import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'export' mode to support API routes
  // output: 'export',
  
  // Keep trailing slash for consistency
  trailingSlash: true,
  
  images: {
    // Allow external images from various sources
    domains: [
      'images.unsplash.com',
      'i.scdn.co',  // Spotify images
      'mosaic.scdn.co',  // Spotify mosaic images
      'firebasestorage.googleapis.com',  // Firebase Storage
    ],
  },
  
  // Enable server-side features
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
