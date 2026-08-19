# 🍰☕ Tiramisu Bot - Serverless Edition

A **100% serverless** expense tracker Discord bot using **AWS Lambda** + **HTTP Interactions**.

**No 24/7 hosting needed** - completely free forever using AWS Free Tier! ✨

Track your spending the way you actually talk! Built with **TypeScript**, **AWS Lambda**, **Prisma ORM**, and **MySQL**.

---

## 🔥 Features

### 💸 `/record` - Track Your Spending
- **`/record expense`** - spent that bag fr fr
  - 🍕 Food & Drinks (munchies)
  - 🚗 Transportation (on the move)
  - 🛍️ Shopping (treat yourself)
  - 🏠 Bills & Utilities (adulting)
  - 🎮 Entertainment (vibes)
  - ✨ Other (random stuff)

- **`/record income`** - secured the bag!! 💯
  - 💰 Salary (main bag)
  - 💼 Freelance (side hustle)
  - 🎁 Gifts & Bonuses (blessed)
  - ✨ Other Income (extra $$$)

### 📊 `/summary` - Check Your Money Situation
- Weekly, monthly, or yearly recap
- Money in vs money out
- See what's left over
- Category breakdown with visual bars (no cap)

### ⚔️ `/compare` - Battle Your Homies
- Compare spending with up to 3 friends at once
- Choose timeframe: weekly, monthly, or yearly
- Leaderboard showing who saved the most
- See who's on top (W vibes)
- View top spending categories for each person

---

## ⚡ Why Serverless?

### Traditional Bot (Gateway):
- ❌ Needs 24/7 server
- ❌ Hosting costs ($2-5/month)
- ❌ Limited RAM/CPU
- ❌ Downtime during maintenance
- ❌ "NO_CLUSTER" errors on free tiers

### Serverless Lambda:
- ✅ **100% FREE** (1M requests/month forever)
- ✅ No server to maintain
- ✅ Auto-scaling (unlimited)
- ✅ Only runs when commands are used
- ✅ Built-in monitoring
- ✅ Global edge locations

---

## 🚀 Quick Deploy (10 Minutes)

### Prerequisites
- **AWS Account** (free tier: aws.amazon.com/free)
- **Discord Bot** (discord.com/developers/applications)
- **MySQL Database** (Railway/PlanetScale/AWS RDS/your own)

### Step 1: Build Deployment Package

```bash
# Clone repository
git clone <your-repo-url>
cd tiramisu

# Install dependencies
npm install

# Build Lambda bundle
npm run build:deploy
```

This creates `dist/lambda-deployment.zip` ready for upload!

### Step 2: Deploy to AWS Lambda

1. **Create Lambda Function:**
   - Go to https://console.aws.amazon.com/lambda/
   - Click "Create function"
   - Name: `tiramisu-bot`
   - Runtime: Node.js 20.x
   - Architecture: arm64

2. **Upload Code:**
   - Upload `dist/lambda-deployment.zip`
   - Set handler: `lambda.handler`

3. **Configure:**
   - Memory: 512 MB
   - Timeout: 15 seconds
   - Environment variables (see below)

4. **Create Function URL:**
   - Configuration → Function URL
   - Auth type: NONE
   - Copy the URL

### Step 3: Environment Variables

Add these in Lambda Console → Configuration → Environment variables:

```env
DISCORD_PUBLIC_KEY=your_public_key_from_discord_portal
DATABASE_URL=mysql://user:password@host:3306/database?connection_limit=5
NODE_ENV=production
TZ=Asia/Bangkok
```

### Step 4: Register Commands

```bash
# Set environment variables
export DISCORD_TOKEN="your_bot_token"
export APPLICATION_ID="your_app_id"

# Register slash commands
npm run register:commands
```

### Step 5: Connect Discord

1. Go to Discord Developer Portal
2. General Information → Interactions Endpoint URL
3. Paste your Lambda Function URL
4. Save (Discord will verify with PING)

### Step 6: Test!

```
/record expense amount:150 category:munchies note:coffee run
/summary period:this week
/compare target1:@Friend period:this month
```

---

## 📚 Documentation

- **[SERVERLESS_QUICKSTART.md](SERVERLESS_QUICKSTART.md)** - 10-minute setup guide
- **[AWS_LAMBDA_DEPLOYMENT.md](AWS_LAMBDA_DEPLOYMENT.md)** - Detailed deployment guide
- **[COMMANDS.md](COMMANDS.md)** - Command reference

---

## 💰 Cost Estimate

### AWS Lambda Free Tier (Forever):
- **1 million requests/month** - FREE
- **400,000 GB-seconds** - FREE

### Your Usage (~100 commands/day):
- **3,000 requests/month**
- **Cost: $0.00**

### Even at 1M requests/month:
- **Still $0.00** (within free tier!)

**No hosting costs, ever!** 🔥

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **AWS Lambda** | Serverless compute |
| **HTTP Interactions** | Discord webhook protocol |
| **Prisma ORM** | Database ORM with type safety |
| **MySQL** | Relational database |
| **dayjs** | Timezone handling (Asia/Bangkok) |
| **esbuild** | Fast bundler |
| **discord-interactions** | Signature verification |

---

## 📁 Project Structure

```
tiramisu/
├── src/
│   ├── lambda.ts              # Lambda handler entry point
│   ├── handlers/
│   │   ├── record.ts          # /record command handler
│   │   ├── summary.ts         # /summary command handler
│   │   └── compare.ts         # /compare command handler
│   ├── utils/
│   │   ├── embeds.ts          # Embed builders (tiramisu theme)
│   │   ├── categories.ts      # Category definitions
│   │   └── date.ts            # dayjs configuration
│   └── db/
│       └── client.ts          # Prisma client singleton
├── scripts/
│   └── register-commands.mjs  # Command registration script
├── prisma/
│   └── schema.prisma          # Database schema
├── build.mjs                  # esbuild configuration
├── package.json
└── dist/
    └── lambda-deployment.zip  # Deployment package
```

---

## 🎨 Tiramisu Theme

The bot uses a cozy cafe aesthetic inspired by tiramisu dessert:

**Colors:**
- ☕ Coffee Brown (`#D4A574`) - Expenses, errors
- 🍰 Cream (`#FFF8E7`) - Income, positive balance
- 🤎 Latte (`#C8A882`) - Comparisons
- 🍪 Biscuit (`#E8D5C4`) - Multi-user leaderboards

**Emojis:**
- ☕ Coffee - Spending/expenses
- 🍰 Cake - Income/positive
- 🥛 Milk - Money in
- 🤎 Brown heart - Negative balance

---

## 🗄️ Database Schema

```prisma
model Transaction {
  id        String          @id @default(uuid())
  userId    String          @db.VarChar(20)  // Discord User ID
  type      TransactionType  // EXPENSE or INCOME
  amount    Decimal         @db.Decimal(12, 2)
  category  String          @db.VarChar(50)
  note      String?         @db.VarChar(255)
  createdAt DateTime        @default(now())

  @@index([userId, type, createdAt])
  @@map("transactions")
}
```

---

## 🔄 Updating Code

```bash
# 1. Make changes to src/
# 2. Rebuild
npm run build:deploy

# 3. Upload to Lambda
# Via Console: Upload new .zip
# Or AWS CLI:
aws lambda update-function-code \
  --function-name tiramisu-bot \
  --zip-file fileb://dist/lambda-deployment.zip
```

---

## 📊 Monitoring

### CloudWatch Logs:
```bash
# View logs
aws logs tail /aws/lambda/tiramisu-bot --follow

# Or via Console
Lambda → Monitor → View CloudWatch Logs
```

### Metrics:
- Request count
- Error rate
- Duration
- Cold starts

---

## 🚨 Troubleshooting

### "Invalid signature" error:
- Check `DISCORD_PUBLIC_KEY` matches Discord Developer Portal

### Commands not appearing:
- Wait 1-2 minutes for sync
- Refresh Discord (Ctrl+R)
- Re-run `npm run register:commands`

### Database connection timeout:
- Check `DATABASE_URL` is accessible from internet
- Increase Lambda timeout
- Use `connection_limit=5` in DATABASE_URL

### Cold start too slow:
- Increase memory (512 MB → 1024 MB)
- More memory = more CPU

---

## 🔐 Security Notes

- Discord signature verification on every request
- Environment variables encrypted at rest
- No public endpoints (Function URL is the only entry)
- Database credentials in Lambda environment variables
- Consider AWS Secrets Manager for production

---

## 🎯 Command Examples

### Record Expense
```
/record expense amount:150 category:munchies note:lunch with friends
/record expense amount:500 category:on the move note:gas money
```

### Record Income
```
/record income amount:30000 category:main bag note:monthly salary
/record income amount:5000 category:side hustle note:freelance project
```

### Summary
```
/summary period:this week
/summary period:this month
/summary period:this year
```

### Compare
```
/compare target1:@Friend
/compare target1:@Friend1 target2:@Friend2 period:this week
/compare target1:@Friend1 target2:@Friend2 target3:@Friend3 period:this month
```

---

## 🤝 Contributing

Feel free to fork and customize for your needs!

---

## 📝 License

MIT License - Use freely!

---

## 🆘 Support

For issues or questions:
1. Check [AWS_LAMBDA_DEPLOYMENT.md](AWS_LAMBDA_DEPLOYMENT.md)
2. Review [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
3. Check [Discord HTTP Interactions Guide](https://discord.com/developers/docs/interactions/receiving-and-responding)

---

**Built with 🤎☕🍰 for efficient personal finance tracking - now 100% serverless!**

**No servers, no hosting costs, no problems!! fr fr** ໒꒰ྀི´ ˘ ` ꒱ྀིა
