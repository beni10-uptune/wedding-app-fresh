# Shared Utilities

This directory contains utilities, types, and components that will be shared across all Uptune applications.

## Structure

```
shared/
├── utils/       # Utility functions
├── types/       # TypeScript types
├── hooks/       # React hooks
├── constants/   # Shared constants
└── components/  # (future) Shared UI components
```

## Migration Plan

1. **Current Phase**: Code lives in wedding app but follows shared patterns
2. **Extraction Phase**: Move to `@uptune/shared` package
3. **Monorepo Phase**: Part of monorepo packages/

## Usage

```typescript
// Current (within wedding app)
import { formatDate } from '@/shared/utils/date'
import { ApiResponse } from '@/shared/types/api'

// Future (as package)
import { formatDate } from '@uptune/utils'
import { ApiResponse } from '@uptune/types'
```

## Guidelines

- Keep utilities pure and framework-agnostic where possible
- Document all exports with JSDoc
- Include unit tests for utilities
- Avoid app-specific logic