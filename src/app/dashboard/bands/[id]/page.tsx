import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Container from '@/components/Container'
import Link from 'next/link'
import UploadTrackForm from '@/components/UploadTrackForm'
import UploadPhotoForm from '@/components/UploadPhotoForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ManageBandPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/signin')
  }

  // Get band details and verify ownership
  const { data: band, error: bandError } = await supabase
    .from('bands')
    .select(`
      id,
      name,
      slug,
      bio,
      description,
      image_url,
      claimed_by,
      claimed_at,
      band_tracks (
        id,
        title,
        file_url,
        description,
        track_type,
        play_count,
        is_featured,
        created_at
      ),
      band_photos (
        id,
        url,
        caption,
        is_primary,
        photo_order,
        created_at
      )
    `)
    .eq('id', id)
    .single()

  if (bandError || !band) {
    notFound()
  }

  // Verify user owns this band
  if (band.claimed_by !== user.id) {
    redirect('/dashboard')
  }

  const tracks = band.band_tracks || []
  const photos = band.band_photos || []

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {band.name}
          </h1>
          <Link
            href={`/bands/${band.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            View Public Page
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your band's content and media
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {tracks.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track{tracks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {photos.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Photo{photos.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {tracks.reduce((sum, track) => sum + (track.play_count || 0), 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Plays
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tracks & Demos
          </h2>

          {/* Upload Form */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <UploadTrackForm bandId={band.id} />
          </div>

          {/* Tracks List */}
          {tracks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tracks uploaded yet. Upload your first track above!
            </div>
          ) : (
            <div className="space-y-4">
              {tracks
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map(track => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {track.title}
                        </h3>
                        {track.is_featured && (
                          <span className="text-yellow-500 text-sm" title="Featured">★</span>
                        )}
                      </div>
                      {track.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {track.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {track.track_type && (
                          <span className="capitalize">{track.track_type.replace('_', ' ')}</span>
                        )}
                        <span>{track.play_count || 0} plays</span>
                        <span>
                          Uploaded {new Date(track.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <audio
                      src={track.file_url}
                      controls
                      className="h-10"
                      style={{ maxWidth: '300px' }}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Photos Section */}
      <section>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Photo Gallery
          </h2>

          {/* Upload Form */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <UploadPhotoForm bandId={band.id} />
          </div>

          {/* Photos Grid */}
          {photos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No photos uploaded yet. Upload your first photo above!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos
                .sort((a, b) => (a.photo_order || 0) - (b.photo_order || 0))
                .map(photo => (
                  <div key={photo.id} className="group relative aspect-square">
                    <img
                      src={photo.url}
                      alt={photo.caption || band.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {photo.is_primary && (
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </Container>
  )
}
