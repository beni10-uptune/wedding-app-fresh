# 🚀 Deploy Firebase Now - Quick Steps

You've logged in via the browser. Now run these commands in your terminal:

## Option 1: Quick Deploy (Recommended)

Open a **new terminal window** and run:

```bash
cd /Users/bensmith/Desktop/wedding-app-fresh
firebase deploy --only firestore --project weddings-uptune-d12fa
```

## Option 2: If Option 1 Fails

Try with npx:

```bash
cd /Users/bensmith/Desktop/wedding-app-fresh
npx firebase login
npx firebase deploy --only firestore --project weddings-uptune-d12fa
```

## Option 3: Manual Deploy via Console

If terminal commands aren't working, use the Firebase Console:

### Deploy Rules:
1. Go to: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/rules
2. The rules are already in your `firestore.rules` file
3. Copy and paste them into the console
4. Click "Publish"

### Deploy Indexes:
1. Go to: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/indexes
2. Use the indexes from `firestore.indexes.json`
3. Create each index manually

## What Will Be Deployed

- **Simplified Firestore rules** that fix the "database not configured" errors
- **9 compound query indexes** for all your queries

## After Deployment

1. Wait 5-10 minutes for indexes to build
2. Check status at: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/indexes
3. Test signup and login on mobile and desktop

## Success Indicators

✅ Rules deployed: Instant effect
✅ Indexes building: Shows "Building" status
✅ Indexes ready: Shows "Enabled" status
✅ App working: No more "database not configured" errors