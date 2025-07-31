# Vercel Deployment Update Guide

This guide will help you update your existing Vercel deployments to work with the new multi-app workspace structure.

## Current Situation

- **Wedding App**: Previously at root, now at `/apps/wedding`
- **Uptune Hub**: Separate deployment that we'll integrate

## Step-by-Step Instructions

### Part 1: Update Wedding App Deployment

1. **Go to Vercel Dashboard**
   - Navigate to https://vercel.com/dashboard
   - Find your `wedding-app-fresh` project

2. **Update Project Settings**
   - Click on your project
   - Go to "Settings" tab
   - Navigate to "General" section

3. **Configure Root Directory**
   - Find "Root Directory" setting
   - Click "Edit"
   - Change from `.` (or empty) to `apps/wedding`
   - Click "Save"

4. **Update Build & Development Settings**
   - Scroll to "Build & Development Settings"
   - Ensure these are set:
     - Framework Preset: `Next.js`
     - Build Command: `npm run build` (or leave as default)
     - Output Directory: `.next` (or leave as default)
     - Install Command: `npm install` (or leave as default)

5. **Environment Variables**
   - Go to "Environment Variables" section
   - All your existing env vars should still be there
   - No changes needed here

6. **Trigger New Deployment**
   - Go back to project overview
   - Click "Redeploy" on the latest deployment
   - Select "Redeploy with existing Build Cache"
   - This will use the new structure

### Part 2: Prepare Uptune Hub for Integration

1. **Clone Uptune Hub Locally** (if not already done)
   ```bash
   cd /Users/bensmith/Desktop/wedding-app-fresh/apps
   git clone [your-uptune-hub-repo-url] uptune
   ```

2. **Update Uptune Hub's package.json**
   - Open `/apps/uptune/package.json`
   - Ensure the name is unique:
   ```json
   {
     "name": "@uptune/hub",
     "version": "1.0.0",
     // ... rest of config
   }
   ```

3. **Create Vercel Config for Uptune**
   - Create `/apps/uptune/vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": "nextjs"
   }
   ```

### Part 3: Set Up Uptune Hub in Vercel

#### Option A: Update Existing Uptune Hub Project

1. **Go to Uptune Hub Project in Vercel**
   - Find `uptune-hub` project
   - Go to Settings → General

2. **Update Git Repository** (if needed)
   - If it's pointing to a separate repo, you'll need to:
   - Disconnect the current Git integration
   - Connect to `wedding-app-fresh` repo
   - Set Root Directory to `apps/uptune`

3. **Configure Build Settings**
   - Root Directory: `apps/uptune`
   - Framework Preset: `Next.js`
   - Keep all other settings

#### Option B: Create New Vercel Project (Recommended)

1. **Import New Project**
   - Go to https://vercel.com/new
   - Import `wedding-app-fresh` repository
   - During setup:
     - Name it: `uptune-platform`
     - Root Directory: `apps/uptune`
     - Framework: Next.js

2. **Copy Environment Variables**
   - From old uptune-hub project, copy all env vars
   - Add them to the new project

3. **Update Domain**
   - Go to Settings → Domains
   - Add `uptune.xyz` (or your domain)
   - Remove it from old project if needed

### Part 4: Update Root Package.json Scripts

Add these to your root `package.json`:

```json
{
  "scripts": {
    "dev:wedding": "cd apps/wedding && npm run dev",
    "dev:uptune": "cd apps/uptune && npm run dev",
    "build:wedding": "cd apps/wedding && npm run build",
    "build:uptune": "cd apps/uptune && npm run build",
    "deploy:wedding": "cd apps/wedding && vercel --prod",
    "deploy:uptune": "cd apps/uptune && vercel --prod"
  }
}
```

### Part 5: Verify Deployments

1. **Check Wedding App**
   - Visit https://weddings.uptune.xyz
   - Ensure everything works

2. **Check Uptune Hub**
   - Visit https://uptune.xyz
   - Verify functionality

## Troubleshooting

### Build Failures

If builds fail after updating:

1. **Clear Build Cache**
   - In Vercel project settings
   - Go to "Advanced"
   - Click "Delete Build Cache"
   - Redeploy

2. **Check Logs**
   - View build logs for specific errors
   - Common issues:
     - Missing dependencies
     - Path resolution errors
     - Environment variable issues

### Path Issues

If you get module resolution errors:

1. **Update Import Paths**
   - Shared imports: `@uptune/shared`
   - Local imports: Keep as `@/...`

2. **Check tsconfig.json**
   - Ensure paths are correctly configured
   - May need to adjust for new structure

### Environment Variables

- Each app uses its own env vars
- Set them per-project in Vercel
- Don't share sensitive vars between apps

## Benefits of This Setup

1. **Monorepo Advantages**
   - Single repo for all apps
   - Shared code and standards
   - Unified CI/CD

2. **Independent Deployments**
   - Each app deploys separately
   - No interference between apps
   - Different teams can work independently

3. **Code Sharing**
   - Use `@uptune/shared` for common code
   - Consistent UI components
   - Shared utilities

## Next Steps

1. **Monitor Deployments**
   - Watch for any errors
   - Check performance metrics

2. **Update CI/CD** (if applicable)
   - Update any GitHub Actions
   - Adjust build scripts

3. **Team Communication**
   - Inform team of new structure
   - Update documentation
   - Share this guide

---

Need help? Check the build logs in Vercel or reach out for support.