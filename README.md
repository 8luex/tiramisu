# 🍰 Tiramisu Finance Bot

A lightweight, production-ready **Personal Finance & Expense Tracker Discord Bot** optimized for **Discloud** free tier hosting (100MB RAM limit).

Built with **TypeScript**, **discord.js v14**, **Prisma ORM**, and **MySQL**.

---

## ✨ Features

### 📝 `/record` - Record Transactions
- **`/record expense`** - Track your expenses with categories
  - 🍲 อาหาร / เครื่องดื่ม
  - 🚗 เดินทาง
  - 🛍️ ช้อปปิ้ง
  - 🏠 บิล / ค่าใช้จ่ายประจำ
  - 🎮 บันเทิง / สตรีมมิ่ง
  - 📦 อื่นๆ

- **`/record income`** - Track your income
  - 💵 เงินเดือน
  - 💼 งานเสริม / ฟรีแลนซ์
  - 🎁 ของขวัญ / โบนัส
  - 📦 รายรับอื่นๆ

### 📊 `/summary` - View Financial Summary
- Monthly or yearly summary
- Total income and expense breakdown
- Net balance calculation
- Category percentage breakdown with visual bars

### ⚔️ `/compare` - Compare Expenses
- Compare monthly expenses with friends
- See who spent less
- View top spending categories for each user

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v20+ LTS
- **MySQL** database (local or hosted)
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)

### 1. Installation

```bash
# Clone or download this repository
cd tiramisu

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Environment Configuration

Edit `.env` file with your credentials:

```env
DISCORD_TOKEN=your_discord_bot_token_here
APPLICATION_ID=your_application_id_here
DATABASE_URL=mysql://user:password@localhost:3306/finance_bot?connection_limit=3
NODE_ENV=development
```

### 3. Database Setup

```bash
# Push schema to database
npm run prisma:push

# Or create migrations (recommended for production)
npm run prisma:migrate
```

### 4. Development

```bash
# Run in development mode with hot reload
npm run dev
```

### 5. Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

---

## 🌐 Discloud Deployment

### Preparation

1. **Update `discloud.config`:**
   ```
   ID=your-bot-application-id
   TYPE=bot
   MAIN=dist/index.js
   RAM=100
   AUTORESTART=true
   VERSION=stable
   APT=tools
   ```

2. **Set Environment Variables in Discloud:**
   - `DISCORD_TOKEN` - Your Discord bot token
   - `APPLICATION_ID` - Your Discord application ID
   - `DATABASE_URL` - Your MySQL connection string with `?connection_limit=3`
   - `NODE_ENV=production`

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Deploy files to Discloud:**
   - Upload `dist/` folder (compiled JavaScript)
   - Upload `node_modules/` folder
   - Upload `prisma/` folder
   - Upload `.env` file (with production values)
   - Upload `discloud.config`
   - Upload `package.json`

### Memory Optimization for Discloud

This bot is specifically optimized for 100MB RAM:
- ✅ Minimal Discord Gateway Intents (Guilds only)
- ✅ Prisma connection pool limited to 3 connections
- ✅ Database aggregations instead of in-memory processing
- ✅ No caching mechanisms
- ✅ Efficient embed builders
- ✅ Single-threaded architecture

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

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **discord.js v14** | Discord API wrapper |
| **Prisma ORM** | Database ORM with type safety |
| **MySQL** | Relational database |
| **dayjs** | Timezone handling (Asia/Bangkok) |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
tiramisu/
├── src/
│   ├── index.ts              # Bot entry point
│   ├── commands/
│   │   ├── record.ts         # /record command
│   │   ├── summary.ts        # /summary command
│   │   └── compare.ts        # /compare command
│   ├── utils/
│   │   ├── embeds.ts         # Embed builders
│   │   ├── categories.ts     # Category definitions
│   │   └── date.ts           # dayjs configuration
│   └── db/
│       └── client.ts         # Prisma client singleton
├── prisma/
│   └── schema.prisma         # Database schema
├── dist/                     # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
├── discloud.config
└── .env
```

---

## 🎯 Commands Reference

### `/record expense`
```
/record expense amount:100 category:อาหาร/เครื่องดื่ม note:ข้าวเที่ยง
```

### `/record income`
```
/record income amount:30000 category:เงินเดือน note:เงินเดือนเดือนสิงหาคม
```

### `/summary`
```
/summary period:เดือนนี้
/summary period:ปีนี้
```

### `/compare`
```
/compare target:@friend
```

---

## 🔒 Security Notes

- Never commit `.env` file to version control
- Keep your `DISCORD_TOKEN` secret
- Use environment variables for sensitive data
- Limit database connection pool for memory optimization

---

## 📝 License

MIT License - Feel free to use and modify for your needs.

---

## 🤝 Support

For issues or questions:
1. Check the [Discord.js Guide](https://discordjs.guide/)
2. Review [Prisma Documentation](https://www.prisma.io/docs/)
3. Visit [Discloud Documentation](https://docs.discloudbot.com/)

---

## 🎨 Customization

### Adding New Categories

Edit [src/utils/categories.ts](src/utils/categories.ts):

```typescript
export const EXPENSE_CATEGORIES = [
  { name: '🎓 การศึกษา', value: 'EDUCATION' },
  // Add more categories...
];
```

### Changing Timezone

Edit [src/utils/date.ts](src/utils/date.ts):

```typescript
dayjs.tz.setDefault('Your/Timezone');
```

### Modifying Embed Colors

Edit [src/utils/embeds.ts](src/utils/embeds.ts) to customize colors and styling.

---

**Built with 💙 for efficient personal finance tracking**
