/**
 * SLUG Magazine Event Scraper
 * Scrapes events from SLUG Magazine's events calendar
 */

interface SlugMagEvent {
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
 * Fetch events from SLUG Magazine
 * Scrapes events from their events calendar pages
 */
export async function fetchSlugMagEvents(page = 1): Promise<SlugMagEvent[]> {
  try {
    const url = `https://www.slugmag.com/events/page/${page}/`

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`SLUG Magazine fetch error:`, response.status)
      return []
    }

    const html = await response.text()
    return parseSlugMagHTML(html)

  } catch (error) {
    console.error(`Error fetching SLUG Magazine events:`, error)
    return []
  }
}

/**
 * Parse SLUG Magazine HTML to extract events
 * Based on the actual HTML structure from slugmag.com/events
 */
function parseSlugMagHTML(html: string): SlugMagEvent[] {
  const events: SlugMagEvent[] = []

  // Try to find JSON-LD structured data first (most reliable)
  const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  for (const match of jsonLdMatches) {
    try {
      const jsonData = JSON.parse(match[1])
      const items = Array.isArray(jsonData) ? jsonData : [jsonData]
      
      items.forEach((item: any) => {
        if (item['@type'] === 'Event' || item['@type'] === 'MusicEvent') {
          const startDate = item.startDate ? new Date(item.startDate) : null
          const endDate = item.endDate ? new Date(item.endDate) : null
          
          if (startDate) {
            events.push({
              title: item.name || '',
              venue: item.location?.name || item.location?.address?.addressLocality || '',
              venue_address: item.location?.address?.streetAddress || null,
              date: startDate.toISOString(),
              start_time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              end_time: endDate ? endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : null,
              url: item.url || null,
              category: item.eventAttendanceMode || item.genre || null
            })
          }
        }
      })
    } catch (e) {
      // Continue to other parsing methods
    }
  }

  // If no structured data found, parse from HTML text
  if (events.length === 0) {
    // Look for event patterns in the HTML
    // Events appear as: Date, Title, Date range, Venue, Category
    
    // Pattern to match event entries
    // Format appears to be:
    // Date (e.g., "20 Nov" or "20 Nov - 22 Nov")
    // Title
    // Date range (e.g., "11-20-2025 07:00 PM - 11-20-2025 11:30 PM")
    // Venue (e.g., "The Commonwealth Room; 195 W 2100 S Expy, South Salt Lake, UT 84115")
    // Category (e.g., "Concert or Performance")
    
    // More flexible pattern that matches the structure
    const eventPattern = /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:\s*-\s*\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))?)[\s\S]*?([A-Z][^\n<]+?)[\s\S]*?(\d{1,2}-\d{1,2}-\d{4}\s+\d{1,2}:\d{2}\s+(?:AM|PM)(?:\s*-\s*\d{1,2}-\d{1,2}-\d{4}\s+\d{1,2}:\d{2}\s+(?:AM|PM))?)[\s\S]*?([^;]+(?:;\s*[^,\n]+)?)[\s\S]*?(Concert or Performance|Game or Competition|Class, Training, or Workshop|Attraction|Other)/gi

    let match
    while ((match = eventPattern.exec(html)) !== null) {
      const [, displayDate, title, dateRange, venueInfo, category] = match

      if (title && dateRange && venueInfo) {
        // Parse date range
        const dateRangeMatch = dateRange.match(/(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)(?:\s*-\s*(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM))?/i)
        
        if (dateRangeMatch) {
          const [, startMonth, startDay, startYear, startHour, startMin, startPeriod, endMonth, endDay, endYear, endHour, endMin, endPeriod] = dateRangeMatch
          
          // Build ISO datetime strings
          const startDateTime = buildISODateTime(startYear, startMonth, startDay, startHour, startMin, startPeriod)
          
          let endDateTime: string | null = null
          if (endMonth && endDay && endYear && endHour && endMin && endPeriod) {
            endDateTime = buildISODateTime(endYear, endMonth, endDay, endHour, endMin, endPeriod)
          }

          // Parse venue
          const venueParts = venueInfo.split(';')
          const venueName = venueParts[0]?.trim() || venueInfo.trim()
          const venueAddress = venueParts[1]?.trim() || null

          // Format times for display
          const startTime = format12Hour(parseInt(startHour), parseInt(startMin), startPeriod)
          const endTime = endDateTime ? format12Hour(parseInt(endHour), parseInt(endMin), endPeriod) : null

          events.push({
            title: cleanText(title),
            venue: cleanText(venueName),
            venue_address: venueAddress ? cleanText(venueAddress) : null,
            date: startDateTime,
            start_time: startTime,
            end_time: endTime,
            url: null,
            category: category?.trim() || null
          })
        }
      }
    }
  }

  console.log(`Found ${events.length} events from SLUG Magazine`)
  return events
}

/**
 * Build ISO datetime string from components
 */
function buildISODateTime(year: string, month: string, day: string, hour: string, minute: string, period: string): string {
  let hour24 = parseInt(hour, 10)
  if (period.toUpperCase() === 'PM' && hour24 !== 12) {
    hour24 += 12
  } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
    hour24 = 0
  }
  
  const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  const isoTime = `${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:00`
  return `${isoDate}T${isoTime}`
}

/**
 * Format time in 12-hour format
 */
function format12Hour(hour: number, minute: number, period: string): string {
  return `${hour}:${minute.toString().padStart(2, '0')} ${period.toUpperCase()}`
}

/**
 * Clean text content
 */
function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Fetch all events from multiple pages
 * Only returns music/band-related events
 */
export async function fetchAllSlugMagEvents(maxPages = 5): Promise<SlugMagEvent[]> {
  const allEvents: SlugMagEvent[] = []
  
  for (let page = 1; page <= maxPages; page++) {
    const events = await fetchSlugMagEvents(page)
    if (events.length === 0) {
      break // No more events
    }
    allEvents.push(...events)
    
    // Add a small delay to be respectful
    if (page < maxPages) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  // Filter to only music events
  const { filterMusicEvents } = await import('./music-filter')
  const musicEvents = filterMusicEvents(allEvents)
  
  console.log(`Filtered ${allEvents.length} SLUG Magazine events to ${musicEvents.length} music events`)
  return musicEvents
}

