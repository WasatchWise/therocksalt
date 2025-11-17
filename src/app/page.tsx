'use client'

import { useState } from 'react'
import Logo from '@/components/Logo'
import Container from '@/components/Container'
import LiveStreamPlayer from '@/components/LiveStreamPlayer'
import UMRPartnership from '@/components/UMRPartnership'
import Button from '@/components/Button'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement email capture backend
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
            Salt Lake's Music Hub
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 text-center max-w-2xl leading-relaxed px-4">
            Discover local artists, live radio, upcoming shows, and everything happening in Utah's vibrant music scene.
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium uppercase tracking-wide">
              A show on
            </p>
            <UMRPartnership variant="inline" />
          </div>
        </div>

        {/* Promotional Banner */}
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

        {/* Upcoming Live Stream */}
        <div className="max-w-6xl mx-auto mb-20 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 md:p-7 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">
                  Live Stream Tomorrow
                </h3>
              </div>
              <p className="text-white/90 text-sm md:text-base">
                Watch Live on YouTube
              </p>
            </div>
            <div className="aspect-video bg-gray-900">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/eGU3aMSN94c?autoplay=0&rel=0"
                title="Live Stream Tomorrow"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-4 text-center bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <a
                href="https://www.youtube.com/live/eGU3aMSN94c?si=Ll_JzHFKPAdk08nt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Live Stream Player */}
        <div className="max-w-6xl mx-auto mb-16">
          <LiveStreamPlayer
            streamUrl="https://a8.asurahosting.com/listen/therocksalt/radio.mp3"
            title="The Rock Salt Live"
            description="Salt Lake City's Independent Music Radio"
          />
        </div>

        {/* Recently Played & Song Requests */}
        <div className="max-w-6xl mx-auto mb-20 grid md:grid-cols-2 gap-8">
          {/* Recent History */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 animate-slide-in-left">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-center">
              <h4 className="text-lg md:text-xl font-bold text-white drop-shadow-md tracking-tight">Recently Played</h4>
            </div>
            <div>
              <iframe
                src="https://a8.asurahosting.com/public/therocksalt/history?theme=dark"
                frameBorder="0"
                allowTransparency={true}
                className="w-full border-0"
                style={{ minHeight: '400px' }}
                title="Recently Played"
              />
            </div>
          </div>

          {/* Song Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 animate-slide-in-left">
            <div className="bg-gradient-to-r from-pink-600 to-red-600 p-5 text-center">
              <h4 className="text-lg md:text-xl font-bold text-white drop-shadow-md tracking-tight">Request a Song</h4>
            </div>
            <div>
              <iframe
                src="https://a8.asurahosting.com/public/therocksalt/embed-requests?theme=dark"
                frameBorder="0"
                allowTransparency={true}
                className="w-full border-0"
                style={{ minHeight: '400px' }}
                title="Request Songs"
              />
            </div>
          </div>
        </div>

        {/* Music Submission Form */}
        <div className="max-w-4xl mx-auto mb-20 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 md:p-14 border border-gray-200 dark:border-gray-700 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight">
              Submit Your Music
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              Are you a Utah artist? We want to hear from you!
            </p>
            <Button
              href="https://forms.gle/ZkniH6q2HZdEUJbo9"
              size="lg"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3l6 6-6 6m0 0l3-3m-3 3v-12" />
                </svg>
              }
            >
              Submit Your Music
            </Button>
          </div>
        </div>

        {/* Discord Link */}
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <a
            href="https://discord.gg/QWW5uD25r5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl rounded-lg shadow-lg transform transition-all hover:scale-105"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Our Discord Community
          </a>
        </div>

        {/* Email Capture */}
        <div className="max-w-2xl mx-auto mb-20 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-10 md:p-12 border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Get notified about new shows, events, and featured artists
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <Button type="submit" size="md">
                Subscribe
              </Button>
            </form>
            {emailSubmitted && (
              <p className="mt-4 text-green-600 dark:text-green-400 font-semibold animate-fade-in">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* YouTube Live/Video Section */}
        <div className="max-w-6xl mx-auto mb-20 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center tracking-tight">
              Watch Live Sessions & Music Videos
            </h3>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/eGU3aMSN94c"
                title="YouTube Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm md:text-base">
              Catch live performances, interviews, and music videos from Utah&apos;s best artists
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}
