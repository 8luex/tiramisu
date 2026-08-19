# ⚡ Serverless Quickstart

Deploy Tiramisu Bot to AWS Lambda in **10 minutes** - **100% free forever** using AWS Free Tier! 🚀

---

## 🎯 Why Serverless?

**Current Problem:** Discloud free tier full, need 24/7 hosting

**Serverless Solution:**
- ✅ No 24/7 server needed
- ✅ 100% FREE (AWS Lambda: 1M requests/month forever)
- ✅ Auto-scales (handles any load)
- ✅ Only runs when commands are used
- ✅ No more "NO_CLUSTER" errors!

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Build & Package

```bash
# Install dependencies
npm install

# Build Lambda bundle
npm run build:deploy
```

This creates `dist/lambda-deployment.zip` ready for upload!

### Step 2: Deploy to AWS Lambda

1. **Go to AWS Lambda Console:** https://console.aws.amazon.com/lambda/
2. **Create Function:**
   - Name: `tiramisu-bot`
   - Runtime: Node.js 20.x
   - Architecture: arm64
3. **Upload** `dist/lambda-deployment.zip`
4. **Configure:**
   - Handler: `lambda.handler`
   - Memory: 512 MB
   - Timeout: 15 seconds
5. **Add Environment Variables:**
   ```
   DISCORD_PUBLIC_KEY=your_public_key
   DATABASE_URL=mysql://user:pass@host/db?connection_limit=5
   NODE_ENV=production
   TZ=Asia/Bangkok
   ```
6. **Create Function URL:**
   - Go to Configuration → Function URL
   - Auth: NONE
   - Copy the URL (e.g., `https://abc.lambda-url.us-east-1.on.aws/`)

### Step 3: Connect to Discord

1. **Register Commands:**
   ```bash
   node scripts/register-commands.mjs
   ```

2. **Set Interactions Endpoint:**
   - Go to Discord Developer Portal
   - General Information → Interactions Endpoint URL
   - Paste your Lambda Function URL
   - Save (Discord will verify with PING)

3. **Test in Discord!**
   ```
   /record expense amount:150 category:munchies
   /summary period:this week
   /compare target1:@Friend
   ```

---

## 💰 Cost Breakdown

### AWS Lambda Free Tier (Forever):
- **1 million requests/month** - FREE
- **400,000 GB-seconds** - FREE

### Your Usage (estimated):
- **100 commands/day** = 3,000 requests/month
- **Cost:** $0.00

### At scale (1M requests/month):
- **Still FREE** (within free tier)

---

## 🆚 Comparison with Other Hosting

| Platform | Cost | Uptime Required | Setup | Scalability |
|----------|------|-----------------|-------|-------------|
| **Discloud Free** | Free | 24/7 | Easy | Limited slots |
| **Railway** | Free* | 24/7 | Medium | 500 hrs/month |
| **Replit** | Free* | 24/7 | Easy | May sleep |
| **AWS Lambda** | **FREE** | **0** | **Medium** | **Unlimited** |

*Lambda = truly free forever, no hour limits!

---

## 🔥 Features

**All bot features work exactly the same:**
- ☕ `/record expense` - track spending
- 🍰 `/record income` - track earnings  
- 📊 `/summary` - weekly/monthly/yearly recaps
- ⚔️ `/compare` - battle up to 3 friends

**Plus serverless benefits:**
- ⚡ Fast response (cold start ~500ms)
- 🔒 Secure (AWS managed)
- 📊 Built-in monitoring (CloudWatch)
- 🌍 Global (AWS edge locations)

---

## 🛠️ Technical Details

### Architecture:
```
Discord → HTTP POST → Lambda Function URL → Verify Signature → 
Process Command → MySQL → Return Response
```

### Key Changes from Gateway Bot:
- ❌ No discord.js Client (removed)
- ✅ discord-interactions (HTTP verification)
- ❌ No WebSocket connection
- ✅ HTTP POST requests
- ❌ No 24/7 process
- ✅ On-demand execution

### Cold Start Performance:
- **First request:** ~500-800ms (Lambda cold start)
- **Warm requests:** ~50-100ms
- **Discord timeout:** 3 seconds (we're well under!)

---

## 📊 Monitoring

### View Logs:
```bash
# Via AWS Console
Lambda → Monitor → View CloudWatch Logs

# Or AWS CLI
aws logs tail /aws/lambda/tiramisu-bot --follow
```

### Metrics:
- Invocations count
- Error rate
- Duration
- Throttles

---

## 🔄 Updating Code

```bash
# 1. Make changes to src/
# 2. Rebuild & redeploy
npm run build:deploy

# 3. Upload to Lambda
# Via Console: Upload new .zip
# Or AWS CLI:
aws lambda update-function-code \
  --function-name tiramisu-bot \
  --zip-file fileb://dist/lambda-deployment.zip
```

---

## 🚨 Troubleshooting

### "Invalid signature" error:
- Check `DISCORD_PUBLIC_KEY` is correct
- Copy from Discord Developer Portal → General Information

### Commands not showing:
- Wait 1-2 minutes
- Refresh Discord (Ctrl+R)
- Re-run `node scripts/register-commands.mjs`

### Database connection timeout:
- Check `DATABASE_URL` is accessible from internet
- Increase Lambda timeout to 15-30 seconds
- Use `connection_limit=5` in DATABASE_URL

### Lambda cold start too slow:
- Increase memory (more memory = more CPU)
- 512 MB is usually enough
- 1024 MB for faster performance

---

## 📚 Full Documentation

For detailed setup, see [AWS_LAMBDA_DEPLOYMENT.md](AWS_LAMBDA_DEPLOYMENT.md)

---

## 🎉 Success!

Your bot is now **100% serverless** and runs on AWS Lambda!

**Benefits:**
- ✅ FREE forever (1M requests/month)
- ✅ No server maintenance
- ✅ Auto-scaling
- ✅ Only pays for what you use (which is nothing!)

**No more Discloud queue, no more hosting costs, no more maintenance!** 🔥

---

**Questions?** Check AWS_LAMBDA_DEPLOYMENT.md for detailed guide! ☕🍰
