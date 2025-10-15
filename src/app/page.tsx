import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Link from "next/link";
import { getBands, getEvents, getEpisodes } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function Home() {
  // Fetch featured content
  const [bands, events, episodes] = await Promise.all([
    getBands(6),
    getEvents(3),
    getEpisodes(3),
  ]);

  const featuredBands = bands.filter((b) => b.featured).slice(0, 3);
  const upcomingEvents = events.filter(
    (e) => e.start_time && new Date(e.start_time) >= new Date()
  );
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Container>
          <div className="text-center">
            <Logo className="mb-12" priority />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              The Rock Salt - Salt Lake Music Hub
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Discover the vibrant Salt Lake City music scene. Local artists, live episodes, and upcoming shows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit">
                <Button size="lg">
                  Submit Your Music
                </Button>
              </Link>
              <Button href="https://discord.gg/aPDxxnPb" size="lg" variant="outline">
                Join our Discord
              </Button>
              <Link href="/bands">
                <Button variant="outline" size="lg">
                  Explore Artists
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Submit Your Music Section */}
      <section className="py-16 bg-indigo-600 dark:bg-indigo-700">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Share Your Music with Utah
            </h2>
            <p className="text-lg md:text-xl mb-8 text-indigo-100">
              Are you a local artist? Submit your music to be featured on The Rock Salt.
              Get discovered by thousands of music lovers across the Salt Lake City area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit">
                <Button size="lg" variant="outline" className="bg-white text-indigo-600 hover:bg-gray-100 border-white">
                  Submit Music
                </Button>
              </Link>
              <Link href="/events#submit">
                <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-indigo-500 border-white">
                  Submit Event
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Artists */}
      {featuredBands.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-900">
          <Container>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Featured Artists
              </h2>
              <Link
                href="/bands"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredBands.map((band) => (
                <Link
                  key={band.id}
                  href={`/bands/${band.slug}`}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-500 text-xl">★</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {band.name}
                    </h3>
                  </div>
                  {band.band_genres && band.band_genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {band.band_genres
                        .map((bg) => bg.genre?.name)
                        .filter(Boolean)
                        .map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                    </div>
                  )}
                  {band.bio && (
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {band.bio}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <Container>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Upcoming Shows
              </h2>
              <Link
                href="/events"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {event.name}
                      </h3>
                      {event.start_time && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <time>
                            {new Date(event.start_time).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </time>
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{event.venue.name}</span>
                        </div>
                      )}
                      {event.event_bands && event.event_bands.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {event.event_bands
                            .map((eb) => eb.band?.name)
                            .filter(Boolean)
                            .map((bandName, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
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
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Recent Episodes */}
      {episodes.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-900">
          <Container>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Recent Episodes
              </h2>
              <Link
                href="/episodes"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {episode.title}
                  </h3>
                  {episode.date && (
                    <time className="text-sm text-gray-500 dark:text-gray-400 mb-3 block">
                      {new Date(episode.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  )}
                  {episode.description && (
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {episode.description}
                    </p>
                  )}
                  {episode.episode_links && episode.episode_links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {episode.episode_links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          {link.label || "Watch"}
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
