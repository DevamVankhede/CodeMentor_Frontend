# ⚡ Deployment Quick Reference Card

## 🎯 Two Services to Deploy

```
┌─────────────────────────────────────────────────────────┐
│  Service 1: WebSocket Server (Real-time collaboration) │
│  Service 2: Frontend (Next.js app)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Service 1: WebSocket Server

### Render Settings:
```yaml
Name: codementor-websocket
Runtime: Node
Build Command: npm install ws
Start Command: node collaboration-server.js
Environment Variables: (none needed)
```

### After Deployment:
```
URL: https://codementor-websocket.onrender.com
WebSocket URL: wss://codementor-websocket.onrender.com
```

---

## 🌐 Service 2: Frontend

### Render Settings:
```yaml
Name: codementor-frontend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

### Environment Variable:
```bash
NEXT_PUBLIC_WS_URL=wss://codementor-websocket.onrender.com
```

---

## ✅ Deployment Steps (5 Minutes)

### Step 1: Deploy WebSocket (2 min)
1. Render Dashboard → New → Web Service
2. Connect GitHub repo
3. Settings above
4. Create Service
5. **Copy URL** → Change `https://` to `wss://`

### Step 2: Deploy Frontend (2 min)
1. Render Dashboard → New → Web Service
2. Connect same GitHub repo
3. Settings above
4. Add environment variable: `NEXT_PUBLIC_WS_URL`
5. Create Service

### Step 3: Test (1 min)
1. Open frontend URL
2. Go to `/collaborate`
3. Create session
4. Open in another browser
5. ✅ Should work!

---

## 🔑 The ONE Environment Variable You Need

```bash
# Add this to your FRONTEND service on Render:
NEXT_PUBLIC_WS_URL=wss://your-websocket-service.onrender.com
```

**That's it!** No other configuration needed.

---

## 🧪 Testing Checklist

```
□ WebSocket service shows "Live" status
□ Visit https://your-websocket.onrender.com shows JSON
□ Frontend loads without errors
□ Can create collaboration session
□ Can join session from different browser
□ Code changes sync in real-time
□ Chat messages appear instantly
□ Participants list shows all users
```

---

## 🚨 Common Mistakes

❌ **Using `ws://` instead of `wss://`**
✅ Always use `wss://` for production

❌ **Forgetting to add environment variable**
✅ Add `NEXT_PUBLIC_WS_URL` to frontend

❌ **Not redeploying after adding env var**
✅ Render auto-redeploys, wait 2-3 minutes

❌ **Testing in same browser tab**
✅ Use different browsers or incognito mode

---

## 💡 Pro Tips

1. **Free Tier:** Services sleep after 15 min → 30s cold start
2. **Paid Tier:** $7/month per service → Always on
3. **Logs:** Check Render Dashboard → Logs for debugging
4. **Updates:** Push to GitHub → Auto-deploys
5. **Custom Domain:** Add in Render Settings → Custom Domain

---

## 📞 Quick Troubleshooting

**Problem:** Can't connect to WebSocket
**Fix:** Check URL uses `wss://` and service is "Live"

**Problem:** Yellow warning banner
**Fix:** WebSocket server not running or wrong URL

**Problem:** Users not syncing
**Fix:** Check both users are in same session (same URL)

**Problem:** Service keeps restarting
**Fix:** Check logs, ensure `ws` package installed

---

## 🎉 Success!

When working, you'll see:
- ✅ Green dot next to "active" count
- ✅ Multiple users in participant list
- ✅ Real-time code synchronization
- ✅ Instant chat messaging

**Your collaboration system is LIVE!** 🚀
