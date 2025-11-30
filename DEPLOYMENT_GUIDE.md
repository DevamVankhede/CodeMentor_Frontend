# CodeMentor AI - Deployment Guide

## Overview
This guide covers deploying both the Next.js frontend and .NET backend to production.

---

## 🚀 Frontend Deployment (Next.js)

### Option 1: Vercel (Recommended for Next.js)

#### Prerequisites
- GitHub account
- Vercel account (free tier available)

#### Steps

1. **Push to GitHub**
   ```bash
   cd codementor-ai
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/codementor-ai.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: `./` (or `codementor-ai` if in subdirectory)
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Environment Variables**
   Add these in Vercel dashboard (Settings → Environment Variables):
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   JWT_SECRET=your_secure_jwt_secret
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

#### Custom Domain (Optional)
- Go to Settings → Domains
- Add your custom domain
- Update DNS records as instructed

---

### Option 2: Netlify

#### Steps

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect GitHub repository

3. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables in Site Settings

---

### Option 3: Docker + Any Cloud Provider

#### Create Dockerfile
```dockerfile
# codementor-ai/Dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Update next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... other config
}

module.exports = nextConfig
```

#### Build and Run
```bash
docker build -t codementor-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GEMINI_API_KEY=your_key \
  -e NEXT_PUBLIC_API_URL=https://your-backend.com \
  codementor-frontend
```

---

## 🔧 Backend Deployment (.NET)

### Option 1: Azure App Service (Recommended for .NET)

#### Prerequisites
- Azure account
- Azure CLI installed

#### Steps

1. **Prepare the app**
   ```bash
   cd your-backend-directory
   dotnet publish -c Release -o ./publish
   ```

2. **Create Azure Resources**
   ```bash
   # Login to Azure
   az login

   # Create resource group
   az group create --name codementor-rg --location eastus

   # Create App Service plan
   az appservice plan create \
     --name codementor-plan \
     --resource-group codementor-rg \
     --sku B1 \
     --is-linux

   # Create web app
   az webapp create \
     --name codementor-api \
     --resource-group codementor-rg \
     --plan codementor-plan \
     --runtime "DOTNET|8.0"
   ```

3. **Configure App Settings**
   ```bash
   az webapp config appsettings set \
     --name codementor-api \
     --resource-group codementor-rg \
     --settings \
       ConnectionStrings__DefaultConnection="your_connection_string" \
       JwtSettings__Secret="your_jwt_secret" \
       JwtSettings__Issuer="https://codementor-api.azurewebsites.net" \
       ASPNETCORE_ENVIRONMENT="Production"
   ```

4. **Deploy**
   ```bash
   # Deploy using ZIP
   cd publish
   zip -r ../app.zip .
   cd ..
   
   az webapp deployment source config-zip \
     --name codementor-api \
     --resource-group codementor-rg \
     --src app.zip
   ```

5. **Enable CORS**
   ```bash
   az webapp cors add \
     --name codementor-api \
     --resource-group codementor-rg \
     --allowed-origins https://your-frontend.vercel.app
   ```

#### Your API will be available at:
`https://codementor-api.azurewebsites.net`

---

### Option 2: Docker + Any Cloud Provider

#### Create Dockerfile
```dockerfile
# Backend/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["YourProject.csproj", "./"]
RUN dotnet restore "YourProject.csproj"
COPY . .
RUN dotnet build "YourProject.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "YourProject.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "YourProject.dll"]
```

#### Build and Run
```bash
docker build -t codementor-backend .
docker run -p 5000:80 \
  -e ConnectionStrings__DefaultConnection="your_connection" \
  -e JwtSettings__Secret="your_secret" \
  codementor-backend
```

---

### Option 3: Railway

#### Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   cd your-backend-directory
   railway init
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set ConnectionStrings__DefaultConnection="your_connection"
   railway variables set JwtSettings__Secret="your_secret"
   ```

4. **Deploy**
   ```bash
   railway up
   ```

---

## 🗄️ Database Deployment

### Option 1: Azure SQL Database

```bash
# Create SQL server
az sql server create \
  --name codementor-sql \
  --resource-group codementor-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password YourSecurePassword123!

# Create database
az sql db create \
  --name codementor-db \
  --server codementor-sql \
  --resource-group codementor-rg \
  --service-objective S0

# Get connection string
az sql db show-connection-string \
  --name codementor-db \
  --server codementor-sql \
  --client ado.net
```

### Option 2: PostgreSQL on Railway

1. Go to Railway dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Copy the connection string
4. Use in your backend configuration

---

## 🔐 Security Checklist

### Frontend
- [ ] Set strong JWT_SECRET
- [ ] Use HTTPS only
- [ ] Configure CORS properly
- [ ] Hide API keys (use environment variables)
- [ ] Enable rate limiting

### Backend
- [ ] Use strong database passwords
- [ ] Enable HTTPS
- [ ] Configure CORS for your frontend domain only
- [ ] Use secure JWT settings
- [ ] Enable authentication on all protected routes
- [ ] Set up logging and monitoring

---

## 🌐 DNS Configuration

### If using custom domain:

1. **Frontend (Vercel)**
   - Add A record: `@` → Vercel IP
   - Add CNAME: `www` → `cname.vercel-dns.com`

2. **Backend (Azure)**
   - Add CNAME: `api` → `codementor-api.azurewebsites.net`

---

## 📊 Monitoring & Logging

### Frontend (Vercel)
- Built-in analytics available
- Check deployment logs in dashboard
- Set up error tracking (Sentry)

### Backend (Azure)
```bash
# View logs
az webapp log tail \
  --name codementor-api \
  --resource-group codementor-rg

# Enable application insights
az monitor app-insights component create \
  --app codementor-insights \
  --location eastus \
  --resource-group codementor-rg
```

---

## 🚀 Quick Deployment Commands

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd codementor-ai
vercel --prod
```

### Backend (Azure)
```bash
# One-command deploy
az webapp up \
  --name codementor-api \
  --resource-group codementor-rg \
  --runtime "DOTNET:8.0"
```

---

## 🔄 CI/CD Setup

### GitHub Actions for Frontend

Create `.github/workflows/deploy-frontend.yml`:
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### GitHub Actions for Backend

Create `.github/workflows/deploy-backend.yml`:
```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      - run: dotnet publish -c Release -o ./publish
      - uses: azure/webapps-deploy@v2
        with:
          app-name: codementor-api
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./publish
```

---

## 📝 Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] Backend API is responding
- [ ] Database connection works
- [ ] Authentication works
- [ ] AI features work (Gemini API)
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled
- [ ] Environment variables are set
- [ ] Monitoring is active
- [ ] Backups are configured

---

## 🆘 Troubleshooting

### Frontend Issues
- **Build fails**: Check Node version (use 18+)
- **API calls fail**: Verify NEXT_PUBLIC_API_URL
- **Gemini not working**: Check NEXT_PUBLIC_GEMINI_API_KEY

### Backend Issues
- **500 errors**: Check application logs
- **Database connection fails**: Verify connection string
- **CORS errors**: Add frontend URL to CORS policy

### Common Commands
```bash
# Check frontend logs (Vercel)
vercel logs

# Check backend logs (Azure)
az webapp log tail --name codementor-api --resource-group codementor-rg

# Restart backend
az webapp restart --name codementor-api --resource-group codementor-rg
```

---

## 💰 Cost Estimates

### Free Tier Options
- **Frontend**: Vercel (Free tier: 100GB bandwidth)
- **Backend**: Azure App Service (Free tier available)
- **Database**: Railway PostgreSQL (Free tier: 500MB)

### Paid Options (Monthly)
- **Vercel Pro**: $20/month
- **Azure App Service B1**: ~$13/month
- **Azure SQL Database S0**: ~$15/month

**Total Estimated Cost**: $0-50/month depending on usage

---

## 📞 Support

If you encounter issues:
1. Check application logs
2. Verify environment variables
3. Test API endpoints manually
4. Check CORS configuration
5. Review security settings

---

**Deployment Status**: Ready to deploy!
**Recommended Stack**: Vercel (Frontend) + Azure (Backend) + Azure SQL (Database)
