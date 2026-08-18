# ❓ Frequently Asked Questions (FAQ)

Common questions and answers about Tiramisu Bot.

---

## 🤖 General Questions

### Q: What is Tiramisu Bot?
**A:** Tiramisu is a personal finance and expense tracking Discord bot that helps you record income/expenses, view financial summaries, and compare spending with friends - all within Discord.

### Q: Is it free to use?
**A:** Yes! The bot is completely free and open-source. You can host it yourself on Discloud's free tier (100MB RAM).

### Q: What data does the bot store?
**A:** The bot stores:
- Your Discord User ID
- Transaction amounts
- Categories
- Optional notes
- Timestamps

It does NOT store:
- Messages
- Personal information
- Bank details
- Credit card information

### Q: Is my data secure?
**A:** Yes! Your transaction data is stored in a MySQL database and is only accessible to you. Other users cannot see your individual transactions.

---

## 💰 Transaction Questions

### Q: Can I edit or delete transactions?
**A:** Currently, the bot doesn't support editing or deleting past transactions. This is intentional to maintain data integrity. If you make a mistake, you can add a correction transaction with a note.

**Future feature**: Edit/delete functionality may be added in future updates.

### Q: What's the maximum transaction amount?
**A:** The maximum amount is **999,999,999,999.99 THB** (12 digits before decimal, 2 after). This should cover all personal finance needs!

### Q: What's the minimum transaction amount?
**A:** The minimum is **0.01 THB** (1 satang).

### Q: Can I record transactions from past dates?
**A:** Currently, transactions are automatically timestamped with the current date/time. You cannot backdate transactions.

**Workaround**: Add a note with the actual date, e.g., `note:ค่าอาหารวันที่ 15 สิงหาคม`

### Q: What timezone does the bot use?
**A:** All timestamps use **Asia/Bangkok (ICT/GMT+7)** timezone. This affects:
- Transaction creation times
- Monthly/yearly summaries
- Comparisons

---

## 📊 Summary Questions

### Q: Why is my summary empty?
**A:** Your summary is empty if you haven't recorded any transactions for the selected period. Try:
1. Recording a transaction with `/record`
2. Check if you selected the correct period (month vs. year)
3. Verify transactions were saved successfully

### Q: When does a "month" start and end?
**A:** Months follow calendar boundaries in Bangkok timezone:
- **Start**: 1st day at 00:00:00 ICT
- **End**: Last day at 23:59:59 ICT

Example: August 2026 = Aug 1, 2026 00:00:00 to Aug 31, 2026 23:59:59

### Q: Can I see summaries for previous months?
**A:** Currently, you can only view:
- **This month** (current calendar month)
- **This year** (current calendar year)

**Future feature**: Historical period selection may be added.

### Q: Why don't percentages add up to exactly 100%?
**A:** Due to rounding to 1 decimal place, percentages may add up to 99.9% or 100.1%. This is normal and doesn't affect actual amounts.

---

## ⚔️ Comparison Questions

### Q: What does the comparison show?
**A:** The `/compare` command shows:
- Total expenses for the current month for both users
- Top spending category for each user
- Who spent less and by how much

### Q: Can I compare income?
**A:** No, comparisons only show expenses. Income is private and not shown in comparisons.

### Q: Can others see my detailed transactions?
**A:** No! The comparison only shows:
- Total monthly expense (one number)
- Your top category (category name only, no amounts)

Your individual transaction details remain private.

### Q: Why does comparison show ฿0 for my friend?
**A:** This means your friend hasn't recorded any expenses this month yet. Encourage them to start tracking!

### Q: Can I compare with multiple users at once?
**A:** No, you can only compare with one user at a time. To compare with multiple people, run the command multiple times.

---

## 🔧 Technical Questions

### Q: Why aren't commands showing up?
**A:** Global slash commands take 1-5 minutes to register after bot startup. If they still don't appear:
1. Wait a bit longer (up to 10 minutes)
2. Refresh Discord (Ctrl+R / Cmd+R)
3. Check if bot is online
4. Try typing `/` to trigger autocomplete
5. Kick and re-invite the bot if still missing

### Q: What happens if the bot goes offline?
**A:** If hosted on Discloud with `AUTORESTART=true`, the bot will automatically restart. Your data in the MySQL database is safe and persists across restarts.

### Q: Why is the bot slow?
**A:** If commands take >5 seconds to respond:
1. Check your internet connection
2. Verify database connection is stable
3. Check Discloud status page
4. Review bot logs for errors
5. Ensure RAM usage isn't at 100%

Normal response time is <2 seconds.

### Q: Can I host the bot on platforms other than Discloud?
**A:** Yes! You can host on:
- ✅ Discloud (optimized for)
- ✅ Railway
- ✅ Heroku
- ✅ VPS (Ubuntu, Debian, etc.)
- ✅ Your own computer (24/7)
- ✅ Raspberry Pi

Just ensure Node.js v20+ and MySQL are available.

### Q: What's the minimum RAM requirement?
**A:** **100MB** is the minimum (Discloud free tier). Typical usage is 40-60MB. On platforms with more RAM, the bot will still run efficiently.

---

## 🎨 Customization Questions

### Q: Can I add more categories?
**A:** Yes! Edit [src/utils/categories.ts](src/utils/categories.ts):

```typescript
export const EXPENSE_CATEGORIES = [
  { name: '🎓 การศึกษา', value: 'EDUCATION' },
  // Add your categories here
];
```

Then rebuild and redeploy.

### Q: Can I change the bot's language?
**A:** Yes! The bot currently uses Thai language. To change to English or another language:
1. Edit all command descriptions in `src/commands/*.ts`
2. Edit category names in `src/utils/categories.ts`
3. Edit embed templates in `src/utils/embeds.ts`
4. Rebuild and redeploy

### Q: Can I change the timezone?
**A:** Yes! Edit [src/utils/date.ts](src/utils/date.ts):

```typescript
dayjs.tz.setDefault('Your/Timezone');
// Examples: 'America/New_York', 'Europe/London', 'Asia/Tokyo'
```

### Q: Can I change the embed colors?
**A:** Yes! Edit [src/utils/embeds.ts](src/utils/embeds.ts). Current colors:
- Expense: `0xef4444` (red)
- Income: `0x22c55e` (green)
- Summary (positive): `0x22c55e` (green)
- Summary (negative): `0xef4444` (red)
- Comparison: `0x3b82f6` (blue)
- Error: `0xef4444` (red)

---

## 📱 Usage Questions

### Q: Can I use the bot on mobile?
**A:** Yes! All commands work perfectly on:
- ✅ Discord Mobile App (iOS & Android)
- ✅ Discord Desktop App
- ✅ Discord Web Browser

Embeds are responsive and readable on all screen sizes.

### Q: Can multiple people use the bot simultaneously?
**A:** Yes! The bot handles concurrent users efficiently. Each user's data is isolated by their Discord User ID.

### Q: Is there a limit to how many transactions I can record?
**A:** No hard limit! However, for performance:
- Database can store millions of transactions
- Summaries aggregate efficiently regardless of transaction count
- Keep your database clean by archiving very old data if needed

### Q: Can I use the bot in multiple Discord servers?
**A:** Yes! The bot works across all servers where it's invited. Your data is tracked by your Discord User ID, so:
- Your transactions are available in all servers
- You can record in Server A and view summary in Server B
- Data is per-user, not per-server

---

## 🛠️ Troubleshooting

### Q: I got an error "ไม่สามารถบันทึกรายการได้"
**A:** This database error can happen if:
1. **Database connection lost** - Check DATABASE_URL
2. **Database is down** - Verify MySQL server is running
3. **Connection pool exhausted** - Check `connection_limit=3` is set
4. **Invalid data** - Verify amount is a valid number

**Solution**: Try again in a few seconds. If persistent, check bot logs.

### Q: Commands work but data isn't saving
**A:** Verify:
1. Prisma schema is pushed to database: `npm run prisma:push`
2. `transactions` table exists in MySQL
3. Database credentials are correct
4. Check bot logs for errors

### Q: Bot shows online but doesn't respond
**A:** This can happen if:
1. Commands aren't registered yet (wait 5 min)
2. Bot lacks permissions in the server
3. Discord API is having issues

**Solution**: 
- Check bot permissions
- Review Discloud/bot logs
- Try in a different channel
- Restart bot

### Q: Getting "interaction failed" message
**A:** This happens when:
1. Bot takes too long to respond (>3 seconds)
2. Database query timeout
3. Network issues

**Solution**: Command will auto-retry. If persistent:
- Check database performance
- Verify internet connection
- Review bot logs

---

## 💡 Best Practices

### Q: How often should I record transactions?
**A:** For best results:
- ✅ **Daily**: Record expenses as they happen
- ✅ **Weekly**: Review and ensure nothing missed
- ✅ **Monthly**: Check `/summary` and adjust spending

### Q: Should I record every tiny expense?
**A:** It's up to you!
- **Detailed tracking**: Record everything, even ฿10 items
- **Simplified tracking**: Only record expenses >฿50
- **Balanced approach**: Record all significant expenses, group small ones

Find what works for your lifestyle!

### Q: What should I put in notes?
**A:** Good notes help you remember later:
- ✅ **Vendor/Store**: "7-Eleven", "Shopee"
- ✅ **Purpose**: "ข้าวเที่ยง", "ค่าไฟเดือนสิงหาคม"
- ✅ **Context**: "งานเลี้ยงทีม", "ซื้อของขวัญวันเกิด"
- ❌ **Too vague**: "อาหาร", "stuff", "things"

---

## 🔮 Future Features

### Q: Will there be more features?
**A:** Potential future features (not yet implemented):
- 📅 Custom date ranges for summaries
- 📝 Edit/delete transactions
- 📊 Charts and graphs
- 💾 Data export (CSV/PDF)
- 🎯 Budget limits and alerts
- 🔔 Recurring transactions
- 📈 Spending trends analysis
- 🌍 Multi-currency support

These are ideas - no timeline yet!

### Q: Can I contribute features?
**A:** Absolutely! This is open-source:
1. Fork the repository
2. Implement your feature
3. Test thoroughly
4. Submit a pull request

Or open an issue with feature requests!

---

## 🆘 Still Need Help?

If your question isn't answered here:

1. **Check the docs**:
   - [README.md](README.md) - Project overview
   - [SETUP.md](SETUP.md) - Setup guide
   - [COMMANDS.md](COMMANDS.md) - Command reference
   - [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment guide

2. **Review logs**:
   ```bash
   # Check bot logs for errors
   discloud logs <app-id>
   ```

3. **Test database**:
   ```bash
   # Verify database connection
   npm run prisma:db:push
   ```

4. **Community resources**:
   - Discord.js Documentation
   - Prisma Documentation
   - Discloud Support

---

**Can't find your answer? Feel free to open an issue on GitHub! 🚀**
