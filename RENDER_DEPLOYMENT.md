# 🚀 Render Deployment Guide - WebSocket Collaboration

## Step 1: Deploy WebSocket Server on Render

### 1.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

### 1.2 Configure WebSocket Service
```
Name: codementor-websocket
Environment: Node
Region: Choose closest to your users
Branch: main
Root Directory: (leave empty)
Build Command: npm install ws
Start Command: node collaboration-server.js
```

### 1.3 Environment Variables (WebSocket Service)
**No environment variables needed!** The server uses `process.env.PORT` automatically.

### 1.4 Important Settings
- **Instance Type:** Free (or Starter for better performance)
- **Auto-Deploy:** Yes
- Click **"Create Web Service"**

### 1.5 Get Your WebSocket URL
After deployment, Render will give you a URL like:
```
https://codementor-websocket.onrender.com
```

**Important:** Change `https://` to `wss://` for WebSocket:
```
wss://codementor-websocket.onrender.com
```

---

## Step 2: Deploy Frontend on Render

### 2.1 Create New Static Site (or Web Service)
1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"** (for Next.js static) or **"Web Service"** (for Next.js with SSR)
3. Connect your GitHub repository

### 2.2 Configure Frontend Service
```
Name: codementor-frontend
Environment: Node
Branch: main
Build Command: npm install && npm run build
Start Command: npm start (if Web Service) or leave empty (if Static Site)
Publish Directory: .next (if Static Site)
```

### 2.3 Environment Variables (Frontend Service)
Add this in Render Dashboard → Environment:

**Key:** `NEXT_PUBLIC_WS_URL`  
**Value:** `wss://codementor-websocket.onrender.com`

(Replace with your actual WebSocket service URL from Step 1.5)

### 2.4 Click "Create Static Site" or "Create Web Service"

---

## Step 3: Test Your Deployment

### 3.1 Check WebSocket Server
Visit: `https://codementor-websocket.onrender.com`

You should see:
```json
{
  "status": "running",
  "message": "Collaboration WebSocket Server",
  "port": 10000,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3.2 Test Collaboration
1. Open your frontend: `https://codementor-frontend.onrender.com`
2. Go to `/collaborate`
3. Create a session
4. Open in another browser/device
5. Join the session
6. **Start coding together!** ✅

---

## 📋 Quick Reference

### Frontend Environment Variable
```
NEXT_PUBLIC_WS_URL=wss://your-websocket-service.onrender.com
```

### WebSocket Server
- **Port:** Automatically assigned by Render (usually 10000)
- **Protocol:** Use `wss://` (secure WebSocket)
- **No additional config needed!**

---

## 🔧 Troubleshooting

### Issue: "Connecting to collaboration server..."
**Solution:** Check if WebSocket service is running:
- Visit `https://your-websocket-service.onrender.com`
- Should show JSON response with "status": "running"

### Issue: WebSocket connection fails
**Solution:** Make sure you're using `wss://` not `ws://` in production

### Issue: Render free tier sleeps after 15 minutes
**Solution:** 
- Upgrade to paid tier ($7/month) for always-on service
- Or accept 30-second cold start when inactive

---

## ✅ Deployment Checklist

- [ ] WebSocket server deployed on Render
- [ ] Got WebSocket URL (wss://...)
- [ ] Added `NEXT_PUBLIC_WS_URL` to frontend environment variables
- [ ] Frontend deployed on Render
- [ ] Tested collaboration in different browsers
- [ ] Verified real-time code sync works
- [ ] Verified chat messaging works

---

## 🎉 You're Live!

Your collaboration system is now deployed and working across:
- ✅ Different browsers
- ✅ Different devices
- ✅ Different locations
- ✅ Real-time code editing
- ✅ Real-time chat

**Share your app with the world!** 🌍
