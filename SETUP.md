# 🚀 Setup Guide for Tiramisu Bot

This guide will walk you through setting up the bot from scratch to deployment.

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- ✅ **Node.js v20+** installed ([Download](https://nodejs.org/))
- ✅ **MySQL database** (local or cloud-hosted)
- ✅ **Discord account** with Developer Portal access
- ✅ **Discloud account** (optional, for hosting)

---

## Step 1: Create a Discord Bot

### 1.1 Create Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Name it "Tiramisu Bot" (or your preferred name)
4. Click **"Create"**

### 1.2 Create Bot User
1. Navigate to the **"Bot"** section in the left sidebar
2. Click **"Add Bot"** → **"Yes, do it!"**
3. Under **"Token"**, click **"Reset Token"** and copy it
   - ⚠️ **IMPORTANT:** Save this token securely - you'll need it for `.env`
4. Disable **"Public Bot"** (optional, for private use)
5. Under **"Privileged Gateway Intents"**, you don't need to enable any

### 1.3 Get Application ID
1. Go to **"General Information"** in the left sidebar
2. Copy the **"Application ID"**
   - This is your `APPLICATION_ID` for `.env`

### 1.4 Invite Bot to Your Server
1. Go to **"OAuth2"** → **"URL Generator"**
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ `Send Messages`
   - ✅ `Embed Links`
   - ✅ `Use Slash Commands`
4. Copy the generated URL and open it in your browser
5. Select your server and click **"Authorize"**

---

## Step 2: Set Up MySQL Database

### Option A: Local MySQL (Development)

```bash
# Install MySQL (macOS with Homebrew)
brew install mysql
brew services start mysql

# Create database
mysql -u root -p
CREATE DATABASE finance_bot;
CREATE USER 'financeuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON finance_bot.* TO 'financeuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Your `DATABASE_URL` will be:
```
mysql://financeuser:your_password@localhost:3306/finance_bot?connection_limit=3
```

### Option B: Cloud MySQL (Production)

Popular free/cheap options:
- **PlanetScale** (Free tier available)
- **Railway** (Free tier with limits)
- **Aiven** (Free trial)
- **AWS RDS Free Tier**

Get the connection string from your provider.

---

## Step 3: Install and Configure

### 3.1 Install Dependencies

```bash
cd tiramisu
npm install
```

### 3.2 Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env file
nano .env
```

Fill in your values:
```env
DISCORD_TOKEN=your_bot_token_from_step_1.2
APPLICATION_ID=your_application_id_from_step_1.3
DATABASE_URL=mysql://user:password@host:3306/database?connection_limit=3
NODE_ENV=development
```

### 3.3 Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

You should see:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema
```

---

## Step 4: Test Locally

### 4.1 Run Development Server

```bash
npm run dev
```

Expected output:
```
🤖 Bot logged in as tiramisu#6772
📊 Serving 3 commands
🔄 Registering slash commands globally...
✅ Slash commands registered successfully
```

### 4.2 Test Commands in Discord

Wait ~1 minute for commands to register, then in Discord:

1. **Test Recording Expense:**
   ```
   /record expense amount:100 category:🍲 อาหาร/เครื่องดื่ม note:ข้าวเที่ยง
   ```

2. **Test Recording Income:**
   ```
   /record income amount:1000 category:💵 เงินเดือน
   ```

3. **Test Summary:**
   ```
   /summary period:เดือนนี้
   ```

4. **Test Comparison (with a friend):**
   ```
   /compare target:@YourFriend
   ```

---

## Step 5: Build for Production

### 5.1 Build Project

```bash
npm run build
```

This creates the `dist/` folder with compiled JavaScript.

### 5.2 Test Production Build

```bash
# Set production mode
export NODE_ENV=production

# Run production build
npm start
```

---

## Step 6: Deploy to Discloud

### 6.1 Update Configuration

Edit `discloud.config`:
```
ID=your_application_id_here
TYPE=bot
MAIN=dist/index.js
RAM=100
AUTORESTART=true
VERSION=stable
APT=tools
```

### 6.2 Prepare Production Environment

Update `.env` for production:
```env
DISCORD_TOKEN=your_bot_token
APPLICATION_ID=your_application_id
DATABASE_URL=mysql://user:password@production-host:3306/db?connection_limit=3
NODE_ENV=production
```

### 6.3 Upload to Discloud

1. Build the project: `npm run build`
2. Compress these files/folders into a `.zip`:
   - `dist/` (compiled code)
   - `node_modules/` (dependencies)
   - `prisma/` (schema)
   - `.env` (with production values)
   - `discloud.config`
   - `package.json`

3. Upload to [Discloud Dashboard](https://discloud.app/dashboard)

4. Start your bot and monitor logs

---

## 🔍 Troubleshooting

### Bot doesn't appear online
- ✅ Check `DISCORD_TOKEN` is correct
- ✅ Verify bot has proper permissions
- ✅ Check Discloud logs for errors

### Commands don't show up
- ⏳ Wait 1-5 minutes for global commands to register
- 🔄 Try refreshing Discord (Ctrl+R / Cmd+R)
- 🔌 Kick and re-invite the bot

### Database connection errors
- ✅ Verify `DATABASE_URL` format
- ✅ Check database credentials
- ✅ Ensure database exists
- ✅ Test connection: `npm run prisma:db:push`

### Memory issues on Discloud
- 📊 Monitor RAM usage in Discloud dashboard
- ⚙️ Verify `connection_limit=3` in DATABASE_URL
- 🔍 Check for memory leaks in logs

### TypeScript compilation errors
- 🔄 Delete `node_modules/` and `dist/`, then `npm install`
- ✅ Ensure TypeScript version is ^5.4.5
- 🔧 Run `npm run prisma:generate` again

---

## 📚 Additional Resources

- [Discord.js Guide](https://discordjs.guide/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Discloud Documentation](https://docs.discloudbot.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 🎉 Success!

Your Tiramisu Bot should now be running! Users can start tracking their finances using the slash commands.

For customization options, see [README.md](README.md).

---

**Need Help?**
- Check the troubleshooting section above
- Review Discord.js documentation
- Verify all environment variables are set correctly
