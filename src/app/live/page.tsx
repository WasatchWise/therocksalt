import { Metadata } from 'next'
import LiveStreamPlayer from '@/components/LiveStreamPlayer'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Listen Live | The Rock Salt',
  description: 'Stream Salt Lake City\'s independent music radio station live. Broadcasting local artists, underground sounds, and the best of SLC\'s music scene.',
}

// Use localhost for local development
// In production, you'll want to update this to your streaming server's public URL
const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL || 'http://localhost:8000/rocksalt.mp3'

export default function LivePage() {
  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Listen Live
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tune in to Salt Lake City's premier independent music radio station.
            Broadcasting the best local artists and underground sounds 24/7.
          </p>
        </div>

        {/* Live Stream Player */}
        <LiveStreamPlayer
          streamUrl={STREAM_URL}
          title="The Rock Salt Live"
          description="Salt Lake City's Independent Music Radio"
        />

        {/* About the Stream */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What You'll Hear
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Local SLC bands and artists</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Underground and independent music</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Live DJ sets and radio shows</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Exclusive premieres and unreleased tracks</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Want to DJ?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              If you're a local DJ or artist interested in hosting a show on The Rock Salt,
              we'd love to hear from you! Contact us to receive secure streaming credentials
              and setup instructions for broadcasting via Mixxx or other DJ software.
            </p>
            <a
              href="mailto:music@therocksalt.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Get in Touch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            Stream Not Working?
          </h3>
          <ul className="text-yellow-800 dark:text-yellow-300 space-y-2 text-sm">
            <li>• The stream may be offline if no DJ is currently broadcasting</li>
            <li>• Try refreshing the page or clicking play again</li>
            <li>• Check that your browser allows audio autoplay</li>
            <li>• For best results, use Chrome, Firefox, or Safari</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}
