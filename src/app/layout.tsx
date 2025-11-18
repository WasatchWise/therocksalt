import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWAInstall from "@/components/PWAInstall";
import InstallPrompt from "@/components/InstallPrompt";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import FloatingPlayer from "@/components/FloatingPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Rock Salt | Utah's Music Memory",
    template: "%s | The Rock Salt"
  },
  description: "Utah's Music Memory. Since the phpBB Era. Live radio, opinionated coverage, and all 29 counties—not just Salt Lake.",
  keywords: ["Utah music", "Salt Lake City music", "SLC bands", "local artists", "Utah music scene", "independent music", "live music", "regional music"],
  authors: [{ name: "The Rock Salt" }],
  creator: "The Rock Salt",
  publisher: "The Rock Salt",
  metadataBase: new URL('https://www.therocksalt.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rock Salt',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.therocksalt.com',
    title: "The Rock Salt | Salt Lake's Music Hub",
    description: "Salt Lake's Music Hub. Discover local artists, upcoming shows, live radio, and everything happening in Utah's vibrant music scene.",
    siteName: 'The Rock Salt',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Rock Salt | Salt Lake's Music Hub",
    description: "Salt Lake's Music Hub. Your one-stop destination for Utah music.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AudioPlayerProvider>
          <PWAInstall />
          <InstallPrompt />

          {/* Global Salt Vault Banner - Very Top */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
              <p className="text-gray-300 font-medium">
                💬 Join the conversation in the Salt Vault
              </p>
              <a
                href="https://therocksalt.discourse.group"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold transition-colors"
              >
                Enter →
              </a>
            </div>
          </div>

          <Header />
          <main className="flex-1 pb-40">
            {children}
          </main>
          <Footer />
          <FloatingPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
