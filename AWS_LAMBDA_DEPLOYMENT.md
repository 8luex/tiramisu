# 🚀 AWS Lambda Serverless Deployment

Deploy Tiramisu Bot as a **100% serverless** application using AWS Lambda + HTTP Interactions!

**No 24/7 hosting needed** - only runs when commands are used = **Always Free Tier** ✨

---

## 📋 Architecture Overview

```
Discord User
     ↓
 /command
     ↓
Discord API (HTTP POST)
     ↓
AWS Lambda Function URL
     ↓
Lambda Handler (verify signature)
     ↓
Process Command
     ↓
Query MySQL Database
     ↓
Return Response (Embed)
```

**Key Benefits:**
- ✅ **100% Free** (AWS Lambda always-free tier: 1M requests/month)
- ✅ **No server maintenance**
- ✅ **Auto-scaling** (handles any load)
- ✅ **Pay-per-use** (only charged when commands are executed)
- ✅ **Cold start:** ~500-800ms (acceptable for Discord interactions)

---

## 🔑 Prerequisites

### 1. AWS Account
- Sign up at https://aws.amazon.com/free/
- Free tier includes:
  - **1 million Lambda requests/month** (forever free)
  - **400,000 GB-seconds compute time/month**

### 2. Discord Application Setup
- Go to https://discord.com/developers/applications
- Create/select your application
- Get these values:
  - `Application ID` (from General Information)
  - `Public Key` (from General Information)
  - `Bot Token` (from Bot section)

### 3. MySQL Database
- Can be hosted anywhere:
  - AWS RDS Free Tier
  - Railway.app
  - PlanetScale
  - Your own server

---

## 📦 Step 1: Build Lambda Deployment Package

```bash
# Install dependencies
npm install

# Build Lambda bundle with esbuild
npm run build:lambda

# Generate Prisma client
npm run prisma:generate

# Package everything for deployment
npm run package:lambda
```

This creates `dist/lambda-deployment.zip` containing:
- `lambda.js` (bundled handler)
- `node_modules/@prisma` (Prisma client)
- `node_modules/.prisma` (generated client)

---

## 🌐 Step 2: Create AWS Lambda Function

### Via AWS Console (Easiest)

1. **Go to AWS Lambda Console:**
   - https://console.aws.amazon.com/lambda/

2. **Create Function:**
   - Click "Create function"
   - Choose "Author from scratch"
   - **Function name:** `tiramisu-bot`
   - **Runtime:** Node.js 20.x
   - **Architecture:** arm64 (cheaper & faster)
   - Click "Create function"

3. **Upload Deployment Package:**
   - In the "Code" tab
   - Click "Upload from" → ".zip file"
   - Select `dist/lambda-deployment.zip`
   - Click "Save"

4. **Configure Handler:**
   - In "Runtime settings", click "Edit"
   - **Handler:** `lambda.handler`
   - Click "Save"

5. **Configure Memory & Timeout:**
   - Go to "Configuration" → "General configuration"
   - **Memory:** 512 MB (adjust based on usage)
   - **Timeout:** 15 seconds
   - Click "Save"

---

## 🔐 Step 3: Configure Environment Variables

In Lambda Console → "Configuration" → "Environment variables":

```
DISCORD_PUBLIC_KEY=your_public_key_from_discord_developer_portal
DATABASE_URL=mysql://user:password@host:3306/database?connection_limit=5
NODE_ENV=production
TZ=Asia/Bangkok
```

**Important:**
- `DISCORD_PUBLIC_KEY` is needed for signature verification
- `DATABASE_URL` must be accessible from Lambda (use public endpoint or VPC)
- `connection_limit=5` prevents connection exhaustion

---

## 🌍 Step 4: Create Lambda Function URL

1. **In Lambda Console:**
   - Go to "Configuration" → "Function URL"
   - Click "Create function URL"

2. **Settings:**
   - **Auth type:** NONE (Discord handles auth via signature)
   - **Invoke mode:** BUFFERED
   - Click "Save"

3. **Copy Function URL:**
   ```
   https://abc123xyz.lambda-url.us-east-1.on.aws/
   ```
   - Save this URL - you'll need it for Discord!

---

## 🤖 Step 5: Register Discord Commands

Create a script to register slash commands with Discord:

### `scripts/register-commands.mjs`

```javascript
import https from 'https';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const APPLICATION_ID = process.env.APPLICATION_ID;

const commands = [
  {
    name: 'record',
    description: '💰 track ur money moves',
    options: [
      {
        name: 'expense',
        description: '💸 spent some cash',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'amount',
            description: '💵 how much',
            type: 10, // NUMBER
            required: true,
            min_value: 0.01,
          },
          {
            name: 'category',
            description: '📁 what for',
            type: 3, // STRING
            required: true,
            choices: [
              { name: '🍕 Food & Drinks (munchies)', value: 'FOOD_DRINK' },
              { name: '🚗 Transportation (on the move)', value: 'TRANSPORT' },
              { name: '🛍️ Shopping (treat yourself)', value: 'SHOPPING' },
              { name: '🏠 Bills & Utilities (adulting)', value: 'BILLS' },
              { name: '🎮 Entertainment (vibes)', value: 'ENTERTAINMENT' },
              { name: '✨ Other (random stuff)', value: 'OTHER' },
            ],
          },
          {
            name: 'note',
            description: '📝 spill the tea (optional)',
            type: 3, // STRING
            required: false,
            max_length: 255,
          },
        ],
      },
      {
        name: 'income',
        description: '🍰 secured the bag!! 💯',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'amount',
            description: '💵 how much',
            type: 10, // NUMBER
            required: true,
            min_value: 0.01,
          },
          {
            name: 'category',
            description: '📁 source',
            type: 3, // STRING
            required: true,
            choices: [
              { name: '💰 Salary (main bag)', value: 'SALARY' },
              { name: '💼 Freelance (side hustle)', value: 'FREELANCE' },
              { name: '🎁 Gifts & Bonuses (blessed)', value: 'GIFT' },
              { name: '✨ Other Income (extra $$$)', value: 'OTHER_INCOME' },
            ],
          },
          {
            name: 'note',
            description: '📝 spill the tea (optional)',
            type: 3, // STRING
            required: false,
            max_length: 255,
          },
        ],
      },
    ],
  },
  {
    name: 'summary',
    description: '📊 check ur money situation fr',
    options: [
      {
        name: 'period',
        description: '⏰ what timeframe tho',
        type: 3, // STRING
        required: true,
        choices: [
          { name: '📅 this week', value: 'WEEK' },
          { name: '🔥 this month', value: 'MONTH' },
          { name: '💯 this year', value: 'YEAR' },
        ],
      },
    ],
  },
  {
    name: 'compare',
    description: '☕ spending battle',
    options: [
      {
        name: 'target1',
        description: '👥 first person',
        type: 6, // USER
        required: true,
      },
      {
        name: 'target2',
        description: '👥 second person (optional)',
        type: 6, // USER
        required: false,
      },
      {
        name: 'target3',
        description: '👥 third person (optional)',
        type: 6, // USER
        required: false,
      },
      {
        name: 'period',
        description: '⏰ what timeframe tho',
        type: 3, // STRING
        required: false,
        choices: [
          { name: '📅 this week', value: 'WEEK' },
          { name: '🔥 this month', value: 'MONTH' },
          { name: '💯 this year', value: 'YEAR' },
        ],
      },
    ],
  },
];

// Register commands
const data = JSON.stringify({ commands });

const options = {
  hostname: 'discord.com',
  path: `/api/v10/applications/${APPLICATION_ID}/commands`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    Authorization: `Bot ${DISCORD_TOKEN}`,
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('Response:', body);
    console.log('✅ Commands registered successfully!');
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
```

### Run Registration:

```bash
export DISCORD_TOKEN="your_bot_token"
export APPLICATION_ID="your_app_id"
node scripts/register-commands.mjs
```

---

## 🔗 Step 6: Connect Discord to Lambda

1. **Go to Discord Developer Portal:**
   - https://discord.com/developers/applications
   - Select your application

2. **Set Interactions Endpoint URL:**
   - Go to "General Information"
   - Find "Interactions Endpoint URL"
   - Paste your Lambda Function URL:
     ```
     https://abc123xyz.lambda-url.us-east-1.on.aws/
     ```
   - Click "Save Changes"

3. **Discord will verify your endpoint:**
   - Sends a PING request
   - Your Lambda must respond with PONG
   - If verification fails, check:
     - Lambda logs (CloudWatch)
     - Environment variables (PUBLIC_KEY)
     - Handler configuration

---

## ✅ Step 7: Test Your Bot!

1. **Invite bot to your server** (if not already)
2. **Wait 1-2 minutes** for commands to sync
3. **Try commands:**
   ```
   /record expense amount:150 category:FOOD_DRINK note:lunch
   /summary period:MONTH
   /compare target1:@Friend period:MONTH
   ```

---

## 📊 Monitoring & Logs

### View Lambda Logs:
1. Go to Lambda Console → your function
2. Click "Monitor" → "View CloudWatch logs"
3. Check for errors or performance issues

### Common Issues:

**"Invalid signature" error:**
- Check `DISCORD_PUBLIC_KEY` is correct
- Verify it matches Discord Developer Portal

**Database connection timeout:**
- Increase Lambda timeout to 15-30 seconds
- Check `DATABASE_URL` is correct
- Ensure database accepts connections from Lambda IP range

**Cold start too slow:**
- Increase memory (more memory = more CPU)
- Consider provisioned concurrency (costs money)

---

## 💰 Cost Estimate

### Free Tier (First 12 Months + Forever Free):
- **Lambda Requests:** 1M/month free **forever**
- **Lambda Compute:** 400,000 GB-seconds/month free **forever**
- **RDS MySQL (if used):** 750 hours/month free (12 months)

### Typical Usage for Personal Bot:
- **~100 commands/day** = 3,000 requests/month
- **Cost:** $0.00 (well within free tier)

### At Scale (1M requests/month):
- **Lambda:** Free
- **Data transfer:** ~$1-2/month
- **Database:** Depends on provider

---

## 🔄 Updating Your Bot

When you make code changes:

```bash
# 1. Build new deployment package
npm run build:deploy

# 2. Upload to Lambda
# Via AWS Console: Upload .zip file
# Or via AWS CLI:
aws lambda update-function-code \
  --function-name tiramisu-bot \
  --zip-file fileb://dist/lambda-deployment.zip
```

---

## 🔐 Security Best Practices

1. **Use AWS Secrets Manager** for sensitive data (optional):
   ```bash
   # Store DATABASE_URL in Secrets Manager
   aws secretsmanager create-secret \
     --name tiramisu-bot/database-url \
     --secret-string "mysql://user:pass@host/db"
   ```

2. **Enable CloudWatch Logs encryption**
3. **Restrict Lambda IAM role** (only necessary permissions)
4. **Use VPC** if database is in private network (optional)

---

## 🚨 Troubleshooting

### Lambda not responding:
```bash
# Check logs
aws logs tail /aws/lambda/tiramisu-bot --follow
```

### Commands not appearing in Discord:
- Wait 1-2 minutes
- Refresh Discord (Ctrl+R)
- Re-run registration script
- Check bot has proper permissions in server

### Database connection errors:
- Verify `DATABASE_URL` format
- Test connection from local machine first
- Check database firewall rules
- Increase `connection_limit` if needed

---

## 📚 Additional Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Discord HTTP Interactions](https://discord.com/developers/docs/interactions/receiving-and-responding)
- [Prisma with Lambda](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-aws-lambda)

---

**🎉 Your bot is now 100% serverless and free!! no cap fr fr** ☕🍰
