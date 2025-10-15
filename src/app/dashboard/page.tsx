import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Container from '@/components/Container'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/signin')
  }

  // Get bands claimed by this user
  const { data: claimedBands, error: bandsError } = await supabase
    .from('bands')
    .select(`
      id,
      name,
      slug,
      image_url,
      claimed_at,
      band_tracks (
        id,
        title,
        play_count
      ),
      band_photos (
        id
      )
    `)
    .eq('claimed_by', user.id)
    .order('claimed_at', { ascending: false })

  const bands = claimedBands || []

  return (
    <Container className="py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your band pages and content
        </p>
      </div>

      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Account
        </h2>
        <div className="space-y-2 text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user.id}
          </p>
        </div>
      </div>

      {/* Claimed Bands */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Bands {bands.length > 0 && `(${bands.length})`}
        </h2>

        {bands.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No bands claimed yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse the artist directory and claim your band page to get started.
            </p>
            <Link
              href="/bands"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Artists
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bands.map(band => {
              const trackCount = band.band_tracks?.length || 0
              const photoCount = band.band_photos?.length || 0
              const totalPlays = band.band_tracks?.reduce((sum, track) => sum + (track.play_count || 0), 0) || 0

              return (
                <div
                  key={band.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Band Image */}
                  {band.image_url && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={band.image_url}
                        alt={band.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {band.name}
                    </h3>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {trackCount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Track{trackCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {photoCount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Photo{photoCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {totalPlays}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Play{totalPlays !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Claimed date */}
                    {band.claimed_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Claimed {new Date(band.claimed_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/bands/${band.slug}`}
                        className="flex-1 px-4 py-2 text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        View Page
                      </Link>
                      <Link
                        href={`/dashboard/bands/${band.id}`}
                        className="flex-1 px-4 py-2 text-center bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Container>
  )
}
