import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../db/client';
import { createTransactionEmbed, createErrorEmbed } from '../utils/embeds';

interface DiscordInteraction {
  type: number;
  data: {
    name: string;
    options?: Array<{
      name: string;
      type: number;
      value?: any;
      options?: Array<{
        name: string;
        value: any;
      }>;
    }>;
  };
  member: {
    user: {
      id: string;
      username: string;
      avatar: string | null;
    };
  };
}

export async function handleRecordCommand(interaction: DiscordInteraction) {
  try {
    const subcommand = interaction.data.options?.[0];
    if (!subcommand) {
      return createErrorResponse('No subcommand provided');
    }

    const subcommandName = subcommand.name;
    const options = subcommand.options || [];

    // Extract parameters
    const amount = options.find((opt) => opt.name === 'amount')?.value;
    const category = options.find((opt) => opt.name === 'category')?.value;
    const note = options.find((opt) => opt.name === 'note')?.value || null;

    if (!amount || !category) {
      return createErrorResponse('Missing required parameters');
    }

    // Validate amount
    if (amount <= 0) {
      return {
        type: 4,
        data: {
          embeds: [createErrorEmbed('aint no way 💀 amount gotta be more than 0 baht bestie')],
        },
      };
    }

    const type = subcommandName === 'expense' ? 'EXPENSE' : 'INCOME';
    const userId = interaction.member.user.id;

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount: new Decimal(amount),
        category,
        note,
      },
    });

    // Create user object for embed
    const user = {
      id: interaction.member.user.id,
      username: interaction.member.user.username,
      displayAvatarURL: () => {
        const avatar = interaction.member.user.avatar;
        if (avatar) {
          return `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${avatar}.png`;
        }
        return `https://cdn.discordapp.com/embed/avatars/0.png`;
      },
    };

    const embed = createTransactionEmbed(
      user as any,
      type,
      new Decimal(amount),
      category,
      note
    );

    return {
      type: 4,
      data: {
        embeds: [embed],
      },
    };
  } catch (error) {
    console.error('Error in handleRecordCommand:', error);
    return createErrorResponse('lowkey broke rn 💀 couldnt save that, try again');
  }
}

function createErrorResponse(message: string) {
  return {
    type: 4,
    data: {
      embeds: [createErrorEmbed(message)],
    },
  };
}
