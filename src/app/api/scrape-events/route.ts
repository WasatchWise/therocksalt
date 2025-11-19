import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchAllSlugMagEvents } from '@/lib/events/slugmag'
import { fetchAllCityWeeklyEvents } from '@/lib/events/cityweekly'
import { fetchAllSoundwellEvents } from '@/lib/events/soundwell'
import { fetchAllPiperDownEvents } from '@/lib/events/piperdown'

// Create admin client for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE!
)

interface ScrapedEvent {
  title: string
  venue: string
  venue_address: string | null
  date: string
  start_time: string
  end_time: string | null
  url: string | null
  category: string | null
}

/**
 * POST /api/scrape-events
 * Triggers all event scrapers and saves results to database
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add auth check here
    // const authHeader = request.headers.get('authorization')
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const results = {
      slugmag: { scraped: 0, saved: 0 },
      cityweekly: { scraped: 0, saved: 0 },
      soundwell: { scraped: 0, saved: 0 },
      piperdown: { scraped: 0, saved: 0 },
      errors: [] as string[]
    }

    // Run all scrapers in parallel
    const [slugEvents, cityWeeklyEvents, soundwellEvents, piperDownEvents] = await Promise.all([
      fetchAllSlugMagEvents().catch(err => {
        results.errors.push(`SLUG Magazine: ${err.message}`)
        return []
      }),
      fetchAllCityWeeklyEvents().catch(err => {
        results.errors.push(`City Weekly: ${err.message}`)
        return []
      }),
      fetchAllSoundwellEvents().catch(err => {
        results.errors.push(`Soundwell: ${err.message}`)
        return []
      }),
      fetchAllPiperDownEvents().catch(err => {
        results.errors.push(`Piper Down: ${err.message}`)
        return []
      })
    ])

    results.slugmag.scraped = slugEvents.length
    results.cityweekly.scraped = cityWeeklyEvents.length
    results.soundwell.scraped = soundwellEvents.length
    results.piperdown.scraped = piperDownEvents.length

    // Combine all events
    const allEvents: ScrapedEvent[] = [
      ...slugEvents,
      ...cityWeeklyEvents,
      ...soundwellEvents,
      ...piperDownEvents
    ]

    // Save events to database
    for (const event of allEvents) {
      try {
        const saved = await saveEvent(event)
        if (saved) {
          // Track which source it came from
          if (slugEvents.includes(event as any)) results.slugmag.saved++
          else if (cityWeeklyEvents.includes(event as any)) results.cityweekly.saved++
          else if (soundwellEvents.includes(event as any)) results.soundwell.saved++
          else if (piperDownEvents.includes(event as any)) results.piperdown.saved++
        }
      } catch (err: any) {
        results.errors.push(`Save error for "${event.title}": ${err.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      total_scraped: allEvents.length,
      total_saved: results.slugmag.saved + results.cityweekly.saved + results.soundwell.saved + results.piperdown.saved,
      sources: results
    })

  } catch (error: any) {
    console.error('Scrape events error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * Save a scraped event to the database
 * Handles venue matching and deduplication
 */
async function saveEvent(event: ScrapedEvent): Promise<boolean> {
  // Find or create venue
  const venueId = await findOrCreateVenue(event.venue, event.venue_address)

  // Check for existing event (dedupe by name + date + venue)
  const eventDate = new Date(event.date)
  const dateStr = eventDate.toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('events')
    .select('id')
    .eq('name', event.title)
    .eq('venue_id', venueId)
    .gte('start_time', `${dateStr}T00:00:00`)
    .lte('start_time', `${dateStr}T23:59:59`)
    .single()

  if (existing) {
    // Event already exists, skip
    return false
  }

  // Insert new event
  const { error } = await supabase
    .from('events')
    .insert({
      name: event.title,
      venue_id: venueId,
      start_time: event.date,
      description: event.category || null,
      external_url: event.url
    })

  if (error) {
    console.error('Insert event error:', error)
    throw error
  }

  return true
}

/**
 * Find existing venue or create a new one
 */
async function findOrCreateVenue(venueName: string, address: string | null): Promise<string> {
  // Normalize venue name for matching
  const normalizedName = venueName.toLowerCase().trim()

  // Try to find existing venue
  const { data: existing } = await supabase
    .from('venues')
    .select('id')
    .ilike('name', `%${normalizedName}%`)
    .single()

  if (existing) {
    return existing.id
  }

  // Create new venue
  const slug = venueName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data: newVenue, error } = await supabase
    .from('venues')
    .insert({
      name: venueName,
      slug: slug,
      address: address,
      city: 'Salt Lake City',
      state: 'UT'
    })
    .select('id')
    .single()

  if (error) {
    console.error('Create venue error:', error)
    throw error
  }

  return newVenue.id
}

/**
 * GET /api/scrape-events
 * Returns scraper status info
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    sources: ['SLUG Magazine', 'City Weekly', 'Soundwell', 'Piper Down'],
    usage: 'POST to this endpoint to trigger scraping'
  })
}
