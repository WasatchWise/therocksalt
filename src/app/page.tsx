'use client'

import Logo from '@/components/Logo'
import UMRPartnership from '@/components/UMRPartnership'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Compact Hero - Left Aligned */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-4">
            <Logo className="w-32 h-auto" priority />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                Utah's Music Memory
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 max-w-2xl">
                Documenting Utah's music scene since 2002. Live radio • Opinionated coverage • All 29 counties.
              </p>
              <div className="flex gap-2">
                <a href="/artists" className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold text-sm transition-colors">
                  Browse Artists
                </a>
                <a href="/events" className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-semibold text-sm transition-colors">
                  See Shows
                </a>
                <a href="https://forms.gle/ZkniH6q2HZdEUJbo9" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 border-2 border-gray-800 dark:border-white text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full font-semibold text-sm transition-colors">
                  Submit Music
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">A show on</span>
            <UMRPartnership variant="inline" />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {/* Radio Schedule Card */}
          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-lg p-3 text-white shadow-lg border-2 border-red-700">
            <h3 className="font-bold text-base mb-1.5">🔴 Radio Schedule</h3>
            <p className="text-xs mb-0.5 opacity-90">Rock Salt Radio Live</p>
            <p className="text-sm font-bold">Tue & Thu • 11am-1pm</p>
          </div>

          {/* Featured Artist Card */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-3 text-white shadow-lg border-2 border-purple-700">
            <h3 className="font-bold text-base mb-1.5">⭐ This Week</h3>
            <p className="text-sm font-bold mb-0.5">Power of Intent</p>
            <p className="text-xs opacity-90 line-clamp-2">Shoegaze that weaponizes reverb. Worth the drive.</p>
          </div>

          {/* Tonight Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-3 text-white shadow-lg border-2 border-blue-700">
            <h3 className="font-bold text-base mb-2">🎸 Tonight in Utah</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold">TBA @ Kilby Court</span>
                <span className="opacity-75">8pm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Open Mic @ Urban Lounge</span>
                <span className="opacity-75">9pm</span>
              </div>
              <a href="/events" className="block text-center pt-1 opacity-90 hover:opacity-100 underline text-xs">
                See all shows →
              </a>
            </div>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Radio Schedule - Expanded */}
          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-2xl mb-4">🔴 On Air</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm opacity-90 mb-1">Rock Salt Radio Live</p>
                <p className="text-xl font-bold">Tuesday & Thursday</p>
                <p className="text-lg">11am - 1pm MST</p>
              </div>
              <div className="pt-3 border-t border-white/20">
                <p className="text-sm opacity-90 mb-2">ALL LOCAL - ALL DAY</p>
                <p className="text-xs opacity-75">AutoDJ spinning Utah artists 24/7 when we're not live</p>
              </div>
            </div>
          </div>

          {/* Featured Band Spotify */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">🎵 Power of Intent - Animal Nature</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              My Bloody Valentine vibes in Little Cottonwood Canyon.
            </p>
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
              📍 Photo op: Bonneville Salt Flats at golden hour
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
