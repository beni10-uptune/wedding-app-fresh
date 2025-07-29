#!/bin/bash

# UpTune Platform Monorepo Setup Script
# This script creates the complete monorepo structure for UpTune

set -e  # Exit on error

echo "🚀 Setting up UpTune Platform Monorepo..."

# Navigate to Desktop
cd ~/Desktop

# Create monorepo with Turborepo
echo "📦 Creating Turborepo structure..."
npx create-turbo@latest uptune-platform --use-pnpm --example basic

cd uptune-platform

# Remove example apps
echo "🧹 Cleaning up example apps..."
rm -rf apps/web apps/docs packages/eslint-config-custom

# Create app directories
echo "📁 Creating app directories..."
mkdir -p apps/hub
mkdir -p apps/weddings
mkdir -p apps/teams
mkdir -p apps/celebrations
mkdir -p apps/admin

# Create package directories
echo "📦 Creating package directories..."
mkdir -p packages/ui/src/components
mkdir -p packages/ui/src/styles
mkdir -p packages/auth/src
mkdir -p packages/music-core/src
mkdir -p packages/database/src
mkdir -p packages/analytics/src
mkdir -p packages/config/src
mkdir -p packages/types/src

# Create infrastructure directories
mkdir -p infrastructure/firebase
mkdir -p infrastructure/vercel
mkdir -p infrastructure/scripts
mkdir -p docs

# Create root configuration files
echo "⚙️  Creating root configuration files..."

# Root package.json
cat > package.json << 'EOF'
{
  "name": "uptune-platform",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "clean": "turbo clean && rm -rf node_modules",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo build --filter=docs^... && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.2",
    "eslint": "^8.48.0",
    "prettier": "^3.0.3",
    "turbo": "latest",
    "typescript": "^5.2.2"
  },
  "packageManager": "pnpm@8.15.1",
  "engines": {
    "node": ">=18"
  }
}
EOF

# Turbo configuration
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": [],
      "cache": false
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint"]
    },
    "clean": {
      "cache": false
    }
  }
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# turbo
.turbo

# vercel
.vercel

# typescript
*.tsbuildinfo
dist

# firebase
.firebase/
*-debug.log
firebase-debug.log
firestore-debug.log
firebase-export*

# IDE
.idea
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# OS
.DS_Store
Thumbs.db
EOF

# Create workspace settings for VS Code/Cursor
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.workingDirectories": [
    { "pattern": "apps/*/" },
    { "pattern": "packages/*/" }
  ],
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/.turbo": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
EOF

# Create workspace file
cat > uptune.code-workspace << 'EOF'
{
  "folders": [
    {
      "name": "🏠 Platform Root",
      "path": "."
    },
    {
      "name": "🌐 Hub",
      "path": "apps/hub"
    },
    {
      "name": "💑 Weddings",
      "path": "apps/weddings"
    },
    {
      "name": "👥 Teams",
      "path": "apps/teams"
    },
    {
      "name": "🎊 Celebrations",
      "path": "apps/celebrations"
    },
    {
      "name": "🛠️ Admin",
      "path": "apps/admin"
    },
    {
      "name": "🎨 UI Package",
      "path": "packages/ui"
    },
    {
      "name": "🔐 Auth Package",
      "path": "packages/auth"
    },
    {
      "name": "🎵 Music Core",
      "path": "packages/music-core"
    }
  ],
  "settings": {
    "typescript.enablePromptUseWorkspaceTsdk": true
  }
}
EOF

# Create README
cat > README.md << 'EOF'
# UpTune Platform

Bringing people together through music.

## 🏗 Architecture

This is a monorepo containing all UpTune products and shared packages.

### Apps

- `hub` - Central UpTune platform (uptune.xyz)
- `weddings` - Wedding music planning (weddings.uptune.xyz)
- `teams` - Team building through music (teams.uptune.xyz)
- `celebrations` - Life celebrations & memorials (celebrations.uptune.xyz)
- `admin` - Internal admin dashboard (admin.uptune.xyz)

### Packages

- `ui` - Shared React components
- `auth` - Authentication and authorization
- `music-core` - Music features (Spotify, playlists, search)
- `database` - Database schemas and utilities
- `analytics` - Analytics integration
- `config` - Shared configuration
- `types` - Shared TypeScript types

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Run specific app
pnpm dev --filter=hub
pnpm dev --filter=weddings

# Build all apps
pnpm build

# Run tests
pnpm test
```

## 📁 Project Structure

```
uptune-platform/
├── apps/
│   ├── hub/
│   ├── weddings/
│   ├── teams/
│   ├── celebrations/
│   └── admin/
├── packages/
│   ├── ui/
│   ├── auth/
│   ├── music-core/
│   ├── database/
│   ├── analytics/
│   ├── config/
│   └── types/
├── infrastructure/
│   ├── firebase/
│   ├── vercel/
│   └── scripts/
└── docs/
```

## 🛠 Development

### Adding a new app

```bash
cd apps
pnpm create next-app@latest new-app --typescript --tailwind --app
```

### Adding a new package

```bash
cd packages
mkdir new-package
cd new-package
pnpm init
```

## 📝 Commit Convention

- `feat(app):` - New feature for specific app
- `fix(package):` - Bug fix in package
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring

Examples:
- `feat(hub): add musical journey feature`
- `fix(ui): button hover state issue`
- `docs: update deployment guide`
EOF

# Create pnpm workspace
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

# Create prettier config
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
EOF

# Create eslint config
cat > .eslintrc.js << 'EOF'
module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: [
        "plugin:@typescript-eslint/recommended",
      ],
    },
  ],
};
EOF

# Initialize git
echo "🔧 Initializing Git repository..."
git init
git add .
git commit -m "Initial monorepo setup"

# Create packages
echo "📦 Setting up shared packages..."

# UI Package
cat > packages/ui/package.json << 'EOF'
{
  "name": "@uptune/ui",
  "version": "0.0.1",
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "exports": {
    ".": "./src/index.tsx",
    "./styles": "./src/styles/index.css"
  },
  "scripts": {
    "lint": "eslint \"src/**/*.ts*\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "clsx": "^2.0.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.5",
    "@types/react-dom": "^18.2.4",
    "eslint": "^8.48.0",
    "react": "^18.2.0",
    "typescript": "^5.2.2"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

cat > packages/ui/src/index.tsx << 'EOF'
// UI Package - Shared components for all UpTune products
export * from './components/Button'
export * from './components/Card'
export * from './components/Modal'
// Add more exports as components are created
EOF

# Auth Package
cat > packages/auth/package.json << 'EOF'
{
  "name": "@uptune/auth",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint \"src/**/*.ts*\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "firebase": "^10.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.5",
    "eslint": "^8.48.0",
    "typescript": "^5.2.2"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
EOF

# Types Package
cat > packages/types/package.json << 'EOF'
{
  "name": "@uptune/types",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint \"src/**/*.ts*\"",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
EOF

# Create base tsconfig
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "ESNext",
    "lib": ["ESNext"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noImplicitAny": true
  },
  "exclude": ["node_modules", "dist", ".turbo", ".next"]
}
EOF

echo "✅ UpTune Platform monorepo setup complete!"
echo ""
echo "Next steps:"
echo "1. cd ~/Desktop/uptune-platform"
echo "2. pnpm install"
echo "3. cursor ."
echo ""
echo "The monorepo is ready for development! 🚀"