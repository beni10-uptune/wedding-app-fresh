# UpTune Platform Deployment Guide

## 🚀 Quick Start

The monorepo structure has been created in `uptune-platform/`. Here's how to deploy your multi-product platform:

## 📁 Structure Created

```
uptune-platform/
├── apps/
│   ├── weddings/      # Your existing wedding app (migrated)
│   ├── teams/         # UpTune for Teams (skeleton created)
│   ├── celebrations/  # UpTune for Celebrations (skeleton created)
│   └── hub/          # Main UpTune hub (skeleton created)
└── packages/
    ├── ui/           # Shared UI components
    ├── auth/         # Shared authentication
    └── music-core/   # Core music functionality
```

## 🛠️ Manual Deployment Steps

### 1. Deploy Wedding App (Already Working)

Since your wedding app is already deployed, no changes needed for now. It will continue running at `weddings.uptune.xyz`.

### 2. Deploy New Apps to Vercel

For each new app (teams, celebrations, hub):

```bash
cd uptune-platform/apps/teams
vercel

# When prompted:
# - Set up and deploy: Yes
# - Scope: Your account
# - Link to existing project: No
# - Project name: uptune-teams
# - Directory: ./
# - Build command: next build
# - Output directory: .next
# - Development command: next dev -p 3001
```

Repeat for:
- `apps/celebrations` → `uptune-celebrations` → port 3002
- `apps/hub` → `uptune-hub` → port 3003

### 3. Configure Custom Domains

In Vercel Dashboard for each project:

1. Go to Settings → Domains
2. Add custom domain:
   - `uptune-teams` → `teams.uptune.xyz`
   - `uptune-celebrations` → `celebrations.uptune.xyz`
   - `uptune-hub` → `uptune.xyz`

### 4. Set Environment Variables

For each app in Vercel, add these environment variables:

```env
# Firebase Config (same for all apps)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# App-specific
NEXT_PUBLIC_APP_NAME=teams  # or celebrations, hub
NEXT_PUBLIC_GTM_ID=GTM-NJP3X5W3

# Stripe (if needed for the app)
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

## 🎯 Next Steps for Each Product

### UpTune Hub (uptune.xyz)
- Main landing page showcasing all products
- User dashboard to access different products
- Unified billing/subscription management
- Blog and resources

### UpTune for Teams
- Team music preferences survey
- Office playlist generation
- Team building activities with music
- Culture mapping through music taste

### UpTune for Celebrations
- Birthday party playlists
- Anniversary celebrations
- Holiday parties
- Custom event music planning

## 🔄 Migration Path

1. **Phase 1** (Now): Deploy skeleton apps with "Coming Soon" pages
2. **Phase 2**: Build out Hub with product showcase
3. **Phase 3**: Develop Teams product MVP
4. **Phase 4**: Launch Celebrations product
5. **Phase 5**: Integrate shared components and unified auth

## 📊 Architecture Benefits

1. **Shared Authentication**: Users sign up once, access all products
2. **Shared UI Components**: Consistent design across products
3. **Shared Music Core**: Spotify integration, playlist generation
4. **Independent Deployments**: Each product can be updated separately
5. **Unified Analytics**: Track user journey across products

## 🚦 Current Status

✅ Monorepo structure created
✅ Wedding app migrated (can be deployed independently)
✅ Skeleton apps created for Teams, Celebrations, Hub
✅ Shared packages structure defined
⏳ Next: Deploy skeleton apps to claim domains
⏳ Next: Build out Hub landing page

## 📝 Development Workflow

For local development:

```bash
# Run wedding app
cd uptune-platform/apps/weddings
npm install
npm run dev  # http://localhost:3000

# Run teams app
cd ../teams
npm install
npm run dev  # http://localhost:3001

# Run celebrations app
cd ../celebrations
npm install
npm run dev  # http://localhost:3002

# Run hub
cd ../hub
npm install
npm run dev  # http://localhost:3003
```

## 🎨 Branding Guidelines

Each product should maintain UpTune core branding while having its unique identity:

- **Weddings**: Purple/Pink gradient (current)
- **Teams**: Blue/Green gradient (professional)
- **Celebrations**: Orange/Yellow gradient (festive)
- **Hub**: Multi-color gradient (unified)

## 📈 Growth Strategy

1. **Cross-promotion**: Wedding users → Teams for corporate events
2. **Upsell**: Free wedding trial → Paid team subscriptions
3. **Expansion**: Teams → Company celebrations → Personal events
4. **Network effects**: More users = Better music data = Better recommendations