import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* <Header /> */}
        <main className="flex-1">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
