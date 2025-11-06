import Link from 'next/link'
import { Metadata } from 'next'
import Logo from '@/components/Logo'
import Container from '@/components/Container'
import MusicSubmissionForm from '@/components/MusicSubmissionForm'

export const metadata: Metadata = {
  title: 'The Rock Salt | Salt Lake City\'s Independent Music Radio',
  description: 'Salt Lake City\'s premier independent music radio station. Submit your music, listen live, and discover local bands.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Container className="py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="w-64 md:w-80 h-auto" priority />
        </div>

        {/* Tagline */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Salt Lake City's Independent Music Radio
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Broadcasting local artists, underground sounds, and the best of SLC's music scene
          </p>
        </div>

        {/* Listen Live Button */}
        <div className="flex justify-center mb-16">
          <Link
            href="/live"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-xl rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse hover:animate-none"
          >
            {/* Live indicator dot */}
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>

            <span className="text-2xl">🎸</span>
            <span>LISTEN LIVE</span>

            {/* Glow effect */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10"></span>
          </Link>
        </div>

        {/* Music Submission Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Submit Your Music
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Are you a Salt Lake City artist? We want to hear from you!
                <br />
                Submit your music for airplay consideration.
              </p>
            </div>

            <MusicSubmissionForm />
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Questions? Reach out to us
          </p>
          <a
            href="mailto:music@therocksalt.com"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            music@therocksalt.com
          </a>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-x-6 text-sm">
          <Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            About
          </Link>
          <Link href="/bands" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Artists
          </Link>
          <Link href="/venues" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Venues
          </Link>
          <Link href="/events" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Events
          </Link>
          <Link href="/episodes" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Radio Episodes
          </Link>
        </div>
      </Container>
    </main>
  )
}
