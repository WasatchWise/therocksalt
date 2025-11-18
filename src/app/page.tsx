'use client'

import Logo from '@/components/Logo'
import UMRPartnership from '@/components/UMRPartnership'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Sticky Discourse Banner */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#8b9b47] to-[#a4a654] border-b-2 border-[#6b7a37] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <p className="text-white font-bold text-sm">
            💬 Join the conversation. Now.
          </p>
          <a
            href="https://therocksalt.discourse.group"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-white text-[#8b9b47] hover:bg-gray-100 rounded-full font-bold text-sm transition-colors"
          >
            Salt Vault →
          </a>
        </div>
      </div>

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
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <span>A show on</span>
            <UMRPartnership variant="inline" />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Radio Schedule Card */}
          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-4 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">🔴 Radio Schedule</h3>
            <p className="text-sm mb-1">Rock Salt Radio Live</p>
            <p className="text-sm font-bold">Tue & Thu • 11am-1pm</p>
          </div>

          {/* Featured Artist Card */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">⭐ This Week</h3>
            <p className="text-sm font-bold mb-1">Power of Intent</p>
            <p className="text-xs opacity-90 line-clamp-2">Shoegaze that weaponizes reverb. Worth the drive.</p>
          </div>

          {/* Tonight Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">🎸 Tonight in Utah</h3>
            <p className="text-xs">Events calendar coming soon</p>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Live Stream */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3">
              <h3 className="font-bold text-white text-sm">📹 Salt Sessions</h3>
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
