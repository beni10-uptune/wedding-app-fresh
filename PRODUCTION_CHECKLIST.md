# Production Launch Checklist for UpTune

## 🚨 CRITICAL - Fix Immediately

### 1. **API Keys Security** 
- [ ] **REVOKE current Stripe production keys** (they're exposed in git)
- [ ] Generate new Stripe keys
- [ ] Remove .env.local from git history: `git filter-branch --tree-filter 'rm -f .env.local' HEAD`
- [ ] Add .env.local to .gitignore
- [ ] Configure Stripe webhook endpoint and add STRIPE_WEBHOOK_SECRET

### 2. **Environment Variables**
- [ ] Set NEXT_PUBLIC_GTM_ID to your actual GTM container ID
- [ ] Verify all Spotify API keys are set
- [ ] Ensure Firebase service account is properly configured
- [ ] Set RESEND_API_KEY for email functionality

## ✅ Completed Items

- [x] Created robots.txt
- [x] Created sitemap.xml 
- [x] Created manifest.json for PWA
- [x] Fixed favicon apple-icon reference
- [x] Added cookie consent banner
- [x] Updated GTM to respect cookie consent

## 📋 Pre-Launch Tasks

### Legal & Compliance
- [ ] Update Privacy Policy with:
  - All third-party services (Stripe, Firebase, Spotify, GTM)
  - Data retention periods
  - User rights (GDPR)
  - Cookie details
- [ ] Update Terms of Service with:
  - Limitation of liability
  - Dispute resolution
  - Governing law
- [ ] Create Cookie Policy page

### Security
- [ ] Tighten Firebase security rules
- [ ] Add rate limiting to public endpoints
- [ ] Add CORS headers to API routes
- [ ] Input validation on guest submissions

### Testing
- [ ] Test full signup → payment → usage flow
- [ ] Test webhook handling
- [ ] Test guest invitation flow
- [ ] Test Spotify export
- [ ] Test on mobile devices
- [ ] Test email delivery

### Performance
- [ ] Optimize images (restrict remote patterns)
- [ ] Enable code splitting for heavy libraries
- [ ] Test Core Web Vitals scores
- [ ] Minify JavaScript/CSS

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up alerts for failed payments
- [ ] Monitor 404 errors

### SEO & Marketing
- [ ] Add structured data for rich snippets
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics goals
- [ ] Create social media preview images
- [ ] Prepare launch email templates

## 🚀 Launch Day

1. [ ] Switch to production environment
2. [ ] Verify all API keys are production keys
3. [ ] Test critical paths one more time
4. [ ] Monitor error logs closely
5. [ ] Have rollback plan ready

## 📊 Post-Launch

- [ ] Monitor conversion rates
- [ ] Track user feedback
- [ ] Monitor server resources
- [ ] Review security logs
- [ ] Plan first feature updates based on user behavior

## 🎯 Google Ads Specific

Before launching ads:
- [ ] Landing page load time < 3 seconds
- [ ] Mobile-responsive design verified
- [ ] Clear CTA above the fold
- [ ] Trust signals visible (testimonials, security badges)
- [ ] Conversion tracking properly configured
- [ ] Negative keywords list prepared
- [ ] Ad copy A/B tests planned

Remember: **DO NOT LAUNCH** until exposed API keys are replaced!