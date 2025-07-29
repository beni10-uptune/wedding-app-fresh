import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GoogleTagManagerWrapper } from "@/components/GoogleTagManagerWrapper";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://weddings.uptune.xyz'),
  title: {
    default: "UpTune for Weddings - Create Your Perfect Wedding Playlist | £25",
    template: "%s | UpTune Weddings"
  },
  description: "Plan your wedding music effortlessly with UpTune. Collaborate with your partner, get guest song requests, and create the perfect soundtrack for your special day. One simple price: £25.",
  keywords: ["wedding music planner", "wedding playlist creator", "wedding DJ alternative", "wedding music app", "wedding song requests", "wedding music timeline", "UK wedding music", "wedding planning tool"],
  authors: [{ name: "UpTune", url: "https://weddings.uptune.xyz" }],
  creator: "UpTune",
  publisher: "UpTune",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "UpTune for Weddings - Create Your Perfect Wedding Playlist",
    description: "The joyful way to plan your wedding music. Collaborate with your partner and guests to create the perfect soundtrack. Just £25 per wedding.",
    url: "https://weddings.uptune.xyz",
    siteName: "UpTune for Weddings",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "UpTune for Weddings - Wedding Music Planning Made Easy",
      }
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UpTune for Weddings - Create Your Perfect Wedding Playlist",
    description: "Plan your wedding music effortlessly. One simple price: £25 per wedding.",
    images: ["/og-image.svg"],
    creator: "@uptune",
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
  alternates: {
    canonical: "https://weddings.uptune.xyz",
  },
  verification: {
    google: "googlebd103d2c5b7686b4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NJP3X5W3';
  
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dancing.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <GoogleTagManagerWrapper gtmId={gtmId} />
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <CookieConsent />
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
