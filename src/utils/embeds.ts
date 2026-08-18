import { EmbedBuilder, User } from 'discord.js';
import { Decimal } from '@prisma/client/runtime/library';
import { getCategoryDisplay } from './categories';
import dayjs from './date';

export function createTransactionEmbed(
  user: User,
  type: 'EXPENSE' | 'INCOME',
  amount: Decimal,
  category: string,
  note: string | null
): EmbedBuilder {
  const isExpense = type === 'EXPENSE';
  const color = isExpense ? 0xef4444 : 0x22c55e;
  const emoji = isExpense ? '💸' : '💰';
  const title = isExpense ? 'spent that bag fr fr' : 'secured the bag!! 💯';

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${emoji} ${title}`)
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    })
    .addFields(
      { name: '💵 amount', value: `฿${amount.toString()}`, inline: true },
      { name: '📁 category', value: getCategoryDisplay(category), inline: true }
    )
    .setTimestamp()
    .setFooter({ text: 'tiramisu | money moves only 🔥' });

  if (note) {
    embed.addFields({ name: '📝 note', value: note, inline: false });
  }

  return embed;
}

export function createSummaryEmbed(
  user: User,
  period: 'MONTH' | 'YEAR',
  totalIncome: Decimal,
  totalExpense: Decimal,
  categoryBreakdown: Array<{ category: string; amount: Decimal; percentage: number }>
): EmbedBuilder {
  const netBalance = totalIncome.minus(totalExpense);
  const isPositive = netBalance.isPositive();

  const periodText = period === 'MONTH' ? 'this month' : 'this year';
  const periodDate =
    period === 'MONTH'
      ? dayjs().tz().format('MMMM YYYY')
      : dayjs().tz().format('YYYY');

  const statusEmoji = isPositive ? '🔥' : '💀';
  const statusText = isPositive ? 'W rizz' : 'L fr';

  const embed = new EmbedBuilder()
    .setColor(isPositive ? 0x22c55e : 0xef4444)
    .setTitle(`📊 ur money recap - ${periodText}`)
    .setDescription(`**${periodDate}** | ${statusEmoji} ${statusText}`)
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    })
    .addFields(
      { name: '💰 money in', value: `฿${totalIncome.toString()}`, inline: true },
      { name: '💸 money out', value: `฿${totalExpense.toString()}`, inline: true },
      {
        name: `${isPositive ? '✨' : '😭'} left over`,
        value: `${isPositive ? '+' : ''}฿${netBalance.toString()}`,
        inline: true,
      }
    )
    .setTimestamp()
    .setFooter({ text: 'tiramisu | no cap tracking 💯' });

  if (categoryBreakdown.length > 0) {
    const breakdownText = categoryBreakdown
      .map((item) => {
        const bar = createPercentageBar(item.percentage);
        return `${getCategoryDisplay(item.category)}\n${bar} ${item.percentage.toFixed(1)}% (฿${item.amount.toString()})`;
      })
      .join('\n\n');

    embed.addFields({ name: '🔥 where ur money went', value: breakdownText, inline: false });
  }

  return embed;
}

export function createComparisonEmbed(
  invoker: User,
  target: User,
  invokerExpense: Decimal,
  targetExpense: Decimal,
  invokerTopCategory: string | null,
  targetTopCategory: string | null
): EmbedBuilder {
  const diff = invokerExpense.minus(targetExpense).abs();
  const invokerSpentLess = invokerExpense.lessThan(targetExpense);
  const winner = invokerSpentLess ? invoker : target;
  const loser = invokerSpentLess ? target : invoker;

  const embed = new EmbedBuilder()
    .setColor(0x3b82f6)
    .setTitle('⚔️ spending battle fr fr')
    .setDescription(`${invoker.username} VS ${target.username}`)
    .addFields(
      {
        name: `${invokerSpentLess ? 'W ' : 'L '}${invoker.username}`,
        value: `💸 spent: ฿${invokerExpense.toString()}${
          invokerTopCategory ? `\n🔝 mostly on: ${getCategoryDisplay(invokerTopCategory)}` : ''
        }`,
        inline: true,
      },
      {
        name: `${!invokerSpentLess ? 'W ' : 'L '}${target.username}`,
        value: `💸 spent: ฿${targetExpense.toString()}${
          targetTopCategory ? `\n🔝 mostly on: ${getCategoryDisplay(targetTopCategory)}` : ''
        }`,
        inline: true,
      }
    )
    .addFields({
      name: '🔥 verdict',
      value: `${winner.username} ate!! saved ฿${diff.toString()} more than ${loser.username} 💯`,
      inline: false,
    })
    .setTimestamp()
    .setFooter({ text: 'tiramisu | slay the spending game 💅' });

  return embed;
}

export function createErrorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xef4444)
    .setTitle('💀 bruh moment')
    .setDescription(message)
    .setTimestamp()
    .setFooter({ text: 'run it back bestie 💫' });
}

function createPercentageBar(percentage: number): string {
  const filledBlocks = Math.round((percentage / 100) * 10);
  const emptyBlocks = 10 - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}
