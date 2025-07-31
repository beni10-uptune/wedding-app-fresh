# Uptune Apps - Multi-Project Context for Claude

<!-- Last Updated: 2025-01-30 -->

## Apps Overview

### 1. Wedding App (Current)
- **Location**: `/wedding-app-fresh`
- **URL**: weddings.uptune.xyz
- **Stack**: Next.js 15, TypeScript, Firebase, Spotify API
- **Purpose**: Wedding planning with custom playlists

### 2. Uptune App
- **Location**: `/uptune-app` (to be managed)
- **URL**: uptune.xyz
- **Stack**: TBD
- **Purpose**: Main music platform

## Monorepo Architecture (Planned)
```
uptune-monorepo/
├── apps/
│   ├── wedding/      # Wedding planning app
│   ├── uptune/       # Main uptune platform
│   └── admin/        # Admin dashboard
├── packages/
│   ├── ui/           # Shared UI components
│   ├── utils/        # Shared utilities
│   ├── types/        # Shared TypeScript types
│   ├── config/       # Shared configs (ESLint, TS, etc.)
│   └── api-client/   # Shared API client
└── services/
    ├── auth/         # Shared auth service
    └── music/        # Shared music/Spotify service
```

## 🚨 Critical Information - Read First

### Recent Issues & Fixes
- **2025-01-30**: Fixed Next.js 15 async params in dynamic routes - use `use()` hook to unwrap Promise-based params
- **Known ESLint warnings**: Multiple `@typescript-eslint/no-explicit-any` warnings exist but don't block builds

### Before Every Commit
1. Run `npm run build` to check for compilation errors
2. Run `npm run lint` to check for linting issues
3. Fix any blocking errors (warnings can be addressed later)

## Important Technical Details

### Next.js 15 Considerations
- This project uses Next.js 15.3.5
- Dynamic route params are now Promise-based in Next.js 15
- Use the `use()` hook to unwrap params in client components:
  ```typescript
  import { use } from 'react'
  
  export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    // ...
  }
  ```

### Build and Lint Commands
- **Build**: `npm run build`
- **Lint**: `npm run lint` 
- **Dev**: `npm run dev`
- **Type Check**: The build command includes type checking

Always run these commands before committing to ensure code quality.

### Key Technologies
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS
- **Music Integration**: Spotify Web API
- **Payments**: Stripe
- **Deployment**: Vercel

### Project Structure
- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and shared logic
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks

### Key Features
- Custom wedding URL slugs (e.g., weddings.uptune.xyz/john-and-jane)
- Multi-tier subscription system (Free, Starter, Professional, Ultimate)
- Spotify playlist creation and management
- Guest song submissions
- Wedding moment-based playlists
- AI-powered song recommendations
- Collaborative playlist building

### Environment Variables
The project uses various environment variables for:
- Firebase configuration
- Spotify API credentials
- Stripe API keys
- Other service integrations

### Common Tasks
1. **Creating a new page**: Add to `/src/app` directory following Next.js conventions
2. **Adding API routes**: Create route handlers in `/src/app/api`
3. **Working with Firebase**: Use helper functions in `/src/lib/firestore-helpers.ts`
4. **Spotify integration**: Check `/src/lib/spotify.ts` for API helpers

### Code Style
- Use TypeScript strictly - avoid `any` types
- Follow existing patterns for components and hooks
- Keep components focused and reusable
- Use Tailwind CSS for styling
- No unnecessary comments in code

## 📝 Development Log

### Recent Changes
<!-- Add new entries at the top -->
- **2025-01-30**: Updated CLAUDE.md for multi-app management
- **2025-01-30**: Fixed build errors and added slug property to Wedding type
- **2025-01-30**: Added CLAUDE.md documentation
- **2025-01-30**: Fixed Next.js 15 async params in [slug]/page.tsx

### TODO/Known Issues
- [ ] Address ESLint warnings (non-blocking)
- [ ] Set up shared utilities package
- [ ] Migrate Uptune app to this workspace
- [ ] Create unified auth system across apps

## 🔧 Quick Reference

### Common Patterns

#### Dynamic Routes in Next.js 15
```typescript
// Client Component
import { use } from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  // ...
}

// Server Component
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // ...
}
```

#### Firebase Operations
```typescript
// Always use helpers from /src/lib/firestore-helpers.ts
import { getDocument, updateDocument } from '@/lib/firestore-helpers'
```

### Debugging Commands
- Check TypeScript errors: `npx tsc --noEmit`
- Run specific linter: `npx eslint src/app/[slug]/page.tsx`
- Test build locally: `npm run build && npm run start`

### Deployment
- Auto-deploys to Vercel on push to `main` branch
- Preview deployments created for pull requests

## 📦 Shared Utilities

The `/src/shared` directory contains utilities that will be shared across all Uptune apps:

### Available Utilities
```typescript
import { 
  // Date utilities
  formatDate, formatDateTime, getRelativeTime,
  
  // String utilities  
  slugify, truncate, formatCurrency, isValidEmail,
  
  // Hooks
  useDebounce,
  
  // Types
  ApiResponse, PaginatedResponse,
  
  // Constants
  ROUTES, API_ENDPOINTS, HTTP_STATUS
} from '@/shared'
```

### Migration Path
1. Currently lives in wedding app at `/src/shared`
2. Will be extracted to `@uptune/shared` package
3. Eventually part of monorepo at `/packages/shared`