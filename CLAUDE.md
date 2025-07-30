# Wedding App - Project Context for Claude

## Overview
This is a wedding planning application built with Next.js 15, TypeScript, and Firebase. The app allows couples to create custom wedding playlists with Spotify integration.

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