# Uptune Coding Standards

## Overview
These standards apply to all Uptune applications to ensure consistency, maintainability, and quality across our codebase.

## 🎯 Core Principles

1. **Type Safety First** - Use TypeScript strictly, avoid `any`
2. **Consistency** - Follow established patterns within each app
3. **Simplicity** - Prefer simple, readable solutions
4. **Performance** - Consider performance implications
5. **User Experience** - Prioritize user-facing features

## 📁 Project Structure

### Monorepo Structure (Future)
```
uptune-monorepo/
├── apps/           # Applications
├── packages/       # Shared packages
└── services/       # Shared services
```

### App Structure (Current)
```
app-name/
├── src/
│   ├── app/        # Next.js app router
│   ├── components/ # React components
│   ├── lib/        # Utilities and helpers
│   ├── hooks/      # Custom React hooks
│   ├── types/      # TypeScript types
│   └── styles/     # Global styles
├── public/         # Static assets
└── tests/          # Test files
```

## 🔧 Technical Standards

### TypeScript
```typescript
// ✅ Good - Explicit types
interface User {
  id: string
  email: string
  name: string
}

// ❌ Bad - Using any
const processData = (data: any) => { ... }

// ✅ Good - Type narrowing
const processData = (data: unknown) => {
  if (typeof data === 'string') { ... }
}
```

### React Components
```typescript
// ✅ Good - Typed props with interface
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}

// ❌ Bad - Inline prop types
export function Button({ onClick, children }: { onClick: any, children: any }) { ... }
```

### State Management
- Use React hooks for local state
- Use Context API for cross-component state
- Consider Zustand for complex app state
- Keep state as close to usage as possible

### API Calls
```typescript
// ✅ Good - Typed API responses
interface ApiResponse<T> {
  data: T
  error?: string
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  try {
    const res = await fetch(`/api/users/${id}`)
    const data = await res.json()
    return { data }
  } catch (error) {
    return { data: null, error: error.message }
  }
}
```

### Error Handling
```typescript
// ✅ Good - Comprehensive error handling
try {
  const result = await riskyOperation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: error.message }
}
```

## 🎨 UI/UX Standards

### Styling
- Use Tailwind CSS for styling
- Avoid inline styles except for dynamic values
- Create reusable component classes
- Follow mobile-first approach

### Component Patterns
```typescript
// ✅ Good - Composable components
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>

// ✅ Good - Consistent prop naming
<Button 
  onClick={handleClick}
  isLoading={loading}
  isDisabled={disabled}
>
  Submit
</Button>
```

### Accessibility
- Always include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

## 🚀 Performance Guidelines

### Code Splitting
```typescript
// ✅ Good - Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />
})
```

### Optimization
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images with next/image
- Minimize bundle size

## 🧪 Testing Standards

### Unit Tests
- Test business logic separately
- Mock external dependencies
- Aim for 80% coverage on critical paths

### Integration Tests
- Test user workflows
- Verify API integrations
- Test error scenarios

## 📝 Code Review Checklist

Before submitting PR:
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (warnings are ok for now)
- [ ] No `console.log` in production code
- [ ] API calls have error handling
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] Accessibility considered

## 🔄 Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements
- `docs/description` - Documentation

### Commit Messages
```
type: Brief description

- Detailed explanation if needed
- List of changes

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: feat, fix, docs, style, refactor, test, chore

## 🔗 Shared Resources

### Utilities to Share
- Authentication helpers
- API client wrapper
- Common TypeScript types
- Date/time utilities
- Validation functions

### UI Components to Share
- Button, Input, Card
- Modal, Dialog
- Navigation components
- Loading states
- Error boundaries

## 🚦 Migration Path

1. **Phase 1**: Apply standards to new code
2. **Phase 2**: Gradually refactor existing code
3. **Phase 3**: Extract shared utilities
4. **Phase 4**: Move to monorepo structure

---

Remember: These are guidelines, not rigid rules. Use your judgment and prioritize shipping quality features to users.