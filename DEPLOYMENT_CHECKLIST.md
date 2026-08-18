# 🚀 Deployment Checklist for Discloud

Use this checklist to ensure a smooth deployment to Discloud.

---

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] `.env` file created with production values
- [ ] `DISCORD_TOKEN` is valid and not expired
- [ ] `APPLICATION_ID` matches your Discord app
- [ ] `DATABASE_URL` includes `?connection_limit=3`
- [ ] `NODE_ENV` set to `production`

### 2. Discord Configuration
- [ ] Bot token is fresh (not expired)
- [ ] Bot is invited to your server
- [ ] Bot has required permissions:
  - [ ] Send Messages
  - [ ] Embed Links
  - [ ] Use Slash Commands
- [ ] Gateway Intents configured (only Guilds needed)

### 3. Database Setup
- [ ] MySQL database is accessible from Discloud
- [ ] Database credentials are correct
- [ ] Database exists and is empty (for first deployment)
- [ ] Connection limit set to 3 in DATABASE_URL
- [ ] Test connection with `npm run prisma:db:push`

### 4. Code Verification
- [ ] All TypeScript files compile without errors
- [ ] `npm run build` completes successfully
- [ ] `dist/` folder contains compiled JavaScript
- [ ] No syntax errors in any command files
- [ ] All imports are using correct paths

### 5. Discloud Config
- [ ] `discloud.config` ID matches APPLICATION_ID
- [ ] RAM set to 100MB
- [ ] MAIN points to `dist/index.js`
- [ ] AUTORESTART is `true`
- [ ] VERSION is `stable`

---

## 📦 Files to Upload

Create a `.zip` file containing:

```
✅ dist/ (entire folder with compiled JS)
✅ node_modules/ (entire folder)
✅ prisma/ (folder with schema.prisma)
✅ .env (with production values)
✅ discloud.config
✅ package.json
```

### Files to EXCLUDE:
```
❌ src/ (TypeScript source, not needed)
❌ tsconfig.json
❌ .git/
❌ .gitignore
❌ *.md files (README, SETUP, etc.)
❌ .env.example
```

---

## 🔨 Build Process

Run these commands in order:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run prisma:generate

# 3. Build TypeScript
npm run build

# 4. Verify dist/ folder exists
ls -la dist/

# 5. Test local production build (optional)
NODE_ENV=production npm start
```

Expected output from build:
```
$ tsc
✓ Compilation complete
✓ Files generated in dist/
```

---

## 🗄️ Database Migration

### First Deployment

```bash
# Push schema to production database
npm run prisma:push
```

Expected output:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema
```

### Verify Database

```bash
# Check if table exists
mysql -u user -p -h host -D database -e "SHOW TABLES;"
```

Expected output:
```
+------------------------+
| Tables_in_finance_bot  |
+------------------------+
| transactions           |
+------------------------+
```

---

## 📤 Discloud Upload Steps

### Method 1: Web Dashboard

1. Go to [Discloud Dashboard](https://discloud.app/dashboard)
2. Click **"Upload Application"**
3. Select your `.zip` file
4. Wait for upload to complete
5. Check deployment logs
6. Start the bot

### Method 2: CLI (if available)

```bash
discloud upload tiramisu.zip
discloud start <app-id>
discloud logs <app-id>
```

---

## 🔍 Post-Deployment Verification

### 1. Check Bot Status
- [ ] Bot shows as "Online" in Discord
- [ ] Green status indicator
- [ ] Correct username and avatar

### 2. Test Commands
- [ ] `/record expense` works
- [ ] `/record income` works
- [ ] `/summary period:เดือนนี้` works
- [ ] `/summary period:ปีนี้` works
- [ ] `/compare target:@user` works

### 3. Check Database
- [ ] Transactions are being saved
- [ ] Timestamps are correct (Asia/Bangkok)
- [ ] Data persists after bot restart
- [ ] No duplicate entries

### 4. Monitor Performance
- [ ] Check RAM usage in Discloud dashboard
- [ ] Should be under 100MB (ideally 40-60MB)
- [ ] No memory leaks over time
- [ ] Response times are fast (<2 seconds)

### 5. Check Logs
```bash
# Check for errors
discloud logs <app-id>
```

Expected healthy logs:
```
🤖 Bot logged in as Tiramisu Finance Bot#1234
📊 Serving 3 commands
🔄 Registering slash commands globally...
✅ Slash commands registered successfully
```

---

## 🚨 Common Issues & Solutions

### Issue: Bot goes offline randomly
**Solution:**
- Check RAM usage (might be exceeding 100MB)
- Review Discloud logs for errors
- Verify `AUTORESTART=true` in config

### Issue: Commands not registering
**Solution:**
- Wait 5-10 minutes for global commands
- Check APPLICATION_ID matches Discord app
- Verify DISCORD_TOKEN is valid
- Restart bot in Discloud dashboard

### Issue: Database connection errors
**Solution:**
- Verify DATABASE_URL format
- Check `connection_limit=3` parameter
- Ensure database is accessible from Discloud IP
- Test credentials manually

### Issue: High memory usage
**Solution:**
- Ensure only `Guilds` intent is enabled
- Verify Prisma connection pool is limited
- Check for memory leaks in custom code
- Restart bot to clear memory

### Issue: Slash commands show old data
**Solution:**
- Commands are cached for up to 1 hour
- Wait for cache to expire
- Or kick and re-invite bot to force refresh

---

## 📊 Monitoring

### Daily Checks
- [ ] Bot is online
- [ ] No error spikes in logs
- [ ] RAM usage is stable

### Weekly Checks
- [ ] Database size is reasonable
- [ ] No memory leaks detected
- [ ] User feedback (if any)
- [ ] Performance is consistent

### Monthly Checks
- [ ] Review total data usage
- [ ] Check for deprecation notices
- [ ] Update dependencies if needed
- [ ] Backup database

---

## 🔄 Update Deployment

When making code changes:

```bash
# 1. Pull latest changes
git pull

# 2. Install any new dependencies
npm install

# 3. Rebuild
npm run build

# 4. Test locally
npm start

# 5. Create new .zip with updated dist/
# 6. Upload to Discloud
# 7. Restart bot

# 8. Verify changes in Discord
```

---

## 🔐 Security Checklist

- [ ] `.env` file is NOT committed to Git
- [ ] `DISCORD_TOKEN` is kept secret
- [ ] Database credentials are secure
- [ ] No hardcoded secrets in code
- [ ] `.gitignore` includes sensitive files
- [ ] Production database has strong password

---

## 📝 Rollback Plan

If deployment fails:

1. **Keep previous working `.zip` backup**
2. **Document current configuration**
3. **Have database backup ready**
4. **Know how to restore previous version:**
   ```bash
   # Stop current bot
   discloud stop <app-id>
   
   # Upload previous version
   discloud upload backup.zip
   
   # Start bot
   discloud start <app-id>
   ```

---

## ✅ Final Checklist

Before marking deployment complete:

- [ ] Bot is online and responsive
- [ ] All 3 commands work correctly
- [ ] Data persists in database
- [ ] No errors in logs
- [ ] RAM usage is under 80MB
- [ ] Commands register globally (within 5 min)
- [ ] Timezone is correct (Asia/Bangkok)
- [ ] Error handling works (test with invalid inputs)
- [ ] Multiple users can use bot simultaneously
- [ ] Bot auto-restarts on crash

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Bot is online 24/7 with <99% uptime
✅ All commands respond in <2 seconds
✅ RAM usage stays under 80MB consistently
✅ No critical errors in logs for 24 hours
✅ Users can track transactions without issues
✅ Database connections are stable

---

## 📞 Support Resources

- [Discloud Documentation](https://docs.discloudbot.com/)
- [Discord.js Guide](https://discordjs.guide/)
- [Prisma Troubleshooting](https://www.prisma.io/docs/guides/general-guides/troubleshooting)

---

**Ready to deploy? Start with the Pre-Deployment Checklist! 🚀**
