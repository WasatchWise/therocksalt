/**
 * Bandsintown API Integration
 * Fetches upcoming events for artists and venues
 */

const BANDSINTOWN_API_URL = 'https://rest.bandsintown.com'
const APP_ID = process.env.BANDSINTOWN_APP_ID || 'therocksalt'

interface BandsinTownEvent {
  id: string
  url: string
  datetime: string
  description: string
  venue: {
    name: string
    location: string
    city: string
    region: string
    country: string
    latitude: string
    longitude: string
  }
  lineup: string[]
  offers: Array<{
    type: string
    url: string
    status: string
  }>
  artist_id: string
  on_sale_datetime: string
}

/**
 * Get events for a specific artist
 */
export async function getArtistEvents(artistName: string): Promise<BandsinTownEvent[]> {
  try {
    const response = await fetch(
      `${BANDSINTOWN_API_URL}/artists/${encodeURIComponent(artistName)}/events?app_id=${APP_ID}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      console.error(`Bandsintown API error for ${artistName}:`, response.status)
      return []
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error(`Error fetching Bandsintown events for ${artistName}:`, error)
    return []
  }
}

/**
 * Get events happening in a specific location
 */
export async function getLocationEvents(
  city: string,
  state: string,
  radius = 50
): Promise<BandsinTownEvent[]> {
  try {
    const location = `${city},${state}`
    const response = await fetch(
      `${BANDSINTOWN_API_URL}/events/search?location=${encodeURIComponent(location)}&radius=${radius}&app_id=${APP_ID}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      console.error(`Bandsintown location search error:`, response.status)
      return []
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error(`Error fetching location events:`, error)
    return []
  }
}

/**
 * Get events for multiple artists
 */
export async function getMultipleArtistsEvents(
  artistNames: string[]
): Promise<BandsinTownEvent[]> {
  const eventPromises = artistNames.map(name => getArtistEvents(name))
  const eventsArrays = await Promise.all(eventPromises)
  return eventsArrays.flat()
}
