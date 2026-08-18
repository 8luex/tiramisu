import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../db/client';
import { createMultiComparisonEmbed, createErrorEmbed } from '../utils/embeds';
import dayjs from '../utils/date';

export const data = new SlashCommandBuilder()
  .setName('compare')
  .setDescription('⚔️ battle ur homies fr')
  .addUserOption((option) =>
    option.setName('target1').setDescription('👥 first person').setRequired(true)
  )
  .addUserOption((option) =>
    option.setName('target2').setDescription('👥 second person (optional)').setRequired(false)
  )
  .addUserOption((option) =>
    option.setName('target3').setDescription('👥 third person (optional)').setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('period')
      .setDescription('⏰ what timeframe tho')
      .setRequired(false)
      .addChoices(
        { name: '📅 this week', value: 'WEEK' },
        { name: '🔥 this month', value: 'MONTH' },
        { name: '💯 this year', value: 'YEAR' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  try {
    await interaction.deferReply();

    const target1 = interaction.options.getUser('target1', true);
    const target2 = interaction.options.getUser('target2');
    const target3 = interaction.options.getUser('target3');
    const period = (interaction.options.getString('period') || 'MONTH') as 'WEEK' | 'MONTH' | 'YEAR';

    const targets = [target1, target2, target3].filter((u): u is NonNullable<typeof u> => u !== null);

    for (const target of targets) {
      if (target.bot) {
        await interaction.editReply({
          embeds: [createErrorEmbed('bruh u cant beef with a bot 💀')],
        });
        return;
      }

      if (target.id === interaction.user.id) {
        await interaction.editReply({
          embeds: [createErrorEmbed('bestie u cant compare with urself 😭 thats just sad')],
        });
        return;
      }
    }

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

    const allUsers = [interaction.user, ...targets];

    const allData = await Promise.all(
      allUsers.map((user) =>
        prisma.transaction.groupBy({
          by: ['category'],
          where: {
            userId: user.id,
            type: 'EXPENSE',
            createdAt: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        })
      )
    );

    interface UserStats {
      user: typeof allUsers[0];
      total: Decimal;
      topCategory: string | null;
    }

    const userStats: UserStats[] = allUsers.map((user, index) => {
      const data = allData[index];
      let total = new Decimal(0);
      let topCategory: string | null = null;
      let topAmount = new Decimal(0);

      for (const agg of data) {
        const amount = agg._sum.amount ? new Decimal(agg._sum.amount.toString()) : new Decimal(0);
        total = total.plus(amount);

        if (amount.greaterThan(topAmount)) {
          topAmount = amount;
          topCategory = agg.category;
        }
      }

      return { user, total, topCategory };
    });

    userStats.sort((a, b) => a.total.comparedTo(b.total));

    const embed = createMultiComparisonEmbed(userStats, period);

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
