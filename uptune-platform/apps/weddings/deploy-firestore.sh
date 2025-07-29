#!/bin/bash

echo "🚀 Deploying Firestore rules and indexes to weddings-uptune-d12fa..."
echo ""

# Check if user is authenticated
echo "Checking authentication status..."
if npx firebase projects:list > /dev/null 2>&1; then
    echo "✅ Authentication verified"
else
    echo "❌ Not authenticated. Please run: npx firebase login"
    exit 1
fi

# Deploy Firestore rules and indexes
echo ""
echo "📝 Deploying Firestore rules and indexes..."
npx firebase deploy --only firestore --project weddings-uptune-d12fa

# Check deployment status
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Next steps:"
    echo "1. Check index status at: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/indexes"
    echo "2. Wait 5-10 minutes for indexes to build"
    echo "3. Test the app at your deployed URL"
else
    echo ""
    echo "❌ Deployment failed. Please check the error messages above."
    echo ""
    echo "Common fixes:"
    echo "1. Run: npx firebase login --reauth"
    echo "2. Check your internet connection"
    echo "3. Verify project access permissions"
fi