import https from 'https';
import { config } from 'dotenv';

// Load environment variables
config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const APPLICATION_ID = process.env.APPLICATION_ID;

if (!DISCORD_TOKEN || !APPLICATION_ID) {
  console.error('❌ Missing DISCORD_TOKEN or APPLICATION_ID in environment');
  process.exit(1);
}

const commands = [
  {
    name: 'record',
    description: '💰 track ur money moves',
    options: [
      {
        name: 'expense',
        description: '💸 spent some cash',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'amount',
            description: '💵 how much',
            type: 10, // NUMBER
            required: true,
            min_value: 0.01,
          },
          {
            name: 'category',
            description: '📁 what for',
            type: 3, // STRING
            required: true,
            choices: [
              { name: '🍕 Food & Drinks (munchies)', value: 'FOOD_DRINK' },
              { name: '🚗 Transportation (on the move)', value: 'TRANSPORT' },
              { name: '🛍️ Shopping (treat yourself)', value: 'SHOPPING' },
              { name: '🏠 Bills & Utilities (adulting)', value: 'BILLS' },
              { name: '🎮 Entertainment (vibes)', value: 'ENTERTAINMENT' },
              { name: '✨ Other (random stuff)', value: 'OTHER' },
            ],
          },
          {
            name: 'note',
            description: '📝 spill the tea (optional)',
            type: 3, // STRING
            required: false,
            max_length: 255,
          },
        ],
      },
      {
        name: 'income',
        description: '🍰 secured the bag!! 💯',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'amount',
            description: '💵 how much',
            type: 10, // NUMBER
            required: true,
            min_value: 0.01,
          },
          {
            name: 'category',
            description: '📁 source',
            type: 3, // STRING
            required: true,
            choices: [
              { name: '💰 Salary (main bag)', value: 'SALARY' },
              { name: '💼 Freelance (side hustle)', value: 'FREELANCE' },
              { name: '🎁 Gifts & Bonuses (blessed)', value: 'GIFT' },
              { name: '✨ Other Income (extra $$$)', value: 'OTHER_INCOME' },
            ],
          },
          {
            name: 'note',
            description: '📝 spill the tea (optional)',
            type: 3, // STRING
            required: false,
            max_length: 255,
          },
        ],
      },
    ],
  },
  {
    name: 'summary',
    description: '📊 check ur money situation fr',
    options: [
      {
        name: 'period',
        description: '⏰ what timeframe tho',
        type: 3, // STRING
        required: true,
        choices: [
          { name: '📅 this week', value: 'WEEK' },
          { name: '🔥 this month', value: 'MONTH' },
          { name: '💯 this year', value: 'YEAR' },
        ],
      },
    ],
  },
  {
    name: 'compare',
    description: '☕ spending battle',
    options: [
      {
        name: 'target1',
        description: '👥 first person',
        type: 6, // USER
        required: true,
      },
      {
        name: 'target2',
        description: '👥 second person (optional)',
        type: 6, // USER
        required: false,
      },
      {
        name: 'target3',
        description: '👥 third person (optional)',
        type: 6, // USER
        required: false,
      },
      {
        name: 'period',
        description: '⏰ what timeframe tho',
        type: 3, // STRING
        required: false,
        choices: [
          { name: '📅 this week', value: 'WEEK' },
          { name: '🔥 this month', value: 'MONTH' },
          { name: '💯 this year', value: 'YEAR' },
        ],
      },
    ],
  },
];

// Register commands globally
const data = JSON.stringify(commands);

const options = {
  hostname: 'discord.com',
  path: `/api/v10/applications/${APPLICATION_ID}/commands`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    Authorization: `Bot ${DISCORD_TOKEN}`,
  },
};

console.log('🔄 Registering slash commands with Discord...');
console.log(`📋 Commands to register: ${commands.length}`);

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Commands registered successfully!');
      console.log('📊 Response:', JSON.parse(body).length, 'commands active');
      console.log('');
      console.log('Next steps:');
      console.log('1. Set Interactions Endpoint URL in Discord Developer Portal');
      console.log('2. Paste your Lambda Function URL');
      console.log('3. Discord will verify with a PING request');
      console.log('4. Test commands in Discord! (wait 1-2 minutes for sync)');
    } else {
      console.error('❌ Failed to register commands');
      console.error('Status:', res.statusCode);
      console.error('Response:', body);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error registering commands:', error.message);
  process.exit(1);
});

req.write(data);
req.end();
