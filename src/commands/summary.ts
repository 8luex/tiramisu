import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../db/client';
import { createSummaryEmbed, createErrorEmbed } from '../utils/embeds';
import dayjs from '../utils/date';

export const data = new SlashCommandBuilder()
  .setName('summary')
  .setDescription('สรุปรายรับรายจ่าย')
  .addStringOption((option) =>
    option
      .setName('period')
      .setDescription('ช่วงเวลา')
      .setRequired(true)
      .addChoices(
        { name: '📅 เดือนนี้', value: 'MONTH' },
        { name: '📆 ปีนี้', value: 'YEAR' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  try {
    await interaction.deferReply();

    const period = interaction.options.getString('period', true) as 'MONTH' | 'YEAR';
    const now = dayjs().tz();

    let startDate: Date;
    let endDate: Date;

    if (period === 'MONTH') {
      startDate = now.startOf('month').toDate();
      endDate = now.endOf('month').toDate();
    } else {
      startDate = now.startOf('year').toDate();
      endDate = now.endOf('year').toDate();
    }

    const aggregates = await prisma.transaction.groupBy({
      by: ['type', 'category'],
      where: {
        userId: interaction.user.id,
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
      const amount = agg._sum.amount ? new Decimal(agg._sum.amount.toString()) : new Decimal(0);

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

    const embed = createSummaryEmbed(
      interaction.user,
      period,
      totalIncome,
      totalExpense,
      categoryBreakdown
    );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error generating summary:', error);
    const errorEmbed = createErrorEmbed('ไม่สามารถสรุปข้อมูลได้ กรุณาลองใหม่อีกครั้ง');

    if (interaction.deferred) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}
