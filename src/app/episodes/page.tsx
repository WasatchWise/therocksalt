import { getEpisodes } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Radio Episodes | The Rock Salt',
  description: 'Listen to Rock Salt Radio episodes featuring local Salt Lake City artists. Live music sessions, interviews, and performances.',
}

export default async function EpisodesPage() {
  const episodes = await getEpisodes(50)

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Rock Salt Radio Episodes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Listen to our radio episodes featuring live sessions, interviews, and performances from Salt Lake City&apos;s finest musicians.
        </p>
      </div>

      {episodes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎙️</div>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No episodes yet. Check back soon for new content!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes.map((episode) => (
            <article
              key={episode.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {episode.title}
                  </h2>
                  {episode.featured && (
                    <span className="text-yellow-500 text-xl ml-2" title="Featured Episode">
                      ★
                    </span>
                  )}
                </div>

                {episode.date && (
                  <time className="text-sm text-gray-500 dark:text-gray-400 block mb-4">
                    {new Date(episode.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}

                {episode.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {episode.description}
                  </p>
                )}

                {episode.episode_links && episode.episode_links.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Watch/Listen:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {episode.episode_links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          {link.label || 'Watch'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </Container>
  )
}
