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
  const title = isExpense ? 'บันทึกรายจ่าย' : 'บันทึกรายรับ';

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${emoji} ${title}`)
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    })
    .addFields(
      { name: '💵 จำนวนเงิน', value: `฿${amount.toString()}`, inline: true },
      { name: '📁 หมวดหมู่', value: getCategoryDisplay(category), inline: true }
    )
    .setTimestamp()
    .setFooter({ text: 'Tiramisu Finance Tracker' });

  if (note) {
    embed.addFields({ name: '📝 หมายเหตุ', value: note, inline: false });
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

  const periodText = period === 'MONTH' ? 'เดือนนี้' : 'ปีนี้';
  const periodDate =
    period === 'MONTH'
      ? dayjs().tz().format('MMMM YYYY')
      : dayjs().tz().format('YYYY');

  const embed = new EmbedBuilder()
    .setColor(isPositive ? 0x22c55e : 0xef4444)
    .setTitle(`📊 สรุปการเงิน${periodText}`)
    .setDescription(`**${periodDate}**`)
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    })
    .addFields(
      { name: '💰 รายรับรวม', value: `฿${totalIncome.toString()}`, inline: true },
      { name: '💸 รายจ่ายรวม', value: `฿${totalExpense.toString()}`, inline: true },
      {
        name: '💵 คงเหลือสุทธิ',
        value: `${isPositive ? '+' : ''}฿${netBalance.toString()}`,
        inline: true,
      }
    )
    .setTimestamp()
    .setFooter({ text: 'Tiramisu Finance Tracker' });

  if (categoryBreakdown.length > 0) {
    const breakdownText = categoryBreakdown
      .map((item) => {
        const bar = createPercentageBar(item.percentage);
        return `${getCategoryDisplay(item.category)}\n${bar} ${item.percentage.toFixed(1)}% (฿${item.amount.toString()})`;
      })
      .join('\n\n');

    embed.addFields({ name: '📈 รายจ่ายตามหมวดหมู่', value: breakdownText, inline: false });
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

  const embed = new EmbedBuilder()
    .setColor(0x3b82f6)
    .setTitle('⚔️ เปรียบเทียบรายจ่ายประจำเดือน')
    .setDescription(`${invoker.username} VS ${target.username}`)
    .addFields(
      {
        name: `${invokerSpentLess ? '🏆' : '📊'} ${invoker.username}`,
        value: `รายจ่าย: ฿${invokerExpense.toString()}${
          invokerTopCategory ? `\nหมวดสูงสุด: ${getCategoryDisplay(invokerTopCategory)}` : ''
        }`,
        inline: true,
      },
      {
        name: `${!invokerSpentLess ? '🏆' : '📊'} ${target.username}`,
        value: `รายจ่าย: ฿${targetExpense.toString()}${
          targetTopCategory ? `\nหมวดสูงสุด: ${getCategoryDisplay(targetTopCategory)}` : ''
        }`,
        inline: true,
      }
    )
    .addFields({
      name: '📉 ผลต่าง',
      value: `${winner.username} ใช้น้อยกว่า ฿${diff.toString()}`,
      inline: false,
    })
    .setTimestamp()
    .setFooter({ text: 'Tiramisu Finance Tracker' });

  return embed;
}

export function createErrorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xef4444)
    .setTitle('❌ เกิดข้อผิดพลาด')
    .setDescription(message)
    .setTimestamp();
}

function createPercentageBar(percentage: number): string {
  const filledBlocks = Math.round((percentage / 100) * 10);
  const emptyBlocks = 10 - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}
