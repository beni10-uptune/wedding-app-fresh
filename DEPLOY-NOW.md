# 🚀 Deploy Firestore Rules - 1 Minute Fix

You already have Firebase configured! Just need to deploy the rules.

## Quick Deploy (Copy & Paste These)

```bash
# 1. Make sure you're in the project directory
cd /Users/bensmith/Desktop/wedding-app-fresh

# 2. Deploy the Firestore rules
firebase deploy --only firestore:rules
```

## Expected Output
```
=== Deploying to 'weddings-uptune-d12fa'...

i  deploying firestore
i  firestore: reading indexes from firestore.indexes.json...
i  cloud.firestore: checking firestore.rules for compilation errors...
✔  cloud.firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
✔  firestore: released rules firestore.rules to cloud.firestore

✔  Deploy complete!
```

## Verify It Worked

1. Try the signup flow again
2. You should be able to complete wedding creation without the "missing permissions" error

## If You're Not Logged In

```bash
# Login first
firebase login

# Then deploy
firebase deploy --only firestore:rules
```

That's literally all you need to do! The rules file is already in your project and ready to deploy.