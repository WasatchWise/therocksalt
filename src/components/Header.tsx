'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { getSavedBandsCount } from '@/lib/savedBands'
import Logo from './Logo'
import Container from './Container'
import UMRPartnership from './UMRPartnership'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [savedCount, setSavedCount] = useState(0)
  const { user } = useAuth()
  const router = useRouter()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Listen Live', href: '/live', highlight: true },
    { name: 'Discover', href: '/discover', accent: true },
    { name: 'Artists', href: '/bands' },
    { name: 'Venues', href: '/venues' },
    { name: 'Events', href: '/events' },
  ]

  // Update saved bands count on mount and when bands are saved/unsaved
  useEffect(() => {
    const updateCount = () => setSavedCount(getSavedBandsCount())

    // Initial count
    updateCount()

    // Listen for band saved/unsaved events
    window.addEventListener('bandSaved', updateCount)
    window.addEventListener('storage', updateCount) // For cross-tab updates

    return () => {
      window.removeEventListener('bandSaved', updateCount)
      window.removeEventListener('storage', updateCount)
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 shadow-sm">
      <Container>
        <nav className="flex items-center justify-between py-4">
          {/* Logo and UMR Partnership */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <Logo className="w-32 h-auto" priority />
            </Link>
            <div className="hidden lg:block">
              <UMRPartnership variant="badge" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={
                  item.highlight
                    ? "px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 animate-pulse hover:animate-none"
                    : item.accent
                    ? "px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all"
                    : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                }
              >
                {item.highlight && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
                {item.name}
              </Link>
            ))}

            {/* My Bands link with badge */}
            <Link
              href="/my-bands"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              My Bands
              {savedCount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* UMR Partnership (mobile) */}
            <div className="lg:hidden">
              <UMRPartnership variant="badge" />
            </div>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    item.highlight
                      ? "px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 animate-pulse hover:animate-none"
                      : item.accent
                      ? "px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.highlight && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                  {item.name}
                </Link>
              ))}

              {/* My Bands link with badge (mobile) */}
              <Link
                href="/my-bands"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                My Bands
                {savedCount > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    {savedCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
