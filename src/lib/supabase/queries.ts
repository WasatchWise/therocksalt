import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'

type BandWithRelations = Tables<'bands'> & {
  band_links: Tables<'band_links'>[] | null
  band_genres: Array<{
    genre: Pick<Tables<'genres'>, 'id' | 'name'> | null
  }> | null
}

type EpisodeWithLinks = Tables<'episodes'> & {
  episode_links: Tables<'episode_links'>[] | null
}

type EventWithRelations = Tables<'events'> & {
  venue: Pick<Tables<'venues'>, 'id' | 'name' | 'city' | 'state' | 'address' | 'website'> | null
  event_bands: Array<{
    slot_order: number | null
    is_headliner: boolean | null
    band: Pick<Tables<'bands'>, 'id' | 'name' | 'slug'> | null
  }> | null
}

type BandWithFullDetails = BandWithRelations & {
  band_tracks?: Array<Tables<'band_tracks'>> | null
  band_photos?: Array<Tables<'band_photos'>> | null
  past_events?: Array<{
    event: Tables<'events'> & {
      venue: Pick<Tables<'venues'>, 'name' | 'city'> | null
    }
  }> | null
  episodes?: Array<{
    episode: Pick<Tables<'episodes'>, 'id' | 'title' | 'date'> | null
  }> | null
}

export async function getBands(limit = 20): Promise<BandWithRelations[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('bands')
    .select(`
      *,
      band_links ( * ),
      band_genres (
        genre:genres ( id, name )
      )
    `)
    .order('featured', { ascending: false })
    .order('name', { ascending: true })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching bands:', error)
    }
    return []
  }
  return (data ?? []) as BandWithRelations[]
}

export async function getEpisodes(limit = 20): Promise<EpisodeWithLinks[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('episodes')
    .select(`
      *,
      episode_links ( * )
    `)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching episodes:', error)
    }
    return []
  }
  return (data ?? []) as EpisodeWithLinks[]
}

export async function getEvents(limit = 20): Promise<EventWithRelations[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:venues ( id, name, city, state ),
      event_bands (
        slot_order,
        is_headliner,
        band:bands ( id, name, slug )
      )
    `)
    .order('start_time', { ascending: true })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching events:', error)
    }
    return []
  }
  return (data ?? []) as EventWithRelations[]
}

export async function getBandsClient(limit = 20): Promise<BandWithRelations[]> {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('bands')
    .select(`
      *,
      band_links ( * )
    `)
    .order('featured', { ascending: false })
    .order('name', { ascending: true })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching bands (client):', error)
    }
    return []
  }
  return (data ?? []) as BandWithRelations[]
}

export async function getBandBySlug(slug: string): Promise<BandWithFullDetails | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('bands')
    .select(`
      *,
      band_links ( * ),
      band_genres (
        genre:genres ( id, name )
      ),
      band_tracks (
        id,
        title,
        description,
        file_url,
        duration_seconds,
        track_type,
        is_featured,
        play_count,
        created_at
      ),
      band_photos (
        id,
        url,
        caption,
        source,
        source_attribution,
        is_primary,
        photo_order
      )
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching band:', error)
    }
    return null
  }

  return data as BandWithFullDetails
}

export async function getBandEvents(bandId: string, limit = 10): Promise<EventWithRelations[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('event_bands')
    .select(`
      event:events (
        *,
        venue:venues ( id, name, city, state, address ),
        event_bands (
          slot_order,
          is_headliner,
          band:bands ( id, name, slug )
        )
      )
    `)
    .eq('band_id', bandId)
    .order('event(start_time)', { ascending: false })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching band events:', error)
    }
    return []
  }

  // Extract events from the nested structure
  return (data?.map(item => item.event).filter(Boolean) ?? []) as EventWithRelations[]
}

export async function getAllBandSlugs(): Promise<string[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('bands')
    .select('slug')

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching band slugs:', error)
    }
    return []
  }
  return (data ?? []).map(band => band.slug).filter(Boolean) as string[]
}

export async function incrementTrackPlayCount(trackId: string): Promise<void> {
  const supabase = await createServerClient()
  await supabase.rpc('increment_track_play_count', { track_id: trackId })
}

// ============================================================================
// VENUES
// ============================================================================

type VenueWithRelations = Tables<'venues'> & {
  venue_links?: Array<Tables<'venue_links'>> | null
  venue_photos?: Array<Tables<'venue_photos'>> | null
}

type VenueWithFullDetails = VenueWithRelations & {
  upcoming_events?: Array<Tables<'events'>> | null
  past_events?: Array<Tables<'events'>> | null
}

export async function getVenues(limit = 50): Promise<VenueWithRelations[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('venues')
    .select(`
      *,
      venue_links ( * ),
      venue_photos ( * )
    `)
    .order('featured', { ascending: false })
    .order('name', { ascending: true })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching venues:', error)
    }
    return []
  }
  return (data ?? []) as VenueWithRelations[]
}

export async function getVenueBySlug(slug: string): Promise<VenueWithFullDetails | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('venues')
    .select(`
      *,
      venue_links ( * ),
      venue_photos ( * )
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching venue:', error)
    }
    return null
  }

  return data as VenueWithFullDetails
}

export async function getVenueEvents(venueId: string): Promise<EventWithRelations[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:venues ( id, name, city, state, address ),
      event_bands (
        slot_order,
        is_headliner,
        band:bands ( id, name, slug )
      )
    `)
    .eq('venue_id', venueId)
    .order('start_time', { ascending: false })
    .limit(20)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching venue events:', error)
    }
    return []
  }
  return (data ?? []) as EventWithRelations[]
}

export async function getAllVenueSlugs(): Promise<string[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('venues')
    .select('slug')

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching venue slugs:', error)
    }
    return []
  }
  return (data ?? []).map(venue => venue.slug).filter(Boolean) as string[]
}
