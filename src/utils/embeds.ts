import { Decimal } from '@prisma/client/runtime/library';
import { getCategoryDisplay } from './categories';
import dayjs from './date';

// Discord Embed Types (no discord.js dependency)
interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  author?: {
    name: string;
    icon_url?: string;
  };
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
}

interface User {
  id: string;
  username: string;
  displayAvatarURL: () => string;
}

export function createTransactionEmbed(
  user: User,
  type: 'EXPENSE' | 'INCOME',
  amount: Decimal,
  category: string,
  note: string | null
): DiscordEmbed {
  const isExpense = type === 'EXPENSE';
  const color = isExpense ? 0xD4A574 : 0xFFF8E7;
  const emoji = isExpense ? '☕' : '🍰';
  const title = isExpense ? 'spent that bag fr fr' : 'secured the bag!! 💯';

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    { name: '💵 amount', value: `฿${amount.toString()}`, inline: true },
    { name: '📁 category', value: getCategoryDisplay(category), inline: true },
  ];

  if (note) {
    fields.push({ name: '📝 note', value: note, inline: false });
  }

  return {
    color,
    title: `${emoji} ${title}`,
    author: {
      name: user.username,
      icon_url: user.displayAvatarURL(),
    },
    fields,
    footer: { text: '🍰 ᯓ tiramisu bot ☕ ꔛ track ur vibes ໒꒰ྀི´ ˘ ` ꒱ྀིა' },
    timestamp: new Date().toISOString(),
  };
}

export function createSummaryEmbed(
  user: User,
  period: 'WEEK' | 'MONTH' | 'YEAR',
  totalIncome: Decimal,
  totalExpense: Decimal,
  categoryBreakdown: Array<{ category: string; amount: Decimal; percentage: number }>
): DiscordEmbed {
  const netBalance = totalIncome.minus(totalExpense);
  const isPositive = netBalance.isPositive();

  const periodText =
    period === 'WEEK' ? 'this week' : period === 'MONTH' ? 'this month' : 'this year';
  const periodDate =
    period === 'WEEK'
      ? `Week of ${dayjs().tz().startOf('week').format('MMM D')}`
      : period === 'MONTH'
        ? dayjs().tz().format('MMMM YYYY')
        : dayjs().tz().format('YYYY');

  const statusEmoji = isPositive ? '🍰' : '💀';
  const statusText = isPositive ? 'W rizz' : 'L fr';

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    { name: '🥛 money in', value: `฿${totalIncome.toString()}`, inline: true },
    { name: '☕ money out', value: `฿${totalExpense.toString()}`, inline: true },
    {
      name: `${isPositive ? '🍰' : '😭'} left over`,
      value: `${isPositive ? '+' : ''}฿${netBalance.toString()}`,
      inline: true,
    },
  ];

  if (categoryBreakdown.length > 0) {
    const breakdownText = categoryBreakdown
      .map((item) => {
        const bar = createPercentageBar(item.percentage);
        return `${getCategoryDisplay(item.category)}\n${bar} ${item.percentage.toFixed(
          1
        )}% (฿${item.amount.toString()})`;
      })
      .join('\n\n');

    fields.push({ name: '☕ where ur money went', value: breakdownText, inline: false });
  }

  return {
    color: isPositive ? 0xFFF8E7 : 0xD4A574,
    title: `🍰 ur money recap - ${periodText}`,
    description: `**${periodDate}** ໒꒰ྀི ${statusEmoji} ${statusText} ꒱ྀིა`,
    author: {
      name: user.username,
      icon_url: user.displayAvatarURL(),
    },
    fields,
    footer: { text: '🍰 ᯓ tiramisu bot ☕ ꔛ ur spending wrapped ໒꒰ྀི´ ˘ ` ꒱ྀིა' },
    timestamp: new Date().toISOString(),
  };
}

export function createMultiComparisonEmbed(
  userStats: Array<{ user: User; total: Decimal; topCategory: string | null }>,
  period: 'WEEK' | 'MONTH' | 'YEAR'
): DiscordEmbed {
  const periodText =
    period === 'WEEK' ? 'this week' : period === 'MONTH' ? 'this month' : 'this year';
  const winner = userStats[0];
  const medals = ['🥇', '🥈', '🥉', '4️⃣'];

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [];

  userStats.forEach((stat, index) => {
    const medal = medals[index] || '🔸';
    const label =
      index === 0 ? `${medal} ${stat.user.username} (W)` : `${medal} ${stat.user.username}`;

    fields.push({
      name: label,
      value: `💸 spent: ฿${stat.total.toString()}${stat.topCategory ? `\n🔝 mostly on: ${getCategoryDisplay(stat.topCategory)}` : ''
        }`,
      inline: false,
    });
  });

  if (userStats.length > 1) {
    const diff = userStats[userStats.length - 1].total.minus(winner.total);
    fields.push({
      name: '🔥 verdict',
      value: `${winner.user.username} ate!! saved ฿${diff.toString()} more 💯`,
      inline: false,
    });
  }

  return {
    color: 0xE8D5C4,
    title: `☕ spending battle - ${periodText}`,
    description: '🍰 leaderboard (who saved the most) ໒꒰ྀི´ ˘ ` ꒱ྀིა',
    fields,
    footer: { text: '☕ tiramisu bot 🍰 who ate the most ໒꒰ྀི´ ˘ ` ꒱ྀིა' },
    timestamp: new Date().toISOString(),
  };
}

export function createErrorEmbed(message: string): DiscordEmbed {
  return {
    color: 0xD4A574,
    title: '💀 bruh moment',
    description: message,
    footer: { text: '🍰 run it back bestie ໒꒰ྀི´ ˘ ` ꒱ྀིა' },
    timestamp: new Date().toISOString(),
  };
}

function createPercentageBar(percentage: number): string {
  const filledBlocks = Math.round((percentage / 100) * 10);
  const emptyBlocks = 10 - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}
