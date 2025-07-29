#!/bin/bash

# Get Firebase auth token
TOKEN=$(firebase auth:print-access-token)
PROJECT_ID="weddings-uptune-d12fa"

# Function to update a blog post
update_blog_post() {
  local slug=$1
  local image=$2
  
  echo "Updating $slug..."
  
  curl -X PATCH \
    "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/blogPosts/$slug?updateMask.fieldPaths=featuredImage" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"fields\": {
        \"featuredImage\": {
          \"stringValue\": \"$image\"
        }
      }
    }"
    
  echo ""
}

# Update each blog post
update_blog_post "complete-guide-wedding-music-planning" "/images/blog/wedding_music_planning_guide.png"
update_blog_post "perfect-wedding-timeline" "/images/blog/wedding_timeline_music.png"
update_blog_post "10-ways-guest-music-selection" "/images/blog/guests_music_collaboration.png"
update_blog_post "real-wedding-sarah-tom" "/images/blog/sarah_tom_wedding_story.png"
update_blog_post "wedding-reception-music-guide" "/images/blog/reception_music_guide.png"

echo "✨ All blog images updated!"