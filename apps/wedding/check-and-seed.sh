#!/bin/bash

echo "🔍 Checking Firebase configuration..."
echo ""

curl -s https://weddings.uptune.xyz/api/check-firebase | python3 -m json.tool

echo ""
echo "📝 Attempting to seed blog posts..."
echo ""

curl -X POST https://weddings.uptune.xyz/api/seed-blogs \
  -H "Content-Type: application/json" \
  -d '{"secret": "uptune-seed-2025"}' | python3 -m json.tool

echo ""
echo "✅ Done!"