import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://weddings.uptune.xyz'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/pricing',
    '/blog',
    '/help',
    '/contact',
    '/privacy',
    '/terms',
    '/auth/login',
    '/auth/signup',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Add blog posts (you can make this dynamic later)
  const blogPosts = [
    '/blog/ultimate-wedding-music-planning-guide',
    '/blog/first-dance-song-guide',
    '/blog/wedding-processional-music-guide',
    '/blog/wedding-reception-timeline',
    '/blog/how-to-dj-your-own-wedding',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPosts]
}