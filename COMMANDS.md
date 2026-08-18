# 📋 Command Reference

Quick reference guide for all Tiramisu Finance Bot commands.

---

## 💸 `/record expense` - Record an Expense

Track your spending with categories.

### Syntax
```
/record expense amount:<number> category:<choice> [note:<text>]
```

### Parameters
- `amount` **(required)** - Amount in Baht (minimum 0.01)
- `category` **(required)** - Choose from:
  - 🍲 อาหาร / เครื่องดื่ม (Food & Drinks)
  - 🚗 เดินทาง (Transportation)
  - 🛍️ ช้อปปิ้ง (Shopping)
  - 🏠 บิล / ค่าใช้จ่ายประจำ (Bills & Utilities)
  - 🎮 บันเทิง / สตรีมมิ่ง (Entertainment & Streaming)
  - 📦 อื่นๆ (Other)
- `note` *(optional)* - Additional note (max 255 characters)

### Examples
```
/record expense amount:150 category:🍲 อาหาร/เครื่องดื่ม note:กาแฟเช้า
/record expense amount:500 category:🚗 เดินทาง note:น้ำมันรถ
/record expense amount:1200 category:🛍️ ช้อปปิ้ง note:เสื้อผ้า
/record expense amount:800 category:🏠 บิล/ค่าใช้จ่ายประจำ note:ค่าไฟ
```

### Response
Returns a **red-colored embed** with:
- Transaction details
- Timestamp
- Your Discord profile

---

## 💰 `/record income` - Record Income

Track your earnings.

### Syntax
```
/record income amount:<number> category:<choice> [note:<text>]
```

### Parameters
- `amount` **(required)** - Amount in Baht (minimum 0.01)
- `category` **(required)** - Choose from:
  - 💵 เงินเดือน (Salary)
  - 💼 งานเสริม / ฟรีแลนซ์ (Freelance & Side Jobs)
  - 🎁 ของขวัญ / โบนัส (Gifts & Bonuses)
  - 📦 รายรับอื่นๆ (Other Income)
- `note` *(optional)* - Additional note (max 255 characters)

### Examples
```
/record income amount:30000 category:💵 เงินเดือน note:เงินเดือนเดือนสิงหาคม
/record income amount:5000 category:💼 งานเสริม/ฟรีแลนซ์ note:โปรเจค freelance
/record income amount:2000 category:🎁 ของขวัญ/โบนัส note:โบนัสงาน
```

### Response
Returns a **green-colored embed** with:
- Transaction details
- Timestamp
- Your Discord profile

---

## 📊 `/summary` - View Financial Summary

Get a detailed summary of your income and expenses.

### Syntax
```
/summary period:<choice>
```

### Parameters
- `period` **(required)** - Choose from:
  - 📅 เดือนนี้ (This Month)
  - 📆 ปีนี้ (This Year)

### Examples
```
/summary period:เดือนนี้
/summary period:ปีนี้
```

### Response
Returns an embed showing:
- **Total Income** (💰 รายรับรวม)
- **Total Expenses** (💸 รายจ่ายรวม)
- **Net Balance** (💵 คงเหลือสุทธิ)
  - Green if positive
  - Red if negative
- **Category Breakdown** (📈 รายจ่ายตามหมวดหมู่)
  - Visual percentage bars
  - Sorted by highest spending
  - Shows amount and percentage per category

### Example Output
```
📊 สรุปการเงินเดือนนี้
August 2026

💰 รายรับรวม: ฿35,000
💸 รายจ่ายรวม: ฿12,500
💵 คงเหลือสุทธิ: +฿22,500

📈 รายจ่ายตามหมวดหมู่

🍲 อาหาร / เครื่องดื่ม
████████░░ 45.0% (฿5,625)

🚗 เดินทาง
████░░░░░░ 24.0% (฿3,000)

🛍️ ช้อปปิ้ง
███░░░░░░░ 16.0% (฿2,000)

🏠 บิล / ค่าใช้จ่ายประจำ
██░░░░░░░░ 12.0% (฿1,500)

🎮 บันเทิง / สตรีมมิ่ง
█░░░░░░░░░ 3.0% (฿375)
```

---

## ⚔️ `/compare` - Compare Expenses

Compare your monthly expenses with another user.

### Syntax
```
/compare target:<user>
```

### Parameters
- `target` **(required)** - Mention the Discord user to compare with
  - Cannot be yourself
  - Cannot be a bot

### Examples
```
/compare target:@JohnDoe
/compare target:@Friend
```

### Response
Returns a comparison embed showing:
- **Both users' total expenses** for current month
- **Winner indicator** (🏆) for who spent less
- **Top spending category** for each user
- **Difference amount** (how much less the winner spent)

### Example Output
```
⚔️ เปรียบเทียบรายจ่ายประจำเดือน
You VS @Friend

🏆 You
รายจ่าย: ฿12,500
หมวดสูงสุด: 🍲 อาหาร / เครื่องดื่ม

📊 @Friend
รายจ่าย: ฿15,800
หมวดสูงสุด: 🛍️ ช้อปปิ้ง

📉 ผลต่าง
You ใช้น้อยกว่า ฿3,300
```

---

## 🚨 Error Handling

All commands include built-in error handling:

### Common Errors

**Invalid Amount**
```
❌ เกิดข้อผิดพลาด
จำนวนเงินต้องมากกว่า 0 บาท
```

**Cannot Compare with Bot**
```
❌ เกิดข้อผิดพลาด
ไม่สามารถเปรียบเทียบกับบอทได้
```

**Cannot Compare with Yourself**
```
❌ เกิดข้อผิดพลาด
ไม่สามารถเปรียบเทียบกับตัวเองได้
```

**Database Error**
```
❌ เกิดข้อผิดพลาด
ไม่สามารถบันทึกรายการได้ กรุณาลองใหม่อีกครั้ง
```

---

## 💡 Tips & Best Practices

### Recording Transactions
- ✅ **Be consistent** - Record transactions regularly
- ✅ **Add notes** - Makes it easier to remember later
- ✅ **Choose correct categories** - Helps with accurate summaries
- ✅ **Round amounts** - Use whole numbers when possible (e.g., 100 instead of 99.50)

### Using Summaries
- 📅 **Check monthly** - Review at the end of each month
- 📆 **Check yearly** - Great for annual financial reviews
- 📊 **Track trends** - Compare month-to-month to identify spending patterns
- 🎯 **Set goals** - Use summaries to set spending limits per category

### Comparing with Friends
- 🏆 **Make it fun** - Gamify saving money with friends
- 💪 **Friendly competition** - See who can spend less
- 📉 **Learn habits** - Discover where others save money
- 🤝 **Accountability** - Keep each other motivated to save

---

## 🔐 Privacy Notes

- All financial data is **private per-user**
- Other users **cannot see** your individual transactions
- Only you can see your own `/summary`
- `/compare` only shows **monthly totals** and **top categories**, not detailed transactions
- All data is stored securely in the database with your Discord User ID

---

## ⏱️ Timezone Information

All timestamps are in **Asia/Bangkok (ICT/GMT+7)** timezone.

This affects:
- Transaction creation times
- Monthly summaries (use Bangkok's month boundaries)
- Yearly summaries (use Bangkok's year boundaries)
- Comparisons (current month in Bangkok time)

---

## 🔄 Command Refresh

If commands don't appear after bot restart:
1. Wait 1-5 minutes (global commands take time to propagate)
2. Refresh Discord (Ctrl+R / Cmd+R)
3. Try typing `/` in the chat to trigger autocomplete
4. If still missing, kick and re-invite the bot

---

## 📱 Mobile Usage

All commands work perfectly on:
- ✅ Discord Mobile App (iOS/Android)
- ✅ Discord Desktop App
- ✅ Discord Web Browser

Embeds are responsive and readable on all devices!

---

**Ready to start tracking? Try `/record expense` now! 🚀**
