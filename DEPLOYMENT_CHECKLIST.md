# Deployment Checklist

Use this checklist to ensure a smooth deployment.

## 📋 Pre-Deployment

### Frontend
- [ ] All environment variables are set in `.env.production`
- [ ] Gemini API key is valid and has quota
- [ ] Build completes without errors (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] All features tested locally

### Backend
- [ ] Database is set up and accessible
- [ ] Connection string is correct
- [ ] JWT secret is strong (32+ characters)
- [ ] CORS is configured for frontend domain
- [ ] API endpoints are tested
- [ ] Authentication works

## 🚀 Deployment Steps

### Option 1: Vercel + Azure (Recommended)

#### Frontend (Vercel)
1. [ ] Push code to GitHub
2. [ ] Connect repository to Vercel
3. [ ] Add environment variables in Vercel dashboard:
   - [ ] `NEXT_PUBLIC_GEMINI_API_KEY`
   - [ ] `NEXT_PUBLIC_API_URL`
   - [ ] `NEXT_PUBLIC_APP_URL`
   - [ ] `JWT_SECRET`
4. [ ] Deploy
5. [ ] Test deployed site
6. [ ] Configure custom domain (optional)

#### Backend (Azure)
1. [ ] Create Azure App Service
2. [ ] Configure app settings:
   - [ ] Connection string
   - [ ] JWT settings
   - [ ] CORS origins
3. [ ] Deploy backend
4. [ ] Test API endpoints
5. [ ] Enable HTTPS
6. [ ] Configure custom domain (optional)

### Option 2: Docker Deployment

#### Frontend
1. [ ] Build Docker image: `docker build -t codementor-frontend .`
2. [ ] Test locally: `docker run -p 3000:3000 codementor-frontend`
3. [ ] Push to container registry
4. [ ] Deploy to cloud provider
5. [ ] Configure environment variables
6. [ ] Test deployed container

#### Backend
1. [ ] Build Docker image
2. [ ] Test locally
3. [ ] Push to container registry
4. [ ] Deploy to cloud provider
5. [ ] Configure environment variables
6. [ ] Test API endpoints

## 🔐 Security Checklist

- [ ] All API keys are in environment variables (not in code)
- [ ] JWT secret is strong and unique
- [ ] HTTPS is enabled
- [ ] CORS is configured correctly
- [ ] Database credentials are secure
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] Error messages don't expose sensitive info

## 🧪 Post-Deployment Testing

### Frontend Tests
- [ ] Homepage loads
- [ ] Sign in/Sign up works
- [ ] AI Editor works
- [ ] Roadmap generation works
- [ ] Games load and function
- [ ] Profile page works
- [ ] Settings page works
- [ ] Navigation works
- [ ] Mobile responsive

### Backend Tests
- [ ] API health check responds
- [ ] Authentication endpoints work
- [ ] Database connection works
- [ ] CORS headers are correct
- [ ] Error handling works
- [ ] Logging is active

### Integration Tests
- [ ] Frontend can call backend API
- [ ] Authentication flow works end-to-end
- [ ] AI features work (Gemini API)
- [ ] Data persists correctly
- [ ] File uploads work (if applicable)

## 📊 Monitoring Setup

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors
- [ ] Set up analytics (optional)
- [ ] Database backup configured

## 🌐 DNS Configuration

- [ ] Frontend domain points to deployment
- [ ] Backend API subdomain configured
- [ ] SSL certificates are valid
- [ ] WWW redirect configured (if needed)

## 📝 Documentation

- [ ] Update README with production URLs
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document deployment process
- [ ] Update API documentation

## 🔄 CI/CD Setup (Optional)

- [ ] GitHub Actions workflow configured
- [ ] Secrets added to GitHub
- [ ] Automatic deployment on push to main
- [ ] Build status badge added to README
- [ ] Deployment notifications configured

## 💰 Cost Optimization

- [ ] Choose appropriate service tiers
- [ ] Set up auto-scaling (if needed)
- [ ] Configure CDN for static assets
- [ ] Enable caching where appropriate
- [ ] Monitor usage and costs

## 🆘 Rollback Plan

- [ ] Previous version is tagged in Git
- [ ] Rollback procedure documented
- [ ] Database backup before deployment
- [ ] Know how to revert deployment quickly

## ✅ Final Checks

- [ ] All features work in production
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Mobile experience is good
- [ ] SEO basics are in place
- [ ] Analytics are tracking
- [ ] Team has access to dashboards
- [ ] Support channels are ready

## 📞 Emergency Contacts

- **DevOps Lead**: [Name/Email]
- **Backend Lead**: [Name/Email]
- **Frontend Lead**: [Name/Email]
- **Cloud Provider Support**: [Link/Phone]

## 🎉 Post-Launch

- [ ] Announce launch to team
- [ ] Monitor for first 24 hours
- [ ] Collect user feedback
- [ ] Address any critical issues
- [ ] Plan next iteration

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Version**: ___________
**Status**: ⬜ Pending | ⬜ In Progress | ⬜ Complete
