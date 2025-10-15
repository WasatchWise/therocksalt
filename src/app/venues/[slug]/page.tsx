import { notFound } from 'next/navigation'
import { getVenueBySlug, getVenueEvents, getAllVenueSlugs } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import Button from '@/components/Button'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60

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
  const venue = await getVenueBySlug(slug)

  if (!venue) {
    return {
      title: 'Venue Not Found'
    }
  }

  return {
    title: venue.name,
    description: venue.description || venue.bio || `${venue.name} - Salt Lake City music venue featured on The Rock Salt`,
  }
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params
  const venue = await getVenueBySlug(slug)

  if (!venue) {
    notFound()
  }

  const events = await getVenueEvents(venue.id)

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.filter(e => e.start_time && new Date(e.start_time) >= now)
  const pastEvents = events.filter(e => e.start_time && new Date(e.start_time) < now)

  // Get primary photo
  const primaryPhoto = venue.venue_photos?.find(p => p.is_primary) || venue.venue_photos?.[0]

  return (
    <Container className="py-12">
      {/* Header Section */}
      <div className="mb-12">
        {/* Photo Hero */}
        {(primaryPhoto || venue.image_url) && (
          <div className="aspect-[21/9] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-8">
            <img
              src={primaryPhoto?.url || venue.image_url || ''}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {venue.featured && (
                <span className="text-yellow-500 text-2xl" title="Featured Venue">
                  ★
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {venue.name}
              </h1>
            </div>

            {/* Location */}
            {venue.address && (
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-4">
                <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p>{venue.address}</p>
                  {(venue.city || venue.state) && (
                    <p>{[venue.city, venue.state, venue.zip_code].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {(venue.bio || venue.description) && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {venue.bio || venue.description}
              </p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {venue.capacity && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Capacity</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {venue.capacity.toLocaleString()}
                  </p>
                </div>
              )}
              {upcomingEvents.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Upcoming Shows</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {upcomingEvents.length}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap gap-3">
              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Website
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {venue.phone && (
                <a
                  href={`tel:${venue.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {venue.phone}
                </a>
              )}
              {venue.email && (
                <a
                  href={`mailto:${venue.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              )}
              {venue.venue_links && venue.venue_links.length > 0 && venue.venue_links.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {link.label || 'Link'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Claim Page Button (if not claimed) */}
        {!venue.claimed_by && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg p-6 border-2 border-dashed border-indigo-300 dark:border-indigo-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Is this your venue?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Claim this page to manage your venue info, post opportunities, and connect with artists.
                </p>
              </div>
              <Button variant="primary" size="lg">
                Claim This Venue
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Amenities */}
      {venue.amenities && Object.keys(venue.amenities as object).length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(venue.amenities as Record<string, boolean>)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                >
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 dark:text-white capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Booking Info */}
      {venue.booking_info && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Information
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {venue.booking_info}
            </p>
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {venue.venue_photos && venue.venue_photos.length > 1 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Photos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {venue.venue_photos
              .sort((a, b) => (a.photo_order || 0) - (b.photo_order || 0))
              .map(photo => (
                <div key={photo.id} className="aspect-square">
                  <img
                    src={photo.url}
                    alt={photo.caption || venue.name}
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

      {/* Upcoming Events */}
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
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
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
                {event.event_bands && event.event_bands.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Featuring:
                    </span>
                    {event.event_bands
                      .map(eb => eb.band)
                      .filter(Boolean)
                      .map((band, idx) => (
                        <Link
                          key={idx}
                          href={`/bands/${band!.slug}`}
                          className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                        >
                          {band!.name}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Events */}
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!venue.venue_photos?.length && events.length === 0 && !venue.amenities && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            More content coming soon. Check back later!
          </p>
        </div>
      )}
    </Container>
  )
}
