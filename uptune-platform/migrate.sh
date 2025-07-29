#!/bin/bash

echo "🚀 Starting UpTune monorepo migration..."

# Set up directories
MONOREPO_DIR="."
WEDDING_APP_DIR="apps/weddings"

# Create apps directory
mkdir -p "$WEDDING_APP_DIR"

echo "📦 Copying wedding app files..."

# Copy all files from parent directory
cd ..
rsync -av --progress \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='uptune-platform' \
  --exclude='migrate-to-monorepo.sh' \
  --exclude='setup-uptune-platform.sh' \
  --exclude='MIGRATION_GUIDE.md' \
  . "uptune-platform/$WEDDING_APP_DIR/"

cd uptune-platform

echo "📝 Updating wedding app package.json..."

# Update the wedding app's package.json
cd "$WEDDING_APP_DIR"
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.name = '@uptune/weddings';
pkg.dependencies = {
  ...pkg.dependencies,
  '@uptune/ui': 'workspace:*',
  '@uptune/auth': 'workspace:*',
  '@uptune/music-core': 'workspace:*'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Update next.config.js to transpile packages
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@uptune/ui', '@uptune/auth', '@uptune/music-core'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
EOF

cd ../..

echo "🏗️ Creating other app structures..."

# Port counter
port=0

# Create other apps
for app in teams celebrations hub; do
  mkdir -p "apps/$app/app"
  port=$((port + 1))
  
  cat > "apps/$app/package.json" << EOF
{
  "name": "@uptune/$app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 300$port",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@uptune/ui": "workspace:*",
    "@uptune/auth": "workspace:*",
    "@uptune/music-core": "workspace:*",
    "next": "15.1.0",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.378.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "autoprefixer": "^10.4.0",
    "postcss": "^8"
  }
}
EOF

  # Create next.config.js
  cat > "apps/$app/next.config.js" << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@uptune/ui', '@uptune/auth', '@uptune/music-core'],
}

module.exports = nextConfig
EOF

  # Create tailwind.config.js
  cat > "apps/$app/tailwind.config.js" << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

  # Create globals.css
  mkdir -p "apps/$app/app"
  cat > "apps/$app/app/globals.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

  # Create a basic page
  cat > "apps/$app/app/page.tsx" << EOF
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          UpTune for ${app^}
        </h1>
        <p className="text-xl text-gray-600">Coming Soon</p>
      </div>
    </div>
  )
}
EOF

  # Create layout
  cat > "apps/$app/app/layout.tsx" << 'EOF'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

  # Create tsconfig.json
  cat > "apps/$app/tsconfig.json" << 'EOF'
{
  "extends": "../../tsconfig.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

done

echo "📋 Creating shared UI components..."

# Create more UI components
cat > "packages/ui/src/components/Card.tsx" << 'EOF'
import React from 'react'
import { cn } from '../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-gray-200 shadow-sm',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-6',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
EOF

cat > "packages/ui/src/components/Input.tsx" << 'EOF'
import React from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
EOF

echo "🔧 Creating shared tsconfig files..."

# Create shared TypeScript configs
mkdir -p packages/config
cat > "packages/config/tsconfig.base.json" << 'EOF'
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@uptune/ui": ["../../packages/ui/src"],
      "@uptune/auth": ["../../packages/auth/src"],
      "@uptune/music-core": ["../../packages/music-core/src"]
    }
  },
  "exclude": ["node_modules"]
}
EOF

echo "📝 Creating GitHub Actions workflow..."

mkdir -p .github/workflows
cat > ".github/workflows/ci.yml" << 'EOF'
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run lint
        run: npm run lint
        
      - name: Run build
        run: npm run build
        
      - name: Run tests
        run: npm run test
EOF

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. npm install"
echo "2. npm run dev (to run all apps)"
echo ""
echo "Apps will run on:"
echo "- Weddings: http://localhost:3000"
echo "- Teams: http://localhost:3001"
echo "- Celebrations: http://localhost:3002"
echo "- Hub: http://localhost:3003"