# Wedding Subdomain Setup Guide

This guide explains how to set up the `weddings.uptune.xyz` subdomain for custom wedding URLs.

## Overview

The app now supports custom wedding URLs like `weddings.uptune.xyz/sarah-and-jane` instead of numeric IDs. This provides a better user experience and makes URLs more memorable for wedding invitations.

## Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_APP_DOMAIN=https://uptune.xyz
NEXT_PUBLIC_WEDDING_DOMAIN=https://weddings.uptune.xyz
```

For local development, the app will automatically use localhost.

## Vercel Setup

### 1. Add Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Domains
3. Add `weddings.uptune.xyz`
4. Choose "Redirect to an existing domain" and select your main domain

### 2. Configure DNS

Add these DNS records to your domain provider:

```
Type: CNAME
Name: weddings
Value: cname.vercel-dns.com
```

Or if using A records:

```
Type: A
Name: weddings
Value: 76.76.21.21
```

### 3. Update Vercel Project Settings

In your `vercel.json` (create if doesn't exist):

```json
{
  "rewrites": [
    {
      "source": "/:slug",
      "destination": "/[slug]",
      "has": [
        {
          "type": "host",
          "value": "weddings.uptune.xyz"
        }
      ]
    }
  ]
}
```

## SEO Considerations

### Robots.txt
The `robots.txt` file already blocks wedding-specific pages from being indexed:
- `/wedding/*/builder/`
- `/wedding/*/settings/`
- `/wedding/*/payment/`

### Slug Pages
The `[slug]` route handles redirects properly:
- Valid wedding slugs redirect to `/join/[weddingId]`
- Invalid slugs redirect to 404
- Uses server-side redirects (good for SEO)

## Security & Access Control

### Existing Protections
1. **Authentication Required**: Wedding management pages require authentication
2. **Owner Verification**: Only wedding owners can access settings
3. **Guest Access**: Public slug URLs only allow joining/viewing, not editing
4. **Rate Limiting**: Consider adding rate limiting to slug lookups to prevent enumeration

### Additional Recommendations
1. Add monitoring for 404s on slug routes to detect potential attacks
2. Consider implementing slug expiration for inactive weddings
3. Add analytics to track slug usage patterns

## Testing Checklist

- [ ] Create wedding with custom slug
- [ ] Access wedding via `weddings.uptune.xyz/custom-slug`
- [ ] Share link copies with correct subdomain
- [ ] Edit slug in settings
- [ ] Verify slug uniqueness validation
- [ ] Test redirect for non-existent slugs
- [ ] Verify all share buttons use correct domain
- [ ] Test in production environment

## Fallback Behavior

If subdomain is not configured or fails:
1. App falls back to main domain with `/join/[id]` URLs
2. Existing ID-based URLs continue to work
3. No data loss or access issues

## Local Development

For local testing, the app automatically uses `localhost:3000` for both main and wedding domains. No special configuration needed.

## Monitoring

Monitor these metrics:
- 404 rate on slug routes
- Slug lookup performance
- Subdomain SSL certificate status
- DNS resolution time