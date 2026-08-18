import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../db/client';
import { createComparisonEmbed, createErrorEmbed } from '../utils/embeds';
import dayjs from '../utils/date';

export const data = new SlashCommandBuilder()
  .setName('compare')
  .setDescription('⚔️ battle ur homie fr')
  .addUserOption((option) =>
    option.setName('target').setDescription('👥 who we beefing with').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  try {
    await interaction.deferReply();

    const targetUser = interaction.options.getUser('target', true);

    if (targetUser.bot) {
      await interaction.editReply({
        embeds: [createErrorEmbed('bruh u cant beef with a bot 💀')],
      });
      return;
    }

    if (targetUser.id === interaction.user.id) {
      await interaction.editReply({
        embeds: [createErrorEmbed('bestie u cant compare with urself 😭 thats just sad')],
      });
      return;
    }

    const now = dayjs().tz();
    const startDate = now.startOf('month').toDate();
    const endDate = now.endOf('month').toDate();

    const [invokerData, targetData] = await Promise.all([
      prisma.transaction.groupBy({
        by: ['category'],
        where: {
          userId: interaction.user.id,
          type: 'EXPENSE',
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ['category'],
        where: {
          userId: targetUser.id,
          type: 'EXPENSE',
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
    ]);

    let invokerTotal = new Decimal(0);
    let invokerTopCategory: string | null = null;
    let invokerTopAmount = new Decimal(0);

    for (const agg of invokerData) {
      const amount = agg._sum.amount ? new Decimal(agg._sum.amount.toString()) : new Decimal(0);
      invokerTotal = invokerTotal.plus(amount);

      if (amount.greaterThan(invokerTopAmount)) {
        invokerTopAmount = amount;
        invokerTopCategory = agg.category;
      }
    }

    let targetTotal = new Decimal(0);
    let targetTopCategory: string | null = null;
    let targetTopAmount = new Decimal(0);

    for (const agg of targetData) {
      const amount = agg._sum.amount ? new Decimal(agg._sum.amount.toString()) : new Decimal(0);
      targetTotal = targetTotal.plus(amount);

      if (amount.greaterThan(targetTopAmount)) {
        targetTopAmount = amount;
        targetTopCategory = agg.category;
      }
    }

    const embed = createComparisonEmbed(
      interaction.user,
      targetUser,
      invokerTotal,
      targetTotal,
      invokerTopCategory,
      targetTopCategory
    );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error comparing expenses:', error);
    const errorEmbed = createErrorEmbed('comparison machine broke 💀 try again bestie');

    if (interaction.deferred) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}
