# 🚀 COMPLETE PRODUCTION DEPLOYMENT GUIDE

## 📋 Overview

You need to deploy **TWO** separate services:
1. **Frontend (Next.js)** - Your main website
2. **WebSocket Server** - For real-time collaboration

---

## 🎯 DEPLOYMENT OPTION 1: Render.com (RECOMMENDED - FREE)

### Step 1: Deploy WebSocket Server on Render

1. **Go to [render.com](https://render.com)** and sign up/login

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure the service:**
   ```
   Name: codementor-collab-server
   Region: Choose closest to your users
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install ws
   Start Command: node collaboration-server.js
   ```

5. **Set Environment Variables:**
   ```
   PORT = (leave empty - Render auto-assigns)
   ```

6. **Choose Plan:** Free

7. **Click "Create Web Service"**

8. **Wait for deployment** (2-3 minutes)

9. **Copy your WebSocket URL:**
   ```
   Example: https://codementor-collab-server.onrender.com
   ```
   
   **IMPORTANT:** Change `https://` to `wss://` for WebSocket:
   ```
   wss://codementor-collab-server.onrender.com
   ```

### Step 2: Deploy Frontend on Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository**

4. **Configure:**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **Add Environment Variable:**
   ```
   Name: NEXT_PUBLIC_WS_URL
   Value: wss://codementor-collab-server.onrender.com
   ```
   (Use YOUR WebSocket URL from Step 1)

6. **Click "Deploy"**

7. **Done!** Your site will be live at `https://your-project.vercel.app`

---

## 🎯 DEPLOYMENT OPTION 2: Railway.app (EASY)

### Step 1: Deploy WebSocket Server

1. **Go to [railway.app](https://railway.app)** and sign up

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your repository**

4. **Add these settings:**
   ```
   Start Command: node collaboration-server.js
   ```

5. **Add Environment Variables:**
   ```
   PORT = (Railway auto-assigns)
   ```

6. **Generate Domain:**
   - Go to Settings → Generate Domain
   - Copy the URL (e.g., `codementor-collab.up.railway.app`)
   - Your WebSocket URL: `wss://codementor-collab.up.railway.app`

### Step 2: Deploy Frontend

1. **Create another Railway project** for frontend

2. **Or use Vercel** (follow Option 1, Step 2)

3. **Set Environment Variable:**
   ```
   NEXT_PUBLIC_WS_URL=wss://codementor-collab.up.railway.app
   ```

---

## 🎯 DEPLOYMENT OPTION 3: Same Server (VPS/Cloud)

If you have your own server (AWS, DigitalOcean, etc.):

### Step 1: Setup WebSocket Server

```bash
# SSH into your server
ssh user@your-server.com

# Create directory
mkdir -p /var/www/collab-server
cd /var/www/collab-server

# Upload collaboration-server.js
# (use scp, git, or FTP)

# Install dependencies
npm install ws

# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start collaboration-server.js --name collab-server

# Save PM2 config
pm2 save
pm2 startup
```

### Step 2: Configure Nginx (if using)

```nginx
# /etc/nginx/sites-available/collab-server

upstream websocket {
    server localhost:8080;
}

server {
    listen 80;
    server_name collab.yourdomain.com;

    location / {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Step 3: Setup SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d collab.yourdomain.com

# Your WebSocket URL will be:
# wss://collab.yourdomain.com
```

---

## 📝 ENVIRONMENT VARIABLES SUMMARY

### Frontend (.env.production)
```bash
# WebSocket Server URL (REQUIRED)
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com

# API URL (if you have backend)
NEXT_PUBLIC_API_URL=https://your-api.com

# Other variables
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

### WebSocket Server
```bash
# Port (auto-assigned by hosting platform)
PORT=8080

# No other variables needed!
```

---

## ✅ VST

After deployment, verify:


```bash

https://your-websocket-server.com

# Should show:
{
  "status": "running
  "message": "Collaboration WebSocket Server",
  "port": 8080,
  "timest
}


### 2. Frontket
- Open browser console (F12)
- Go to your collaboration page
- Look f server`
- Should see green dot next to participant count

### 3. Test Real-Timeures
- Open site in 2 different browsers
ssion
- Type in one → Shher
- Send chat both

---

TING

### Iss

**Solution 1:** Check WRL
```javascript
// Make sure it starts with wss:// (not 
NEXT_PUBLIC_WS_URL=w
```

**S
de)

wall
- Make surserver

### Issue: "Mixed Content"rror

**Solution:** Use `wss://` (se://`
```bas

ws://your-server.com

# Correct:
wss://your-server.com
```



**Solution
- Upgrade to paid plan ($7/month)
- Or use Railway (doesn't sleep)
- Or iing

---

## 💰 COST BRN


- *
s/month)
- **Total:** $0/month

### Production Option (Recommend

- **Webmonth)
- **Total:** $27/month

### Enterprise Option
- **Frontend:** Vercel Enterprise ustom)
- **WebSocket:** AWS/th)
- **Total:** Custom pricing

---

## 🎯 RECOMMENDED FOR YOU

Based on your needs, I recond:

### For Development/Testg:
``
Frontend: Vercel (Free)
WebSocket: Render (Free)
Total: $0/month
```

###:

Frontend: Vercel (Free or Pro)

Total: $5-7/month
```

---

##  COMMANDS

### Deploy WebSocket Serder:
b
2. Connect t
3. Set start command: `node
4. Copy WebSocket URL

### Deploy Frontend to Vercel:
```bash
ercel CLI
npm i -g ve

# Deploy
vercel

# Add environment variable
vercel env add NEXT_PUBLIC_WS_URL

# Rloy
rod
```

---

## 🎉 YOU'RE READY TO DE

Follow the steps above and your collaboration ss:
owsers
- ✅ Different devices  
- ✅ Different locations
nc
- ✅up

**Choose your deployment o!** 🚀
