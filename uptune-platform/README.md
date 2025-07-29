# UpTune Platform Monorepo

This monorepo contains all UpTune products and shared packages.

## Structure

```
uptune-platform/
├── apps/
│   ├── weddings/      # Wedding music planning app
│   ├── teams/         # Team building & culture app
│   ├── celebrations/  # Birthday & event music app
│   └── hub/          # Central hub & landing pages
└── packages/
    ├── ui/           # Shared UI components
    ├── auth/         # Shared authentication logic
    ├── music-core/   # Core music functionality
    ├── database/     # Shared database utilities
    └── config/       # Shared configurations
```

## Getting Started

```bash
# Install dependencies
npm install

# Run all apps in development
npm run dev

# Build all apps
npm run build

# Run specific app
npm run dev --filter=weddings
```

## Deployment

Each app can be deployed independently to Vercel:

- `weddings.uptune.xyz` - Wedding music planning
- `teams.uptune.xyz` - Team building platform
- `celebrations.uptune.xyz` - Event music planning
- `uptune.xyz` - Main hub

## Development

### Adding a new app

```bash
cd apps
npx create-next-app@latest my-app --typescript --tailwind --app
```

### Adding a new package

```bash
cd packages
mkdir my-package
cd my-package
npm init -y
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth
- **Payments**: Stripe
- **Music**: Spotify API
- **Deployment**: Vercel
- **Monorepo**: Turborepo