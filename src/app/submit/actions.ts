'use server'

import { createClient } from '@/lib/supabase/server'
import { limit } from '@/lib/rateLimit'
import { revalidatePath } from 'next/cache'
import type { MusicSubmissionData } from '@/types/submission'

export async function submitMusicSubmission(formData: FormData) {
  try {
    // Basic rate limit keyed by email or IP contained in the form (fallback)
    const ipOrEmail = (formData.get('contactEmail') as string) || 'anonymous'
    const { success } = await limit(ipOrEmail, 'submit')
    if (!success) {
      return { success: false, error: 'Too many submissions. Please try again later.' }
    }
    const supabase = await createClient()

    // Extract form fields
    const bandName = formData.get('bandName') as string
    const hometown = formData.get('hometown') as string
    const bio = formData.get('bio') as string
    const description = formData.get('description') as string
    const contactName = formData.get('contactName') as string
    const contactEmail = formData.get('contactEmail') as string
    const contactPhone = formData.get('contactPhone') as string
    const primaryGenre = formData.get('primaryGenre') as string
    const additionalGenres = formData.get('additionalGenres') as string
    const ffo = formData.get('ffo') as string
    const howDidYouHear = formData.get('howDidYouHear') as string
    const bookingAvailable = formData.get('bookingAvailable') as string
    const additionalComments = formData.get('additionalComments') as string
    const emailOptIn = formData.get('emailOptIn') === 'true'

    // Social links
    const website = formData.get('website') as string
    const instagram = formData.get('instagram') as string
    const facebook = formData.get('facebook') as string
    const spotify = formData.get('spotify') as string
    const bandcamp = formData.get('bandcamp') as string
    const tiktok = formData.get('tiktok') as string

    // Music details
    const songTitle = formData.get('songTitle') as string
    const songDescription = formData.get('songDescription') as string
    const streamingLinks = formData.get('streamingLinks') as string

    // Files
    const bandPhoto = formData.get('bandPhoto') as File | null
    const musicFile = formData.get('musicFile') as File | null

    // Upload band photo if provided
    let bandPhotoUrl: string | undefined
    if (bandPhoto && bandPhoto.size > 0) {
      const photoExt = bandPhoto.name.split('.').pop()
      const photoPath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${photoExt}`

      const { data: photoData, error: photoError } = await supabase.storage
        .from('band-photos')
        .upload(photoPath, bandPhoto, {
          contentType: bandPhoto.type,
          upsert: false
        })

      if (photoError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Photo upload error:', photoError)
        }
        return { success: false, error: 'Failed to upload band photo: ' + photoError.message }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('band-photos')
        .getPublicUrl(photoData.path)

      bandPhotoUrl = publicUrl
    }

    // Upload music file if provided
    let musicFileUrl: string | undefined
    if (musicFile && musicFile.size > 0) {
      const musicExt = musicFile.name.split('.').pop()
      const musicPath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${musicExt}`

      const { data: musicData, error: musicError } = await supabase.storage
        .from('band-music')
        .upload(musicPath, musicFile, {
          contentType: musicFile.type,
          upsert: false
        })

      if (musicError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Music upload error:', musicError)
        }
        // Clean up photo if it was uploaded
        if (bandPhotoUrl) {
          await supabase.storage.from('band-photos').remove([bandPhotoUrl])
        }
        return { success: false, error: 'Failed to upload music file: ' + musicError.message }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('band-music')
        .getPublicUrl(musicData.path)

      musicFileUrl = publicUrl
    }

    // Parse additional genres and streaming links
    const genrePreferences = [primaryGenre]
    if (additionalGenres) {
      try {
        const parsed = JSON.parse(additionalGenres)
        genrePreferences.push(...parsed)
      } catch {
        // If not JSON, try comma-separated
        genrePreferences.push(...additionalGenres.split(',').map(g => g.trim()).filter(Boolean))
      }
    }

    const streamingLinksArray = streamingLinks
      ? streamingLinks.split(',').map((link) => link.trim()).filter(Boolean)
      : []

    // Build the submission data
    const submissionData: MusicSubmissionData = {
      band_name: bandName,
      contact_name: contactName,
      contact_email: contactEmail,
      hometown: hometown,
      links: {
        band_photo: bandPhotoUrl,
        music_file: musicFileUrl,
        song_title: songTitle || undefined,
        song_description: songDescription || undefined,
        website: website || undefined,
        instagram: instagram || undefined,
        facebook: facebook || undefined,
        spotify: spotify || undefined,
        bandcamp: bandcamp || undefined,
        tiktok: tiktok || undefined,
        streaming_links: streamingLinksArray.length > 0 ? streamingLinksArray : undefined
      },
      notes: [
        bio,
        description && `Full Description: ${description}`,
        contactPhone && `Phone: ${contactPhone}`,
        ffo && `For Fans Of: ${ffo}`,
        howDidYouHear && `How they heard about us: ${howDidYouHear}`,
        bookingAvailable && `Booking Available: ${bookingAvailable}`,
        emailOptIn && 'Opted in to email updates',
        additionalComments && `Additional Comments: ${additionalComments}`
      ].filter(Boolean).join('\n\n'),
      genre_preferences: genrePreferences,
      status: 'pending'
    }

    // Insert into database
    const { error } = await supabase
      .from('music_submissions')
      .insert(submissionData)

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Database insert error:', error)
      }
      // Clean up uploaded files
      if (bandPhotoUrl) {
        const photoPath = bandPhotoUrl.split('/').pop()
        if (photoPath) await supabase.storage.from('band-photos').remove([photoPath])
      }
      if (musicFileUrl) {
        const musicPath = musicFileUrl.split('/').pop()
        if (musicPath) await supabase.storage.from('band-music').remove([musicPath])
      }
      return { success: false, error: 'Failed to save submission: ' + error.message }
    }

    // Revalidate relevant paths
    revalidatePath('/')
    revalidatePath('/submit')

    return {
      success: true,
      message: 'Submission received! We\'ll review your music and be in touch soon.',
      redirectUrl: `/submit/success?band=${encodeURIComponent(bandName)}&email=${encodeURIComponent(contactEmail)}`
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected error in submitMusicSubmission:', error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
