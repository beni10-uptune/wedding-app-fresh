# 🚨 QUICK FIX: Deploy Firestore Rules Now

The "missing permissions" error is happening because the Firestore security rules haven't been deployed to your Firebase project.

## Fix in 3 Steps (2 minutes)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```
(This opens a browser - login with your Firebase account)

### Step 3: Deploy the Rules
```bash
cd /Users/bensmith/Desktop/wedding-app-fresh
firebase deploy --only firestore:rules
```

## That's it! ✅

The permissions error should now be fixed. Try the signup flow again.

---

## If You Get Errors:

### "No project active"
```bash
# List your projects
firebase projects:list

# Select your project
firebase use your-project-id
```

### "firebase.json not found"
```bash
# Initialize Firebase first
firebase init

# Select:
# - Firestore (press SPACE to select, then ENTER)
# - Use existing project
# - Accept default file names
```

### Still Having Issues?

1. Check Firebase Console → Firestore → Rules
2. Make sure the rules show the playlists subcollection rules
3. Try a hard refresh in your browser (Cmd+Shift+R)

The key is getting those `firestore.rules` deployed to your Firebase project!