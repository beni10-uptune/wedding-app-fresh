# Freemium Implementation TODO

## Completed ✅

1. **Homepage Updates**
   - Removed fake testimonials and social proof
   - Added authentic, product-focused copy
   - Created free vs paid tier comparison
   - Added "Try it Free" CTAs throughout
   - Moved pricing to dedicated section

2. **Core Infrastructure**
   - Created subscription tier definitions
   - Built upgrade modal component
   - Added song limit checking in QuickAddSongModal
   - Updated create-wedding flow to skip payment
   - Added free tier notices to dashboard

## Still Needed 🚧

### 1. **Guest Limit Enforcement**
```typescript
// In guest invitation flow
const guestCount = await getGuestCount(weddingId)
if (!isPremium && guestCount >= 5) {
  showUpgradeModal('GUEST_LIMIT')
}
```

### 2. **Export Blocking**
```typescript
// In export page/components
if (!isPremium) {
  showUpgradeModal('EXPORT_BLOCKED')
  return
}
```

### 3. **Co-owner Blocking**
```typescript
// In settings page
if (!isPremium && tryingToAddCoOwner) {
  showUpgradeModal('CO_OWNER_BLOCKED')
}
```

### 4. **Curated Library Access**
```typescript
// In music builder
if (!isPremium && accessingCuratedSongs) {
  showUpgradeModal('LIBRARY_BLOCKED')
}
```

### 5. **Database Updates**
- Add indexes for efficient counting queries
- Consider adding counters to wedding document:
  ```typescript
  interface Wedding {
    // ... existing fields
    counters?: {
      totalSongs: number
      totalGuests: number
      guestSubmissions: number
    }
  }
  ```

### 6. **Analytics & Tracking**
- Track upgrade trigger points
- Monitor conversion rates
- A/B test different limits

### 7. **Payment Flow Updates**
- Add "Upgrade" buttons throughout the app
- Create dedicated upgrade page (not just payment page)
- Show what they're missing on free tier

### 8. **Email Notifications**
- "You're approaching your song limit" email
- "Your guests want to add more songs" email
- "Ready to export?" upgrade prompt

### 9. **Mobile App Updates**
- Ensure upgrade modals work well on mobile
- Test touch interactions
- Verify responsive design

### 10. **Edge Cases**
- What happens if user downgrades? (Not applicable for one-time payment)
- Grandfather existing paid users
- Handle payment failures gracefully

## Implementation Priority

### Phase 1 (Critical)
1. Export blocking - This directly affects revenue
2. Guest limit enforcement - Core freemium feature
3. Update all "Export" buttons to check premium status

### Phase 2 (Important)
1. Co-owner blocking
2. Curated library gating
3. Better upgrade page with benefits

### Phase 3 (Nice to Have)
1. Email notifications
2. Analytics tracking
3. A/B testing framework

## Code Locations

- **Export Features**: `/app/wedding/[id]/export/page.tsx`
- **Guest Management**: `/app/wedding/[id]/guests/page.tsx`
- **Settings (Co-owner)**: `/app/wedding/[id]/settings/page.tsx`
- **Music Builder**: `/app/wedding/[id]/builder/components/`

## Testing Checklist

- [ ] User can create account without payment
- [ ] User can add up to 25 songs
- [ ] User sees upgrade modal at 25 songs
- [ ] User can invite up to 5 guests
- [ ] User sees upgrade modal at 5 guests
- [ ] Export buttons show upgrade modal
- [ ] Co-owner invite shows upgrade modal
- [ ] Upgrade modal has correct trigger message
- [ ] Payment flow works from upgrade modal
- [ ] After payment, all features unlock
- [ ] Song counter shows correct limit/status

## Revenue Impact Estimation

Based on typical freemium conversion rates:
- 2-5% of free users convert to paid
- Upgrade triggers at natural friction points
- Export block likely highest conversion trigger
- Guest limit encourages viral growth