import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWAInstall from "@/components/PWAInstall";
import InstallPrompt from "@/components/InstallPrompt";

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
    default: "The Rock Salt | Salt Lake's Music Hub",
    template: "%s | The Rock Salt"
  },
  description: "The Rock Salt is Salt Lake City's premier independent music platform. Discover local artists, upcoming shows, live episodes, and the vibrant SLC music scene.",
  keywords: ["Salt Lake City music", "SLC bands", "local artists", "Utah music scene", "independent music", "live music"],
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
    description: "Salt Lake City's premier independent music platform. Discover local artists, upcoming shows, and the vibrant SLC music scene.",
    siteName: 'The Rock Salt',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Rock Salt | Salt Lake's Music Hub",
    description: "Salt Lake City's premier independent music platform.",
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
        <PWAInstall />
        <InstallPrompt />
        {/* <Header /> */}
        <main className="flex-1">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
