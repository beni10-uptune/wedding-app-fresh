# UpTune Platform Migration Guide

This guide helps you migrate from the standalone wedding app to the UpTune platform monorepo.

## 🚀 Quick Start

### 1. Create the Monorepo
```bash
# Run the setup script
cd ~/Desktop/wedding-app-fresh
./setup-uptune-platform.sh

# Navigate to the new monorepo
cd ~/Desktop/uptune-platform

# Install dependencies
pnpm install

# Open in Cursor
cursor .
```

### 2. Open Both Projects in Cursor
- **Window 1**: `uptune-platform` (new monorepo)
- **Window 2**: `wedding-app-fresh` (reference)

## 📦 Migration Steps

### Phase 1: Copy Core Structure (Week 1)

#### 1.1 Copy the Wedding App
```bash
# In uptune-platform directory
cp -r ../wedding-app-fresh/* apps/weddings/
cp -r ../wedding-app-fresh/.* apps/weddings/ 2>/dev/null || true

# Remove items we don't need
cd apps/weddings
rm -rf .git node_modules .next
rm setup-uptune-platform.sh MIGRATION_GUIDE.md
```

#### 1.2 Update Wedding App Configuration
```bash
# Update package.json name
sed -i '' 's/"name": "weddings.uptune.xyz"/"name": "@uptune\/weddings"/' package.json

# Update imports to use workspace packages (do this gradually)
# From: import { Button } from '@/components/ui/Button'
# To:   import { Button } from '@uptune/ui'
```

### Phase 2: Extract Shared Packages (Week 2)

#### 2.1 UI Components
```bash
# Copy common components to UI package
mkdir -p packages/ui/src/components

# Move shared components
mv apps/weddings/src/components/ui/Button.tsx packages/ui/src/components/
mv apps/weddings/src/components/ui/Card.tsx packages/ui/src/components/
mv apps/weddings/src/components/ui/Modal.tsx packages/ui/src/components/

# Create exports
echo 'export * from "./Button"' >> packages/ui/src/components/index.ts
```

#### 2.2 Authentication
```bash
# Move auth logic
mkdir -p packages/auth/src
mv apps/weddings/src/lib/firebase.ts packages/auth/src/
mv apps/weddings/src/contexts/AuthContext.tsx packages/auth/src/
mv apps/weddings/src/lib/auth-*.ts packages/auth/src/
```

#### 2.3 Music Features
```bash
# Move music-related code
mkdir -p packages/music-core/src
mv apps/weddings/src/lib/spotify-*.ts packages/music-core/src/
mv apps/weddings/src/components/MusicPlayer.tsx packages/music-core/src/
mv apps/weddings/src/components/SongSearch.tsx packages/music-core/src/
```

### Phase 3: Create New Apps (Week 3-4)

#### 3.1 Hub App
```bash
cd apps/hub
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Install shared packages
pnpm add @uptune/ui @uptune/auth @uptune/types
```

#### 3.2 Teams App
```bash
cd ../teams
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Copy relevant features from weddings
cp -r ../weddings/src/components/SongSearch.tsx src/components/
# Modify for teams context
```

### Phase 4: Setup Infrastructure (Week 4)

#### 4.1 Environment Variables
Create `.env.local` files for each app:

```bash
# apps/hub/.env.local
NEXT_PUBLIC_PRODUCT=hub
NEXT_PUBLIC_FIREBASE_PROJECT_ID=uptune-hub-prod
# ... other Firebase config

# apps/weddings/.env.local
NEXT_PUBLIC_PRODUCT=weddings
NEXT_PUBLIC_FIREBASE_PROJECT_ID=weddings-uptune-d12fa
# ... existing Firebase config

# apps/teams/.env.local
NEXT_PUBLIC_PRODUCT=teams
NEXT_PUBLIC_FIREBASE_PROJECT_ID=uptune-teams-prod
# ... new Firebase config
```

#### 4.2 Vercel Setup
```bash
# Link each app to Vercel
cd apps/hub
vercel link

cd ../weddings
vercel link

cd ../teams
vercel link
```

## 🔧 Common Issues & Solutions

### Issue: Import Errors
**Problem**: `Cannot find module '@uptune/ui'`
**Solution**: 
```bash
# From monorepo root
pnpm install
pnpm build --filter=@uptune/ui
```

### Issue: TypeScript Errors
**Problem**: Types not recognized across packages
**Solution**:
```json
// In app's tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@uptune/ui": ["../../packages/ui/src"],
      "@uptune/auth": ["../../packages/auth/src"],
      "@uptune/types": ["../../packages/types/src"]
    }
  }
}
```

### Issue: Build Failures
**Problem**: Turbo not building dependencies
**Solution**:
```bash
# Clear cache and rebuild
pnpm clean
pnpm install
pnpm build
```

## 📝 Checklist

### Week 1
- [ ] Run setup script
- [ ] Copy wedding app to monorepo
- [ ] Update package.json configurations
- [ ] Test wedding app runs in monorepo

### Week 2
- [ ] Extract UI components
- [ ] Extract auth logic
- [ ] Extract music features
- [ ] Update imports in wedding app

### Week 3
- [ ] Create hub app structure
- [ ] Create teams app structure
- [ ] Set up shared routing
- [ ] Implement cross-product navigation

### Week 4
- [ ] Configure Vercel deployments
- [ ] Set up CI/CD
- [ ] Test all apps
- [ ] Deploy to staging

## 🎯 Success Criteria

- ✅ All apps run independently
- ✅ Shared code is properly extracted
- ✅ No duplicate code between apps
- ✅ CI/CD pipeline works
- ✅ All apps deploy successfully

## 🆘 Need Help?

1. Check the monorepo docs: `docs/README.md`
2. Run diagnostics: `pnpm turbo run lint test`
3. Clear everything: `pnpm clean && pnpm install`