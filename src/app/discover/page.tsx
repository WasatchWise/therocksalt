import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Container from '@/components/Container'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover Utah Bands | The Rock Salt',
  description: 'Discover local Utah bands and artists. Browse by genre, find new music, and support the local scene.',
}

export const revalidate = 60 // Revalidate every minute

// Get all bands with their genres
async function getBandsWithGenres() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bands')
    .select(`
      id,
      name,
      slug,
      hometown,
      bio,
      image_url,
      tier,
      featured,
      band_genres (
        genre:genres ( id, name )
      ),
      band_links (
        label,
        url
      ),
      band_photos (
        url,
        is_primary
      )
    `)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching bands:', error)
    return []
  }

  return data || []
}

// Get all unique genres
async function getAllGenres() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('genres')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching genres:', error)
    return []
  }

  return data || []
}

// Get upcoming events to show "playing soon" bands
async function getUpcomingEventBands() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select(`
      id,
      name,
      start_time,
      venue:venues ( name, city ),
      event_bands (
        band:bands (
          id,
          name,
          slug
        )
      )
    `)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(20)

  if (error) {
    console.error('Error fetching upcoming events:', error)
    return []
  }

  return data || []
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const selectedGenre = typeof params.genre === 'string' ? params.genre : null
  const searchQuery = typeof params.q === 'string' ? params.q.toLowerCase() : null

  const [bands, genres, upcomingEvents] = await Promise.all([
    getBandsWithGenres(),
    getAllGenres(),
    getUpcomingEventBands(),
  ])

  // Filter bands based on search and genre
  let filteredBands = bands.filter(band => {
    // Genre filter
    if (selectedGenre) {
      const bandGenres = band.band_genres?.map(bg => bg.genre?.name?.toLowerCase()) || []
      if (!bandGenres.includes(selectedGenre.toLowerCase())) {
        return false
      }
    }

    // Search filter
    if (searchQuery) {
      const nameMatch = band.name.toLowerCase().includes(searchQuery)
      const bioMatch = band.bio?.toLowerCase().includes(searchQuery)
      const hometownMatch = band.hometown?.toLowerCase().includes(searchQuery)
      if (!nameMatch && !bioMatch && !hometownMatch) {
        return false
      }
    }

    return true
  })

  // Sort: Featured/HOF first, then alphabetically
  filteredBands = filteredBands.sort((a, b) => {
    if (a.tier === 'hof' && b.tier !== 'hof') return -1
    if (b.tier === 'hof' && a.tier !== 'hof') return 1
    if (a.featured && !b.featured) return -1
    if (b.featured && !a.featured) return 1
    return a.name.localeCompare(b.name)
  })

  // Get bands playing soon (from events)
  const bandsPlayingSoon = new Set<string>()
  upcomingEvents.forEach(event => {
    event.event_bands?.forEach(eb => {
      if (eb.band?.slug) {
        bandsPlayingSoon.add(eb.band.slug)
      }
    })
  })

  // Popular genres (ones with most bands)
  const genreCounts = new Map<string, number>()
  bands.forEach(band => {
    band.band_genres?.forEach(bg => {
      const name = bg.genre?.name
      if (name) {
        genreCounts.set(name, (genreCounts.get(name) || 0) + 1)
      }
    })
  })
  const popularGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name]) => name)

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Discover Utah Bands
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {filteredBands.length} artists in the local scene
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery || ''}
            placeholder="Search bands, genres, locations..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/discover"
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              !selectedGenre
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Genres
          </Link>
          {popularGenres.map(genre => (
            <Link
              key={genre}
              href={`/discover?genre=${encodeURIComponent(genre)}`}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedGenre?.toLowerCase() === genre.toLowerCase()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {genre}
            </Link>
          ))}
        </div>

        {/* Active Filters */}
        {(selectedGenre || searchQuery) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Filtering by:</span>
            {selectedGenre && (
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full">
                {selectedGenre}
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                "{searchQuery}"
              </span>
            )}
            <Link
              href="/discover"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Clear all
            </Link>
          </div>
        )}
      </div>

      {/* Playing This Week Banner */}
      {!selectedGenre && !searchQuery && bandsPlayingSoon.size > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-2">
            🎸 Playing This Week
          </h2>
          <div className="flex flex-wrap gap-2">
            {[...bandsPlayingSoon].slice(0, 8).map(slug => {
              const band = bands.find(b => b.slug === slug)
              if (!band) return null
              return (
                <Link
                  key={slug}
                  href={`/bands/${slug}`}
                  className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-semibold hover:bg-white/30 transition-colors"
                >
                  {band.name}
                </Link>
              )
            })}
            <Link
              href="/events"
              className="px-3 py-1 bg-white text-green-700 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              See all shows →
            </Link>
          </div>
        </div>
      )}

      {/* Band Grid */}
      {filteredBands.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBands.map(band => {
            const primaryPhoto = band.band_photos?.find(p => p.is_primary) || band.band_photos?.[0]
            const imageUrl = primaryPhoto?.url || band.image_url
            const genres = band.band_genres?.map(bg => bg.genre?.name).filter(Boolean).slice(0, 2) || []
            const isPlayingSoon = band.slug && bandsPlayingSoon.has(band.slug)
            const spotifyLink = band.band_links?.find(l =>
              l.label?.toLowerCase().includes('spotify') ||
              l.url?.includes('spotify.com')
            )

            return (
              <Link
                key={band.id}
                href={`/bands/${band.slug}`}
                className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 transition-all hover:shadow-xl hover:scale-[1.02] ${
                  band.tier === 'hof'
                    ? 'border-yellow-400'
                    : band.tier === 'platinum'
                    ? 'border-purple-400'
                    : isPlayingSoon
                    ? 'border-green-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                }`}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={band.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                      🎸
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {band.tier === 'hof' && (
                      <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-black rounded">
                        HALL OF FAME
                      </span>
                    )}
                    {band.tier === 'platinum' && (
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs font-black rounded">
                        PLATINUM
                      </span>
                    )}
                    {isPlayingSoon && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        PLAYING SOON
                      </span>
                    )}
                  </div>

                  {/* Spotify indicator */}
                  {spotifyLink && (
                    <div className="absolute bottom-2 right-2">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {band.name}
                  </h3>
                  {band.hometown && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {band.hometown}
                    </p>
                  )}
                  {genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {genres.map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No bands found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search or filters
          </p>
          <Link
            href="/discover"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View all bands
          </Link>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-3">
          Are you a Utah band?
        </h2>
        <p className="text-indigo-100 mb-6">
          Get discovered by local fans. Submit your band for free.
        </p>
        <Link
          href="/submit"
          className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Submit Your Band →
        </Link>
      </div>
    </Container>
  )
}
