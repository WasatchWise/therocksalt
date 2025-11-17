'use client'

import { useState } from 'react'
import Logo from '@/components/Logo'
import Container from '@/components/Container'
import UMRPartnership from '@/components/UMRPartnership'
import Button from '@/components/Button'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmailSubmitted(true)
    setEmail('')
    setTimeout(() => setEmailSubmitted(false), 3000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Container className="py-8 md:py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center mb-16 animate-fade-in">
          <Logo className="w-64 md:w-80 h-auto mb-8" priority />
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 text-center tracking-tight">
            Utah's Music Memory
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 text-center max-w-2xl leading-relaxed px-4">
            Utah makes more noise than you think. We've been documenting it since 2002, back when message boards were the algorithm. Live radio • Opinionated coverage • All 29 counties, not just Salt Lake.
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium uppercase tracking-wide">
              A show on
            </p>
            <UMRPartnership variant="inline" />
          </div>
        </div>

        {/* Show Schedule Banner */}
        <div className="max-w-4xl mx-auto mb-16 animate-scale-in">
          <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-3xl p-10 md:p-14 shadow-2xl text-center transform hover:scale-[1.01] transition-all duration-300 border-4 border-white dark:border-gray-800">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
              ALL LOCAL - ALL DAY
            </h2>
            <div className="text-white space-y-3">
              <p className="text-2xl md:text-3xl font-bold drop-shadow-md">Rock Salt Radio Live</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-xl md:text-2xl font-semibold">
                <span>Tuesday & Thursday</span>
                <span className="hidden md:inline">•</span>
                <span>11 - 1p</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Content Grid */}
        <div className="max-w-7xl mx-auto mb-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Live Stream */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 text-center">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                  Watch Live Sessions
                </h3>
              </div>
            </div>
            <div className="aspect-video bg-gray-900">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/eGU3aMSN94c"
                title="Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Featured Band */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              This Week: Power of Intent
            </h3>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                Power of Intent weaponizes reverb. Their latest single "Animal Nature" sounds like My Bloody Valentine got lost in Little Cottonwood Canyon and decided the echo was better than the exit. Worth the drive from anywhere in the valley.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <iframe
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/track/4cNzwiPOLzL2XjyXzMhFOi?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
              <p className="text-sm text-white/80 italic">
                📍 Photo op: Shoot your own "Animal Nature" cover at Bonneville Salt Flats during golden hour.
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Upcoming Events
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-semibold mb-2">Event Calendar Coming Soon</p>
              <p className="text-sm">We're building a comprehensive events system</p>
            </div>
          </div>
        </div>

        {/* Submit Music CTA */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-xl p-10 md:p-14 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Submit Your Music
            </h2>
            <p className="text-lg mb-10 text-white/90">
              Make music in Utah? We're listening. No genre gatekeeping, no pay-to-play bullshit. Submit your stuff. We spin it or tell you why we didn't.
            </p>
            <Button
              href="https://forms.gle/ZkniH6q2HZdEUJbo9"
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              Submit Now
            </Button>
          </div>
        </div>

        {/* The Salt Vault */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-[#8b9b47] to-[#a4a654] rounded-3xl shadow-xl p-10 md:p-14 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              The Salt Vault
            </h2>
            <p className="text-lg mb-8 text-white/90">
              The forums are back. Not Discord. Not Facebook groups. An actual message board. Like it's 2002.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="https://therocksalt.discourse.group"
                size="lg"
                className="bg-white text-[#8b9b47] hover:bg-gray-100"
              >
                Enter The Vault
              </Button>
              <button
                onClick={() => window.open('https://therocksalt.discourse.group/categories', '_blank')}
                className="px-6 py-3 border-2 border-white text-white hover:bg-white/10 rounded-lg font-semibold text-lg transition-colors"
              >
                Browse Categories
              </button>
            </div>
            <p className="text-sm text-white/70 mt-6 italic">
              First 100 members get the "Salt Miner" badge
            </p>
          </div>
        </div>

        {/* Community Links */}
        <div className="max-w-4xl mx-auto mb-16 grid md:grid-cols-2 gap-6">
          {/* Discord */}
          <a
            href="https://discord.gg/9qRatCBJ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Join Discord</span>
          </a>

          {/* Newsletter */}
          <div className="p-6 bg-gray-800 dark:bg-gray-700 rounded-xl shadow-lg">
            <h3 className="text-white font-bold text-lg mb-3">Stay Updated</h3>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-3 py-2 rounded-lg border-0 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
            {emailSubmitted && (
              <p className="mt-2 text-green-400 text-sm">Thanks!</p>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}
