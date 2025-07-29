// Copy and paste this entire script into Firebase Console
// Go to: Firebase Console → Firestore → Click the three dots → Open in Cloud Shell
// Then paste this script

const authors = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    bio: 'Wedding music expert and content strategist at UpTune.',
    avatar: '/images/authors/sarah-mitchell.jpg',
    email: 'sarah@uptune.xyz'
  },
  {
    id: 'uptune-team',
    name: 'UpTune Team',
    bio: 'The UpTune team is dedicated to helping couples create their perfect wedding soundtrack.',
    avatar: '/images/authors/uptune-team.jpg',
    email: 'team@uptune.xyz'
  }
];

// Create authors
authors.forEach(author => {
  db.collection('blogAuthors').doc(author.id).set({
    ...author,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
});

// For blog posts, you'll need to create them manually in the console
// Here are the document IDs and key fields:

console.log(`
Create these documents in the 'blogPosts' collection:

1. Document ID: complete-guide-wedding-music-planning
   - title: "The Complete Guide to Wedding Music Planning: Create Your Perfect Soundtrack"
   - excerpt: "Learn how to create the perfect soundtrack for every moment of your wedding day with our comprehensive music planning guide."
   - authorId: "sarah-mitchell"
   - category: "Music Planning"
   - status: "published"
   - featuredImage: "/images/blog/wedding_music_planning_guide.png"
   - readTime: 12

2. Document ID: perfect-wedding-timeline
   - title: "How to Create the Perfect Wedding Timeline with Music: A Step-by-Step Guide"
   - excerpt: "Design a flawless wedding day timeline with perfectly timed music for each special moment."
   - authorId: "uptune-team"
   - category: "Planning Resources"
   - status: "published"
   - featuredImage: "/images/blog/wedding_timeline_music.png"
   - readTime: 10

3. Document ID: 10-ways-guest-music-selection
   - title: "10 Ways to Get Your Wedding Guests Involved in Music Selection"
   - excerpt: "Discover creative ways to include your guests in choosing your wedding music while maintaining your vision."
   - authorId: "sarah-mitchell"
   - category: "Guest Experience"
   - status: "published"
   - featuredImage: "/images/blog/guests_music_collaboration.png"
   - readTime: 8

4. Document ID: real-wedding-sarah-tom
   - title: "Real Wedding: How Sarah & Tom Created Their Perfect Soundtrack with UpTune"
   - excerpt: "Follow Sarah and Tom's journey as they navigated different musical tastes to create a wedding playlist that had everyone dancing."
   - authorId: "uptune-team"
   - category: "Real Weddings"
   - status: "published"
   - featuredImage: "/images/blog/sarah_tom_wedding_story.png"
   - readTime: 7

5. Document ID: wedding-reception-music-guide
   - title: "Wedding Reception Music: From Cocktail Hour to Last Dance"
   - excerpt: "Master the art of reception music planning with this detailed guide."
   - authorId: "sarah-mitchell"
   - category: "Reception Planning"
   - status: "published"
   - featuredImage: "/images/blog/reception_music_guide.png"
   - readTime: 9
`);