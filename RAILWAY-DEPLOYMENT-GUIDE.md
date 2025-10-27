# Railway Deployment Guide - VoiceCartz
**Get VoiceCartz Online in 30 Minutes**

---

## 🎯 What You're About to Do

Deploy VoiceCartz to Railway so you can access it from your phone anywhere in the world!

**Time Required:** 30 minutes
**Cost:** Free for first month ($5 credit), then $5-10/month
**Difficulty:** Easy (step-by-step instructions below)

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [x] ✅ VoiceCartz code pushed to GitHub
- [x] ✅ GitHub account
- [ ] Railway account (we'll create this)
- [x] ✅ OpenAI API key: `sk-proj-z-iSLj0nGlvypuRmw8JP...`
- [x] ✅ JWT Secret (generated): `7be66c7647f7cc4193d1f018c77df04713ba68198a6bb6dffed99023bfe3fc59`

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Account (2 minutes)

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** in the top-right corner
3. Click **"Login with GitHub"**
4. Authorize Railway to access your GitHub account
5. You'll get $5 in free credits automatically!

---

### Step 2: Create New Project (1 minute)

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. If asked to install Railway GitHub app:
   - Click **"Configure GitHub App"**
   - Select your repositories (or just `voicecartz`)
   - Click **"Install & Authorize"**

---

### Step 3: Deploy Backend (5 minutes)

1. In Railway dashboard, select your `voicecartz` repository
2. Railway will ask which service to deploy first
3. Select **Root directory** (this is the backend)
4. Railway will automatically:
   - Detect it's a Node.js app
   - Run `npm install`
   - Start the server
5. Wait for deployment to complete (green checkmark)

**Your backend URL will be something like:**
`https://voicecartz-production-xxxx.up.railway.app`

---

### Step 4: Add PostgreSQL Database (2 minutes)

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Click **"Add PostgreSQL"**
4. Railway automatically:
   - Creates the database
   - Generates `DATABASE_URL` variable
   - Connects it to your backend

**That's it! Railway handles all the database configuration.**

---

### Step 5: Configure Backend Environment Variables (5 minutes)

1. Click on your **backend service** (the Node.js app)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add each of these:

```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=7be66c7647f7cc4193d1f018c77df04713ba68198a6bb6dffed99023bfe3fc59
OPENAI_API_KEY=<copy-from-backend/.env-on-your-computer>
FRONTEND_URL=https://voicecartz-frontend.up.railway.app
```

**Important:** Copy your OpenAI API key from the `backend/.env` file on your computer. Never commit API keys to GitHub!

**Note:** We'll update `FRONTEND_URL` in Step 7 once we have the actual URL.

4. Railway will automatically redeploy with new variables

---

### Step 6: Setup Database Schema (3 minutes)

Your database needs tables! We need to run the setup script.

**Option A: Use Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run database setup
railway run npm run db:setup
```

**Option B: Use Railway Dashboard (Easier)**
1. In Railway, click your backend service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"**
5. You might see database errors - that's expected
6. We'll fix this by adding a startup command:
   - Go to **"Settings"** tab
   - Find **"Custom Start Command"**
   - Enter: `npm run db:setup && npm start`
7. Click **"Redeploy"**

---

### Step 7: Deploy Frontend (5 minutes)

1. Back in your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose your `voicecartz` repository again
4. This time, configure it differently:

**Settings to change:**
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npx vite preview --host --port $PORT`

5. Add environment variable:
   - Go to **"Variables"** tab
   - Add: `VITE_API_URL` = `<your-backend-url>`
   - Example: `VITE_API_URL=https://voicecartz-production-xxxx.up.railway.app`

6. Click **"Deploy"**

**Your frontend URL will be something like:**
`https://voicecartz-frontend-production-xxxx.up.railway.app`

---

### Step 8: Update CORS Configuration (2 minutes)

Now that you have your frontend URL, update the backend:

1. Go to your **backend service** in Railway
2. Go to **"Variables"** tab
3. Update `FRONTEND_URL` variable:
   - Change to your actual frontend URL
   - Example: `https://voicecartz-frontend-production-xxxx.up.railway.app`
4. Railway will automatically redeploy

---

### Step 9: Generate Domain Names (Optional, 2 minutes)

Railway gives you random URLs. Let's make them nicer:

**Backend:**
1. Click backend service → **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get something like: `voicecartz-backend.up.railway.app`
5. Copy this URL

**Frontend:**
1. Click frontend service → **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get something like: `voicecartz.up.railway.app`
5. Copy this URL

**Update backend FRONTEND_URL:**
1. Go back to backend → **"Variables"**
2. Update `FRONTEND_URL` to your new frontend domain
3. Update frontend `VITE_API_URL` to your new backend domain

---

### Step 10: Test Your Deployment! 🎉 (3 minutes)

1. **Open your frontend URL** in a browser:
   - Example: `https://voicecartz.up.railway.app`

2. **Create an account:**
   - Click "Register"
   - Enter email and password
   - Click "Register"

3. **Create a shopping list:**
   - Enter list name (e.g., "Walmart")
   - Select store type
   - Click "Create"

4. **Add an item:**
   - Click microphone or type manually
   - Add "Bananas"
   - Watch it get categorized!

5. **Test on your phone:**
   - Open the URL on your phone
   - Login with same account
   - See your shopping list!

---

## 📱 Install as PWA on Your Phone

### iOS (iPhone/iPad)
1. Open your VoiceCartz URL in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. VoiceCartz appears as an app on your home screen!

### Android
1. Open your VoiceCartz URL in Chrome
2. Tap the **three dots** menu
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Install"**
5. VoiceCartz appears as an app in your app drawer!

---

## 🎯 Your Deployed URLs

**Fill these in as you deploy:**

```
Backend URL:  https://_____________________________.up.railway.app
Frontend URL: https://_____________________________.up.railway.app
Database:     (Managed by Railway - no URL needed)
```

---

## 🔧 Troubleshooting

### Backend won't start
**Check logs:**
1. Click backend service → **"Deployments"**
2. Click latest deployment → **"View Logs"**
3. Look for errors

**Common issues:**
- Missing environment variables → Add them in Variables tab
- Database connection failed → Make sure PostgreSQL is added
- Port binding error → Set `PORT` variable to `5000`

### Frontend won't connect to backend
**Check:**
1. `VITE_API_URL` is set correctly in frontend variables
2. `FRONTEND_URL` is set correctly in backend variables
3. Both services are deployed (green checkmarks)

**Test backend directly:**
```bash
curl https://your-backend-url.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-10-26T..."
}
```

### CORS errors
**Symptoms:** "Access-Control-Allow-Origin" error in browser console

**Fix:**
1. Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
2. Include `https://` in the URL
3. Don't include trailing slash
4. Redeploy backend after changing

### Database errors
**If you see "relation does not exist" errors:**

Your database tables weren't created. Run the setup:

```bash
# Via Railway CLI
railway run npm run db:setup

# Or update start command to:
npm run db:setup && npm start
```

---

## 💰 Cost Breakdown

**Free Trial:**
- $5 in credits (automatic)
- Lasts about 1 month for personal use

**After Trial:**
- Backend: ~$3-5/month
- Frontend: ~$2-3/month
- Database: ~$2-3/month
- **Total: $7-11/month**

**Usage includes:**
- Unlimited requests
- Always online (no sleeping)
- 1GB RAM per service
- Automatic SSL certificates
- Custom domains

---

## 🎉 Success Checklist

After deployment, you should have:

- [ ] Backend deployed and accessible
- [ ] PostgreSQL database connected
- [ ] Frontend deployed and accessible
- [ ] Can register a new account
- [ ] Can create a shopping list
- [ ] Can add items
- [ ] Can access from phone
- [ ] PWA installed on phone
- [ ] Works offline (after first load)

---

## 📞 Need Help?

**Railway Documentation:**
- [Getting Started](https://docs.railway.app/getting-started)
- [Environment Variables](https://docs.railway.app/develop/variables)
- [Deployment Guide](https://docs.railway.app/deploy/deployments)

**VoiceCartz Documentation:**
- [Technical Docs](docs/TECHNICAL-DOCS.md)
- [User Guide](docs/USER-GUIDE.md)
- [Hosting Options](docs/HOSTING-OPTIONS.md)

**Common Commands:**
```bash
# View Railway status
railway status

# View backend logs
railway logs --service backend

# View frontend logs
railway logs --service frontend

# Run database setup
railway run npm run db:setup
```

---

## 🚀 Next Steps After Deployment

1. **Share with friends!**
   - Send them your VoiceCartz URL
   - They can create their own accounts

2. **Customize your domain** (optional)
   - Buy a custom domain (e.g., `myvoicecartz.com`)
   - Add it in Railway Settings → Domains

3. **Monitor usage**
   - Check Railway dashboard for metrics
   - Watch your credit usage

4. **Backup your data**
   - Railway handles backups automatically
   - Can export database if needed

---

## 🎊 Congratulations!

You've successfully deployed VoiceCartz to the internet!

**What you've accomplished:**
✅ Deployed a full-stack application
✅ Set up PostgreSQL database in the cloud
✅ Configured authentication and security
✅ Made it accessible from anywhere
✅ Created an installable PWA
✅ Set up offline support

**VoiceCartz is now live and ready to use! 🛒🎤**

---

**Deployed:** October 26, 2025
**Platform:** Railway
**Status:** 🟢 Ready to use!
