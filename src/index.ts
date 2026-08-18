import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  ChatInputCommandInteraction,
  Collection,
} from 'discord.js';
import * as recordCommand from './commands/record';
import * as summaryCommand from './commands/summary';
import * as compareCommand from './commands/compare';

interface Command {
  data: {
    name: string;
    toJSON: () => unknown;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commands = new Collection<string, Command>();
commands.set(recordCommand.data.name, recordCommand);
commands.set(summaryCommand.data.name, summaryCommand);
commands.set(compareCommand.data.name, compareCommand);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
  if (!client.user) {
    console.error('Client user is not available');
    process.exit(1);
  }

  console.log(`🤖 Bot logged in as ${client.user.tag}`);
  console.log(`📊 Serving ${commands.size} commands`);

  try {
    const token = process.env.DISCORD_TOKEN;
    const applicationId = process.env.APPLICATION_ID;

    if (!token || !applicationId) {
      console.error('Missing DISCORD_TOKEN or APPLICATION_ID in environment variables');
      process.exit(1);
    }

    const rest = new REST({ version: '10' }).setToken(token);
    const commandsData = Array.from(commands.values()).map((cmd) => cmd.data.toJSON());

    console.log('🔄 Registering slash commands globally...');

    await rest.put(Routes.applicationCommands(applicationId), {
      body: commandsData,
    });

    console.log('✅ Slash commands registered successfully');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.warn(`Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);

    const errorMessage = {
      content: '💀 bruh moment fr fr... try that again bestie',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('❌ DISCORD_TOKEN is not defined in environment variables');
  process.exit(1);
}

client.login(token).catch((error) => {
  console.error('Failed to login:', error);
  process.exit(1);
});
