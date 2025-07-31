# Uptune Workspace

Multi-app workspace for all Uptune applications.

## 🏗️ Structure

```
uptune-workspace/
├── apps/
│   ├── wedding/        # Wedding planning app (weddings.uptune.xyz)
│   ├── uptune/         # Main uptune platform (uptune.xyz)
│   └── admin/          # Admin dashboard (future)
├── packages/
│   └── shared/         # Shared utilities and components
├── scripts/            # Workspace-level scripts
└── docs/              # Documentation
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run wedding app
npm run dev:wedding

# Run uptune app (when added)
npm run dev:uptune
```

### Building

```bash
# Build wedding app
npm run build:wedding

# Build all apps
npm run build:all
```

## 📦 Apps

### Wedding App
- **URL**: https://weddings.uptune.xyz
- **Location**: `/apps/wedding`
- **Stack**: Next.js 15, TypeScript, Firebase, Spotify API
- **Status**: Production

### Uptune Platform
- **URL**: https://uptune.xyz
- **Location**: `/apps/uptune`
- **Stack**: TBD
- **Status**: To be migrated

## 🛠️ Shared Packages

### @uptune/shared
Shared utilities, types, and components used across all apps.

```typescript
import { formatDate, ApiResponse } from '@uptune/shared'
```

## 📚 Documentation

- [Coding Standards](./CODING_STANDARDS.md)
- [Claude Context](./CLAUDE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)

## 🚢 Deployment

Each app deploys independently:

### Wedding App
```bash
cd apps/wedding
vercel --prod
```

## 🔧 Workspace Management

### Adding a New App
1. Create directory: `mkdir apps/new-app`
2. Add to workspace: Update root `package.json`
3. Configure deployment

### Updating Claude Context
```bash
npm run update:claude
```

---

Managed with Claude Code 🤖