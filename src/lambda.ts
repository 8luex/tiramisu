import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { verifyKey } from 'discord-interactions';
import { handleRecordCommand } from './handlers/record';
import { handleSummaryCommand } from './handlers/summary';
import { handleCompareCommand } from './handlers/compare';
import prisma from './db/client';

// Interaction Types
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
} as const;

// Interaction Response Types
const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
} as const;

/**
 * AWS Lambda Handler for Discord HTTP Interactions
 * Handles slash commands via HTTP POST requests
 */
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    // Verify Discord signature
    const signature = event.headers['x-signature-ed25519'];
    const timestamp = event.headers['x-signature-timestamp'];
    const body = event.body || '';

    if (!signature || !timestamp) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Missing signature headers' }),
      };
    }

    const publicKey = process.env.DISCORD_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('DISCORD_PUBLIC_KEY not configured');
    }

    const isValid = verifyKey(body, signature, timestamp, publicKey);
    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    // Parse interaction payload
    const interaction = JSON.parse(body);

    // Handle PING (Discord endpoint verification)
    if (interaction.type === InteractionType.PING) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: InteractionResponseType.PONG }),
      };
    }

    // Handle APPLICATION_COMMAND
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const commandName = interaction.data.name;

      let response;
      switch (commandName) {
        case 'record':
          response = await handleRecordCommand(interaction);
          break;
        case 'summary':
          response = await handleSummaryCommand(interaction);
          break;
        case 'compare':
          response = await handleCompareCommand(interaction);
          break;
        default:
          response = {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Unknown command',
              flags: 64, // Ephemeral
            },
          };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      };
    }

    // Unknown interaction type
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown interaction type' }),
    };
  } catch (error) {
    console.error('Lambda handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Internal server error 💀',
          flags: 64,
        },
      }),
    };
  } finally {
    // Prisma cleanup (optional, as Lambda reuses connections)
    await prisma.$disconnect();
  }
}
