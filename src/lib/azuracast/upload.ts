/**
 * AzuraCast Upload Utilities
 * Handles uploading music files from Supabase storage to AzuraCast
 */

import { AzuraCastClient } from './client'
import type { MusicSubmissionData } from '@/types/submission'

export interface UploadMetadata {
  title: string
  artist: string
  album?: string
  genre?: string
  artworkUrl?: string
}

/**
 * Upload a music file from Supabase storage URL to AzuraCast
 */
export async function uploadToAzuraCast(
  musicFileUrl: string,
  metadata: UploadMetadata,
  apiKey?: string
): Promise<{ mediaId: number; path: string; name: string }> {
  const client = apiKey
    ? new AzuraCastClient({ apiKey })
    : new AzuraCastClient()

  // Download the file from Supabase
  const fileResponse = await fetch(musicFileUrl)
  if (!fileResponse.ok) {
    throw new Error(`Failed to download file from Supabase: ${fileResponse.statusText}`)
  }

  const fileBlob = await fileResponse.blob()
  
  // Extract filename from URL
  const urlParts = musicFileUrl.split('/')
  const filename = urlParts[urlParts.length - 1] || 'track.mp3'
  
  // Create a File object from the blob
  const file = new File([fileBlob], filename, { type: fileBlob.type })

  // Upload to AzuraCast
  const result = await client.uploadMedia(file, metadata)

  return {
    mediaId: result.id,
    path: result.path,
    name: result.name,
  }
}

/**
 * Create metadata from music submission data
 */
export function createMetadataFromSubmission(
  submission: MusicSubmissionData
): UploadMetadata {
  const title = submission.links.song_title || submission.band_name
  const artist = submission.band_name
  const album = 'The Rock Salt - Local Music'
  const genre = submission.genre_preferences?.[0] || 'Rock'
  const artworkUrl = submission.links.band_photo

  return {
    title,
    artist,
    album,
    genre,
    artworkUrl,
  }
}

/**
 * Upload submission to AzuraCast and add to playlist
 */
export async function processSubmissionToPlaylist(
  submission: MusicSubmissionData,
  apiKey?: string
): Promise<{ mediaId: number; path: string; addedToPlaylist: boolean }> {
  if (!submission.links.music_file) {
    throw new Error('No music file in submission')
  }

  // Upload to AzuraCast
  const { mediaId, path } = await uploadToAzuraCast(
    submission.links.music_file,
    createMetadataFromSubmission(submission),
    apiKey
  )

  // Add to default playlist
  const client = apiKey
    ? new AzuraCastClient({ apiKey })
    : new AzuraCastClient()

  try {
    await client.addToPlaylist(mediaId)
    return { mediaId, path, addedToPlaylist: true }
  } catch (error) {
    console.error('Failed to add to playlist:', error)
    // Media is uploaded but not in playlist - return partial success
    return { mediaId, path, addedToPlaylist: false }
  }
}

