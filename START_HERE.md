# 🚀 START COLLABORATION - QUICK FIX

## ❌ Error: WebSocket Connection Failed

This error means the WebSocket server is not running.

---

## ✅ SOLUTION - 3 Steps:

### Step 1: Install WebSocket Package
```bash
npm install ws
```

### Step 2: Start WebSocket Server (NEW TERMINAL)
```bash
node collaboration-server.js
```

**Keep this terminal open!** You should see:
```
🚀 Collaboration Server starting on port 8080...
✅ Collaboration Server running on http://localhost:8080
📡 WebSocket server ready for connections
```

### Step 3: Start Frontend (DIFFERENT TERMINAL)
```bash
npm run dev
```

---

## 🎯 Quick Start (Windows)

Double-click: `start-collaboration.bat`

This will automatically:
1. Install dependencies
2. Start WebSocket server
3. Start frontend

---

## ✅ How to Know It's Working

1. **WebSocket Server Terminal** shows:
   ```
   ✅ Collaboration Server running on http://localhost:8080
   ```

2. **Frontend** shows:
   - Green dot next to "active" count
   - No yellow warning banner

3. **Test**:
   - Open `http://localhost:3000/collaborate`
   - Create session
   - Open in another browser
   - Type in one → See in other ✅

---

## 🔧 Still Not Working?

### Check 1: Is port 8080 free?
```bash
netstat -ano | findstr :8080
```

If port is busy, change it:
- In `collaboration-server.js`: Change `PORT = 8080` to `PORT = 8081`
- In `.env.local`: Add `NEXT_PUBLIC_WS_URL=ws://localhost:8081`

### Check 2: Is ws package installed?
```bash
npm list ws
```

If not found:
```bash
npm install ws
```

### Check 3: Are both servers running?
You need **TWO terminals**:
- Terminal 1: WebSocket server (`node collaboration-server.js`)
- Terminal 2: Frontend (`npm run dev`)

---

## 📝 Environment Variables

Create `.env.local` file:
```
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

For production (Render):
```
NEXT_PUBLIC_WS_URL=wss://your-websocket-service.onrender.com
```

---

## ✅ Success Checklist

- [ ] Installed `ws` package
- [ ] WebSocket server running (Terminal 1)
- [ ] Frontend running (Terminal 2)
- [ ] No yellow warning in browser
- [ ] Green dot showing "connected"
- [ ] Can create and join sessions

---

## 🎉 You're Ready!

Once both servers are running, collaboration will work perfectly across:
- ✅ Multiple browser tabs
- ✅ Different browsers
- ✅ Different devices (when deployed)
