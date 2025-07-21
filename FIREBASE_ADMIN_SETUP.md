# Firebase Admin SDK Setup for Vercel

Your Vercel build is failing because the Firebase Admin SDK requires service account credentials. Follow these steps to fix it:

## 1. Get Your Firebase Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Select your wedding-app project
3. Click the gear icon ⚙️ → "Project settings"
4. Navigate to the "Service accounts" tab
5. Click "Generate new private key"
6. Save the downloaded JSON file securely

## 2. Extract Required Values

Open the downloaded JSON file and find these three values:

```json
{
  "project_id": "your-project-id",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_VERY_LONG_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
}
```

## 3. Add Environment Variables to Vercel

Go to your Vercel project settings → Environment Variables and add:

### FIREBASE_PROJECT_ID
- **Value**: Your project_id from the JSON (e.g., `wedding-app-12345`)
- **Environment**: Production, Preview, Development

### FIREBASE_CLIENT_EMAIL  
- **Value**: Your client_email from the JSON
- **Environment**: Production, Preview, Development

### FIREBASE_PRIVATE_KEY
- **Value**: Your private_key from the JSON
- **Environment**: Production, Preview, Development
- **⚠️ IMPORTANT**: Copy the entire private key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines

## 4. Handling the Private Key in Vercel

The private key contains `\n` characters that need special handling:

1. Copy the entire private key value from your JSON file
2. In Vercel, paste it exactly as it appears in the JSON (with `\n` characters)
3. Our code already handles the conversion: `privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')`

## 5. Redeploy

After adding all three environment variables:
1. Go to your Vercel project
2. Click "Redeploy" 
3. Choose "Redeploy with existing Build Cache" or trigger a new deployment

## Security Notes

- **NEVER** commit the service account JSON file to Git
- Keep your private key secure and only share it through secure channels
- These credentials give admin access to your Firebase project

## Troubleshooting

If the build still fails:
1. Double-check that all three environment variables are set correctly
2. Ensure the private key is copied completely (it's very long)
3. Check that environment variables are available for the deployment environment you're using
4. Try clearing the build cache and redeploying

## Local Development

For local development, create a `.env.local` file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

This file is already in `.gitignore` so it won't be committed.