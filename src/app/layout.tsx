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
  title: "UpTune for Weddings - Transform Your Wedding Music Planning",
  description: "The joyful way to plan your wedding music. Collaborate with your partner and guests to create the perfect soundtrack. £25 per wedding.",
  keywords: "wedding music, wedding playlist, wedding DJ, wedding planning, music curation",
  authors: [{ name: "UpTune" }],
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
    title: "UpTune for Weddings - Transform Your Wedding Music Planning",
    description: "The joyful way to plan your wedding music. Collaborate with your partner and guests to create the perfect soundtrack.",
    url: "https://weddings.uptune.xyz",
    siteName: "UpTune for Weddings",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UpTune for Weddings - Transform Your Wedding Music Planning",
    description: "The joyful way to plan your wedding music. Collaborate with your partner and guests to create the perfect soundtrack.",
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
