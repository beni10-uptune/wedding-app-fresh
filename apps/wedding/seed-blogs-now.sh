#!/bin/bash

echo "🎵 Seeding blog posts to production..."
echo ""

curl -X POST https://weddings.uptune.xyz/api/seed-blogs \
  -H "Content-Type: application/json" \
  -d '{"secret": "uptune-seed-2025"}' \
  | python3 -m json.tool

echo ""
echo "✅ Done! Check the blog posts at:"
echo "   - https://weddings.uptune.xyz/blog/category/music-by-genre"
echo "   - https://weddings.uptune.xyz/blog/best-hip-hop-wedding-songs-2025"
echo "   - https://weddings.uptune.xyz/blog/best-country-wedding-songs-2025"
echo "   - https://weddings.uptune.xyz/blog/best-rnb-wedding-songs-2025"
echo "   - https://weddings.uptune.xyz/blog/best-rock-wedding-songs-2025"
echo "   - https://weddings.uptune.xyz/blog/best-indie-wedding-songs-2025"