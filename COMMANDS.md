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
Returns a **coffee brown colored embed** (☕ tiramisu theme) with:
- Transaction details
- Timestamp
- Your Discord profile
- Footer: "🍰 ᯓ tiramisu | ꔛ track ur vibes ໒꒰ྀི´ ˘ ` ꒱ྀིა"

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
Returns a **cream colored embed** (🍰 tiramisu theme) with:
- Transaction details
- Timestamp
- Your Discord profile
- Footer: "🍰 ᯓ tiramisu | ꔛ track ur vibes ໒꒰ྀི´ ˘ ` ꒱ྀིა"

---

## 📊 `/summary` - ur money recap

Get a detailed summary of your income and expenses.

### Syntax
```
/summary period:<choice>
```

### Parameters
- `period` **(required)** - what timeframe tho:
  - 📅 this week
  - 🔥 this month
  - 💯 this year

### Examples
```
/summary period:this week
/summary period:this month
/summary period:this year
```

### Response
Returns an embed showing:
- **🥛 money in** - total income
- **☕ money out** - total expenses  
- **left over** - net balance
  - Cream colored (🍰) with "W rizz" if positive
  - Coffee brown (☕) with "L fr" if negative
- **☕ where ur money went** - category breakdown
  - Visual percentage bars
  - Sorted by highest spending
  - Shows amount and percentage per category

### Example Output
```
🍰 ur money recap - this month
August 2026 ໒꒰ྀི 🍰 W rizz ꒱ྀིა

🥛 money in: ฿35,000
☕ money out: ฿12,500
🍰 left over: +฿22,500

☕ where ur money went

🍕 Food & Drinks (munchies)
████████░░ 45.0% (฿5,625)

🚗 Transportation (on the move)
████░░░░░░ 24.0% (฿3,000)

🛍️ Shopping (treat yourself)
███░░░░░░░ 16.0% (฿2,000)
```

Footer: "🍰 ᯓ tiramisu | ꔛ ur spending wrapped ໒꒰ྀི´ ˘ ` ꒱ྀིა"

---

## ☕ `/compare` - spending battle

Compare expenses with up to 3 friends. Leaderboard shows who saved the most!

### Syntax
```
/compare target1:<user> [target2:<user>] [target3:<user>] [period:<choice>]
```

### Parameters
- `target1` **(required)** - first person to compare
- `target2` *(optional)* - second person (for 3-way comparison)
- `target3` *(optional)* - third person (for 4-way comparison)
- `period` *(optional)* - what timeframe tho (defaults to this month):
  - 📅 this week
  - 🔥 this month
  - 💯 this year
  
**Rules:**
- Cannot compare with yourself
- Cannot compare with bots
- Winner = who spent the least (saved the most)

### Examples
```
# 1v1 Battle
/compare target1:@Friend

# 3-way Battle with custom period
/compare target1:@Friend1 target2:@Friend2 period:this week

# 4-way Battle (max)
/compare target1:@Friend1 target2:@Friend2 target3:@Friend3 period:this month
```

### Response
Returns a leaderboard embed showing:
- **🥇🥈🥉 Medal rankings** - sorted by who spent least
- **Total expenses** for each person in selected period
- **Top spending category** for each person
- **verdict** - how much the winner saved

### Example Output (Multi-User)
```
☕ spending battle - this month
🍰 leaderboard (who saved the most) ໒꒰ྀི´ ˘ ` ꒱ྀིა

🥇 You (W)
💸 spent: ฿12,500
🔝 mostly on: 🍕 Food & Drinks (munchies)

🥈 Friend1
💸 spent: ฿15,800
🔝 mostly on: 🛍️ Shopping (treat yourself)

🥉 Friend2
💸 spent: ฿18,200
🔝 mostly on: 🎮 Entertainment (vibes)

🔥 verdict
You ate!! saved ฿5,700 more 💯
```

Footer: "tiramisu bot 🍰 who ate the most ໒꒰ྀི´ ˘ ` ꒱ྀིა"

---

## ☕ Error Messages (bruh moments)

All commands include error handling with coffee brown embeds:

### Invalid Amount
```
☕ bruh moment
aint no way 💀 amount gotta be more than 0 baht bestie
🍰 run it back bestie ໒꒰ྀི´ ˘ ` ꒱ྀིა
```

### Cannot Compare with Bot
```
☕ bruh moment
bruh u cant beef with a bot 💀
🍰 run it back bestie ໒꒰ྀི´ ˘ ` ꒱ྀིა
```

### Cannot Compare with Yourself
```
☕ bruh moment
bestie u cant compare with urself 😭 thats just sad
🍰 run it back bestie ໒꒰ྀི´ ˘ ` ꒱ྀིა
```

### Database Error
```
☕ bruh moment
lowkey broke rn 💀 couldnt save that, try again
🍰 run it back bestie ໒꒰ྀི´ ˘ ` ꒱ྀིა
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
- 💪 **Friendly competition** - see who's slaying (up to 4 people!)
- 📊 **Weekly battles** - compare different time periods
- 📉 **Learn habits** - discover saving strategies
- 🤝 **Accountability** - keep each other motivated

---

## 🔐 Privacy Notes

- All data is **private per-user** (no cap)
- Other users **cannot see** your transactions
- Only you can see your `/summary`
- `/compare` only shows **period totals** and **top categories** (not individual transactions)
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
