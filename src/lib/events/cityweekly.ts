/**
 * City Weekly Event Scraper
 * Scrapes events from City Weekly's calendar
 */

interface CityWeeklyEvent {
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
 * Fetch events from City Weekly
 * Uses their events.cityweekly.net calendar
 */
export async function fetchCityWeeklyEvents(): Promise<CityWeeklyEvent[]> {
  try {
    // City Weekly events page
    const url = 'https://events.cityweekly.net/'

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`City Weekly fetch error:`, response.status)
      return []
    }

    const html = await response.text()
    return parseCityWeeklyHTML(html)

  } catch (error) {
    console.error(`Error fetching City Weekly events:`, error)
    return []
  }
}

/**
 * Parse City Weekly HTML to extract events
 * Based on the actual HTML structure from events.cityweekly.net
 */
function parseCityWeeklyHTML(html: string): CityWeeklyEvent[] {
  const events: CityWeeklyEvent[] = []

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
    // City Weekly structure:
    // Date header (Today, Tomorrow, or specific date)
    // Event title
    // Time (e.g., "9:00pm" or "All day")
    // Venue (e.g., "@ Tavernacle Social Club")
    
    // Get current date for "Today" and "Tomorrow"
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Parse date headers and events
    // Pattern: Date header followed by events
    const dateSectionPattern = /(Today|Tomorrow|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2})[\s\S]*?(?=(?:Today|Tomorrow|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2})|$)/gi
    
    let dateSectionMatch
    while ((dateSectionMatch = dateSectionPattern.exec(html)) !== null) {
      const dateHeader = dateSectionMatch[1]
      const sectionContent = dateSectionMatch[0]
      
      // Determine the actual date
      let eventDate: Date
      if (dateHeader === 'Today') {
        eventDate = new Date(today)
      } else if (dateHeader === 'Tomorrow') {
        eventDate = new Date(tomorrow)
      } else {
        // Parse specific date (e.g., "Wednesday, November 19")
        eventDate = parseDateString(dateHeader)
        if (!eventDate || isNaN(eventDate.getTime())) {
          continue // Skip if we can't parse the date
        }
      }
      
      // Extract events from this date section
      // Pattern: Event title, then time, then venue
      // Events appear as: Title\nTime\n@ Venue
      const eventPattern = /([A-Z][^\n@<]+?)\s*\n\s*(\d{1,2}:\d{2}(?:am|pm)|All day|\d{1,2}-\d{1,2}pm|\d{1,2}:\d{2}\s+(?:AM|PM))\s*\n\s*@\s*([^\n<]+?)(?=\n\s*[A-Z]|\n\s*\d{1,2}:\d{2}|$)/gi
      
      let eventMatch
      while ((eventMatch = eventPattern.exec(sectionContent)) !== null) {
        const [, title, timeStr, venue] = eventMatch
        
        if (title && timeStr && venue) {
          // Parse time
          let startTime = '12:00 AM'
          let endTime: string | null = null
          let eventDateTime = new Date(eventDate)
          
          if (timeStr.toLowerCase() !== 'all day') {
            // Parse time like "9:00pm", "7:00pm", "4-8pm Friday 10-6pm Saturday"
            const timeMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)/i)
            if (timeMatch) {
              const [, hour, minute = '00', period] = timeMatch
              startTime = `${hour}:${minute} ${period.toUpperCase()}`
              
              // Set the time on the date
              let hour24 = parseInt(hour, 10)
              if (period.toUpperCase() === 'PM' && hour24 !== 12) {
                hour24 += 12
              } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
                hour24 = 0
              }
              eventDateTime.setHours(hour24, parseInt(minute, 10), 0, 0)
            }
          } else {
            // All day event - set to start of day
            eventDateTime.setHours(0, 0, 0, 0)
            startTime = 'All day'
          }
          
          // Clean venue name (remove extra spaces, @ symbol if present)
          const cleanVenue = venue.replace(/^@\s*/, '').trim()
          
          events.push({
            title: cleanText(title),
            venue: cleanText(cleanVenue),
            venue_address: null,
            date: eventDateTime.toISOString(),
            start_time: startTime,
            end_time: endTime,
            url: null,
            category: null
          })
        }
      }
    }
  }

  console.log(`Found ${events.length} events from City Weekly`)
  return events
}

/**
 * Parse date string like "Wednesday, November 19" or "Monday, December 1"
 */
function parseDateString(dateStr: string): Date | null {
  try {
    // Remove day of week if present
    const dateOnly = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+/i, '')
    
    // Try to parse as "Month Day" format
    const currentYear = new Date().getFullYear()
    const parsedDate = new Date(`${dateOnly}, ${currentYear}`)
    
    // If the date is in the past, assume it's next year
    if (parsedDate < new Date()) {
      parsedDate.setFullYear(currentYear + 1)
    }
    
    return isNaN(parsedDate.getTime()) ? null : parsedDate
  } catch (e) {
    return null
  }
}

/**
 * Clean text content
 */
function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Fetch all events from City Weekly
 * Only returns music/band-related events
 */
export async function fetchAllCityWeeklyEvents(): Promise<CityWeeklyEvent[]> {
  // City Weekly appears to show all events on one page
  const allEvents = await fetchCityWeeklyEvents()
  
  // Filter to only music events
  const { filterMusicEvents } = await import('./music-filter')
  const musicEvents = filterMusicEvents(allEvents)
  
  console.log(`Filtered ${allEvents.length} City Weekly events to ${musicEvents.length} music events`)
  return musicEvents
}
