# UpTune Monorepo Setup Guide

## Overview

We'll set up a proper monorepo where:
- Your wedding app stays at `weddings.uptune.xyz`
- Hub deploys to `uptune.xyz`
- Teams deploys to `teams.uptune.xyz`
- Celebrations deploys to `celebrations.uptune.xyz`

All apps share:
- Firebase config and auth logic
- UI components and styling
- Database utilities
- Core music functionality

## Step 1: Prepare the Monorepo

We'll use the `uptune-platform` directory we already created, but fix it properly.

## Step 2: Fix Package Dependencies

Each app needs to be deployable independently while still sharing code.

## Step 3: Vercel Deployment Strategy

Each app gets its own Vercel project, all pulling from the same repo but different directories:

### Deploy Wedding App
1. Create new Vercel project
2. Import `beni10-uptune/wedding-app-fresh`
3. Root directory: `/` (your current setup)
4. Domain: `weddings.uptune.xyz`

### Deploy Hub App
1. Create new Vercel project
2. Import same repo
3. Root directory: `uptune-platform/apps/hub`
4. Build settings:
   ```
   Build Command: cd ../.. && npm install && cd apps/hub && npm run build
   Output Directory: apps/hub/.next
   Install Command: cd ../.. && npm install
   ```
5. Domain: `uptune.xyz`

### Deploy Teams App (later)
Same process, root directory: `uptune-platform/apps/teams`

### Deploy Celebrations App (later)
Same process, root directory: `uptune-platform/apps/celebrations`

## Shared Code Structure

```
uptune-platform/
├── apps/
│   ├── hub/          # Landing page
│   ├── teams/        # Teams product
│   ├── celebrations/ # Celebrations product
│   └── weddings/     # Copy of your wedding app
└── packages/
    ├── ui/           # Shared components
    ├── config/       # Shared Firebase config
    ├── database/     # Firestore utilities
    └── styles/       # Shared Tailwind config
```

## Benefits

1. **Shared Authentication**: Users log in once, access all products
2. **Consistent Design**: Same components and styling
3. **Shared Data**: Same Firebase backend
4. **Efficient Development**: Change once, update everywhere
5. **Independent Deployment**: Each app can be updated separately

## Implementation Steps

Let me set this up properly...