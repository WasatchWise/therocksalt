import { notFound } from 'next/navigation'
import { getVenueBySlug, getVenueEvents, getAllVenueSlugs } from '@/lib/supabase/queries'
import { getVenueDetails, getVenueTypeDescription, getGoogleMapsUrl, getDirectionsUrl } from '@/lib/apis/google-places'
import Container from '@/components/Container'
import Button from '@/components/Button'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // Cache for 1 hour (Google Places API calls)

// Extended venue type to handle fields that may exist in DB but not in generated types
interface ExtendedVenue {
  id: string
  name: string
  slug: string
  address?: string | null
  city?: string | null
  state?: string | null
  website?: string | null
  capacity?: number | null
  // Fields that may exist but aren't in generated types
  image_url?: string | null
  notes?: string | null
  venue_type?: string | null
  featured?: boolean | null
  phone?: string | null
  claimed_by?: string | null
  venue_photos?: Array<{ id: string; url: string; caption?: string; is_primary?: boolean; photo_order?: number }> | null
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const venueData = await getVenueBySlug(slug)

  if (!venueData) {
    return {
      title: 'Venue Not Found'
    }
  }

  // Cast to extended type to access optional fields
  const venue = venueData as unknown as ExtendedVenue

  return {
    title: `${venue.name} | Salt Lake City Music Venue | The Rock Salt`,
    description: venue.notes || `${venue.name} - ${venue.city || 'Salt Lake City'} music venue. Find upcoming shows, venue info, and more on The Rock Salt.`,
  }
}

// Utah venue descriptions for places we know well
const VENUE_DESCRIPTIONS: Record<string, { vibe: string; expect: string; bestFor: string }> = {
  'urban-lounge': {
    vibe: 'Intimate, sweaty, legendary. The kind of room where you can feel the bass in your chest.',
    expect: 'Standing room, craft beer, and some of the best touring acts in a 500-cap room.',
    bestFor: 'Indie rock, punk, electronic, hip-hop - basically everything good.'
  },
  'kilby-court': {
    vibe: 'DIY backyard vibes in a literal garage. Where Utah bands are born.',
    expect: 'All-ages shows, local bands, and the occasional secret headliner.',
    bestFor: 'Local music discovery, all-ages crowds, intimate performances.'
  },
  'the-depot': {
    vibe: 'Big room energy in a converted train station. Salt Lake\'s mid-size workhorse.',
    expect: 'GA floor with balcony seating, full bars, proper sound system.',
    bestFor: 'National touring acts, sold-out shows, when Urban Lounge is too small.'
  },
  'the-state-room': {
    vibe: 'Upscale listening room with dinner service. Sit-down shows for grown folks.',
    expect: 'Reserved seating, full menu, premium acoustics.',
    bestFor: 'Singer-songwriters, acoustic sets, jazz, blues, folk.'
  },
  'soundwell': {
    vibe: 'Industrial-chic warehouse vibes on the west side.',
    expect: 'Open floor plan, good beer selection, DJ nights and live bands.',
    bestFor: 'Electronic, indie, hip-hop, events.'
  },
  'metro-music-hall': {
    vibe: 'The Depot\'s little sibling. Solid mid-size room.',
    expect: 'Standing room, good sightlines, attached to The Depot.',
    bestFor: 'Growing touring acts, local headliners.'
  },
  'piper-down': {
    vibe: 'Irish pub meets punk rock basement. Dive bar excellence.',
    expect: 'Cheap beer, late nights, real rock and roll.',
    bestFor: 'Punk, metal, rock, no-frills shows.'
  },
  'ice-haus': {
    vibe: 'West side DIY space with serious community energy.',
    expect: 'All-ages, volunteer-run, underground.',
    bestFor: 'Punk, hardcore, experimental, local scenes.'
  },
  'barbary-coast': {
    vibe: 'Neighborhood bar with a stage. Unpretentious and loud.',
    expect: 'Dive bar atmosphere, cheap drinks, rock shows.',
    bestFor: 'Rock, punk, metal, local bands.'
  },
  'aces-high-saloon': {
    vibe: 'Biker bar energy meets live music. Real deal.',
    expect: 'Pool tables, cheap beer, loud rock.',
    bestFor: 'Metal, rock, punk, outlaw country.'
  },
  'velour': {
    vibe: 'Provo\'s all-ages institution. Where Utah County bands get their start.',
    expect: 'All-ages, no alcohol, family-friendly but not lame.',
    bestFor: 'Indie, rock, folk, local music, all-ages crowds.'
  },
  'the-complex': {
    vibe: 'Massive warehouse complex with multiple rooms.',
    expect: 'Large-scale production, EDM shows, big events.',
    bestFor: 'EDM, large touring acts, festivals.'
  },
  'red-butte-garden': {
    vibe: 'Outdoor amphitheater in the foothills. Utah\'s prettiest venue.',
    expect: 'Lawn seating, gorgeous views, summer concerts.',
    bestFor: 'Summer concerts, big folk/rock acts, sunset shows.'
  },
  'vivint-arena': {
    vibe: 'The big one. Arena shows for arena bands.',
    expect: 'Stadium seating, major production, expensive beer.',
    bestFor: 'Arena tours, major headliners, sports.'
  },
  'egyptian-theatre': {
    vibe: 'Historic Park City gem. Gorgeous old-school theater.',
    expect: 'Seated shows, film screenings, intimate theater experience.',
    bestFor: 'Film, smaller concerts, special events.'
  },
  'hog-wallow': {
    vibe: 'Brighton base area bar with live music. Ski town vibes.',
    expect: 'Apres-ski crowds, mountain air, casual atmosphere.',
    bestFor: 'Rock, country, apres-ski entertainment.'
  }
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params
  const venueData = await getVenueBySlug(slug)

  if (!venueData) {
    notFound()
  }

  // Cast to extended type to access fields that may exist but aren't in generated types
  const venue = venueData as unknown as ExtendedVenue

  const events = await getVenueEvents(venue.id)

  // Get Google Places data for images and additional info
  const googleDetails = await getVenueDetails(
    venue.name,
    venue.city || 'Salt Lake City',
    venue.state || 'UT'
  )

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.filter(e => e.start_time && new Date(e.start_time) >= now)
  const pastEvents = events.filter(e => e.start_time && new Date(e.start_time) < now)

  // Get venue-specific description if we have one
  const venueInfo = VENUE_DESCRIPTIONS[slug]
  const venueTypeLabel = venue.venue_type || getVenueTypeDescription(googleDetails.types)

  // Use Google photo if no database image
  const heroImage = venue.image_url || googleDetails.photoUrl

  return (
    <Container className="py-12">
      {/* Hero Section with Image */}
      <div className="mb-8">
        {heroImage ? (
          <div className="relative aspect-[21/9] bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden mb-6">
            <img
              src={heroImage}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Venue name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                {venue.featured && (
                  <span className="text-yellow-400 text-2xl" title="Featured Venue">★</span>
                )}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                  {venueTypeLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                {venue.name}
              </h1>
              {venue.address && (
                <p className="text-white/90 mt-2 text-lg">
                  {venue.address}{venue.city && `, ${venue.city}`}
                </p>
              )}
            </div>
          </div>
        ) : (
          // No image fallback
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {venue.featured && (
                <span className="text-yellow-500 text-2xl" title="Featured Venue">★</span>
              )}
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded-full">
                {venueTypeLabel}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {venue.name}
            </h1>
          </div>
        )}

        {/* Quick Info Bar */}
        <div className="flex flex-wrap gap-4 items-center text-sm">
          {venue.capacity && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Capacity: {venue.capacity.toLocaleString()}</span>
            </div>
          )}
          {googleDetails.rating && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-yellow-500">★</span>
              <span>{googleDetails.rating.toFixed(1)} ({googleDetails.totalRatings?.toLocaleString()} reviews)</span>
            </div>
          )}
          {googleDetails.isOpenNow !== null && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${googleDetails.isOpenNow ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
              {googleDetails.isOpenNow ? 'Open Now' : 'Closed'}
            </span>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* What to Expect */}
          {venueInfo && (
            <section className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                What to Expect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">The Vibe</h3>
                  <p className="text-gray-700 dark:text-gray-300">{venueInfo.vibe}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">What You Get</h3>
                  <p className="text-gray-700 dark:text-gray-300">{venueInfo.expect}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Best For</h3>
                  <p className="text-gray-700 dark:text-gray-300">{venueInfo.bestFor}</p>
                </div>
              </div>
            </section>
          )}

          {/* Description from DB */}
          {venue.notes && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{venue.notes}</p>
            </section>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upcoming Shows ({upcomingEvents.length})
                </h2>
                <Link href="/events" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                  See all events →
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 5).map(event => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {event.name || 'Untitled Event'}
                        </h3>
                        {event.start_time && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(event.start_time).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                        {event.event_bands && event.event_bands.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {event.event_bands
                              .map(eb => eb.band)
                              .filter(Boolean)
                              .slice(0, 3)
                              .map((band, idx) => (
                                <Link
                                  key={idx}
                                  href={`/bands/${band!.slug}`}
                                  className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900"
                                >
                                  {band!.name}
                                </Link>
                              ))}
                          </div>
                        )}
                      </div>
                      {event.ticket_price && (
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          ${event.ticket_price}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Shows
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {pastEvents.slice(0, 6).map(event => (
                  <div
                    key={event.id}
                    className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {event.name || 'Untitled Event'}
                    </h3>
                    {event.start_time && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Contact & Location
            </h2>

            {/* Address */}
            {venue.address && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                <p className="text-gray-900 dark:text-white">
                  {venue.address}
                </p>
                {(venue.city || venue.state) && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {[venue.city, venue.state].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Phone */}
            {venue.phone && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                <a href={`tel:${venue.phone}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {venue.phone}
                </a>
              </div>
            )}

            {/* Hours */}
            {googleDetails.openingHours && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hours</p>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                  {googleDetails.openingHours.map((hours, idx) => (
                    <p key={idx}>{hours}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Visit Website
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              {googleDetails.placeId && (
                <a
                  href={getGoogleMapsUrl(googleDetails.placeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View on Google Maps
                </a>
              )}

              {googleDetails.lat && googleDetails.lng && (
                <a
                  href={getDirectionsUrl(googleDetails.lat, googleDetails.lng, venue.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </a>
              )}
            </div>
          </div>

          {/* Additional Photos */}
          {googleDetails.additionalPhotos.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                More Photos
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {googleDetails.additionalPhotos.slice(0, 4).map((photoUrl, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={photoUrl}
                      alt={`${venue.name} photo ${idx + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claim Venue CTA */}
          {!venue.claimed_by && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Own this venue?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Claim this page to manage your info, post shows, and connect with artists.
              </p>
              <Button variant="primary" size="sm" className="w-full">
                Claim This Venue
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {events.length === 0 && !venueInfo && !venue.notes && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No events yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            We&apos;re still gathering info about this venue.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Know about an upcoming show? Submit it →
          </Link>
        </div>
      )}
    </Container>
  )
}
