#!/bin/bash

# Migration helper script for moving wedding app to monorepo
# Run this AFTER setting up the monorepo with setup-uptune-platform.sh

set -e

echo "🚀 Starting migration to UpTune platform monorepo..."

# Check if monorepo exists
if [ ! -d "$HOME/Desktop/uptune-platform" ]; then
    echo "❌ Error: uptune-platform not found. Run setup-uptune-platform.sh first!"
    exit 1
fi

# Check if we're in the wedding-app-fresh directory
if [[ ! "$PWD" =~ wedding-app-fresh$ ]]; then
    echo "❌ Error: Please run this script from the wedding-app-fresh directory"
    exit 1
fi

WEDDING_APP_DIR="$PWD"
MONOREPO_DIR="$HOME/Desktop/uptune-platform"

echo "📁 Source: $WEDDING_APP_DIR"
echo "📁 Target: $MONOREPO_DIR/apps/weddings"

# Create wedding app in monorepo
echo "📦 Copying wedding app to monorepo..."
mkdir -p "$MONOREPO_DIR/apps/weddings"

# Copy all files except git and node_modules
rsync -av --progress \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.turbo' \
    --exclude='setup-uptune-platform.sh' \
    --exclude='migrate-to-monorepo.sh' \
    --exclude='MIGRATION_GUIDE.md' \
    "$WEDDING_APP_DIR/" "$MONOREPO_DIR/apps/weddings/"

cd "$MONOREPO_DIR/apps/weddings"

# Update package.json
echo "📝 Updating package.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' 's/"name": "weddings.uptune.xyz"/"name": "@uptune\/weddings"/' package.json
else
    # Linux
    sed -i 's/"name": "weddings.uptune.xyz"/"name": "@uptune\/weddings"/' package.json
fi

# Create initial shared components structure
echo "🎨 Setting up shared UI components..."
cd "$MONOREPO_DIR"

# Extract Button component as example
if [ -f "apps/weddings/src/components/ui/Button.tsx" ]; then
    mkdir -p packages/ui/src/components/Button
    cp apps/weddings/src/components/ui/Button.tsx packages/ui/src/components/Button/index.tsx
    
    # Create UI package index
    cat > packages/ui/src/index.tsx << 'EOF'
// Shared UI Components
export * from './components/Button'
// Add more components as they are migrated
EOF
fi

# Create migration status file
cat > "$MONOREPO_DIR/MIGRATION_STATUS.md" << 'EOF'
# Migration Status

## ✅ Completed
- [x] Wedding app copied to monorepo
- [x] Package.json updated
- [x] Basic structure created

## 🚧 In Progress
- [ ] Extract shared components to packages/ui
- [ ] Extract auth logic to packages/auth
- [ ] Extract music features to packages/music-core
- [ ] Update all imports

## 📋 TODO
- [ ] Create hub app
- [ ] Create teams app
- [ ] Create celebrations app
- [ ] Set up Vercel projects
- [ ] Configure CI/CD

## 📊 Component Migration Tracker

### UI Components
- [ ] Button
- [ ] Card
- [ ] Modal
- [ ] Form elements
- [ ] Navigation
- [ ] Layouts

### Features
- [ ] Authentication
- [ ] Music search
- [ ] Playlist management
- [ ] Payment processing
- [ ] Analytics

### API Routes
- [ ] Auth endpoints
- [ ] Spotify integration
- [ ] Stripe webhooks
- [ ] Data fetching

Last updated: $(date)
EOF

echo "✅ Migration phase 1 complete!"
echo ""
echo "Next steps:"
echo "1. cd $MONOREPO_DIR"
echo "2. pnpm install"
echo "3. cd apps/weddings && pnpm dev (test that it works)"
echo "4. Start extracting shared components to packages/"
echo ""
echo "Use MIGRATION_STATUS.md to track your progress"