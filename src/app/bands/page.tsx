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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bands.map((band) => (
          <Link
            key={band.id}
            href={`/bands/${band.slug}`}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] block"
          >
            <div className="flex items-center gap-2 mb-3">
              {band.featured && (
                <span className="text-yellow-500 text-xl" title="Featured Artist">
                  ★
                </span>
              )}
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
        ))}
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


