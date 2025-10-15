import { getBands } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Artists',
  description: 'Discover talented local artists from Salt Lake City. Browse our directory of bands and musicians across all genres.',
}

export default async function BandsPage() {
  const bands = await getBands(500)

  // Sort by tier (hof -> featured -> free) then by name
  const tierOrder = { hof: 0, featured: 1, free: 2 }
  const sortedBands = [...bands].sort((a, b) => {
    const tierA = tierOrder[a.tier as keyof typeof tierOrder] ?? 2
    const tierB = tierOrder[b.tier as keyof typeof tierOrder] ?? 2
    if (tierA !== tierB) return tierA - tierB
    return (a.name || '').localeCompare(b.name || '')
  })

  // Separate HOF tier bands for special display
  const hofBands = sortedBands.filter(b => b.tier === 'hof')
  const regularBands = sortedBands.filter(b => b.tier !== 'hof')

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Artist Directory
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover talented local artists from the Salt Lake City music scene
        </p>
      </div>

      {/* ROCK & ROLL HALL OF FAME TIER - Full width, massive cards */}
      {hofBands.length > 0 && (
        <section className="mb-16">
          <div className="space-y-8">
            {hofBands.map((band) => (
              <Link
                key={band.id}
                href={`/bands/${band.slug}`}
                className="block relative bg-gradient-to-br from-red-900 via-purple-900 to-red-900 border-8 border-yellow-400 rounded-3xl overflow-hidden shadow-2xl hover:shadow-yellow-400/70 transition-all duration-500 hover:scale-[1.02]"
              >
                {/* PREMIUM BADGE */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-gray-900 px-8 py-3 rounded-full font-black text-xl uppercase shadow-2xl border-4 border-white animate-bounce">
                  ⭐ ROCK & ROLL HALL OF FAME ⭐
                </div>

                {/* SPOTLIGHT ANIMATION */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-400 via-red-500 via-purple-500 to-yellow-400 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-400 via-red-500 via-purple-500 to-yellow-400 animate-pulse"></div>

                <div className="p-8 md:p-12 pt-20">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* LEFT: Band Info */}
                    <div className="flex-1">
                      <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mb-6 leading-tight tracking-tight uppercase">
                        {band.name}
                      </h2>

                      {band.bio && (
                        <p className="text-white text-xl mb-6 leading-relaxed line-clamp-3">
                          {band.bio}
                        </p>
                      )}

                      {band.band_genres?.length ? (
                        <div className="flex flex-wrap gap-3 mb-6">
                          <span className="text-lg font-black text-yellow-300 uppercase tracking-wide">
                            Genres:
                          </span>
                          {band.band_genres
                            ?.map((bg) => bg.genre?.name)
                            .filter(Boolean)
                            .map((genre, index) => (
                              <span
                                key={index}
                                className="px-6 py-3 text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-full font-black uppercase shadow-xl border-2 border-white"
                              >
                                {genre}
                              </span>
                            ))}
                        </div>
                      ) : null}
                    </div>

                    {/* RIGHT: Links */}
                    {band.band_links?.length ? (
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 text-gray-900 rounded-3xl p-8 shadow-2xl border-8 border-white">
                          <h3 className="text-2xl font-black uppercase tracking-wider mb-4">Listen Now</h3>
                          <div className="flex flex-col gap-3">
                            {band.band_links.map((link) => (
                              <a
                                key={link.id}
                                href={link.url ?? '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white text-lg font-black rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 uppercase border-2 border-yellow-400"
                              >
                                {link.label || 'Link'}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* REGULAR BANDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {regularBands.map((band) => {
          const tier = band.tier || 'free'

          // FEATURED TIER - Enhanced styling
          if (tier === 'featured') {
            return (
              <Link
                key={band.id}
                href={`/bands/${band.slug}`}
                className="block bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-4 border-yellow-400 rounded-xl p-6 shadow-xl hover:shadow-yellow-400/50 transition-all hover:scale-[1.05]"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-pulse rounded-t-xl"></div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-400 text-2xl animate-pulse">★</span>
                  <h2 className="text-xl font-black text-white uppercase truncate">
                    {band.name}
                  </h2>
                </div>

                {band.band_genres?.length ? (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {band.band_genres
                        ?.map((bg) => bg.genre?.name)
                        .filter(Boolean)
                        .map((genre, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-black bg-yellow-400 text-gray-900 rounded-full uppercase"
                          >
                            {genre}
                          </span>
                        ))}
                    </div>
                  </div>
                ) : null}

                {band.band_links?.length ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {band.band_links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-bold"
                        >
                          {link.label || 'Link'}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Link>
            )
          }

          // FREE TIER - Simple card
          return (
            <Link
              key={band.id}
              href={`/bands/${band.slug}`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] block"
            >
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {band.name}
                </h2>
              </div>

              {band.band_genres?.length ? (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {band.band_genres
                      ?.map((bg) => bg.genre?.name)
                      .filter(Boolean)
                      .map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                  </div>
                </div>
              ) : null}

              {band.band_links?.length ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Listen:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {band.band_links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        {link.label || 'Link'}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </Link>
          )
        })}
      </div>

      {bands.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎸</div>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No artists found. Check back soon for new additions!
          </p>
        </div>
      )}
    </Container>
  )
}


