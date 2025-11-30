# Quick Deployment Guide

Choose your deployment method and follow the steps.

## 🚀 Method 1: Vercel (Easiest - 5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps
1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variables:
     - \`NEXT_PUBLIC_GEMINI_API_KEY\`
     - \`NEXT_PUBLIC_API_URL\`
     - \`NEXT_PUBLIC_APP_URL\`
     - \`JWT_SECRET\`
   - Click "Deploy"

3. **Done!** Your app is live at \`https://your-app.vercel.app\`

---

## 🐳 Method 2: Docker (10 minutes)

### Prerequisites
- Docker installed

### Steps
1. **Build**
   \`\`\`bash
   docker build -t codementor-ai .
   \`\`\`

2. **Run**
   \`\`\`bash
   docker run -p 3000:3000 \\
     -e NEXT_PUBLIC_GEMINI_API_KEY=your_key \\
     -e NEXT_PUBLIC_API_URL=https://your-backend.com \\
     codementor-ai
   \`\`\`

3. **Access** at \`http://localhost:3000\`

---

## ☁️ Method 3: Azure (15 minutes)

### Prerequisites
- Azure account
- Azure CLI installed

### Steps
1. **Login**
   \`\`\`bash
   az login
   \`\`\`

2. **Create Resources**
   \`\`\`bash
   az group create --name codementor-rg --location eastus
   az appservice plan create --name codementor-plan --resource-group codementor-rg --sku B1
   az webapp create --name codementor-app --resource-group codementor-rg --plan codementor-plan --runtime "NODE:18-lts"
   \`\`\`

3. **Deploy**
   \`\`\`bash
   npm run build
   az webapp deployment source config-zip --resource-group codementor-rg --name codementor-app --src ./build.zip
   \`\`\`

---

## 🎯 Method 4: Railway (5 minutes)

### Prerequisites
- Railway account (free)

### Steps
1. **Install CLI**
   \`\`\`bash
   npm i -g @railway/cli
   \`\`\`

2. **Deploy**
   \`\`\`bash
   railway login
   railway init
   railway up
   \`\`\`

3. **Add Environment Variables** in Railway dashboard

---

## 🔧 Backend Deployment

### Option A: Azure App Service
\`\`\`bash
az webapp create --name codementor-api --resource-group codementor-rg --plan codementor-plan --runtime "DOTNET:8.0"
dotnet publish -c Release -o ./publish
az webapp deployment source config-zip --resource-group codementor-rg --name codementor-api --src ./publish.zip
\`\`\`

### Option B: Railway
\`\`\`bash
cd backend
railway init
railway up
\`\`\`

### Option C: Docker
\`\`\`bash
docker build -t codementor-backend ./backend
docker run -p 5000:80 codementor-backend
\`\`\`

---

## 📋 Environment Variables Needed

### Frontend
\`\`\`
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_URL=https://your-frontend-url.com
JWT_SECRET=your_jwt_secret_32_chars_min
\`\`\`

### Backend
\`\`\`
ConnectionStrings__DefaultConnection=your_database_connection
JwtSettings__Secret=your_jwt_secret
JwtSettings__Issuer=https://your-api-url.com
ASPNETCORE_ENVIRONMENT=Production
\`\`\`

---

## ✅ Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] Backend API responds
- [ ] Can sign in/sign up
- [ ] AI features work
- [ ] Roadmap generation works
- [ ] Games load
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)

---

## 🆘 Troubleshooting

### Build Fails
- Check Node version (need 18+)
- Run \`npm install\` again
- Check for TypeScript errors

### API Not Working
- Verify \`NEXT_PUBLIC_API_URL\` is correct
- Check backend is running
- Verify CORS is configured

### Gemini AI Not Working
- Check \`NEXT_PUBLIC_GEMINI_API_KEY\` is set
- Verify API key is valid
- Check API quota

---

## 📞 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions
2. Review [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. Check logs in your deployment platform
4. Open an issue on GitHub

---

**Recommended**: Vercel (Frontend) + Azure (Backend) for best performance and ease of use.
