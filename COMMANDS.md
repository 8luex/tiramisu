# 📋 Command Reference

Quick reference guide for all Tiramisu Bot commands! 🔥

---

## 💸 `/record expense` - spent that bag fr fr

Track your spending with categories.

### Syntax
```
/record expense amount:<number> category:<choice> [note:<text>]
```

### Parameters
- `amount` **(required)** - how much you spent (minimum 0.01 baht)
- `category` **(required)** - what you spent on:
  - 🍕 Food & Drinks (munchies)
  - 🚗 Transportation (on the move)
  - 🛍️ Shopping (treat yourself)
  - 🏠 Bills & Utilities (adulting)
  - 🎮 Entertainment (vibes)
  - ✨ Other (random stuff)
- `note` *(optional)* - spill the tea (max 255 characters)

### Examples
```
/record expense amount:150 category:munchies note:boba run
/record expense amount:500 category:on the move note:gas money
/record expense amount:1200 category:treat yourself note:new fit
/record expense amount:800 category:adulting note:electric bill
```

### Response
Returns a **red-colored embed** with:
- Transaction details
- Timestamp
- Your Discord profile
- Footer: "tiramisu | money moves only 🔥"

---

## 💰 `/record income` - secured the bag!! 💯

Track your earnings.

### Syntax
```
/record income amount:<number> category:<choice> [note:<text>]
```

### Parameters
- `amount` **(required)** - how much you made (minimum 0.01 baht)
- `category` **(required)** - where the money from:
  - 💰 Salary (main bag)
  - 💼 Freelance (side hustle)
  - 🎁 Gifts & Bonuses (blessed)
  - ✨ Other Income (extra $$$)
- `note` *(optional)* - spill the tea (max 255 characters)

### Examples
```
/record income amount:30000 category:main bag note:payday!!
/record income amount:5000 category:side hustle note:freelance gig
/record income amount:2000 category:blessed note:birthday money
```

### Response
Returns a **green-colored embed** with:
- Transaction details
- Timestamp
- Your Discord profile
- Footer: "tiramisu | money moves only 🔥"

---

## 📊 `/summary` - ur money recap

Get a detailed summary of your income and expenses.

### Syntax
```
/summary period:<choice>
```

### Parameters
- `period` **(required)** - what timeframe tho:
  - 🔥 this month
  - 💯 this year

### Examples
```
/summary period:this month
/summary period:this year
```

### Response
Returns an embed showing:
- **money in** - total income
- **money out** - total expenses  
- **left over** - net balance
  - Green with "✨ W rizz" if positive
  - Red with "😭 L fr" if negative
- **where ur money went** - category breakdown
  - Visual percentage bars
  - Sorted by highest spending
  - Shows amount and percentage per category

### Example Output
```
📊 ur money recap - this month
August 2026 | 🔥 W rizz

💰 money in: ฿35,000
💸 money out: ฿12,500
✨ left over: +฿22,500

🔥 where ur money went

🍕 Food & Drinks (munchies)
████████░░ 45.0% (฿5,625)

🚗 Transportation (on the move)
████░░░░░░ 24.0% (฿3,000)

🛍️ Shopping (treat yourself)
███░░░░░░░ 16.0% (฿2,000)
```

Footer: "tiramisu | no cap tracking 💯"

---

## ⚔️ `/compare` - battle ur homie fr

Compare your monthly expenses with another user.

### Syntax
```
/compare target:<user>
```

### Parameters
- `target` **(required)** - who we beefing with
  - Cannot be yourself
  - Cannot be a bot

### Examples
```
/compare target:@JohnDoe
/compare target:@Friend
```

### Response
Returns a comparison embed showing:
- **W/L indicators** - who's winning the savings game
- **Both users' total expenses** for current month
- **Top spending category** for each user
- **verdict** - who saved more and by how much

### Example Output
```
⚔️ spending battle fr fr
You VS Friend

W You
💸 spent: ฿12,500
🔝 mostly on: 🍕 Food & Drinks (munchies)

L Friend
💸 spent: ฿15,800
🔝 mostly on: 🛍️ Shopping (treat yourself)

🔥 verdict
You ate!! saved ฿3,300 more than Friend 💯
```

Footer: "tiramisu | slay the spending game 💅"

---

## 💀 Error Messages (bruh moments)

All commands include error handling:

### Invalid Amount
```
💀 bruh moment
aint no way 💀 amount gotta be more than 0 baht bestie
run it back bestie 💫
```

### Cannot Compare with Bot
```
💀 bruh moment
bruh u cant beef with a bot 💀
run it back bestie 💫
```

### Cannot Compare with Yourself
```
💀 bruh moment
bestie u cant compare with urself 😭 thats just sad
run it back bestie 💫
```

### Database Error
```
💀 bruh moment
lowkey broke rn 💀 couldnt save that, try again
run it back bestie 💫
```

---

## 💡 Tips & Best Practices

### Recording Transactions
- ✅ **Be consistent** - record daily for accuracy
- ✅ **Add notes** - spill the tea for context
- ✅ **Choose correct categories** - helps with summaries fr fr
- ✅ **Round amounts** - keep it simple bestie

### Using Summaries
- 📅 **Check monthly** - review at end of month
- 📆 **Check yearly** - annual financial glow up
- 📊 **Track trends** - see where ur money be going
- 🎯 **Set goals** - use summaries to budget better

### Comparing with Friends
- 🏆 **Make it fun** - gamify saving money
- 💪 **Friendly competition** - see who's slaying
- 📉 **Learn habits** - discover saving strategies
- 🤝 **Accountability** - keep each other motivated

---

## 🔐 Privacy Notes

- All data is **private per-user** (no cap)
- Other users **cannot see** your transactions
- Only you can see your `/summary`
- `/compare` only shows **monthly totals** and **top categories**
- Data stored securely with your Discord User ID

---

## ⏱️ Timezone Info

All timestamps use **Asia/Bangkok (ICT/GMT+7)** timezone.

This affects:
- Transaction timestamps
- Monthly/yearly boundaries
- Comparison calculations

---

## 🔄 Command Refresh

If commands don't appear after bot restart:
1. Wait 1-5 minutes (global commands take time)
2. Refresh Discord (Ctrl+R / Cmd+R)
3. Type `/` to trigger autocomplete
4. Kick and re-invite bot if needed

---

## 📱 Mobile Usage

Works on all platforms:
- ✅ Discord Mobile App (iOS/Android)
- ✅ Discord Desktop App
- ✅ Discord Web Browser

Embeds look fire on all devices! 🔥

---

**ready to track? hit `/record expense` and start slaying! 🚀💯**
