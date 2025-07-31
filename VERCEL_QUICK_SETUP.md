# 🚀 Vercel Quick Setup - 5 Minute Guide

## Wedding App (Existing Project)

1. **Go to Vercel Dashboard** → Your `wedding-app-fresh` project
2. **Settings** → **General** → **Root Directory**
3. **Change to**: `apps/wedding`
4. **Save** → **Redeploy**

✅ Wedding app should now work from new location!

## Uptune Hub (New Setup)

### Option 1: Quick Integration (Recommended)

1. **Copy your uptune hub code**:
   ```bash
   cd /Users/bensmith/Desktop/wedding-app-fresh/apps
   git clone [your-uptune-hub-repo] uptune
   ```

2. **Create new Vercel project**:
   - Go to https://vercel.com/new
   - Import `wedding-app-fresh` repo
   - **IMPORTANT**: Set Root Directory to `apps/uptune`
   - Deploy!

3. **Copy environment variables** from old uptune-hub project

4. **Add your domain** (uptune.xyz) to the new project

### Option 2: Update Existing Project

1. Go to `uptune-hub` project in Vercel
2. Settings → Git → Disconnect
3. Connect to `wedding-app-fresh` repo
4. Set Root Directory: `apps/uptune`
5. Redeploy

## Test Everything

- ✅ https://weddings.uptune.xyz (wedding app)
- ✅ https://uptune.xyz (main platform)

## Common Issues & Fixes

**Build fails?**
- Clear build cache in Vercel settings
- Check Root Directory is correct

**Module not found?**
- Shared imports: Change to `@uptune/shared`
- Run `npm install` from workspace root

**Environment variables missing?**
- Copy from old project to new project
- Each app needs its own env vars in Vercel

---

🎉 That's it! Your multi-app setup is ready!