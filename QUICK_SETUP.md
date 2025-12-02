# ⚡ QUICK SETUP - 2 Minutes

## For Render Deployment:

### 1️⃣ Deploy WebSocket Server
```
Service Type: Web Service
Build Command: npm install ws
Start Command: node collaboration-server.js
```

### 2️⃣ Get WebSocket URL
After deployment, copy your URL and change `https://` to `wss://`:
```
Example: wss://codementor-websocket.onrender.com
```

### 3️⃣ Add Environment Variable to Frontend
In Render Dashboard → Your Frontend Service → Environment:
```
Key: NEXT_PUBLIC_WS_URL
Value: wss://your-websocket-service.onrender.com
```

### 4️⃣ Deploy Frontend
Render will auto-deploy. Done! ✅

---

## For Local Development:

### 1️⃣ Install Dependencies
```bash
npm install ws
```

### 2️⃣ Start WebSocket Server
```bash
node collaboration-server.js
```

### 3️⃣ Start Frontend (in new terminal)
```bash
npm run dev
```

### 4️⃣ Test
Open `http://localhost:3000/collaborate` ✅

---

## That's It! 🎉

**Environment Variable Summary:**
- **Local:** `NEXT_PUBLIC_WS_URL=ws://localhost:8080`
- **Production:** `NEXT_PUBLIC_WS_URL=wss://your-service.onrender.com`
