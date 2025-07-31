import { Metadata } from 'next'

export const homeMetadata: Metadata = {
  title: 'UpTune for Weddings - Create Your Perfect Wedding Playlist | £25 One-Time',
  description: 'Plan your wedding music effortlessly with UpTune. Collaborate with your partner, get guest song requests, and create the perfect soundtrack for your special day. One simple price: £25.',
  keywords: 'wedding music planner, wedding playlist creator, wedding DJ alternative, wedding music app, wedding song requests, wedding music timeline, UK wedding music',
  authors: [{ name: 'UpTune', url: 'https://weddings.uptune.xyz' }],
  creator: 'UpTune',
  publisher: 'UpTune',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'UpTune for Weddings - Create Your Perfect Wedding Playlist',
    description: 'The joyful way to plan your wedding music. Collaborate with your partner and guests to create the perfect soundtrack. Just £25 per wedding.',
    url: 'https://weddings.uptune.xyz',
    siteName: 'UpTune for Weddings',
    images: [
      {
        url: 'https://weddings.uptune.xyz/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UpTune for Weddings - Wedding Music Planning Made Easy',
      }
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UpTune for Weddings - Create Your Perfect Wedding Playlist',
    description: 'Plan your wedding music effortlessly. One simple price: £25 per wedding.',
    images: ['https://weddings.uptune.xyz/og-image.png'],
    creator: '@uptune',
  },
  alternates: {
    canonical: 'https://weddings.uptune.xyz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googlebd103d2c5b7686b4',
  },
}