import { getPublicSpiderRiders } from '@/lib/supabase/spider-rider-queries'
import Container from '@/components/Container'
import Link from 'next/link'
import type { Metadata} from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Tour Spider Riders - Browse Available Bands',
  description: 'Find bands available for booking. View their rates, event types, and requirements.',
}

export default async function SpiderRidersPage() {
  const riders = await getPublicSpiderRiders(100)

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
          🕸️ Tour Spider Riders
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Bands ready to book. Browse their rates, event types, and requirements.
          Request a booking instantly!
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-2">For Event Organizers & Venues</h2>
        <p className="text-lg opacity-90 mb-4">
          These bands have posted their touring terms publicly. If your budget and requirements match,
          you can request a booking with one click - no cold-emailing required!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span>No "exposure" gigs - all bands require payment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span>Instant booking requests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span>Auto-generated contracts</span>
          </div>
        </div>
      </div>

      {/* Riders List */}
      {riders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🕸️</div>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No active Spider Riders yet. Be the first to post yours!
          </p>
          <Link
            href="/dashboard/spider-rider"
            className="inline-block mt-6 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Your Spider Rider
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {riders.map((rider: any) => {
            const band = rider.band
            const minGuarantee = rider.guarantee_min ? rider.guarantee_min / 100 : null
            const maxGuarantee = rider.guarantee_max ? rider.guarantee_max / 100 : null

            return (
              <div
                key={rider.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                {/* Band Name & Tier Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Link
                      href={`/bands/${band.slug}`}
                      className="text-2xl font-black text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {band.name}
                    </Link>
                    {band.city && band.state && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {band.city}, {band.state}
                      </p>
                    )}
                  </div>

                  {band.tier === 'hof' && (
                    <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-black uppercase rounded-full">
                      ⭐ HOF
                    </span>
                  )}
                  {band.tier === 'featured' && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold uppercase rounded-full">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Guarantee Range */}
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                    Guarantee Range
                  </div>
                  <div className="text-3xl font-black text-green-900 dark:text-green-200">
                    {minGuarantee && maxGuarantee
                      ? `$${minGuarantee.toLocaleString()} - $${maxGuarantee.toLocaleString()}`
                      : minGuarantee
                      ? `$${minGuarantee.toLocaleString()}+`
                      : 'Contact for rate'}
                  </div>
                </div>

                {/* Event Types */}
                {rider.available_for_event_types && rider.available_for_event_types.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Available For:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rider.available_for_event_types.map((type: string) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold rounded-full"
                        >
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Genres */}
                {band.band_genres && band.band_genres.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Genres:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {band.band_genres
                        .map((bg: any) => bg.genre?.name)
                        .filter(Boolean)
                        .map((genre: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Capacity Range (for venue shows) */}
                {rider.min_venue_capacity && rider.max_venue_capacity && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Venue Capacity:
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      {rider.min_venue_capacity.toLocaleString()} - {rider.max_venue_capacity.toLocaleString()} people
                    </div>
                  </div>
                )}

                {/* Experience Highlights */}
                <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {rider.corporate_events_experience > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {rider.corporate_events_experience}
                      </span>
                      corporate events
                    </div>
                  )}
                  {rider.wedding_experience > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {rider.wedding_experience}
                      </span>
                      weddings
                    </div>
                  )}
                  {rider.owns_sound_system && (
                    <div className="flex items-center gap-1">
                      ✓ Owns sound
                    </div>
                  )}
                  {rider.has_mc_experience && (
                    <div className="flex items-center gap-1">
                      ✓ MC services
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/bands/${band.slug}`}
                  className="block w-full text-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
                >
                  View Full Profile & Request Booking
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* CTA for bands */}
      <div className="mt-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Are you a band?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Post your Spider Rider and let venues, wedding planners, and corporate organizers find YOU.
        </p>
        <Link
          href="/dashboard/spider-rider"
          className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          🕸️ Create Your Spider Rider
        </Link>
      </div>
    </Container>
  )
}
