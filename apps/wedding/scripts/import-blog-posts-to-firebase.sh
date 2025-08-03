#!/bin/bash

# Import blog posts to Firebase using the Firebase CLI
echo "🔥 Importing genre blog posts to Firebase..."

# Read the JSON file and import to Firestore
firebase firestore:import src/data/exports/genre-blog-posts.json --collection blogPosts --project weddings-uptune-d12fa

echo "✅ Import completed!"