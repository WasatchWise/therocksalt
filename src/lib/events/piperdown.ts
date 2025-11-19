/**
 * Piper Down Pub Event Scraper
 * Scrapes live music events from Piper Down
 */

interface PiperDownEvent {
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
 * Fetch events from Piper Down
 */
export async function fetchPiperDownEvents(): Promise<PiperDownEvent[]> {
  try {
    // Piper Down has a live-music page
    const url = 'https://www.piperdownpub.com/live-music'

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Piper Down fetch error:`, response.status)
      return []
    }

    const html = await response.text()
    return parsePiperDownHTML(html)

  } catch (error) {
    console.error(`Error fetching Piper Down events:`, error)
    return []
  }
}

/**
 * Parse Piper Down HTML to extract events
 */
function parsePiperDownHTML(html: string): PiperDownEvent[] {
  const events: PiperDownEvent[] = []

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
              venue: 'Piper Down',
              venue_address: '1492 S State St, Salt Lake City, UT 84115',
              date: startDate.toISOString(),
              start_time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              end_time: null,
              url: item.url || null,
              category: 'Live Music'
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
    // Piper Down typically lists events with:
    // - Date (various formats)
    // - Band/Artist name
    // - Time

    // Pattern for common event listings
    // Format: "Friday, November 22" or "11/22" followed by artist and time
    const eventPattern = /(?:((?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,?\s*\d{4})?)|(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?))[\s\S]*?([A-Z][^\n<]+?)[\s\S]*?(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))/gi

    let match
    while ((match = eventPattern.exec(html)) !== null) {
      const [, longDate, shortDate, artist, timeStr] = match
      const dateStr = longDate || shortDate

      if (dateStr && artist) {
        // Parse the date
        let eventDate: Date

        if (longDate) {
          // "Friday, November 22" format
          eventDate = new Date(longDate.replace(/,/g, ''))
        } else {
          // "11/22" format - assume current year
          const [month, day, year] = shortDate.split('/')
          const currentYear = new Date().getFullYear()
          eventDate = new Date(parseInt(year) || currentYear, parseInt(month) - 1, parseInt(day))
        }

        if (isNaN(eventDate.getTime())) continue

        // Parse time
        const timeMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)/i)
        if (timeMatch) {
          const [, hour, minute = '00', period] = timeMatch
          let hour24 = parseInt(hour, 10)
          if (period.toUpperCase() === 'PM' && hour24 !== 12) {
            hour24 += 12
          } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
            hour24 = 0
          }
          eventDate.setHours(hour24, parseInt(minute, 10), 0, 0)
        }

        events.push({
          title: cleanText(artist),
          venue: 'Piper Down',
          venue_address: '1492 S State St, Salt Lake City, UT 84115',
          date: eventDate.toISOString(),
          start_time: timeStr.trim(),
          end_time: null,
          url: null,
          category: 'Live Music'
        })
      }
    }
  }

  console.log(`Found ${events.length} events from Piper Down`)
  return events
}

/**
 * Clean text content
 */
function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Fetch all Piper Down events
 */
export async function fetchAllPiperDownEvents(): Promise<PiperDownEvent[]> {
  return fetchPiperDownEvents()
}
