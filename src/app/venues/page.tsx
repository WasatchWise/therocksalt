import { getVenues } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Venues',
  description: 'Discover live music venues in Salt Lake City. Find the perfect space for your next show.',
}

export default async function VenuesPage() {
  const venues = await getVenues(100)

  // Sort alphabetically by name for now (no tier system on venues yet)
  const sortedVenues = [...venues].sort((a, b) => {
    return (a.name || '').localeCompare(b.name || '')
  })

  // No tier filtering for now
  const hofVenues = []
  const regularVenues = sortedVenues

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Venues
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover live music venues across Salt Lake City - from intimate clubs to large halls
        </p>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎪</div>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No venues found. Check back soon!
          </p>
        </div>
      ) : (
        <>
          {/* ROCK & ROLL HALL OF FAME TIER - Refined premium treatment */}
          {hofVenues.length > 0 && (
            <section className="mb-12">
              <div className="space-y-4">
                {hofVenues.map((venue) => {
                  const primaryPhoto = venue.venue_photos?.find(p => p.is_primary) || venue.venue_photos?.[0]

                  return (
                    <Link
                      key={venue.id}
                      href={`/venues/${venue.slug}`}
                      className="block relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l-4 border-yellow-400 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                    >
                      {/* Subtle top accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>

                      <div className="p-6 md:p-8">
                        <div className="flex items-start gap-3 mb-4">
                          <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-md text-xs font-black uppercase">
                            Premier Venue
                          </span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                          {/* LEFT: Photo */}
                          {(primaryPhoto || venue.image_url) && (
                            <div className="flex-shrink-0 w-full lg:w-64">
                              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden border-2 border-yellow-400 shadow-lg">
                                <img
                                  src={primaryPhoto?.url || venue.image_url || ''}
                                  alt={venue.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}

                          {/* RIGHT: Venue Info */}
                          <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                              {venue.name}
                            </h2>

                            {/* Location */}
                            {(venue.city || venue.state) && (
                              <div className="flex items-center gap-2 text-yellow-300 mb-4 text-lg font-semibold">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                <span>{[venue.city, venue.state].filter(Boolean).join(', ')}</span>
                              </div>
                            )}

                            {/* Capacity */}
                            {venue.capacity && (
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-bold text-base mb-4">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                                </svg>
                                <span>Capacity: {venue.capacity.toLocaleString()}</span>
                              </div>
                            )}

                            {venue.notes && (
                              <p className="text-white/90 text-base mb-4 leading-relaxed line-clamp-3">
                                {venue.notes}
                              </p>
                            )}

                            {/* Amenities */}
                            {venue.amenities && (
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(venue.amenities as Record<string, boolean>)
                                  .filter(([_, value]) => value)
                                  .map(([key]) => (
                                    <span
                                      key={key}
                                      className="px-3 py-1 text-sm bg-yellow-400/20 text-yellow-300 rounded-md border border-yellow-400/30 font-medium"
                                    >
                                      {key.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* REGULAR VENUES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularVenues.map((venue) => {
              const primaryPhoto = venue.venue_photos?.find(p => p.is_primary) || venue.venue_photos?.[0]

              // Simple card for all venues
              return (
                <Link
                  key={venue.id}
                  href={`/venues/${venue.slug}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.02] block"
                >
                  {/* Photo */}
                  {(primaryPhoto || venue.image_url) && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={primaryPhoto?.url || venue.image_url || ''}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {venue.name}
                    </h2>

                    {/* Location */}
                    {(venue.city || venue.state) && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">
                          {[venue.city, venue.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Capacity */}
                    {venue.capacity && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">Capacity: {venue.capacity.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Description */}
                    {venue.notes && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                        {venue.notes}
                      </p>
                    )}

                    {/* Amenities */}
                    {venue.amenities && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(venue.amenities as Record<string, boolean>)
                          .filter(([_, value]) => value)
                          .slice(0, 3)
                          .map(([key]) => (
                            <span
                              key={key}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                            >
                              {key.replace(/_/g, ' ')}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}

      {/* Stats */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Showing {venues.length} venue{venues.length !== 1 ? 's' : ''} in Salt Lake City
        </p>
      </div>
    </Container>
  )
}
