import { getBands, getEvents } from '@/lib/supabase/queries'
import UMRPartnership from '@/components/UMRPartnership'
import Link from 'next/link'
import NowPlaying from '@/components/NowPlaying'

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
    .slice(0, 5) // Show more events

  // Get stats for social proof
  const totalBands = allBands.length
  const totalEvents = upcomingEvents.length

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* CINEMATIC HERO SECTION - Gen Alpha + Gen X Appeal */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background - Retro meets Modern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-red-900">
          {/* Animated grid pattern - Gen X nostalgia */}
          <div className="absolute inset-0 opacity-20 grid-pattern"></div>
          
          {/* Floating orbs - Modern touch */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* VHS Scan Lines Effect - Pure Gen X Nostalgia */}
        <div className="absolute inset-0 pointer-events-none opacity-10 vhs-scanlines"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* Badge - "Since 2002" - Credibility for Gen X */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Documenting Utah Music Since 2002</span>
          </div>

          {/* Main Headline - Bold, Clear, Memorable */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-gradient">
              THE ROCK
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 animate-gradient animation-delay-1000">
              SALT
            </span>
          </h1>

          {/* Subheadline - Dual Appeal */}
          <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-white/90 max-w-3xl mx-auto">
            Salt Lake's Music Hub
            <span className="block text-lg md:text-xl text-white/70 mt-2 font-normal">
              Live Radio • Opinionated Coverage • All 29 Counties
            </span>
          </p>

          {/* Primary CTA - Big, Bold, Clear */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link 
              href="/live"
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-lg rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-red-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                LISTEN LIVE
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            </Link>

            <Link 
              href="/events"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              SEE SHOWS
            </Link>

            <Link 
              href="/bands"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              DISCOVER BANDS
            </Link>
          </div>

          {/* Social Proof Stats - Gen Alpha loves numbers */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-yellow-400">{totalBands}+</span>
              <span className="text-white/70">Local Artists</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-red-400">{totalEvents}</span>
              <span className="text-white/70">Upcoming Shows</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-purple-400">24/7</span>
              <span className="text-white/70">Live Radio</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Gen Alpha expects this */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* NOW PLAYING SECTION - Real-time, Prominent */}
      <section className="relative py-12 bg-gradient-to-r from-red-900/50 via-purple-900/50 to-red-900/50 backdrop-blur-sm border-y-2 border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Now Playing Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold uppercase tracking-wider text-red-400">NOW PLAYING</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black mb-1">Rock Salt Radio</h2>
              <p className="text-white/70 mb-4">Tuesday & Thursday • 11am - 1pm MST</p>
              
              {/* Real-time Now Playing Widget */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md">
                <NowPlaying />
              </div>
            </div>

            {/* Live Player */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <Link 
                href="/live"
                className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black rounded-full transition-all duration-300 transform hover:scale-110 shadow-xl text-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  TUNE IN LIVE
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </Link>
              <div className="text-center md:text-right">
                <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">ALL LOCAL</div>
                <div className="text-sm text-white/70">AutoDJ 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ARTIST - Premium Treatment */}
      {featuredBand && (
        <section className="relative py-16 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">⭐</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Featured Artist</h2>
            </div>
            
            <Link 
              href={`/bands/${featuredBand.slug}`}
              className="group block relative bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-red-900/80 backdrop-blur-md border-4 border-yellow-400/50 rounded-3xl p-8 md:p-12 overflow-hidden hover:border-yellow-400 transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-1">
                    <h3 className="text-3xl md:text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-yellow-400">
                      {featuredBand.name}
                    </h3>
                    <p className="text-xl text-white/80 mb-4 line-clamp-3">
                      {featuredBand.description || `${featuredBand.origin_city || 'Utah'} • ${featuredBand.status || 'Active'}`}
                    </p>
                    <div className="flex items-center gap-2 text-yellow-400 font-bold">
                      <span>DISCOVER →</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* UPCOMING SHOWS - Visual, Scannable */}
      {upcomingEvents.length > 0 && (
        <section className="relative py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎸</span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Upcoming Shows</h2>
              </div>
              <Link 
                href="/events"
                className="text-white/70 hover:text-white font-bold transition-colors"
              >
                See All →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 6).map((event) => {
                const eventDate = new Date(event.start_time!)
                const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                const day = eventDate.getDate()
                const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

                return (
                  <Link
                    key={event.id}
                    href={`/events#${event.id}`}
                    className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border-2 border-white/10 rounded-2xl p-6 overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
                  >
                    {/* Date Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-black text-xs">
                      {dayOfWeek}
                    </div>

                    <div className="relative z-10">
                      <div className="text-yellow-400 font-black text-sm mb-2">{month} {day}</div>
                      <h3 className="text-2xl font-black mb-2 line-clamp-2">{event.name}</h3>
                      {event.venue && (
                        <p className="text-white/70 text-sm mb-2">{event.venue.name}</p>
                      )}
                      <p className="text-white/50 text-xs">{time}</p>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/10 group-hover:to-yellow-400/5 transition-all duration-300"></div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* RADIO + PLAYLIST SECTION - Side by Side */}
      <section className="relative py-16 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Radio Schedule */}
            <div className="bg-gradient-to-br from-red-900/80 to-orange-900/80 backdrop-blur-md border-4 border-red-500/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🔴</span>
                <h3 className="text-3xl font-black uppercase">On Air</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-white/90 font-bold text-lg mb-1">Rock Salt Radio Live</p>
                  <p className="text-white/70">Tuesday & Thursday</p>
                  <p className="text-white/70">11am - 1pm MST</p>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm font-bold uppercase tracking-wider text-white/90 mb-2">ALL LOCAL - ALL DAY</p>
                  <p className="text-xs text-white/70 mb-4">AutoDJ spinning Utah artists 24/7 when we're not live</p>
                  
                  {/* Recently Played */}
                  <div className="rounded-lg bg-black/30 overflow-hidden">
                    <iframe
                      src="https://a8.asurahosting.com/public/therocksalt/history?theme=dark"
                      className="w-full h-48 border-0"
                      title="Recently Played"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Playlist */}
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-md border-4 border-purple-500/50 rounded-3xl p-8 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🎵</span>
                <h3 className="text-3xl font-black uppercase">Featured Playlist</h3>
              </div>
              <div className="rounded-xl overflow-hidden bg-black/30">
                <iframe
                  data-testid="embed-iframe"
                  src="https://open.spotify.com/embed/playlist/6uTuAYkMZJuFDpvEDUo3Iz?utm_source=generator&theme=0"
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
        </div>
      </section>

      {/* CTA SECTION - Clear Next Steps */}
      <section className="relative py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tight">
            Join The Scene
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Submit your music, share your shows, and become part of Utah's music community.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="https://forms.gle/ZkniH6q2HZdEUJbo9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-black text-lg rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl"
            >
              SUBMIT MUSIC
            </Link>
            <Link 
              href="/events#submit"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              SUBMIT SHOW
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm text-white/50">A show on</span>
            <UMRPartnership variant="inline" />
          </div>
        </div>
      </section>
    </main>
  )
}
