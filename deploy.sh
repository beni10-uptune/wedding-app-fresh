#!/bin/bash

# Navigate to project directory
cd /Users/bensmith/Desktop/wedding-app-fresh

# Check git status
echo "=== Git Status ==="
git status

# Add all changes
echo -e "\n=== Adding Changes ==="
git add -A

# Create commit
echo -e "\n=== Creating Commit ==="
git commit -m "Implement Google Tag Manager integration

- Created comprehensive GTM component with event tracking helpers
- Added GTM script injection and automatic pageview tracking
- Integrated GTM into root layout with environment variable support
- Added tracking events for user authentication (signup/login)
- Added tracking for payment flows (checkout begin, purchase, refund)
- Updated Stripe webhook to track successful payments and refunds
- Added purchase tracking to payment success page
- Implemented standard GA4 events for automatic Google Analytics integration

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
echo -e "\n=== Pushing to Remote ==="
git push origin main

echo -e "\n=== Done! Changes pushed to Vercel ==="