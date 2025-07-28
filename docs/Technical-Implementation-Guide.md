# Technical Implementation Guide: Onboarding Fix & Optimization

## Priority 1: Critical Fixes (Fix Today)

### 1. Deploy Firestore Rules
The Firestore rules are already in the repository but may not be deployed.

```bash
# Deploy the rules immediately
firebase deploy --only firestore:rules
```

### 2. Fix Authentication Flow in Signup

**File**: `/src/app/auth/signup/page.tsx`

**Current Issue**: After signup, the auth observer redirects before the user document is fully created.

**Fix**:
```typescript
// In handleSignup function, after createUserWithEmailAndPassword:

// Wait for the user document to be created
await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  email: user.email,
  displayName,
  partnerName,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  onboardingCompleted: false,
});

// Don't rely on onAuthStateChanged for navigation
// Instead, navigate directly after successful creation
router.push('/create-wedding');
```

### 3. Fix Data Flow Between Signup and Wedding Creation

**File**: `/src/app/create-wedding/page.tsx`

**Add at the beginning of the component**:
```typescript
// Load user data to pre-populate fields
useEffect(() => {
  const loadUserData = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Pre-populate form data
        setFormData(prev => ({
          ...prev,
          partnerName1: userData.displayName || '',
          partnerName2: userData.partnerName || ''
        }));
      }
    }
  };
  loadUserData();
}, [user]);
```

### 4. Fix Scroll Position Issue

**Add to each step transition**:
```typescript
const nextStep = () => {
  setCurrentStep(prev => prev + 1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

### 5. Replace Alert Error Handling

**Create a Toast component**: `/src/components/ui/toast.tsx`
```typescript
import { useState, useEffect } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'error' | 'success' | 'info';
  }>>([]);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return { toasts, showToast };
}
```

### 6. Fix Permission Error on Wedding Creation

**File**: `/src/app/create-wedding/page.tsx`

**Current issue**: The batch write might be failing due to security rules.

**Fix the wedding creation logic**:
```typescript
try {
  // Create wedding document first
  const weddingData = {
    ...formData,
    owners: [user.uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: user.uid,
    tier: 'free',
    paymentStatus: 'pending'
  };

  const weddingRef = await addDoc(collection(db, 'weddings'), weddingData);
  const weddingId = weddingRef.id;

  // Create playlists separately (not in batch)
  for (const playlist of playlists) {
    await addDoc(collection(db, 'weddings', weddingId, 'playlists'), {
      ...playlist,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  // Update user's onboarding status
  await updateDoc(doc(db, 'users', user.uid), {
    onboardingCompleted: true,
    activeWeddingId: weddingId,
    updatedAt: serverTimestamp()
  });

  // Navigate to success
  router.push('/dashboard');
} catch (error) {
  console.error('Error creating wedding:', error);
  // Show user-friendly error
  if (error.code === 'permission-denied') {
    showToast('Please make sure you are logged in. Try refreshing the page.', 'error');
  } else {
    showToast('Something went wrong. Please try again.', 'error');
  }
}
```

## Priority 2: Quick UX Wins (This Week)

### 1. Add Progress Indicator

**Create component**: `/src/components/onboarding/ProgressBar.tsx`
```typescript
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-white/60 mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

### 2. Add Loading States

**Update buttons during async operations**:
```typescript
const [isCreating, setIsCreating] = useState(false);

const handleCreateWedding = async () => {
  setIsCreating(true);
  try {
    // ... creation logic
  } finally {
    setIsCreating(false);
  }
};

// In the button
<button 
  disabled={isCreating}
  className="btn-primary disabled:opacity-50"
>
  {isCreating ? (
    <>
      <Loader2 className="animate-spin mr-2" size={20} />
      Creating your wedding...
    </>
  ) : (
    'Create Wedding'
  )}
</button>
```

### 3. Add Skip Options

**Add to non-essential fields**:
```typescript
<button
  type="button"
  onClick={() => nextStep()}
  className="text-white/60 hover:text-white text-sm"
>
  Skip for now →
</button>
```

### 4. Session Persistence

**Add to create-wedding page**:
```typescript
// Save progress to localStorage
useEffect(() => {
  const saveProgress = () => {
    if (user) {
      localStorage.setItem(`wedding-draft-${user.uid}`, JSON.stringify({
        formData,
        currentStep,
        timestamp: Date.now()
      }));
    }
  };
  
  const debounced = debounce(saveProgress, 1000);
  debounced();
  
  return () => debounced.cancel();
}, [formData, currentStep, user]);

// Load saved progress
useEffect(() => {
  if (user) {
    const saved = localStorage.getItem(`wedding-draft-${user.uid}`);
    if (saved) {
      const { formData: savedData, currentStep: savedStep } = JSON.parse(saved);
      setFormData(savedData);
      setCurrentStep(savedStep);
    }
  }
}, [user]);
```

## Priority 3: Testing Checklist

### Manual Testing Steps:
1. **Test Signup Flow**:
   - [ ] Create account with email/password
   - [ ] Verify no re-login required
   - [ ] Check data pre-population in wedding creation
   - [ ] Test Google OAuth signup

2. **Test Wedding Creation**:
   - [ ] Complete all steps
   - [ ] Verify wedding document created in Firestore
   - [ ] Check playlists subcollection
   - [ ] Confirm redirect to dashboard

3. **Test Error Cases**:
   - [ ] Network disconnection
   - [ ] Invalid data
   - [ ] Duplicate email
   - [ ] Session timeout

4. **Test Mobile**:
   - [ ] Keyboard behavior
   - [ ] Scroll position
   - [ ] Touch targets
   - [ ] Form validation

### Automated Testing:
```typescript
// Add to __tests__/onboarding.test.ts
describe('Onboarding Flow', () => {
  it('should create user and wedding without re-login', async () => {
    // Test implementation
  });
  
  it('should handle permission errors gracefully', async () => {
    // Test implementation
  });
  
  it('should persist form data between steps', async () => {
    // Test implementation
  });
});
```

## Deployment Steps

1. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Deploy Code Changes**:
   ```bash
   git add .
   git commit -m "Fix critical onboarding issues"
   git push origin main
   ```

3. **Verify in Production**:
   - Test complete flow on production
   - Monitor error logs
   - Check analytics for drop-offs

## Monitoring & Analytics

### Add Event Tracking:
```typescript
// Track each step
const trackOnboardingStep = (step: string, data?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'onboarding_step', {
      step_name: step,
      ...data
    });
  }
};

// Usage
trackOnboardingStep('signup_started');
trackOnboardingStep('signup_completed', { method: 'email' });
trackOnboardingStep('wedding_creation_started');
trackOnboardingStep('wedding_creation_completed', { 
  moments_selected: selectedMoments.length 
});
```

### Error Tracking:
```typescript
// Add to error handlers
const trackError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: `${context}: ${error.message}`,
      fatal: false
    });
  }
};
```

## Next Steps

After implementing these critical fixes:

1. **Monitor Success Metrics**:
   - Signup completion rate
   - Wedding creation success rate
   - Time to complete onboarding
   - Error rates

2. **Gather User Feedback**:
   - Add feedback widget
   - Conduct user interviews
   - Review support tickets

3. **Iterate Based on Data**:
   - A/B test form variations
   - Optimize for mobile
   - Reduce steps further

4. **Plan Phase 2 Features**:
   - Interactive demo
   - AI-powered suggestions
   - Social login optimization