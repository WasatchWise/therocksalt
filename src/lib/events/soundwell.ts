/**
 * Soundwell Event Scraper
 * Scrapes events from Soundwell SLC
 */

interface SoundwellEvent {
  title: string
  venue: string
  venue_address: string | null
  date: string
  start_time: string
  end_time: string | null
  url: string | null
  category: string | null
  openers: string[]
}

/**
 * Fetch events from Soundwell
 */
export async function fetchSoundwellEvents(): Promise<SoundwellEvent[]> {
  try {
    const url = 'https://www.soundwellslc.com/events/'

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Soundwell fetch error:`, response.status)
      return []
    }

    const html = await response.text()
    return parseSoundwellHTML(html)

  } catch (error) {
    console.error(`Error fetching Soundwell events:`, error)
    return []
  }
}

/**
 * Parse Soundwell HTML to extract events
 */
function parseSoundwellHTML(html: string): SoundwellEvent[] {
  const events: SoundwellEvent[] = []

  // Try JSON-LD first
  const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  for (const match of jsonLdMatches) {
    try {
      const jsonData = JSON.parse(match[1])
      const items = Array.isArray(jsonData) ? jsonData : [jsonData]

      items.forEach((item: any) => {
        if (item['@type'] === 'Event' || item['@type'] === 'MusicEvent') {
          const startDate = item.startDate ? new Date(item.startDate) : null

          if (startDate) {
            events.push({
              title: item.name || '',
              venue: 'Soundwell',
              venue_address: '149 W 200 S, Salt Lake City, UT 84101',
              date: startDate.toISOString(),
              start_time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              end_time: null,
              url: item.url || null,
              category: 'Concert',
              openers: []
            })
          }
        }
      })
    } catch (e) {
      // Continue to HTML parsing
    }
  }

  // Parse from HTML if no structured data
  if (events.length === 0) {
    // Soundwell format:
    // Date: "December 5, 2025" or similar
    // Artist name
    // Supporting acts (with "with" keyword)
    // Door time: "Doors At 7:00 pm"

    // Pattern to match event blocks
    const eventPattern = /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4})[\s\S]*?([A-Z][^\n]+?)(?:\s*with\s*([^\n]+))?[\s\S]*?Doors\s+(?:At|at)\s+(\d{1,2}:\d{2}\s*(?:am|pm|AM|PM))/gi

    let match
    while ((match = eventPattern.exec(html)) !== null) {
      const [, dateStr, artist, openers, doorTime] = match

      if (dateStr && artist) {
        // Parse the date
        const eventDate = new Date(dateStr)
        if (isNaN(eventDate.getTime())) continue

        // Parse door time
        const timeMatch = doorTime.match(/(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)/i)
        if (timeMatch) {
          const [, hour, minute, period] = timeMatch
          let hour24 = parseInt(hour, 10)
          if (period.toUpperCase() === 'PM' && hour24 !== 12) {
            hour24 += 12
          } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
            hour24 = 0
          }
          eventDate.setHours(hour24, parseInt(minute, 10), 0, 0)
        }

        // Parse openers
        const openerList = openers
          ? openers.split(/,|&/).map(o => o.trim()).filter(Boolean)
          : []

        events.push({
          title: cleanText(artist),
          venue: 'Soundwell',
          venue_address: '149 W 200 S, Salt Lake City, UT 84101',
          date: eventDate.toISOString(),
          start_time: doorTime.trim(),
          end_time: null,
          url: null,
          category: 'Concert',
          openers: openerList
        })
      }
    }
  }

  console.log(`Found ${events.length} events from Soundwell`)
  return events
}

/**
 * Clean text content
 */
function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Fetch all Soundwell events
 */
export async function fetchAllSoundwellEvents(): Promise<SoundwellEvent[]> {
  return fetchSoundwellEvents()
}
