import { notFound } from 'next/navigation'
import { getBandBySlug, getBandEvents, getAllBandSlugs } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import AudioPlayer from '@/components/AudioPlayer'
import ClaimBandButton from '@/components/ClaimBandButton'
import type { Metadata } from 'next'

export const revalidate = 0 // Force dynamic rendering

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Return empty array for dynamic rendering
  // In production, you can pre-generate known slugs
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const band = await getBandBySlug(slug)

  if (!band) {
    return {
      title: 'Band Not Found'
    }
  }

  return {
    title: band.name,
    description: `${band.name} - Salt Lake City local artist featured on The Rock Salt`,
  }
}

export default async function BandPage({ params }: Props) {
  const { slug } = await params
  const band = await getBandBySlug(slug)

  if (!band) {
    notFound()
  }

  const events = await getBandEvents(band.id)

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.filter(e => e.start_time && new Date(e.start_time) >= now)
  const pastEvents = events.filter(e => e.start_time && new Date(e.start_time) < now)

  // Get featured/primary photo
  const primaryPhoto = band.band_photos?.find(p => p.is_primary) || band.band_photos?.[0]

  return (
    <Container className="py-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {band.featured && (
                <span className="text-yellow-500 text-2xl" title="Featured Artist">
                  ★
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {band.name}
              </h1>
            </div>

            {/* Genres */}
            {band.band_genres && band.band_genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {band.band_genres
                  .map(bg => bg.genre?.name)
                  .filter(Boolean)
                  .map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
              </div>
            )}

            {/* Bio */}
            {(band.bio || band.description) && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {band.bio || band.description}
              </p>
            )}

            {/* Links */}
            {band.band_links && band.band_links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {band.band_links.map(link => (
                  <a
                    key={link.id}
                    href={link.url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {link.label || 'Link'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Primary Photo */}
          {primaryPhoto && (
            <div className="flex-shrink-0">
              <img
                src={primaryPhoto.url}
                alt={primaryPhoto.caption || band.name}
                className="w-64 h-64 object-cover rounded-lg shadow-lg"
              />
              {primaryPhoto.source_attribution && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {primaryPhoto.source_attribution}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Claim Page Button (if not claimed) */}
        <ClaimBandButton
          bandId={band.id}
          bandName={band.name}
          isClaimed={!!band.claimed_by}
        />
      </div>

      {/* Tracks/Demos Section */}
      {band.band_tracks && band.band_tracks.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tracks & Demos
          </h2>
          <div className="space-y-4">
            {band.band_tracks
              .sort((a, b) => {
                if (a.is_featured && !b.is_featured) return -1
                if (!a.is_featured && b.is_featured) return 1
                return 0
              })
              .map(track => (
                <div key={track.id}>
                  <AudioPlayer
                    src={track.file_url}
                    title={track.title}
                    artist={band.name}
                    trackId={track.id}
                  />
                  {track.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-16">
                      {track.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1 ml-16">
                    {track.track_type && (
                      <span className="capitalize">{track.track_type.replace('_', ' ')}</span>
                    )}
                    {track.play_count !== undefined && track.play_count > 0 && (
                      <span>{track.play_count} plays</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {band.band_photos && band.band_photos.length > 1 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Photos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {band.band_photos
              .sort((a, b) => (a.photo_order || 0) - (b.photo_order || 0))
              .map(photo => (
                <div key={photo.id} className="aspect-square">
                  <img
                    src={photo.url}
                    alt={photo.caption || band.name}
                    className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
                  />
                  {photo.caption && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {photo.caption}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Custom HTML Section */}
      {band.custom_html && (
        <section className="mb-12">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: band.custom_html }}
          />
        </section>
      )}

      {/* Upcoming Shows */}
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Upcoming Shows
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.name || 'Untitled Event'}
                </h3>
                {event.start_time && (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {new Date(event.start_time).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                )}
                {event.venue && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {event.venue.name}
                    {event.venue.address && ` • ${event.venue.address}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Shows */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Past Shows
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.slice(0, 6).map(event => (
              <div
                key={event.id}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {event.name || 'Untitled Event'}
                </h3>
                {event.start_time && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.start_time).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                )}
                {event.venue && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.venue.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!band.band_tracks?.length && !band.band_photos?.length && events.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            More content coming soon. Check back later!
          </p>
        </div>
      )}
    </Container>
  )
}
