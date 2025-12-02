# 🚀 WebSocket Deployment on Render - Complete Guide

## 📋 What You Need
- GitHub account (you already have this)
- Render account (free) - Sign up at https://render.com

---

## Step 1: Deploy WebSocket Server on Render

### 1.1 Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

### 1.2 Connect Your Repository
1. Click **"Connect a repository"**
2. Select your GitHub account
3. Find and select: **CodeMentor_Frontend**
4. Click **"Connect"**

### 1.3 Configure WebSocket Service

Fill in these settings:

**Name:**
```
codementor-websocket
```

**Region:**
```
Oregon (US West) or Frankfurt (EU Central) - Choose closest to your users
```

**Branch:**
```
main
```

**Root Directory:**
```
(leave empty)
```

**Runtime:**
```
Node
```

**Build Command:**
```
npm install ws
```

**Start Command:**
```
node collaboration-server.js
```

**Instance Type:**
```
Free (or Starter $7/month for better performance)
```

### 1.4 Click "Create Web Service"

Render will now:
- ✅ Clone your repository
- ✅ Install dependencies
- ✅ Start the WebSocket server
- ✅ Give you a URL

---

## Step 2: Get Your WebSocket URL

### 2.1 After Deployment Completes
You'll see a URL like:
```
https://codementor-websocket.onrender.com
```

### 2.2 Convert to WebSocket URL
**IMPORTANT:** Change `https://` to `wss://`

Your WebSocket URL is:
```
wss://codementor-websocket.onrender.com
```

### 2.3 Test the Server
Visit in browser: `https://codementor-websocket.onrender.com`

You should see:
```json
{
  "status": "running",
  "message": "Collaboration WebSocket Server",
  "port": 10000,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

✅ If you see this, your WebSocket server is running!

---

## Step 3: Configure Frontend to Use WebSocket

### 3.1 Go to Your Frontend Service on Render
1. In Render Dashboard, find your **Frontend** service
2. Click on it
3. Go to **"Environment"** tab (left sidebar)

### 3.2 Add Environment Variable
Click **"Add Environment Variable"**

**Key:**
```
NEXT_PUBLIC_WS_URL
```

**Value:**
```
wss://codementor-websocket.onrender.com
```
(Use YOUR actual WebSocket URL from Step 2.2)

### 3.3 Save and Redeploy
1. Click **"Save Changes"**
2. Render will automatically redeploy your frontend
3. Wait for deployment to complete (2-3 minutes)

---

## Step 4: Test Real-Time Collaboration

### 4.1 Open Your Frontend
Visit: `https://your-frontend.onrender.com/collaborate`

### 4.2 Create a Session
1. Click **"Create New Session"**
2. Fill in details
3. Click **"Create Session"**

### 4.3 Test in Another Browser/Device
1. Copy the session link
2. Open in **different browser** (Chrome, Firefox, Edge)
3. Or open on your **phone**
4. Join the session

### 4.4 Verify Real-Time Features
- ✅ Type in one browser → See in other browser
- ✅ Send chat message → Appears in all browsers
- ✅ See all users in participant list
- ✅ Green dot showing "connected"

---

## 🎯 Quick Checklist

- [ ] WebSocket server deployed on Render
- [ ] Got WebSocket URL (wss://...)
- [ ] Added `NEXT_PUBLIC_WS_URL` to frontend environment
- [ ] Frontend redeployed
- [ ] Tested in multiple browsers
- [ ] Real-time code sync works
- [ ] Chat messaging works
- [ ] Participants visible

---

## 🔧 Troubleshooting

### Issue: "Connecting to collaboration server..."
**Check:**
1. Is WebSocket service running? Visit `https://your-websocket.onrender.com`
2. Did you use `wss://` (not `ws://`)?
3. Did you add environment variable to frontend?
4. Did frontend redeploy after adding env var?

### Issue: WebSocket service keeps restarting
**Solution:**
- Check logs in Render Dashboard
- Make sure `ws` package is installed
- Verify `collaboration-server.js` exists in repo

### Issue: Free tier sleeps after 15 minutes
**This is normal for Render free tier:**
- First request after sleep takes 30 seconds to wake up
- Upgrade to Starter ($7/month) for always-on service
- Or accept the cold start delay

---

## 💰 Cost Breakdown

### Free Tier (Both Services Free)
- **WebSocket Server:** Free
- **Frontend:** Free
- **Limitation:** Services sleep after 15 min inactivity
- **Cold Start:** 30 seconds to wake up

### Paid Tier (Recommended for Production)
- **WebSocket Server:** $7/month (Starter)
- **Frontend:** $7/month (Starter) or Free
- **Benefits:** Always on, no cold starts, better performance

---

## 📝 Environment Variables Summary

### Frontend (.env or Render Environment)
```bash
# Production WebSocket URL
NEXT_PUBLIC_WS_URL=wss://codementor-websocket.onrender.com

# Your backend API (if you have one)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### WebSocket Server
**No environment variables needed!**
- Render automatically provides `PORT` variable
- Server uses `process.env.PORT || 8080`

---

## 🚀 Advanced: Custom Domain

### If you want custom domain (e.g., ws.codementor.com):

1. **In Render Dashboard:**
   - Go to WebSocket service
   - Click "Settings"
   - Scroll to "Custom Domain"
   - Add your domain

2. **Update DNS:**
   - Add CNAME record: `ws.yourdomain.com` → `your-service.onrender.com`

3. **Update Frontend:**
   - Change `NEXT_PUBLIC_WS_URL` to `wss://ws.yourdomain.com`

---

## ✅ Success Indicators

You know it's working when:
1. ✅ WebSocket service shows "Live" in Render
2. ✅ Visiting URL shows JSON status
3. ✅ Frontend shows green dot (connected)
4. ✅ Multiple users can join same session
5. ✅ Code changes sync in real-time
6. ✅ Chat messages appear instantly

---

## 🎉 You're Done!

Your real-time collaboration is now live and working across:
- ✅ Different browsers
- ✅ Different devices
- ✅ Different locations worldwide
- ✅ Professional WebSocket infrastructure

**Share your app with the world!** 🌍

---

## 📞 Need Help?

Common issues and solutions:
1. **Can't connect:** Check WebSocket URL uses `wss://`
2. **Service sleeping:** Upgrade to paid tier or accept cold starts
3. **Logs not showing:** Check Render Dashboard → Logs tab
4. **Still stuck:** Check `START_HERE.md` for local testing

---

## 🔄 Updating Your Code

When you push changes to GitHub:
1. Render automatically detects changes
2. Rebuilds and redeploys both services
3. Usually takes 2-3 minutes
4. No manual steps needed!

**Just push to GitHub and Render handles the rest!** 🚀
