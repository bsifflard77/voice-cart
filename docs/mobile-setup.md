# Mobile Access Setup Guide

## Overview
This guide helps you access VoiceCart from your iPhone/iPad on the same network.

---

## Network Configuration

**Your IP Address:** 192.168.40.214

**Access URLs:**
- Frontend: http://192.168.40.214:3000
- Backend API: http://192.168.40.214:5000

---

## Step 1: Configure Windows Firewall

Run these commands in **PowerShell as Administrator**:

### Allow Node.js on Port 3000 (Frontend)
```powershell
New-NetFirewallRule -DisplayName "VoiceCart Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Allow Node.js on Port 5000 (Backend)
```powershell
New-NetFirewallRule -DisplayName "VoiceCart Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

### Verify Rules Were Created
```powershell
Get-NetFirewallRule -DisplayName "VoiceCart*"
```

---

## Step 2: Start the Servers

### Terminal 1 - Backend
```bash
cd "D:\Monomoy Strategies\Projects\voice-cart\backend"
npm run dev
```

You should see:
```
╔═══════════════════════════════════════╗
║     VoiceCart API Server Running      ║
╠═══════════════════════════════════════╣
║  Port: 5000
║  Host: 0.0.0.0 (all interfaces)
║  Local: http://localhost:5000
║  Network: http://192.168.40.214:5000
║  Environment: development
║  Database: voicecart
╚═══════════════════════════════════════╝
```

### Terminal 2 - Frontend
```bash
cd "D:\Monomoy Strategies\Projects\voice-cart\frontend"
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.40.214:3000/
```

---

## Step 3: Test on Mobile Device

1. **Ensure your iPhone/iPad is on the same WiFi network** (192.168.40.x)

2. **Open Safari on your iPhone/iPad**

3. **Navigate to:** http://192.168.40.214:3000

4. **Test the app:**
   - Select a store (Walmart, Sam's Club, Market Basket)
   - Try voice input (Safari will ask for microphone permission)
   - Try manual text input
   - Add items and verify they appear grouped by department
   - Test delete and "picked up" functionality

---

## Troubleshooting

### Cannot Access from Mobile

**1. Check Firewall Rules**
```powershell
Get-NetFirewallRule -DisplayName "VoiceCart*" | Format-Table DisplayName,Enabled,Direction,Action
```

Both rules should show `Enabled: True` and `Action: Allow`

**2. Verify Network**
On your mobile device, go to WiFi settings and verify:
- Connected to same network as PC
- IP address is in range 192.168.40.x

**3. Test Backend Directly**
On your mobile browser, visit: http://192.168.40.214:5000/health

You should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
```

**4. Check Server Logs**
Look for connection attempts in your terminal windows

### Voice Input Not Working on Safari

- Safari requires HTTPS for voice input on iOS (except localhost)
- For testing without HTTPS, use the manual text input
- For production, you'll need to set up HTTPS (we can add this later)

### Firewall Rules Not Working

**Remove old rules if needed:**
```powershell
Remove-NetFirewallRule -DisplayName "VoiceCart Frontend"
Remove-NetFirewallRule -DisplayName "VoiceCart Backend"
```

Then re-create them using the commands in Step 1.

---

## Alternative: Using ngrok (if firewall doesn't work)

If Windows Firewall configuration doesn't work, you can use ngrok:

1. Install ngrok: https://ngrok.com/download
2. Run backend on 5000, frontend on 3000
3. In new terminals:
   ```bash
   ngrok http 3000
   ngrok http 5000
   ```
4. Use the ngrok URLs on your mobile device
5. Update frontend .env with the ngrok backend URL

---

## Configuration Files Changed

The following files were updated for mobile access:

1. **backend/src/server.js**
   - Changed `app.listen(PORT)` to `app.listen(PORT, '0.0.0.0')`
   - Added CORS origins for both localhost and network IP

2. **backend/.env**
   - Updated `FRONTEND_URL` to http://192.168.40.214:3000

3. **frontend/.env.development**
   - Updated `VITE_API_URL` to http://192.168.40.214:5000

4. **frontend/vite.config.ts**
   - Already configured with `host: true` (allows network access)

---

## Reverting to Localhost-Only

If you want to revert to localhost-only access:

1. **Backend .env:**
   ```
   FRONTEND_URL=http://localhost:3000
   ```

2. **Frontend .env.development:**
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Backend server.js:**
   ```javascript
   app.listen(PORT, () => { ... })  // Remove '0.0.0.0'
   ```

---

## Next Steps After Mobile Access Works

Once you confirm mobile access works:
- Test voice input on Safari (may need HTTPS)
- Add PWA features (installable app)
- Add iOS icons and splash screens
- Consider setting up HTTPS for production
