# Deploy UpTune Hub - Quick Instructions

Since you already have your wedding app deployed on Vercel, here's the easiest way to deploy the hub:

## Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import from Git**
   - Select your GitHub repo: `beni10-uptune/wedding-app-fresh`
   - Click "Import"

3. **Configure the Project**
   - **Project Name**: `uptune-hub`
   - **Framework Preset**: Next.js
   - **Root Directory**: Click "Edit" and enter: `uptune-platform/apps/hub`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Add Environment Variables** (if needed):
   ```
   NEXT_PUBLIC_APP_NAME=hub
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

6. **Add Custom Domain**
   - Go to Settings → Domains
   - Add: `uptune.xyz`
   - Follow DNS instructions

## Option 2: Deploy from Command Line

First, install Vercel CLI with sudo:
```bash
sudo npm install -g vercel
```

Then navigate to hub and deploy:
```bash
cd /Users/bensmith/Desktop/wedding-app-fresh/uptune-platform/apps/hub
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - What's your project's name? uptune-hub
# - In which directory is your code located? ./
# - Want to override the settings? No
```

## After Deployment

1. **Test the deployment**
   - Visit the provided Vercel URL
   - Should show the UpTune hub landing page

2. **Add custom domain**
   ```bash
   vercel domains add uptune.xyz
   ```

3. **Deploy other apps** (same process)
   - Teams: `uptune-platform/apps/teams` → `teams.uptune.xyz`
   - Celebrations: `uptune-platform/apps/celebrations` → `celebrations.uptune.xyz`

## Notes

- The hub is a simple Next.js app, no database needed yet
- It links to your existing wedding app at `weddings.uptune.xyz`
- Teams and Celebrations show "Coming Soon" pages

That's it! The Vercel Dashboard method is probably easiest since you're already familiar with it from deploying the wedding app.