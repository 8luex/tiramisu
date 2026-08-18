import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../db/client';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';
import { createTransactionEmbed, createErrorEmbed } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('record')
  .setDescription('บันทึกรายรับหรือรายจ่าย')
  .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
    subcommand
      .setName('expense')
      .setDescription('บันทึกรายจ่าย')
      .addNumberOption((option) =>
        option
          .setName('amount')
          .setDescription('จำนวนเงิน (บาท)')
          .setRequired(true)
          .setMinValue(0.01)
      )
      .addStringOption((option) =>
        option
          .setName('category')
          .setDescription('หมวดหมู่รายจ่าย')
          .setRequired(true)
          .addChoices(...EXPENSE_CATEGORIES)
      )
      .addStringOption((option) =>
        option.setName('note').setDescription('หมายเหตุ (ถ้ามี)').setMaxLength(255)
      )
  )
  .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
    subcommand
      .setName('income')
      .setDescription('บันทึกรายรับ')
      .addNumberOption((option) =>
        option
          .setName('amount')
          .setDescription('จำนวนเงิน (บาท)')
          .setRequired(true)
          .setMinValue(0.01)
      )
      .addStringOption((option) =>
        option
          .setName('category')
          .setDescription('หมวดหมู่รายรับ')
          .setRequired(true)
          .addChoices(...INCOME_CATEGORIES)
      )
      .addStringOption((option) =>
        option.setName('note').setDescription('หมายเหตุ (ถ้ามี)').setMaxLength(255)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  try {
    const subcommand = interaction.options.getSubcommand();
    const amount = interaction.options.getNumber('amount', true);
    const category = interaction.options.getString('category', true);
    const note = interaction.options.getString('note');

    if (amount <= 0) {
      await interaction.reply({
        embeds: [createErrorEmbed('จำนวนเงินต้องมากกว่า 0 บาท')],
        ephemeral: true,
      });
      return;
    }

    const type = subcommand === 'expense' ? 'EXPENSE' : 'INCOME';

    await prisma.transaction.create({
      data: {
        userId: interaction.user.id,
        type,
        amount: new Decimal(amount),
        category,
        note,
      },
    });

    const embed = createTransactionEmbed(
      interaction.user,
      type,
      new Decimal(amount),
      category,
      note
    );

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error recording transaction:', error);
    await interaction.reply({
      embeds: [createErrorEmbed('ไม่สามารถบันทึกรายการได้ กรุณาลองใหม่อีกครั้ง')],
      ephemeral: true,
    });
  }
}
