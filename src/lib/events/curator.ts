/**
 * Event Curator
 * Syncs events from external APIs to database
 */

import { createClient } from '@/lib/supabase/server'
import { getLocationEvents as getBandsinTownEvents } from './bandsintown'
import { searchEventsByLocation as getSongkickEvents, SALT_LAKE_CITY_METRO_ID, getMetroAreaEvents } from './songkick'
import type { Tables } from '@/types/database'

interface CuratedEvent {
  name: string
  description: string | null
  start_time: string
  venue_name: string
  venue_city: string
  venue_state: string
  venue_address: string | null
  ticket_url: string | null
  external_id: string
  source: 'bandsintown' | 'songkick'
  age_restriction: string | null
}

/**
 * Fetch and curate events from all sources
 */
export async function curateEvents(): Promise<{
  success: boolean
  created: number
  updated: number
  errors: string[]
}> {
  const results = {
    success: true,
    created: 0,
    updated: 0,
    errors: [] as string[]
  }

  try {
    const supabase = await createClient()

    // Fetch events from multiple sources
    console.log('Fetching events from Bandsintown...')
    const bandsinTownEvents = await getBandsinTownEvents('Salt Lake City', 'UT', 50)

    console.log('Fetching events from Songkick...')
    const songkickEvents = await getMetroAreaEvents(SALT_LAKE_CITY_METRO_ID)

    console.log(`Found ${bandsinTownEvents.length} Bandsintown events, ${songkickEvents.length} Songkick events`)

    // Get all venues from database
    const { data: venues } = await supabase
      .from('venues')
      .select('id, name, slug, city')

    const venueMap = new Map(venues?.map(v => [v.name.toLowerCase(), v]) || [])

    // Process Bandsintown events
    for (const event of bandsinTownEvents) {
      try {
        // Only include Utah events
        if (event.venue.region !== 'UT') continue

        const curatedEvent: CuratedEvent = {
          name: event.lineup.join(' + '),
          description: event.description || null,
          start_time: event.datetime,
          venue_name: event.venue.name,
          venue_city: event.venue.city,
          venue_state: event.venue.region,
          venue_address: event.venue.location || null,
          ticket_url: event.offers?.[0]?.url || event.url || null,
          external_id: `bandsintown-${event.id}`,
          source: 'bandsintown',
          age_restriction: null
        }

        await upsertEvent(supabase, curatedEvent, venueMap, results)
      } catch (error) {
        results.errors.push(`Bandsintown event ${event.id}: ${error}`)
      }
    }

    // Process Songkick events
    for (const event of songkickEvents) {
      try {
        // Only include Utah events
        if (event.venue?.metroArea?.state?.displayName !== 'UT') continue

        const curatedEvent: CuratedEvent = {
          name: event.displayName,
          description: null,
          start_time: event.start.datetime || event.start.date,
          venue_name: event.venue.displayName,
          venue_city: event.location.city,
          venue_state: 'UT',
          venue_address: null,
          ticket_url: event.uri || null,
          external_id: `songkick-${event.id}`,
          source: 'songkick',
          age_restriction: event.ageRestriction
        }

        await upsertEvent(supabase, curatedEvent, venueMap, results)
      } catch (error) {
        results.errors.push(`Songkick event ${event.id}: ${error}`)
      }
    }

    console.log(`Event curation complete: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`)
    return results

  } catch (error) {
    console.error('Event curation failed:', error)
    results.success = false
    results.errors.push(`Fatal error: ${error}`)
    return results
  }
}

/**
 * Insert or update event in database
 */
async function upsertEvent(
  supabase: any,
  event: CuratedEvent,
  venueMap: Map<string, Tables<'venues'>>,
  results: { created: number; updated: number; errors: string[] }
) {
  // Check if event already exists
  const { data: existing } = await supabase
    .from('events')
    .select('id')
    .eq('external_id', event.external_id)
    .single()

  // Find or create venue
  let venueId = venueMap.get(event.venue_name.toLowerCase())?.id

  if (!venueId) {
    // Create new venue
    const { data: newVenue, error: venueError } = await supabase
      .from('venues')
      .insert({
        name: event.venue_name,
        slug: event.venue_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        city: event.venue_city,
        state: event.venue_state,
        address: event.venue_address,
        venue_type: 'club'
      })
      .select()
      .single()

    if (venueError) {
      throw new Error(`Failed to create venue: ${venueError.message}`)
    }

    venueId = newVenue.id
    venueMap.set(event.venue_name.toLowerCase(), newVenue)
  }

  // Prepare event data
  const eventData = {
    name: event.name,
    description: event.description,
    start_time: event.start_time,
    venue_id: venueId,
    ticket_url: event.ticket_url,
    external_id: event.external_id,
    external_source: event.source,
    age_restriction: event.age_restriction,
    tier: 'free' // Default tier for auto-imported events
  }

  if (existing) {
    // Update existing event
    const { error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', existing.id)

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`)
    }

    results.updated++
  } else {
    // Create new event
    const { error } = await supabase
      .from('events')
      .insert(eventData)

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`)
    }

    results.created++
  }
}
