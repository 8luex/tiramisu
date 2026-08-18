# ⚡ Quick Start Guide

Get your Tiramisu Bot running in 5 minutes!

---

## 🎯 Prerequisites

Before starting, ensure you have:
- ✅ Node.js v20+ installed
- ✅ MySQL database ready
- ✅ Discord bot token

---

## 🚀 Setup (5 Steps)

### Step 1: Install Dependencies (1 min)

```bash
cd tiramisu
npm install
```

### Step 2: Configure Environment (1 min)

```bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env
```

Required values:
```env
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
APPLICATION_ID=YOUR_APP_ID_HERE
DATABASE_URL=mysql://user:pass@host:3306/db?connection_limit=3
NODE_ENV=development
```

### Step 3: Setup Database (1 min)

```bash
npm run prisma:push
```

Expected output:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema
```

### Step 4: Start Bot (30 sec)

```bash
npm run dev
```

Expected output:
```
🤖 Bot logged in as tiramisu#6772
📊 Serving 3 commands
✅ Slash commands registered successfully
```

### Step 5: Test in Discord (1 min)

Wait 1-2 minutes for commands to register, then test:

```
/record expense amount:100 category:🍲 อาหาร/เครื่องดื่ม note:ทดสอบ
```

---

## ✅ Success Checklist

Your bot is working if:
- ✅ Bot shows "Online" in Discord
- ✅ Commands appear when typing `/`
- ✅ `/record` command responds with an embed
- ✅ No errors in terminal

---

## 🔧 Troubleshooting

### Bot is offline
```bash
# Check .env values are correct
cat .env

# Verify token
echo $DISCORD_TOKEN
```

### Commands don't appear
- Wait 5 minutes (global commands take time)
- Refresh Discord (Ctrl+R / Cmd+R)
- Check APPLICATION_ID matches Discord app

### Database errors
```bash
# Test database connection
npm run prisma:db:push

# Check DATABASE_URL format
# Should be: mysql://user:password@host:3306/database?connection_limit=3
```

---

## 📚 Next Steps

1. **Read Full Documentation**
   - [README.md](README.md) - Overview
   - [COMMANDS.md](COMMANDS.md) - Command reference

2. **Production Deployment**
   - [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deploy to Discloud

3. **Get Help**
   - [FAQ.md](FAQ.md) - Common questions
   - [SETUP.md](SETUP.md) - Detailed setup

---

## 🎉 You're Ready!

Your bot is now tracking finances! Try these commands:

```bash
# Record expense
/record expense amount:150 category:🍲 อาหาร/เครื่องดื่ม

# Record income
/record income amount:30000 category:💵 เงินเดือน

# View summary
/summary period:เดือนนี้

# Compare with friend
/compare target:@Friend
```

---

## 🛑 Stop Bot

Press `Ctrl+C` in terminal to stop.

---

**Need help? Check [FAQ.md](FAQ.md) or [SETUP.md](SETUP.md)!**
