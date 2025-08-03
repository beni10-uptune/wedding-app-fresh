#!/usr/bin/env tsx

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const app = getApps().length ? getApp() : initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'uptune-428204',
});

const db = getFirestore(app);

interface BlogFrontMatter {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  featuredImage?: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

async function importMarkdownBlogs() {
  console.log('📚 Importing Markdown Blogs to Firestore...\n');

  const contentDir = join(process.cwd(), 'apps/wedding/content/blog');
  const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} markdown files\n`);

  for (const file of files) {
    try {
      const filePath = join(contentDir, file);
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const frontMatter = data as BlogFrontMatter;

      // Extract slug from filename or frontmatter
      const slug = frontMatter.slug || file.replace('.md', '');

      console.log(`📝 Processing: ${frontMatter.title || file}`);

      // Prepare blog post data
      const blogPost = {
        title: frontMatter.title || 'Untitled',
        slug,
        excerpt: frontMatter.excerpt || content.substring(0, 160) + '...',
        content,
        category: frontMatter.category || 'music-planning',
        tags: frontMatter.tags || [],
        status: 'published',
        publishedAt: frontMatter.publishedAt ? new Date(frontMatter.publishedAt) : new Date(),
        featuredImage: frontMatter.featuredImage || `/images/blog/${slug}-hero.jpg`,
        authorId: 'system', // Default author
        readingTime: Math.ceil(content.split(' ').length / 200), // Estimate reading time
        seo: frontMatter.seo || {
          metaTitle: frontMatter.title,
          metaDescription: frontMatter.excerpt || content.substring(0, 160)
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Check if post already exists
      const existingQuery = await db
        .collection('blog_posts')
        .where('slug', '==', slug)
        .get();

      if (!existingQuery.empty) {
        // Update existing post
        const docId = existingQuery.docs[0].id;
        await db.collection('blog_posts').doc(docId).update({
          ...blogPost,
          updatedAt: new Date()
        });
        console.log(`   ✅ Updated existing post\n`);
      } else {
        // Create new post
        await db.collection('blog_posts').add(blogPost);
        console.log(`   ✅ Created new post\n`);
      }

    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error);
    }
  }

  // Create system author if it doesn't exist
  const authorQuery = await db
    .collection('blog_authors')
    .where('id', '==', 'system')
    .get();

  if (authorQuery.empty) {
    await db.collection('blog_authors').add({
      id: 'system',
      name: 'UpTune Team',
      bio: 'The UpTune team helps couples create perfect wedding playlists.',
      avatar: '/images/uptune-logo.png',
      createdAt: new Date()
    });
    console.log('✅ Created system author\n');
  }

  console.log('🎉 Blog import complete!');
}

// For the markdown files we have, let's add proper frontmatter
const blogMetadata = {
  'first-dance-songs-2025-perfect-wedding-playlist.md': {
    title: 'First Dance Songs 2025: Your Perfect Wedding Playlist',
    category: 'music-planning',
    tags: ['first-dance', 'wedding-songs', '2025-trends'],
    excerpt: 'Discover the perfect first dance songs for 2025, from timeless classics to modern hits. Create unforgettable moments with our curated playlist guide.',
    featuredImage: '/images/blog/first-dance-songs-2025-perfect-wedding-playlist-hero.jpg'
  },
  'wedding-music-cost-uk-complete-budget-guide.md': {
    title: 'Wedding Music Cost UK: Complete Budget Guide',
    category: 'planning-resources',
    tags: ['budget', 'uk-weddings', 'cost-guide'],
    excerpt: 'Everything you need to know about wedding music costs in the UK. From DJs to live bands, get realistic pricing and money-saving tips.',
    featuredImage: '/images/blog/wedding-music-cost-uk-complete-budget-guide-hero.jpg'
  },
  'wedding-music-without-spotify-guide.md': {
    title: 'Wedding Music Without Spotify: Alternative Solutions',
    category: 'music-planning',
    tags: ['spotify-alternatives', 'music-options', 'planning-tips'],
    excerpt: 'Plan your perfect wedding music without Spotify. Explore alternative platforms, offline solutions, and professional options for your big day.',
    featuredImage: '/images/blog/wedding-music-without-spotify-guide-hero.jpg'
  },
  'wedding-music-timeline-complete-guide.md': {
    title: 'Wedding Music Timeline: Complete Planning Guide',
    category: 'planning-resources',
    tags: ['timeline', 'planning-guide', 'music-flow'],
    excerpt: 'Master your wedding music timeline with our comprehensive guide. From ceremony to last dance, ensure perfect musical moments throughout your day.',
    featuredImage: '/images/blog/wedding-music-timeline-complete-guide-reception-planning.jpg'
  }
};

// Run the import
importMarkdownBlogs().catch(console.error);