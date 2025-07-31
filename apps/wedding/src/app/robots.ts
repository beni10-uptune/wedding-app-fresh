import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog/',
          '/pricing',
          '/help',
          '/contact',
          '/about',
          '/song-tools',
        ],
        disallow: [
          '/api/',
          '/wedding/*/builder/',
          '/wedding/*/settings/',
          '/wedding/*/payment/',
          '/dashboard/',
          '/admin/',
          '/auth/forgot-password',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap: 'https://weddings.uptune.xyz/sitemap.xml',
  }
}