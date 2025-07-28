# Debug Steps for Interactive Demo Search

## 1. Test Spotify API Credentials

Visit this URL in your browser:
```
https://yourapp.vercel.app/api/spotify/test
```

This will tell you if:
- Spotify credentials are configured
- Token generation works
- Basic search works

## 2. Check Browser Console

When searching in the demo:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try searching for "Perfect"
4. Look for:
   - "API response:" log
   - Any error messages

## 3. Current Behavior

The demo now:
- Shows demo songs as fallback when Spotify fails
- Logs the API response for debugging
- Works even without Spotify credentials

## 4. Possible Issues

1. **Spotify credentials not in Vercel environment**
   - Check Vercel dashboard → Settings → Environment Variables
   - Need: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET

2. **API response format mismatch**
   - The search API returns `{ tracks: [...] }` 
   - Each track has different property names than expected

3. **CORS or network issues**
   - Check Network tab in DevTools
   - Look for failed requests to /api/spotify/search

## 5. Quick Fix Applied

The demo now always shows fallback songs when Spotify search fails, so users can still experience the feature even if the API isn't working.

## Next Steps

1. Check `/api/spotify/test` endpoint
2. Verify environment variables in Vercel
3. Check browser console for the actual API response format
4. The demo will work with fallback songs regardless