// Configuration for different environments and domains

export const config = {
  // Get the appropriate domain based on environment
  getWeddingDomain: () => {
    if (typeof window === 'undefined') {
      // Server-side: use environment variable or default
      return process.env.NEXT_PUBLIC_WEDDING_DOMAIN || 'https://weddings.uptune.xyz'
    }
    
    // Client-side: check current hostname
    const hostname = window.location.hostname
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${window.location.protocol}//${hostname}:${window.location.port}`
    }
    
    // Production or staging
    return process.env.NEXT_PUBLIC_WEDDING_DOMAIN || 'https://weddings.uptune.xyz'
  },
  
  // Get the main app domain
  getAppDomain: () => {
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://uptune.xyz'
    }
    
    const hostname = window.location.hostname
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${window.location.protocol}//${hostname}:${window.location.port}`
    }
    
    // Production
    return process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://uptune.xyz'
  }
}