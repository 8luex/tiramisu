import { APIApplicationCommandOptionChoice } from 'discord.js';

export const EXPENSE_CATEGORIES: APIApplicationCommandOptionChoice<string>[] = [
  { name: '🍲 อาหาร / เครื่องดื่ม', value: 'FOOD_DRINK' },
  { name: '🚗 เดินทาง', value: 'TRANSPORT' },
  { name: '🛍️ ช้อปปิ้ง', value: 'SHOPPING' },
  { name: '🏠 บิล / ค่าใช้จ่ายประจำ', value: 'BILLS' },
  { name: '🎮 บันเทิง / สตรีมมิ่ง', value: 'ENTERTAINMENT' },
  { name: '📦 อื่นๆ', value: 'OTHER' },
];

export const INCOME_CATEGORIES: APIApplicationCommandOptionChoice<string>[] = [
  { name: '💵 เงินเดือน', value: 'SALARY' },
  { name: '💼 งานเสริม / ฟรีแลนซ์', value: 'FREELANCE' },
  { name: '🎁 ของขวัญ / โบนัส', value: 'GIFT' },
  { name: '📦 รายรับอื่นๆ', value: 'OTHER_INCOME' },
];

export function getCategoryDisplay(category: string): string {
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const found = allCategories.find((c) => c.value === category);
  return found ? found.name : category;
}
