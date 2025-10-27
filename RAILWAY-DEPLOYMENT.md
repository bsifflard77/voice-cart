# VoiceCartz Railway Deployment Guide

## Quick Start Guide

### Prerequisites
- GitHub account
- OpenAI API key (you already have this)
- Railway account (create at https://railway.app)

### Step-by-Step Deployment

## 1. Create Railway Account
1. Go to https://railway.app
2. Click "Start a New Project" or "Login"
3. Sign in with GitHub (recommended)

## 2. Deploy PostgreSQL Database

1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Wait for database to be created
4. Railway will automatically provide these environment variables:
   - `DATABASE_URL`
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

## 3. Deploy Backend

### Option A: Deploy from GitHub (Recommended)

1. Click "New" → "GitHub Repo"
2. Select your `voice-cart` repository
3. Railway will detect it's a Node.js app
4. Set root directory to `/backend`
5. Click "Add Variables" and add:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<generate-a-strong-random-secret-here>
   OPENAI_API_KEY=<your-openai-api-key-from-env-file>
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```
6. Connect the PostgreSQL database (it will automatically add DATABASE_URL)
7. Deploy!

### Option B: Deploy using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
cd backend
railway link

# Deploy
railway up
```

## 4. Run Database Migration

After backend is deployed, you need to initialize the database:

1. In Railway dashboard, click on your PostgreSQL service
2. Click "Connect" → "Copy Connection String"
3. On your local machine, run:
   ```bash
   psql <paste-connection-string-here> -f backend/database-schema-v2.sql
   ```

   OR use Railway's built-in terminal:
   - Click on PostgreSQL service
   - Click "Connect"
   - Click "Open psql"
   - Copy and paste the contents of database-schema-v2.sql

## 5. Deploy Frontend

1. Click "New" → "GitHub Repo"
2. Select your `voice-cart` repository again
3. Set root directory to `/frontend`
4. Click "Add Variables" and add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. Railway will automatically:
   - Run `npm install`
   - Run `npm run build`
   - Serve the built files

6. Get your frontend URL from Railway (it will be something like `https://voice-cart-frontend.up.railway.app`)
7. Go back to backend service and update `FRONTEND_URL` to match

## 6. Generate URLs and Update Environment Variables

After both services are deployed:

1. Copy your backend URL (e.g., `https://voice-cart-backend.up.railway.app`)
2. Copy your frontend URL (e.g., `https://voice-cart-frontend.up.railway.app`)
3. Update environment variables:
   - **Backend**: Set `FRONTEND_URL` to your frontend URL
   - **Frontend**: Set `VITE_API_URL` to your backend URL

## 7. Test Your Deployment

1. Open your frontend URL in a browser
2. Register a new account
3. Create a shopping list
4. Add items using voice input
5. Test on your phone!

## 8. Install PWA on Phone

### iOS (iPhone/iPad)
1. Open your frontend URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android
1. Open your frontend URL in Chrome
2. Tap the three dots menu
3. Tap "Add to Home screen"
4. Tap "Add"

## Environment Variables Reference

### Backend Service
```
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-strong-secret>
OPENAI_API_KEY=<your-openai-api-key>
FRONTEND_URL=<your-frontend-railway-url>
DATABASE_URL=<auto-provided-by-railway>
```

### Frontend Service
```
VITE_API_URL=<your-backend-railway-url>
```

## Troubleshooting

### Backend won't start
- Check logs in Railway dashboard
- Verify DATABASE_URL is connected
- Verify OpenAI API key is valid

### Frontend shows "Network Error"
- Verify VITE_API_URL is correct
- Verify backend CORS is configured correctly
- Check backend logs for errors

### Database connection errors
- Verify PostgreSQL service is running
- Check DATABASE_URL environment variable
- Verify database schema was migrated

### 502 Bad Gateway
- Backend service might be starting up (wait 30 seconds)
- Check backend logs for errors
- Verify PORT environment variable is set to 5000

## Cost Estimation

Railway provides:
- $5 free credit per month
- After that: ~$5-20/month for light usage
- Includes: Backend + Frontend + PostgreSQL

For VoiceCartz with light usage (personal use):
- Expected cost: $0-10/month

## Custom Domain (Optional)

1. Go to your frontend service settings
2. Click "Settings" → "Domains"
3. Click "Custom Domain"
4. Follow instructions to:
   - Add your domain
   - Update DNS records (CNAME)
   - SSL will be automatically configured

## Monitoring

Railway provides:
- Real-time logs
- Resource usage metrics
- Deployment history
- Health checks

Access via: Railway Dashboard → Your Service → Logs/Metrics

## Useful Commands

```bash
# View logs
railway logs

# Run database migrations
railway run npm run db:setup

# Open service in browser
railway open

# Environment variables
railway variables
```

## Next Steps

1. Set up custom domain (optional)
2. Configure monitoring/alerts
3. Set up automated backups
4. Add analytics (optional)
5. Invite users to test!

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- VoiceCartz Issues: [Create issue in your repo]
