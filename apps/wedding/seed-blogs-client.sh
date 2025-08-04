#!/bin/bash

echo "📝 Seeding blog posts using client SDK..."
echo ""

curl -X POST https://weddings.uptune.xyz/api/seed-blogs-client \
  -H "Content-Type: application/json" \
  -d '{"secret": "uptune-seed-2025"}' | python3 -m json.tool

echo ""
echo "✅ Done!"