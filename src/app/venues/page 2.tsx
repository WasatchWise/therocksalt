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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => {
            const primaryPhoto = venue.venue_photos?.find(p => p.is_primary) || venue.venue_photos?.[0]

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
                  {/* Name & Featured */}
                  <div className="flex items-center gap-2 mb-3">
                    {venue.featured && (
                      <span className="text-yellow-500 text-xl" title="Featured Venue">
                        ★
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {venue.name}
                    </h2>
                  </div>

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
                  {venue.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                      {venue.description}
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
