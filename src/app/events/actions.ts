'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { EventSubmissionData } from '@/types/eventSubmission'

export async function submitEvent(formData: FormData) {
  try {
    const supabase = await createClient()

    // Extract form fields
    const eventName = formData.get('eventName') as string
    const eventDescription = formData.get('eventDescription') as string
    const startTime = formData.get('startTime') as string
    const endTime = formData.get('endTime') as string
    const venueId = formData.get('venueId') as string
    const venueName = formData.get('venueName') as string
    const venueAddress = formData.get('venueAddress') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string || 'UT'
    const organizerName = formData.get('organizerName') as string
    const organizerEmail = formData.get('organizerEmail') as string
    const organizerPhone = formData.get('organizerPhone') as string
    const ticketPrice = formData.get('ticketPrice') as string
    const ticketUrl = formData.get('ticketUrl') as string
    const eventUrl = formData.get('eventUrl') as string
    const facebook = formData.get('facebook') as string
    const instagram = formData.get('instagram') as string
    const expectedAttendance = formData.get('expectedAttendance') as string
    const additionalNotes = formData.get('additionalNotes') as string
    const flyerFile = formData.get('flyer') as File | null
    const bands = formData.getAll('bands') as string[]

    // Handle flyer upload if present
    let flyerUrl: string | undefined

    if (flyerFile && flyerFile.size > 0) {
      const fileExt = flyerFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-flyers')
        .upload(filePath, flyerFile, {
          contentType: flyerFile.type,
        })

      if (uploadError) {
        console.error('Flyer upload error:', uploadError)
        return { success: false, error: 'Failed to upload flyer: ' + uploadError.message }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('event-flyers')
        .getPublicUrl(filePath)

      flyerUrl = publicUrl
    }

    // Get venue name from database if venueId is provided and not 'custom'
    let finalVenueName = venueName
    let finalVenueAddress = venueAddress
    let finalCity = city
    let finalState = state
    let finalVenueId: string | undefined

    if (venueId && venueId !== 'custom') {
      const { data: venueData } = await supabase
        .from('venues')
        .select('id, name, address, city, state')
        .eq('id', venueId)
        .single()

      if (venueData) {
        finalVenueName = venueData.name
        finalVenueAddress = venueData.address || undefined
        finalCity = venueData.city || city
        finalState = venueData.state || state
        finalVenueId = venueData.id
      }
    }

    // Build the submission data
    const submissionData: EventSubmissionData = {
      event_name: eventName,
      organizer_name: organizerName,
      organizer_email: organizerEmail,
      organizer_phone: organizerPhone || undefined,
      event_description: eventDescription,
      start_time: startTime,
      end_time: endTime || undefined,
      venue_id: finalVenueId,
      venue_name: finalVenueName,
      venue_address: finalVenueAddress,
      city: finalCity,
      state: finalState,
      ticket_price: ticketPrice || undefined,
      ticket_url: ticketUrl || undefined,
      event_url: eventUrl || undefined,
      flyer_url: flyerUrl,
      social_media_links: {
        facebook: facebook || undefined,
        instagram: instagram || undefined,
      },
      expected_attendance: expectedAttendance || undefined,
      additional_notes: additionalNotes || undefined,
      status: 'pending'
    }

    // Insert into database
    const { data, error } = await supabase
      .from('event_submissions')
      .insert(submissionData)
      .select()
      .single()

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Database insert error:', error)
      }
      return { success: false, error: 'Failed to save event submission: ' + error.message }
    }

    // Insert selected bands into event_submission_bands table
    if (bands && bands.length > 0 && data) {
      const bandInserts = bands.map((bandId, index) => {
        // Get band name from database
        return {
          event_submission_id: data.id,
          band_id: bandId,
          band_name: '', // Will be populated by database trigger or we can fetch it
          slot_order: index,
          is_headliner: index === 0, // First band is headliner by default
        }
      })

      // Fetch band names first
      const { data: bandsData } = await supabase
        .from('bands')
        .select('id, name')
        .in('id', bands)

      const bandsMap = new Map(bandsData?.map((b) => [b.id, b.name]) || [])

      // Update band names in inserts
      bandInserts.forEach((insert) => {
        insert.band_name = bandsMap.get(insert.band_id) || 'Unknown'
      })

      const { error: bandsError } = await supabase
        .from('event_submission_bands')
        .insert(bandInserts)

      if (bandsError) {
        console.error('Bands insert error:', bandsError)
        // Don't fail the whole submission if bands fail to insert
      }
    }

    // Revalidate relevant paths
    revalidatePath('/')
    revalidatePath('/events')

    return {
      success: true,
      data,
      message: 'Event submitted! We\'ll review it and get back to you soon.'
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected error in submitEvent:', error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
