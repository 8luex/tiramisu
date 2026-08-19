import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../db/client';
import { createMultiComparisonEmbed, createErrorEmbed } from '../utils/embeds';
import dayjs from '../utils/date';

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
}

interface DiscordInteraction {
  type: number;
  data: {
    name: string;
    options?: Array<{
      name: string;
      type: number;
      value?: any;
      user?: DiscordUser;
    }>;
    resolved?: {
      users?: {
        [key: string]: DiscordUser;
      };
    };
  };
  member: {
    user: DiscordUser;
  };
}

export async function handleCompareCommand(interaction: DiscordInteraction) {
  try {
    const options = interaction.data.options || [];

    // Extract targets
    const target1Id = options.find((opt) => opt.name === 'target1')?.value;
    const target2Id = options.find((opt) => opt.name === 'target2')?.value;
    const target3Id = options.find((opt) => opt.name === 'target3')?.value;
    const period = (options.find((opt) => opt.name === 'period')?.value ||
      'MONTH') as 'WEEK' | 'MONTH' | 'YEAR';

    if (!target1Id) {
      return createErrorResponse('No target user provided');
    }

    // Get resolved users
    const resolvedUsers = interaction.data.resolved?.users || {};
    const targets: DiscordUser[] = [];

    for (const targetId of [target1Id, target2Id, target3Id].filter(Boolean)) {
      const targetUser = resolvedUsers[targetId];
      if (targetUser) {
        // Check if bot
        if (targetUser.id === interaction.member.user.id) {
          return {
            type: 4,
            data: {
              embeds: [
                createErrorEmbed(
                  'bestie u cant compare with urself 😭 thats just sad'
                ),
              ],
            },
          };
        }
        targets.push(targetUser);
      }
    }

    // Calculate date range
    const now = dayjs().tz();
    let startDate: Date;
    let endDate: Date;

    if (period === 'WEEK') {
      startDate = now.startOf('week').toDate();
      endDate = now.endOf('week').toDate();
    } else if (period === 'MONTH') {
      startDate = now.startOf('month').toDate();
      endDate = now.endOf('month').toDate();
    } else {
      startDate = now.startOf('year').toDate();
      endDate = now.endOf('year').toDate();
    }

    // Get all users (caller + targets)
    const allUserIds = [interaction.member.user.id, ...targets.map((t) => t.id)];
    const allUsers = [interaction.member.user, ...targets];

    // Fetch data for all users in parallel
    const allData = await Promise.all(
      allUserIds.map((userId) =>
        prisma.transaction.groupBy({
          by: ['category'],
          where: {
            userId,
            type: 'EXPENSE',
            createdAt: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        })
      )
    );

    interface UserStats {
      user: {
        id: string;
        username: string;
        displayAvatarURL: () => string;
      };
      total: Decimal;
      topCategory: string | null;
    }

    const userStats: UserStats[] = allUsers.map((user, index) => {
      const data = allData[index];
      let total = new Decimal(0);
      let topCategory: string | null = null;
      let topAmount = new Decimal(0);

      for (const agg of data) {
        const amount = agg._sum.amount
          ? new Decimal(agg._sum.amount.toString())
          : new Decimal(0);
        total = total.plus(amount);

        if (amount.greaterThan(topAmount)) {
          topAmount = amount;
          topCategory = agg.category;
        }
      }

      return {
        user: {
          id: user.id,
          username: user.username,
          displayAvatarURL: () => {
            if (user.avatar) {
              return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
            }
            return `https://cdn.discordapp.com/embed/avatars/0.png`;
          },
        },
        total,
        topCategory,
      };
    });

    // Sort by who spent least (winner = saved most)
    userStats.sort((a, b) => a.total.comparedTo(b.total));

    const embed = createMultiComparisonEmbed(userStats as any, period);

    return {
      type: 4,
      data: {
        embeds: [embed],
      },
    };
  } catch (error) {
    console.error('Error in handleCompareCommand:', error);
    return {
      type: 4,
      data: {
        embeds: [
          createErrorEmbed('comparison machine broke 💀 try again bestie'),
        ],
      },
    };
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
