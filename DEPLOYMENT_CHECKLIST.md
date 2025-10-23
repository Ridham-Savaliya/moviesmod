# 🚀 Production Deployment Checklist

Use this checklist to ensure your MoviesHub platform is production-ready.

## ✅ Pre-Deployment Checklist

### Backend

- [ ] **Environment Variables**
  - [ ] Change `JWT_SECRET` to a strong, random string
  - [ ] Set `NODE_ENV=production`
  - [ ] Update `MONGODB_URI` to production database
  - [ ] Update `FRONTEND_URL` to production website URL
  - [ ] Update `ADMIN_URL` to production admin URL
  - [ ] Set appropriate `MAX_FILE_SIZE`

- [ ] **Security**
  - [ ] Enable HTTPS
  - [ ] Review CORS settings
  - [ ] Check rate limiting values
  - [ ] Verify JWT expiration time
  - [ ] Test authentication flows
  - [ ] Review file upload restrictions

- [ ] **Database**
  - [ ] Set up MongoDB Atlas or production database
  - [ ] Create database backups
  - [ ] Set up database indexes (auto-created by Mongoose)
  - [ ] Test database connection
  - [ ] Configure database access rules

- [ ] **Performance**
  - [ ] Enable compression
  - [ ] Set up CDN for uploads
  - [ ] Configure caching headers
  - [ ] Test API response times

### Website

- [ ] **Environment Variables**
  - [ ] Update `NEXT_PUBLIC_API_URL` to production backend
  - [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
  - [ ] Add `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (if using AdSense)
  - [ ] Set correct `NEXT_PUBLIC_SITE_NAME`
  - [ ] Set correct `NEXT_PUBLIC_SITE_DESCRIPTION`

- [ ] **SEO**
  - [ ] Verify meta tags on all pages
  - [ ] Test schema markup with Google Rich Results Test
  - [ ] Create and submit sitemap.xml
  - [ ] Create robots.txt
  - [ ] Set up Google Search Console
  - [ ] Set up Google Analytics (optional)
  - [ ] Test Open Graph tags
  - [ ] Test Twitter Cards

- [ ] **Performance**
  - [ ] Run Lighthouse audit (target 90+ score)
  - [ ] Optimize images
  - [ ] Enable Next.js image optimization
  - [ ] Test page load times
  - [ ] Enable compression
  - [ ] Set up CDN (Vercel, Cloudflare, etc.)

- [ ] **Content**
  - [ ] Add favicon
  - [ ] Add logo
  - [ ] Customize colors/branding
  - [ ] Add legal pages (Privacy Policy, Terms, DMCA, Disclaimer)
  - [ ] Test all links

### Admin Panel

- [ ] **Environment Variables**
  - [ ] Update `NEXT_PUBLIC_API_URL` to production backend
  - [ ] Set `NEXT_PUBLIC_ADMIN_NAME`

- [ ] **Security**
  - [ ] Use strong admin passwords
  - [ ] Enable HTTPS
  - [ ] Add `noindex, nofollow` meta tags (already included)
  - [ ] Restrict access by IP (optional)
  - [ ] Set up 2FA (future enhancement)

- [ ] **Access**
  - [ ] Create admin accounts
  - [ ] Test all user roles (Admin, Editor, Moderator)
  - [ ] Verify permissions work correctly
  - [ ] Test login/logout flows

## 🌐 Deployment Steps

### 1. Deploy Backend

#### Option A: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set FRONTEND_URL=https://your-website.com
heroku config:set ADMIN_URL=https://admin.your-website.com

# Deploy
git push heroku main
```

#### Option B: DigitalOcean/AWS/GCP
1. Create a server instance
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Set environment variables
6. Use PM2 to run: `pm2 start server.js`
7. Set up Nginx reverse proxy
8. Configure SSL with Let's Encrypt

### 2. Deploy Website

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to website folder
cd website

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add custom domain
```

#### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

### 3. Deploy Admin Panel

Same as website deployment, but:
- Use different subdomain (e.g., admin.yoursite.com)
- Ensure it's not indexed by search engines
- Consider IP whitelisting for extra security

### 4. Database Setup

#### MongoDB Atlas
1. Create account at mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Add database user
4. Whitelist IP addresses (or allow all for development)
5. Get connection string
6. Update MONGODB_URI in backend

## 🧪 Post-Deployment Testing

### Backend
- [ ] Test all API endpoints
- [ ] Verify authentication works
- [ ] Test file uploads
- [ ] Check error handling
- [ ] Monitor logs for errors

### Website
- [ ] Test all pages load correctly
- [ ] Verify search functionality
- [ ] Test filters and pagination
- [ ] Check movie detail pages
- [ ] Test feedback submission
- [ ] Verify AdSense ads display (if configured)
- [ ] Test on mobile devices
- [ ] Test on different browsers

### Admin Panel
- [ ] Test login
- [ ] Verify dashboard loads
- [ ] Test movie CRUD operations
- [ ] Test category management
- [ ] Test feedback moderation
- [ ] Test ad slot management
- [ ] Verify analytics display

## 📊 Monitoring & Maintenance

### Set Up Monitoring
- [ ] Backend uptime monitoring (UptimeRobot, Pingdom)
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Performance monitoring (New Relic, DataDog)
- [ ] Database monitoring (MongoDB Atlas built-in)

### Regular Maintenance
- [ ] Weekly database backups
- [ ] Monthly security updates
- [ ] Monitor disk space
- [ ] Review error logs
- [ ] Update dependencies
- [ ] Monitor API usage

## 🔒 Security Checklist

- [ ] HTTPS enabled on all domains
- [ ] Strong passwords for all accounts
- [ ] JWT secret is secure and random
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] File upload restrictions in place
- [ ] Database access restricted
- [ ] Admin panel not indexed by search engines
- [ ] Regular security updates

## 📈 SEO Checklist

- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] robots.txt configured
- [ ] Meta tags on all pages
- [ ] Schema markup implemented
- [ ] Open Graph tags working
- [ ] Page speed optimized (90+ Lighthouse score)
- [ ] Mobile-friendly
- [ ] Clean URLs
- [ ] Internal linking structure

## 💰 Monetization (Optional)

- [ ] Google AdSense account approved
- [ ] Ad slots configured
- [ ] Ads displaying correctly
- [ ] Ad performance tracking
- [ ] Compliance with AdSense policies

## 📱 Social Media (Optional)

- [ ] Create social media accounts
- [ ] Add social sharing buttons
- [ ] Set up social media meta tags
- [ ] Create content posting schedule

## 🎯 Launch Checklist

### Day Before Launch
- [ ] Final testing on staging environment
- [ ] Database backup
- [ ] DNS records ready
- [ ] SSL certificates ready
- [ ] Monitoring tools configured

### Launch Day
- [ ] Deploy backend
- [ ] Deploy website
- [ ] Deploy admin panel
- [ ] Update DNS records
- [ ] Test everything again
- [ ] Monitor for errors
- [ ] Announce launch

### Week After Launch
- [ ] Monitor performance
- [ ] Check error logs daily
- [ ] Gather user feedback
- [ ] Fix any critical bugs
- [ ] Monitor SEO rankings
- [ ] Check AdSense performance

## 🐛 Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Update FRONTEND_URL and ADMIN_URL in backend .env

### Issue: Images Not Loading
**Solution**: Check uploads directory permissions and CDN configuration

### Issue: Slow Performance
**Solution**: Enable caching, optimize images, use CDN

### Issue: Database Connection Errors
**Solution**: Check MONGODB_URI, verify IP whitelist, check database status

### Issue: Authentication Not Working
**Solution**: Verify JWT_SECRET is set, check token expiration

## 📞 Support Resources

- **Backend Issues**: Check backend/README.md
- **Website Issues**: Check website/README.md
- **Admin Issues**: Check admin/README.md
- **General Help**: Check main README.md

## 🎉 You're Ready to Launch!

Once all checkboxes are complete, your MoviesHub platform is production-ready!

---

**Remember**: 
- Start small and scale gradually
- Monitor everything
- Keep backups
- Update regularly
- Listen to user feedback

**Good luck with your launch! 🚀**
