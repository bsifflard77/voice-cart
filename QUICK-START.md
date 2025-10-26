# VoiceCart Quick Start Guide

## 🎨 Branding
- **Name:** VoiceCart - Voice Shopping List
- **Icon:** Blue shopping cart with microphone
- **Color:** Sky Blue (#0ea5e9)
- **Tagline:** Your voice-first shopping list app

## 🔑 Deployment Credentials

### JWT Secret (Production)
```
7be66c7647f7cc4193d1f018c77df04713ba68198a6bb6dffed99023bfe3fc59
```

### OpenAI API Key
```
<get-from-backend/.env-file>
```
**Note:** Get this from your local `backend/.env` file. Never commit API keys to GitHub!

## 📦 Environment Variables for Railway

### Backend Variables
```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=7be66c7647f7cc4193d1f018c77df04713ba68198a6bb6dffed99023bfe3fc59
OPENAI_API_KEY=<get-from-backend/.env>
FRONTEND_URL=<your-frontend-url>
```
**Note:** Copy your OpenAI API key from `backend/.env` file on your computer.

### Frontend Variables
```bash
VITE_API_URL=<your-backend-url>
```

## 🚀 Railway Deployment Steps

1. **Sign up:** [railway.app](https://railway.app)
2. **Deploy backend:** Select `voice-cart` repo (root)
3. **Add database:** Click "+ New" → PostgreSQL
4. **Set backend vars:** Copy variables above
5. **Deploy frontend:** Same repo, root dir = `frontend`
6. **Set frontend vars:** Add `VITE_API_URL`
7. **Update CORS:** Update backend `FRONTEND_URL`
8. **Test:** Open frontend URL

## 📱 Install on Phone

### iOS
1. Open in Safari
2. Tap Share → "Add to Home Screen"

### Android
1. Open in Chrome
2. Menu → "Add to Home screen"

## 📚 Documentation

- [RAILWAY-DEPLOYMENT-GUIDE.md](RAILWAY-DEPLOYMENT-GUIDE.md) - Full deployment guide
- [DEPLOYMENT-STRATEGY.md](DEPLOYMENT-STRATEGY.md) - All hosting options
- [docs/USER-GUIDE.md](docs/USER-GUIDE.md) - How to use VoiceCart
- [docs/TECHNICAL-DOCS.md](docs/TECHNICAL-DOCS.md) - Technical details
- [docs/HOSTING-OPTIONS.md](docs/HOSTING-OPTIONS.md) - 9 hosting platforms

## 🎯 Your Deployment URLs

```
Backend:  https://________________________________.up.railway.app
Frontend: https://________________________________.up.railway.app
GitHub:   https://github.com/bsifflard77/voice-cart
```

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] Backend deployed
- [ ] PostgreSQL added
- [ ] Backend environment variables set
- [ ] Database schema initialized (`npm run db:setup`)
- [ ] Frontend deployed
- [ ] Frontend environment variable set
- [ ] CORS updated in backend
- [ ] Test: Can register account
- [ ] Test: Can create shopping list
- [ ] Test: Can add items
- [ ] Test: Accessible from phone
- [ ] Install PWA on phone

## 🆘 Quick Troubleshooting

**Backend won't start:**
```bash
# Check logs in Railway dashboard
# Ensure all env variables are set
# Verify DATABASE_URL is automatically set
```

**Frontend can't connect:**
```bash
# Verify VITE_API_URL is correct
# Test backend: curl https://backend-url/health
# Should return: {"status":"healthy","database":"connected"}
```

**CORS errors:**
```bash
# Update FRONTEND_URL in backend variables
# Must match exactly: https://your-frontend.up.railway.app
# No trailing slash
# Redeploy backend
```

## 💰 Cost

- **First month:** Free ($5 credit)
- **After:** $7-11/month
- **Includes:** Unlimited requests, always online, SSL

## 🎉 Ready to Deploy!

Everything is prepared and ready to go. Follow [RAILWAY-DEPLOYMENT-GUIDE.md](RAILWAY-DEPLOYMENT-GUIDE.md) for step-by-step instructions.

**Time needed:** 30 minutes
**Difficulty:** Easy
**Result:** VoiceCart accessible from anywhere! 🌍
