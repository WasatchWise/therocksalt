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

  // Check if HOF tier
  const isHOF = band.tier === 'hof'
  const isPlatinum = band.tier === 'platinum'
  const isFeatured = band.tier === 'featured'

  return (
    <Container className="py-12">
      {/* ROCK & ROLL HALL OF FAME BANNER - Refined */}
      {isHOF && (
        <div className="mb-8 relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l-4 border-yellow-400 rounded-lg overflow-hidden shadow-xl p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-md text-xs font-black uppercase">
              Hall of Fame
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
            {band.name}
          </h1>
          {band.hometown && (
            <p className="text-yellow-300 text-lg font-semibold">{band.hometown}</p>
          )}
        </div>
      )}

      {/* PLATINUM TIER BANNER - Refined */}
      {isPlatinum && (
        <div className="mb-8 relative bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 border-l-4 border-purple-400 rounded-lg overflow-hidden shadow-xl p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400"></div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-purple-400 text-gray-900 rounded-md text-xs font-black uppercase">
              Platinum
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
            {band.name}
          </h1>
          {band.hometown && (
            <p className="text-purple-300 text-lg font-semibold">{band.hometown}</p>
          )}
        </div>
      )}

      {/* REGULAR HEADER (Featured/Free tier) */}
      {!isHOF && !isPlatinum && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {isFeatured && (
              <span className="px-2 py-1 bg-yellow-400 text-gray-900 rounded text-xs font-bold uppercase">
                Featured
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {band.name}
            </h1>
          </div>
          {band.hometown && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{band.hometown}</p>
          )}
        </div>
      )}

      {/* QUICK STATS BAR */}
      {(band.formed_year || band.status || band.origin_city || band.releases?.length || events.length > 0) && (
        <div className={`mb-8 p-6 rounded-xl ${
          isHOF
            ? 'bg-gradient-to-r from-yellow-900/30 to-red-900/30 border-2 border-yellow-400'
            : isPlatinum
            ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-2 border-purple-400'
            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {band.origin_city && (
              <div className="text-center md:text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">From</div>
                <div className={`text-lg font-bold ${
                  isHOF ? 'text-yellow-400' : isPlatinum ? 'text-purple-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {band.origin_city}{band.state ? `, ${band.state}` : ''}
                </div>
              </div>
            )}

            {band.formed_year && (
              <div className="text-center md:text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  {band.disbanded_year ? 'Active' : 'Formed'}
                </div>
                <div className={`text-lg font-bold ${
                  isHOF ? 'text-yellow-400' : isPlatinum ? 'text-purple-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {band.formed_year}{band.disbanded_year ? ` - ${band.disbanded_year}` : ` (${new Date().getFullYear() - band.formed_year} yrs)`}
                </div>
              </div>
            )}

            {band.status && (
              <div className="text-center md:text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Status</div>
                <div className={`text-lg font-bold capitalize ${
                  isHOF ? 'text-yellow-400' : isPlatinum ? 'text-purple-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {band.status === 'active' && '🎸 '}
                  {band.status}
                </div>
              </div>
            )}

            {band.releases && band.releases.length > 0 && (
              <div className="text-center md:text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Releases</div>
                <div className={`text-lg font-bold ${
                  isHOF ? 'text-yellow-400' : isPlatinum ? 'text-purple-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {band.releases.length}
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div className="text-center md:text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total Shows</div>
                <div className={`text-lg font-bold ${
                  isHOF ? 'text-yellow-400' : isPlatinum ? 'text-purple-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {events.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENT SECTION */}
      <div className="mb-12">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            {/* Genres */}
            {band.band_genres && band.band_genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2">GENRES:</span>
                {band.band_genres
                  .map(bg => bg.genre?.name)
                  .filter(Boolean)
                  .map((genre, idx) => (
                    <span
                      key={idx}
                      className={`px-4 py-2 text-sm font-bold rounded-full ${
                        isHOF
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-2 border-white shadow-lg'
                          : isPlatinum
                          ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg'
                          : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                      }`}
                    >
                      {genre}
                    </span>
                  ))}
              </div>
            )}

            {/* Bio - PROMINENTLY DISPLAYED */}
            {(band.bio || band.description) && (
              <div className={`mb-6 p-6 rounded-xl ${
                isHOF
                  ? 'bg-gradient-to-br from-yellow-50 to-red-50 dark:from-yellow-900/20 dark:to-red-900/20 border-2 border-yellow-400'
                  : isPlatinum
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-400'
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase">
                  {isHOF ? '🎸 The Legend' : isPlatinum ? '💿 The Story' : 'About'}
                </h2>
                <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                  {band.bio || band.description}
                </p>
              </div>
            )}

            {/* Links */}
            {band.band_links && band.band_links.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {band.band_links.map(link => (
                  <a
                    key={link.id}
                    href={link.url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-bold ${
                      isHOF
                        ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-2 border-yellow-400 shadow-xl hover:shadow-2xl hover:scale-105'
                        : isPlatinum
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {link.label || 'Link'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
                className={`w-64 h-64 object-cover rounded-lg shadow-lg ${
                  isHOF ? 'border-4 border-yellow-400' : isPlatinum ? 'border-4 border-purple-400' : ''
                }`}
              />
              {primaryPhoto.source_attribution && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {primaryPhoto.source_attribution}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Claim Page Button (if not claimed) - MOVED LOWER AND STYLED DIFFERENTLY */}
        <ClaimBandButton
          bandId={band.id}
          bandName={band.name}
          isClaimed={!!band.claimed_by}
        />
      </div>

      {/* Band Members Section */}
      {band.band_members && band.band_members.length > 0 && (
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            isHOF ? 'text-yellow-400' : isPlatinum ? 'text-purple-400' : 'text-gray-900 dark:text-white'
          }`}>
            {isHOF ? '🎸 The Legends' : isPlatinum ? '🎤 The Artists' : 'Band Members'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {band.band_members.map((member, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                  isHOF
                    ? 'bg-gradient-to-br from-yellow-50 to-red-50 dark:from-yellow-900/20 dark:to-red-900/20 border-yellow-400 hover:border-yellow-500'
                    : isPlatinum
                    ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-400 hover:border-purple-500'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                }`}
              >
                {member.musician?.slug ? (
                  <a
                    href={`/musicians/${member.musician.slug}`}
                    className={`text-xl font-bold mb-2 block hover:underline ${
                      isHOF ? 'text-yellow-600' : isPlatinum ? 'text-purple-600' : 'text-indigo-600'
                    }`}
                  >
                    {member.musician.name}
                  </a>
                ) : (
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.musician?.name || 'Unknown'}
                  </h3>
                )}

                {member.instrument && (
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    {member.instrument}
                  </p>
                )}

                {member.role && member.role !== member.instrument && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {member.role}
                  </p>
                )}

                {(member.tenure_start || member.tenure_end) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {member.tenure_start || '?'} - {member.tenure_end || 'Present'}
                  </p>
                )}

                {member.musician?.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                    {member.musician.bio}
                  </p>
                )}

                {(member.musician?.website_url || member.musician?.instagram_handle) && (
                  <div className="flex gap-3 mt-4">
                    {member.musician.website_url && (
                      <a
                        href={member.musician.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                      >
                        Website
                      </a>
                    )}
                    {member.musician.instagram_handle && (
                      <a
                        href={`https://instagram.com/${member.musician.instagram_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Releases/Albums Section */}
      {band.releases && band.releases.length > 0 && (
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            isHOF ? 'text-yellow-400' : isPlatinum ? 'text-purple-400' : 'text-gray-900 dark:text-white'
          }`}>
            {isHOF ? '💿 The Classics' : isPlatinum ? '🎵 The Catalog' : 'Releases'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {band.releases
              .sort((a, b) => {
                const yearA = a.release_year || 0
                const yearB = b.release_year || 0
                return yearB - yearA
              })
              .map((release) => (
                <div
                  key={release.id}
                  className={`rounded-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
                    isHOF
                      ? 'border-yellow-400 hover:border-yellow-500'
                      : isPlatinum
                      ? 'border-purple-400 hover:border-purple-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                  }`}
                >
                  {release.cover_image_url && (
                    <img
                      src={release.cover_image_url}
                      alt={release.title}
                      className="w-full aspect-square object-cover"
                    />
                  )}
                  <div className={`p-4 ${
                    isHOF
                      ? 'bg-gradient-to-br from-yellow-50 to-red-50 dark:from-yellow-900/20 dark:to-red-900/20'
                      : isPlatinum
                      ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20'
                      : 'bg-white dark:bg-gray-800'
                  }`}>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {release.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {release.release_year && <span>{release.release_year}</span>}
                      {release.format && (
                        <>
                          {release.release_year && <span>•</span>}
                          <span className="capitalize">{release.format}</span>
                        </>
                      )}
                    </div>
                    {(release.spotify_url || release.bandcamp_url) && (
                      <div className="flex gap-2">
                        {release.spotify_url && (
                          <a
                            href={release.spotify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 text-center px-3 py-2 rounded text-sm font-bold transition-all ${
                              isHOF
                                ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white'
                                : isPlatinum
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            Spotify
                          </a>
                        )}
                        {release.bandcamp_url && (
                          <a
                            href={release.bandcamp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 text-center px-3 py-2 rounded text-sm font-bold transition-all ${
                              isHOF
                                ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white'
                                : isPlatinum
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                                : 'bg-cyan-600 text-white hover:bg-cyan-700'
                            }`}
                          >
                            Bandcamp
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

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
