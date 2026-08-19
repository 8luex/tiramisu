import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../db/client';
import { createSummaryEmbed, createErrorEmbed } from '../utils/embeds';
import dayjs from '../utils/date';

interface DiscordInteraction {
  type: number;
  data: {
    name: string;
    options?: Array<{
      name: string;
      value: any;
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

export async function handleSummaryCommand(interaction: DiscordInteraction) {
  try {
    const period = (interaction.data.options?.find((opt) => opt.name === 'period')
      ?.value || 'MONTH') as 'WEEK' | 'MONTH' | 'YEAR';
    const userId = interaction.member.user.id;

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

    // Aggregate transactions
    const aggregates = await prisma.transaction.groupBy({
      by: ['type', 'category'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    let totalIncome = new Decimal(0);
    let totalExpense = new Decimal(0);
    const expenseByCategory: Map<string, Decimal> = new Map();

    for (const agg of aggregates) {
      const amount = agg._sum.amount
        ? new Decimal(agg._sum.amount.toString())
        : new Decimal(0);

      if (agg.type === 'INCOME') {
        totalIncome = totalIncome.plus(amount);
      } else if (agg.type === 'EXPENSE') {
        totalExpense = totalExpense.plus(amount);
        const current = expenseByCategory.get(agg.category) || new Decimal(0);
        expenseByCategory.set(agg.category, current.plus(amount));
      }
    }

    const categoryBreakdown = Array.from(expenseByCategory.entries())
      .map(([category, amount]) => {
        const percentage = totalExpense.isZero()
          ? 0
          : amount.dividedBy(totalExpense).times(100).toNumber();
        return { category, amount, percentage };
      })
      .sort((a, b) => b.percentage - a.percentage);

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

    const embed = createSummaryEmbed(
      user as any,
      period,
      totalIncome,
      totalExpense,
      categoryBreakdown
    );

    return {
      type: 4,
      data: {
        embeds: [embed],
      },
    };
  } catch (error) {
    console.error('Error in handleSummaryCommand:', error);
    return {
      type: 4,
      data: {
        embeds: [
          createErrorEmbed('nah fam the summary aint loading 💀 hit it again'),
        ],
      },
    };
  }
}
