import { getEvents } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import EventSubmissionForm from '@/components/EventSubmissionForm'
import EventBandCard from '@/components/EventBandCard'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming live music events and shows across Utah. Find where and when your favorite local artists are performing.',
}

export default async function EventsPage() {
  const events = await getEvents(50)

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.filter(e => e.start_time && new Date(e.start_time) >= now)
  const pastEvents = events.filter(e => e.start_time && new Date(e.start_time) < now)

  // Sort by tier (hof -> featured -> free) then by start_time
  const tierOrder = { hof: 0, featured: 1, free: 2 }
  upcomingEvents.sort((a, b) => {
    const tierA = tierOrder[a.tier as keyof typeof tierOrder] ?? 2
    const tierB = tierOrder[b.tier as keyof typeof tierOrder] ?? 2
    if (tierA !== tierB) return tierA - tierB
    return new Date(a.start_time!).getTime() - new Date(b.start_time!).getTime()
  })

  return (
    <Container className="py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          Live Shows
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Upcoming shows and live music across Utah
        </p>
      </div>

      {/* Upcoming Events - MARQUEE STYLE */}
      {upcomingEvents.length > 0 && (
        <section className="mb-16">
          <div className="space-y-8">
            {upcomingEvents.map((event) => {
              const eventDate = new Date(event.start_time!)
              const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
              const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
              const day = eventDate.getDate()
              const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()
              const tier = event.tier || 'free'

              // FREE TIER - Simple, compact listing
              if (tier === 'free') {
                return (
                  <article
                    key={event.id}
                    id={event.id}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow hover:shadow-md transition-all scroll-mt-20"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {event.name}
                        </h3>
                        {event.venue && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.venue.name} • {month} {day} at {time}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900 dark:text-white">$10</div>
                        <div className="text-xs text-gray-500">At Door</div>
                      </div>
                    </div>
                  </article>
                )
              }

              // ROCK & ROLL HOF TIER - Premium but refined
              if (tier === 'hof') {
                return (
                  <article
                    key={event.id}
                    id={event.id}
                    className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l-4 border-yellow-400 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] scroll-mt-20"
                  >
                    {/* Subtle top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>

                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-md text-xs font-black uppercase">
                          Hall of Fame
                        </span>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* LEFT: DATE BOX */}
                        <div className="flex-shrink-0 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg p-4 text-center shadow-lg border-2 border-yellow-400">
                          <div className="text-xs font-bold uppercase">{dayOfWeek}</div>
                          <div className="text-sm font-black">{month}</div>
                          <div className="text-4xl font-black leading-none my-1">{day}</div>
                          <div className="text-lg font-black text-yellow-300">{time}</div>
                        </div>

                        {/* MIDDLE: EVENT INFO */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                            {event.name}
                          </h3>

                          {event.venue && (
                            <div className="flex items-center gap-2 text-yellow-300 mb-4 text-lg font-semibold">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                              </svg>
                              <span>{event.venue.name}</span>
                              {event.venue.city && (
                                <span className="text-white/70">• {event.venue.city}</span>
                              )}
                            </div>
                          )}

                          {event.description && (
                            <p className="text-white/90 text-base mb-4 leading-relaxed">
                              {event.description}
                            </p>
                          )}

                          {event.event_bands && event.event_bands.length > 0 && (
                            <div className="space-y-3 mb-4">
                              {/* Headliners */}
                              {event.event_bands.filter(eb => eb.is_headliner && eb.band).length > 0 && (
                                <div>
                                  {event.event_bands
                                    .filter(eb => eb.is_headliner && eb.band)
                                    .sort((a, b) => (a.slot_order || 0) - (b.slot_order || 0))
                                    .map((eb, idx) => eb.band && (
                                      <div key={eb.band.id || idx} className="mb-2">
                                        <EventBandCard band={eb.band} isHeadliner={true} />
                                      </div>
                                    ))}
                                </div>
                              )}

                              {/* Supporting Acts */}
                              {event.event_bands.filter(eb => !eb.is_headliner && eb.band).length > 0 && (
                                <div>
                                  <div className="text-xs font-bold text-yellow-300 uppercase tracking-wide mb-2">
                                    With:
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {event.event_bands
                                      .filter(eb => !eb.is_headliner && eb.band)
                                      .sort((a, b) => (a.slot_order || 0) - (b.slot_order || 0))
                                      .map((eb, idx) => eb.band && (
                                        <EventBandCard key={eb.band.id || idx} band={eb.band} isHeadliner={false} />
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* RIGHT: PRICE & TICKETS */}
                        <div className="flex-shrink-0 text-center lg:text-right">
                          <div className="bg-yellow-400 text-gray-900 rounded-lg p-4 mb-4 shadow-lg border-2 border-white">
                            <div className="text-xs font-black uppercase tracking-wider mb-1">Tickets</div>
                            <div className="text-3xl font-black leading-none my-1">
                              $10
                            </div>
                            <div className="text-xs font-bold uppercase">At Door</div>
                          </div>

                          {event.ticket_url && (
                            <a
                              href={event.ticket_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                              Get Tickets
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              }

              // FEATURED TIER - Clean and prominent
              return (
                <article
                  key={event.id}
                  id={event.id}
                  className="relative bg-white dark:bg-gray-800 border-l-4 border-yellow-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] scroll-mt-20"
                >
                  {/* Subtle top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>

                  <div className="p-6">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="px-2 py-1 bg-yellow-400 text-gray-900 rounded text-xs font-bold uppercase">
                        Featured
                      </span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 items-start">
                      {/* LEFT: DATE BOX */}
                      <div className="flex-shrink-0 bg-red-600 text-white rounded-lg p-3 text-center shadow-md border border-yellow-400">
                        <div className="text-xs font-bold uppercase">{dayOfWeek}</div>
                        <div className="text-sm font-black">{month}</div>
                        <div className="text-3xl font-black leading-none my-1">{day}</div>
                        <div className="text-base font-black text-yellow-300">{time}</div>
                      </div>

                      {/* MIDDLE: EVENT INFO */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
                          {event.name}
                        </h3>

                        {event.venue && (
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3 text-base font-semibold">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            <span>{event.venue.name}</span>
                            {event.venue.city && (
                              <span className="text-gray-500 dark:text-gray-400">• {event.venue.city}</span>
                            )}
                          </div>
                        )}

                        {event.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-base mb-3 leading-relaxed">
                            {event.description}
                          </p>
                        )}

                        {event.event_bands && event.event_bands.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {/* Headliners */}
                            {event.event_bands.filter(eb => eb.is_headliner && eb.band).length > 0 && (
                              <div>
                                {event.event_bands
                                  .filter(eb => eb.is_headliner && eb.band)
                                  .sort((a, b) => (a.slot_order || 0) - (b.slot_order || 0))
                                  .map((eb, idx) => eb.band && (
                                    <div key={eb.band.id || idx} className="mb-1">
                                      <EventBandCard band={eb.band} isHeadliner={true} />
                                    </div>
                                  ))}
                              </div>
                            )}

                            {/* Supporting Acts */}
                            {event.event_bands.filter(eb => !eb.is_headliner && eb.band).length > 0 && (
                              <div>
                                <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                                  With:
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {event.event_bands
                                    .filter(eb => !eb.is_headliner && eb.band)
                                    .sort((a, b) => (a.slot_order || 0) - (b.slot_order || 0))
                                    .map((eb, idx) => eb.band && (
                                      <EventBandCard key={eb.band.id || idx} band={eb.band} isHeadliner={false} />
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* RIGHT: PRICE & TICKETS */}
                      <div className="flex-shrink-0 text-center lg:text-right">
                        <div className="bg-yellow-400 text-gray-900 rounded-lg p-3 mb-3 shadow-md">
                          <div className="text-xs font-black uppercase tracking-wider mb-1">Tickets</div>
                          <div className="text-2xl font-black leading-none">
                            $10
                          </div>
                          <div className="text-xs font-bold uppercase">At Door</div>
                        </div>

                        {event.ticket_url && (
                          <a
                            href={event.ticket_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                          >
                            Get Tickets
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Past Events - Minimized */}
      {pastEvents.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
            Past Shows
          </h2>
          <div className="space-y-2">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-100 dark:bg-gray-800/30 border border-gray-300 dark:border-gray-700 rounded-lg p-3 opacity-60"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{event.name}</span>
                  <span className="text-sm text-gray-500">
                    {event.start_time && new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border-4 border-yellow-400">
          <div className="text-8xl mb-6">🎸</div>
          <p className="text-3xl font-black text-white uppercase">
            No Shows Yet!
          </p>
          <p className="text-xl text-gray-300 mt-2">
            Check back soon for upcoming events
          </p>
        </div>
      )}

      {/* Submit Your Event Section */}
      <section id="submit" className="mt-20 pt-12 border-t-4 border-yellow-400">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Submit Your Show
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-semibold">
            Got a show? Get it on the calendar! We&apos;ll review and feature it here.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <EventSubmissionForm />
        </div>
      </section>
    </Container>
  )
}
