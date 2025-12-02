# 🔧 FIX: WebSocket URL Configuration

## ❌ Current Problem

Your environment variable is **WRONG**:
```
NEXT_PUBLIC_WS_URL = https://codementor-frontend-2.onrender.com
```

This is pointing to your **frontend** with **https** protocol.

---

## ✅ Correct Solution

You need **TWO separate services** on Render:

### Service 1: WebSocket Server (NEW - You need to create this!)
```
Name: codementor-websocket
Build: npm install ws
Start: node collaboration-server.js
```

### Service 2: Frontend (Your existing service)
```
Name: codementor-frontend-2
Environment Variable: NEXT_PUBLIC_WS_URL=wss://codementor-websocket.onrender.com
```

---

## 🚀 Step-by-Step Fix

### Step 1: Create WebSocket Service

1. Go to Render Dashboard: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: `CodeMentor_Frontend`
4. Configure:
   ```
   Name: codementor-websocket
   Region: Oregon (US West)
   Branch: main
   Runtime: Node
   Build Command: npm install ws
   Start Command: node collaboration-server.js
   Instance Type: Free
   ```
5. Click **"Create Web Service"**
6. Wait for deployment (2-3 minutes)

### Step 2: Get WebSocket URL

After deployment, you'll get a URL like:
```
https://codementor-websocket.onrender.com
```

**IMPORTANT:** Change `https://` to `wss://`:
```
wss://codementor-websocket.onrender.com
```

### Step 3: Update Frontend Environment Variable

1. Go to your **Frontend** service (codementor-frontend-2)
2. Click **"Environment"** (left sidebar)
3. Find `NEXT_PUBLIC_WS_URL`
4. **Change from:**
   ```
   https://codementor-frontend-2.onrender.com
   ```
5. **Change to:**
   ```
   wss://codementor-websocket.onrender.com
   ```
   (Use YOUR actual WebSocket service URL)

6. Click **"Save Changes"**
7. Frontend will auto-redeploy (2-3 minutes)

---

## 🎯 Quick Reference

### What You Have Now (WRONG):
```
Frontend: https://codementor-frontend-2.onrender.com
WebSocket: (not deployed yet)
Environment: NEXT_PUBLIC_WS_URL=https://codementor-frontend-2.onrender.com ❌
```

### What You Need (CORRECT):
```
Frontend: https://codementor-frontend-2.onrender.com
WebSocket: https://codementor-websocket.onrender.com (separate service)
Environment: NEXT_PUBLIC_WS_URL=wss://codementor-websocket.onrender.com ✅
```

---

## ✅ How to Verify It's Working

### 1. Check WebSocket Service
Visit: `https://codementor-websocket.onrender.com`

Should show:
```json
{
  "status": "running",
  "message": "Collaboration WebSocket Server",
  "port": 10000
}
```

### 2. Check Frontend
Visit: `https://codementor-frontend-2.onrender.com/collaborate`

Should show:
- ✅ Green dot (connected)
- ✅ No yellow warning banner
- ✅ Can create and join sessions

### 3. Test Real-Time
1. Create session in Browser 1
2. Join session in Browser 2
3. Type in Browser 1 → Should appear in Browser 2 ✅

---

## 🔍 Understanding the Error

The error you saw:
```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

This happens because:
1. Frontend tries to connect to `https://codementor-frontend-2.onrender.com` as WebSocket
2. But that's an HTTP server (Next.js), not WebSocket server
3. It returns HTML (`<!DOCTYPE...`) instead of WebSocket connection
4. JavaScript tries to parse HTML as JSON → Error!

**Solution:** Point to actual WebSocket server with `wss://` protocol.

---

## 📝 Summary

### You Need:
1. ✅ WebSocket Server (separate Render service)
2. ✅ Frontend (your existing service)
3. ✅ Environment variable pointing to WebSocket server with `wss://`

### Current Status:
- ✅ WebSocket server code exists in your repo
- ❌ WebSocket server not deployed as separate service
- ❌ Frontend pointing to wrong URL

### Action Required:
1. Deploy WebSocket server as new Render service
2. Update `NEXT_PUBLIC_WS_URL` to WebSocket service URL
3. Use `wss://` protocol (not `https://`)

---

## 🎉 After Fix

Once fixed, you'll see in logs:
```
✅ User419 joined room 16b22232714b
✅ User833 joined room 1
📨 Received: code-change
📨 Received: chat-message
```

And in browser:
- ✅ Green dot showing connected
- ✅ Real-time code sync working
- ✅ Chat messages appearing instantly

---

## 💡 Pro Tip

You can have both services in the same GitHub repo!
- Frontend uses: `npm start`
- WebSocket uses: `node collaboration-server.js`

Render will deploy them as separate services from the same code.
