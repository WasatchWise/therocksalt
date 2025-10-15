import { getEvents } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import EventSubmissionForm from '@/components/EventSubmissionForm'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming live music events and shows in Salt Lake City. Find out where and when your favorite local artists are performing.',
}

export default async function EventsPage() {
  const events = await getEvents(50)

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.filter(e => e.start_time && new Date(e.start_time) >= now)
  const pastEvents = events.filter(e => e.start_time && new Date(e.start_time) < now)

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Events
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Catch live performances from Salt Lake City&apos;s best local talent.
        </p>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Upcoming Shows
          </h2>
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <article
                key={event.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {event.name}
                    </h3>

                    {event.start_time && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time>
                          {new Date(event.start_time).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </time>
                      </div>
                    )}

                    {event.venue && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{event.venue.name}</span>
                        {event.venue.address && (
                          <span className="text-sm">• {event.venue.address}</span>
                        )}
                      </div>
                    )}

                    {event.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {event.description}
                      </p>
                    )}

                    {event.event_bands && event.event_bands.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Featuring:
                        </span>
                        {event.event_bands
                          .map(eb => eb.band?.name)
                          .filter(Boolean)
                          .map((bandName, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full font-medium"
                            >
                              {bandName}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  {event.ticket_url && (
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors self-start"
                    >
                      Get Tickets
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </article>
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
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <article
                key={event.id}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-75"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {event.name}
                    </h3>
                    {event.start_time && (
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.start_time).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    )}
                  </div>
                  {event.venue && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {event.venue.name}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎫</div>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No events scheduled yet. Check back soon!
          </p>
        </div>
      )}

      {/* Submit Your Event Section */}
      <section id="submit" className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Submit Your Event
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hosting a music event in Salt Lake City? Share it with our community! We&apos;ll review your submission and feature it on our events calendar.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <EventSubmissionForm />
        </div>
      </section>
    </Container>
  )
}
