# Production Deployment Checklist

## 🚨 Pre-Deployment Critical Tasks

### ✅ Completed
- [x] Fixed hardcoded Firebase Admin credentials
- [x] Fixed invalid Stripe API version
- [x] Created pricing page
- [x] Implemented tier enforcement for premium features
- [x] Fixed redundant redirect logic in signup
- [x] Created comprehensive .env.example
- [x] Added Firestore indexes configuration
- [x] Created database seed script

### 🔴 Must Complete Before Launch

#### 1. **Database Setup**
```bash
# Run locally first to test
npx tsx src/scripts/seed-songs-database.ts

# Deploy indexes to production
firebase deploy --only firestore:indexes
```

#### 2. **Environment Variables in Vercel**
Add all required variables from .env.example:
- [ ] All Firebase config vars
- [ ] Firebase Admin SDK credentials
- [ ] Stripe keys (use production keys)
- [ ] Spotify API credentials
- [ ] Set ADMIN_SECRET to strong value
- [ ] Set NEXT_PUBLIC_SEED_SECRET to strong value

#### 3. **Stripe Configuration**
- [ ] Add webhook endpoint in Stripe Dashboard: `https://weddings.uptune.xyz/api/stripe/webhook`
- [ ] Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Copy webhook signing secret to Vercel env vars
- [ ] Test with Stripe CLI first

#### 4. **Remove Development Artifacts**
```bash
# Remove console.logs
grep -r "console.log" src/ --include="*.tsx" --include="*.ts" | grep -v "// console.log" | wc -l
# Currently: 131+ files with console.logs - MUST REMOVE

# Check for localhost references
grep -r "localhost" src/ --include="*.tsx" --include="*.ts"
```

#### 5. **Security Hardening**
- [ ] Enable Upstash Redis for rate limiting
- [ ] Add Sentry for error tracking
- [ ] Review and deploy Firebase security rules
- [ ] Enable CORS properly in API routes
- [ ] Add Content Security Policy headers

## 🟡 High Priority (Complete within 24 hours of launch)

### Error Tracking & Monitoring
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize with wizard
npx @sentry/wizard@latest -i nextjs
```

### Performance Optimizations
- [ ] Enable image optimization with Next.js Image component
- [ ] Add proper caching headers
- [ ] Implement lazy loading for heavy components
- [ ] Optimize bundle size (check with `npm run analyze`)

### API Improvements
- [ ] Fix broken `/api/spotify/enrich/[id]` endpoint
- [ ] Improve search API to use proper Firestore queries
- [ ] Add proper error responses with status codes
- [ ] Implement request validation on all endpoints

## 🟢 Post-Launch Improvements

### UX Enhancements
- [ ] Add loading skeletons instead of blank screens
- [ ] Improve mobile navigation (simplify tabs)
- [ ] Add proper error boundaries
- [ ] Implement offline support with service worker
- [ ] Add keyboard shortcuts for power users

### Feature Completions
- [ ] Connect country/genre filtering to database
- [ ] Implement actual AI recommendations (currently mock)
- [ ] Add email notifications for guest submissions
- [ ] Implement partner collaboration features
- [ ] Add wedding timeline sharing

### Code Quality
- [ ] Split large components (builder/page.tsx is 1800+ lines)
- [ ] Remove duplicate code
- [ ] Add proper TypeScript types (remove `any`)
- [ ] Implement comprehensive testing
- [ ] Add API documentation

## 📊 Launch Day Monitoring

### Key Metrics to Watch
1. **Error Rate** - Should be < 1%
2. **Payment Success Rate** - Should be > 95%
3. **Page Load Time** - Should be < 3s
4. **API Response Time** - Should be < 500ms
5. **Database Query Time** - Should be < 100ms

### Monitoring Commands
```bash
# Check Vercel logs
vercel logs --follow

# Monitor Firebase usage
firebase firestore:indexes

# Check Stripe webhook events
stripe events list --limit 10

# Monitor bundle size
npm run build && npm run analyze
```

## 🚀 Deployment Commands

### Initial Deployment
```bash
# 1. Push to GitHub
git add -A
git commit -m "feat: Production-ready wedding app with all critical fixes"
git push origin main

# 2. Deploy indexes
firebase deploy --only firestore:indexes

# 3. Deploy security rules
firebase deploy --only firestore:rules

# 4. Seed production database (run once)
NODE_ENV=production npx tsx src/scripts/seed-songs-database.ts

# 5. Verify deployment
curl https://weddings.uptune.xyz/api/health
```

### Rollback Plan
```bash
# If issues arise, rollback in Vercel
vercel rollback

# Or revert git commit
git revert HEAD
git push origin main
```

## 📝 Post-Launch Tasks

### Week 1
- [ ] Monitor error logs daily
- [ ] Review user feedback
- [ ] Fix any critical bugs
- [ ] Optimize slow queries
- [ ] Update documentation

### Week 2
- [ ] Implement most requested features
- [ ] A/B test pricing
- [ ] Optimize conversion funnel
- [ ] Add more song data
- [ ] Improve SEO

### Month 1
- [ ] Full security audit
- [ ] Performance audit
- [ ] User experience review
- [ ] Implement analytics insights
- [ ] Plan next major features

## ⚠️ Known Issues to Monitor

1. **Database songs may lack preview URLs** - Monitor and enrich data
2. **Search API performance** - Currently loads all songs then filters
3. **Tier enforcement** - Verify limits are properly enforced
4. **Currency detection** - May show wrong currency to some users
5. **Mobile UX** - Complex navigation needs simplification

## 📞 Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Firebase Support**: https://firebase.google.com/support
- **Stripe Support**: https://support.stripe.com
- **Domain Issues**: Check with your registrar

## ✅ Final Checklist

Before clicking "Deploy to Production":

- [ ] All environment variables set in Vercel
- [ ] Stripe webhook configured and tested
- [ ] Database seeded with songs
- [ ] Firestore indexes deployed
- [ ] Security rules deployed
- [ ] Console.logs removed
- [ ] Error tracking configured
- [ ] Rate limiting enabled
- [ ] Monitoring alerts set up
- [ ] Rollback plan ready

---

**Remember**: It's better to launch with a working product and iterate than to delay for perfection. Focus on core functionality, monitor closely, and improve based on real user feedback.