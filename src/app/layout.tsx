import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dancing.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
