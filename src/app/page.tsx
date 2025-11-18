import { getBands, getEvents } from '@/lib/supabase/queries'
import UMRPartnership from '@/components/UMRPartnership'

export const revalidate = 60

export default async function HomePage() {
  // Fetch real data
  const allBands = await getBands(100)
  const allEvents = await getEvents(50)

  // Get featured band (prefer HOF, then featured tier, then any with Spotify)
  const featuredBand = allBands.find(b => b.tier === 'hof') ||
                      allBands.find(b => b.tier === 'featured') ||
                      allBands.find(b => b.spotify_url)

  // Get upcoming events (today and future only)
  const now = new Date()
  const upcomingEvents = allEvents
    .filter(e => e.start_time && new Date(e.start_time) >= now)
    .sort((a, b) => new Date(a.start_time!).getTime() - new Date(b.start_time!).getTime())
    .slice(0, 2) // Just next 2 shows

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Compact Hero */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
              Salt Lake's Music Hub
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4 max-w-3xl">
              Documenting Utah's music scene since 2002. Live radio • Opinionated coverage • All 29 counties.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <a href="/artists" className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold text-sm transition-colors">
                Browse Artists
              </a>
              <a href="/events" className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-semibold text-sm transition-colors">
                See Shows
              </a>
              <a href="https://forms.gle/ZkniH6q2HZdEUJbo9" target="_blank" rel="noopener noreferrer" className="px-5 py-2 border-2 border-gray-800 dark:border-white text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full font-semibold text-sm transition-colors">
                Submit Music
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">A show on</span>
              <UMRPartnership variant="inline" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {/* Featured Artist Card */}
          {featuredBand ? (
            <a
              href={`/bands/${featuredBand.slug}`}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-3 text-white shadow-lg border-2 border-purple-700 hover:scale-[1.02] transition-transform"
            >
              <h3 className="font-bold text-base mb-1.5">⭐ Featured Artist</h3>
              <p className="text-sm font-bold mb-0.5">{featuredBand.name}</p>
              <p className="text-xs opacity-90 line-clamp-2">
                {featuredBand.description || `${featuredBand.origin_city || 'Utah'} • ${featuredBand.status || 'Active'}`}
              </p>
            </a>
          ) : (
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-3 text-white shadow-lg border-2 border-purple-700">
              <h3 className="font-bold text-base mb-1.5">⭐ Featured Artist</h3>
              <p className="text-xs opacity-90">Check back soon!</p>
            </div>
          )}

          {/* Tonight Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-3 text-white shadow-lg border-2 border-blue-700">
            <h3 className="font-bold text-base mb-2">🎸 Upcoming Shows</h3>
            <div className="space-y-1.5 text-xs">
              {upcomingEvents.length > 0 ? (
                <>
                  {upcomingEvents.map((event, idx) => {
                    const eventDate = new Date(event.start_time!)
                    const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="font-semibold truncate">
                          {event.name} @ {event.venue?.name || 'TBA'}
                        </span>
                        <span className="opacity-75 flex-shrink-0 ml-2">{time}</span>
                      </div>
                    )
                  })}
                  <a href="/events" className="block text-center pt-1 opacity-90 hover:opacity-100 underline text-xs">
                    See all shows →
                  </a>
                </>
              ) : (
                <div className="text-xs opacity-90 space-y-1.5">
                  <p>Events auto-sync every 6 hours from Utah venues.</p>
                  <a href="/events" className="block text-center pt-1 opacity-90 hover:opacity-100 underline">
                    Submit a show →
                  </a>
                </div>
              )}
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
                <p className="text-xs opacity-75 mb-3">AutoDJ spinning Utah artists 24/7 when we're not live</p>

                {/* Recently Played */}
                <div className="mt-4">
                  <h4 className="text-sm font-bold mb-2 opacity-90">Recently Played</h4>
                  <div className="rounded-lg bg-black/20 overflow-hidden">
                    <iframe
                      src="https://a8.asurahosting.com/public/therocksalt/history?theme=dark"
                      className="w-full h-48 border-0"
                      title="Recently Played"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Playlist */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">🎵 Featured Playlist</h3>
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/playlist/6uTuAYkMZJuFDpvEDUo3Iz?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
