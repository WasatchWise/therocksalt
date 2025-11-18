/**
 * Songkick API Integration
 * Fetches events by venue and location
 */

const SONGKICK_API_URL = 'https://api.songkick.com/api/3.0'
const API_KEY = process.env.SONGKICK_API_KEY

interface SongkickEvent {
  id: number
  displayName: string
  type: string
  uri: string
  status: string
  start: {
    date: string
    datetime: string
    time: string
  }
  performance: Array<{
    id: number
    displayName: string
    billing: string
    artist: {
      id: number
      displayName: string
      uri: string
    }
  }>
  location: {
    city: string
    lat: number
    lng: number
  }
  venue: {
    id: number
    displayName: string
    uri: string
    metroArea: {
      displayName: string
      country: { displayName: string }
      state: { displayName: string }
    }
  }
  ageRestriction: string | null
}

/**
 * Get events for a specific metro area
 */
export async function getMetroAreaEvents(metroAreaId: number): Promise<SongkickEvent[]> {
  if (!API_KEY) {
    console.error('SONGKICK_API_KEY not configured')
    return []
  }

  try {
    const response = await fetch(
      `${SONGKICK_API_URL}/metro_areas/${metroAreaId}/calendar.json?apikey=${API_KEY}`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      console.error(`Songkick API error:`, response.status)
      return []
    }

    const data = await response.json()
    return data.resultsPage?.results?.event || []
  } catch (error) {
    console.error(`Error fetching Songkick events:`, error)
    return []
  }
}

/**
 * Search for events by location name
 */
export async function searchEventsByLocation(
  location: string,
  page = 1
): Promise<SongkickEvent[]> {
  if (!API_KEY) {
    console.error('SONGKICK_API_KEY not configured')
    return []
  }

  try {
    const response = await fetch(
      `${SONGKICK_API_URL}/events.json?apikey=${API_KEY}&location=${encodeURIComponent(location)}&page=${page}`,
      {
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      console.error(`Songkick search error:`, response.status)
      return []
    }

    const data = await response.json()
    return data.resultsPage?.results?.event || []
  } catch (error) {
    console.error(`Error searching Songkick events:`, error)
    return []
  }
}

/**
 * Get events for a specific artist
 */
export async function getArtistEvents(artistId: number): Promise<SongkickEvent[]> {
  if (!API_KEY) {
    console.error('SONGKICK_API_KEY not configured')
    return []
  }

  try {
    const response = await fetch(
      `${SONGKICK_API_URL}/artists/${artistId}/calendar.json?apikey=${API_KEY}`,
      {
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      console.error(`Songkick artist calendar error:`, response.status)
      return []
    }

    const data = await response.json()
    return data.resultsPage?.results?.event || []
  } catch (error) {
    console.error(`Error fetching artist events:`, error)
    return []
  }
}

// Salt Lake City metro area ID
export const SALT_LAKE_CITY_METRO_ID = 17318

/**
 * Get events for a specific venue
 */
export async function getVenueEvents(venueId: number): Promise<SongkickEvent[]> {
  if (!API_KEY) {
    console.error('SONGKICK_API_KEY not configured')
    return []
  }

  try {
    const response = await fetch(
      `${SONGKICK_API_URL}/venues/${venueId}/calendar.json?apikey=${API_KEY}`,
      {
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      console.error(`Songkick venue calendar error:`, response.status)
      return []
    }

    const data = await response.json()
    return data.resultsPage?.results?.event || []
  } catch (error) {
    console.error(`Error fetching venue events:`, error)
    return []
  }
}
