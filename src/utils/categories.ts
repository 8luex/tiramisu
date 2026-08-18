import { APIApplicationCommandOptionChoice } from 'discord.js';

export const EXPENSE_CATEGORIES: APIApplicationCommandOptionChoice<string>[] = [
  { name: '🍕 Food & Drinks (munchies)', value: 'FOOD_DRINK' },
  { name: '🚗 Transportation (on the move)', value: 'TRANSPORT' },
  { name: '🛍️ Shopping (treat yourself)', value: 'SHOPPING' },
  { name: '🏠 Bills & Utilities (adulting)', value: 'BILLS' },
  { name: '🎮 Entertainment (vibes)', value: 'ENTERTAINMENT' },
  { name: '✨ Other (random stuff)', value: 'OTHER' },
];

export const INCOME_CATEGORIES: APIApplicationCommandOptionChoice<string>[] = [
  { name: '💰 Salary (main bag)', value: 'SALARY' },
  { name: '💼 Freelance (side hustle)', value: 'FREELANCE' },
  { name: '🎁 Gifts & Bonuses (blessed)', value: 'GIFT' },
  { name: '✨ Other Income (extra $$$)', value: 'OTHER_INCOME' },
];

export function getCategoryDisplay(category: string): string {
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const found = allCategories.find((c) => c.value === category);
  return found ? found.name : category;
}
