'use client'

import { Metadata } from 'next'
import { useState } from 'react'
import Logo from '@/components/Logo'
import Container from '@/components/Container'
import LiveStreamPlayer from '@/components/LiveStreamPlayer'
import MusicSubmissionForm from '@/components/MusicSubmissionForm'

const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL || 'http://localhost:8000/rocksalt.mp3'

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
      <Container className="py-12">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo className="w-64 md:w-80 h-auto" priority />
        </div>

        {/* Radio Player */}
        <div className="max-w-4xl mx-auto mb-16">
          <LiveStreamPlayer
            streamUrl={STREAM_URL}
            title="The Rock Salt Live"
            description="Salt Lake City's Independent Music Radio"
          />
        </div>

        {/* Music Submission Form */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Submit Your Music
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Are you a Salt Lake City artist? We want to hear from you!
              </p>
            </div>
            <MusicSubmissionForm />
          </div>
        </div>

        {/* Discord Link */}
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <a
            href="https://discord.gg/therocksalt"
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
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get notified about new shows, events, and featured artists
            </p>
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
            {emailSubmitted && (
              <p className="mt-4 text-green-600 dark:text-green-400 font-semibold">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}
