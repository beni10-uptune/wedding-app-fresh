# Add Spotify Environment Variables to Vercel

## Steps to Configure Spotify in Production

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `wedding-app-fresh`

2. **Navigate to Settings → Environment Variables**
   - Click on your project
   - Go to "Settings" tab
   - Click "Environment Variables" in the left sidebar

3. **Add These Environment Variables**

   ```
   SPOTIFY_CLIENT_ID = 8d5b7f5747fe45debfad6a12ad4d5741
   SPOTIFY_CLIENT_SECRET = e7cdbbbb63b74762bc8e04f056be0a8c
   ```

   For each variable:
   - Name: Enter the variable name (e.g., `SPOTIFY_CLIENT_ID`)
   - Value: Enter the value from above
   - Environment: Select "Production", "Preview", and "Development"
   - Click "Save"

4. **Trigger a Redeploy**
   - After adding the variables, go to the "Deployments" tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"
   - Or just push another commit to trigger automatic deployment

## Verify It's Working

After deployment completes:
1. Visit your production site
2. Go to the landing page with the interactive demo
3. Try searching for "Perfect" or "Ed Sheeran"
4. You should see real Spotify results

## Troubleshooting

If search still doesn't work:
- Check: https://your-app.vercel.app/api/spotify/test
- This will show if credentials are configured correctly
- Check browser console for any errors

## Important Notes

- The `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` is already in your code
- Only the server-side variables need to be added to Vercel
- These are the same credentials from your .env.local file