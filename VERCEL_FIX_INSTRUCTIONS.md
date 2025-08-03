# Vercel Build Fix Instructions

## The Issue
Vercel is trying to build from the root directory instead of `apps/wedding`. This is causing the build to fail with "Couldn't find any `pages` or `app` directory".

## The Fix
You need to update the Vercel project settings to set the correct root directory.

### Steps to Fix:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/beni10-uptunes-projects/uptune-wedding/settings

2. **Update Root Directory Setting**
   - In Settings → General
   - Find "Root Directory"
   - Change from: `.` (or empty)
   - Change to: `apps/wedding`
   - Click "Save"

3. **Trigger New Deployment**
   - Either push a commit OR
   - Click "Redeploy" on the latest deployment

### Alternative: Using Vercel CLI
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Link to project
vercel link

# Set root directory
vercel --build-env ROOT_DIR=apps/wedding

# Or update project settings
vercel project edit uptune-wedding --root-directory apps/wedding
```

## Expected Result
After updating the root directory to `apps/wedding`, Vercel will:
1. Install dependencies from `apps/wedding/package.json`
2. Run build from `apps/wedding`
3. Deploy successfully to weddings.uptune.xyz

## Quick Test
After fixing, you can verify by pushing a small change:
```bash
echo "# Deploy test $(date)" >> README.md
git add README.md
git commit -m "test: Verify Vercel build with correct root directory"
git push origin main
```

## Important Notes
- The `apps/wedding/vercel.json` file is correctly configured
- No root-level vercel.json is needed
- This is a one-time fix in Vercel project settings
- All future deployments will use the correct directory