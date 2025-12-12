// Google Places API client for fetching venue images and details

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface PlacePhoto {
  photo_reference: string
  height: number
  width: number
  html_attributions: string[]
}

interface PlaceResult {
  place_id: string
  name: string
  formatted_address?: string
  formatted_phone_number?: string
  website?: string
  opening_hours?: {
    weekday_text?: string[]
    open_now?: boolean
  }
  photos?: PlacePhoto[]
  rating?: number
  user_ratings_total?: number
  price_level?: number
  types?: string[]
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
}

interface FindPlaceResponse {
  candidates: PlaceResult[]
  status: string
}

interface PlaceDetailsResponse {
  result: PlaceResult
  status: string
}

export interface VenueDetails {
  placeId: string | null
  photoUrl: string | null
  additionalPhotos: string[]
  rating: number | null
  totalRatings: number | null
  priceLevel: number | null
  openingHours: string[] | null
  isOpenNow: boolean | null
  types: string[]
  lat: number | null
  lng: number | null
}

// Cache for venue photos to avoid repeated API calls
const photoCache = new Map<string, VenueDetails>()

/**
 * Search for a venue by name and city, return the place_id
 */
export async function findVenuePlaceId(
  venueName: string,
  city: string = 'Salt Lake City',
  state: string = 'UT'
): Promise<string | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not configured')
    return null
  }

  const query = `${venueName} ${city} ${state}`
  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json')
  url.searchParams.set('input', query)
  url.searchParams.set('inputtype', 'textquery')
  url.searchParams.set('fields', 'place_id,name,formatted_address')
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY)

  try {
    const response = await fetch(url.toString())
    const data: FindPlaceResponse = await response.json()

    if (data.status === 'OK' && data.candidates.length > 0) {
      return data.candidates[0].place_id
    }

    return null
  } catch (error) {
    console.error('Error finding venue place ID:', error)
    return null
  }
}

/**
 * Get place details including photos
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    return null
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'name,formatted_address,formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total,price_level,types,geometry')
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY)

  try {
    const response = await fetch(url.toString())
    const data: PlaceDetailsResponse = await response.json()

    if (data.status === 'OK') {
      return data.result
    }

    return null
  } catch (error) {
    console.error('Error fetching place details:', error)
    return null
  }
}

/**
 * Build a photo URL from a photo reference
 */
export function buildPhotoUrl(photoReference: string, maxWidth: number = 800): string {
  if (!GOOGLE_PLACES_API_KEY) {
    return ''
  }

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
}

/**
 * Get venue details including photos for a venue
 * Results are cached to reduce API calls
 */
export async function getVenueDetails(
  venueName: string,
  city: string = 'Salt Lake City',
  state: string = 'UT'
): Promise<VenueDetails> {
  const cacheKey = `${venueName}-${city}-${state}`

  // Check cache first
  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey)!
  }

  const emptyResult: VenueDetails = {
    placeId: null,
    photoUrl: null,
    additionalPhotos: [],
    rating: null,
    totalRatings: null,
    priceLevel: null,
    openingHours: null,
    isOpenNow: null,
    types: [],
    lat: null,
    lng: null
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return emptyResult
  }

  try {
    // Find the place ID
    const placeId = await findVenuePlaceId(venueName, city, state)
    if (!placeId) {
      photoCache.set(cacheKey, emptyResult)
      return emptyResult
    }

    // Get place details
    const details = await getPlaceDetails(placeId)
    if (!details) {
      photoCache.set(cacheKey, { ...emptyResult, placeId })
      return { ...emptyResult, placeId }
    }

    // Build photo URLs
    const photos = details.photos || []
    const photoUrls = photos.map(p => buildPhotoUrl(p.photo_reference, 1200))

    const result: VenueDetails = {
      placeId,
      photoUrl: photoUrls[0] || null,
      additionalPhotos: photoUrls.slice(1, 5), // Get up to 4 additional photos
      rating: details.rating || null,
      totalRatings: details.user_ratings_total || null,
      priceLevel: details.price_level || null,
      openingHours: details.opening_hours?.weekday_text || null,
      isOpenNow: details.opening_hours?.open_now ?? null,
      types: details.types || [],
      lat: details.geometry?.location.lat || null,
      lng: details.geometry?.location.lng || null
    }

    // Cache the result
    photoCache.set(cacheKey, result)

    return result
  } catch (error) {
    console.error('Error getting venue details:', error)
    return emptyResult
  }
}

/**
 * Get a venue-type-appropriate description based on Google Places types
 */
export function getVenueTypeDescription(types: string[]): string {
  if (types.includes('night_club')) {
    return 'Nightclub & Live Music'
  }
  if (types.includes('bar')) {
    return 'Bar & Live Music'
  }
  if (types.includes('restaurant')) {
    return 'Restaurant & Music Venue'
  }
  if (types.includes('cafe')) {
    return 'Cafe & Performance Space'
  }
  if (types.includes('movie_theater') || types.includes('performing_arts_theater')) {
    return 'Theater & Performance Space'
  }
  if (types.includes('stadium') || types.includes('arena')) {
    return 'Arena & Concert Hall'
  }
  if (types.includes('church')) {
    return 'Church & Event Space'
  }
  if (types.includes('park')) {
    return 'Outdoor Venue'
  }
  return 'Music Venue'
}

/**
 * Generate a Google Maps link for the venue
 */
export function getGoogleMapsUrl(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`
}

/**
 * Generate a Google Maps directions link
 */
export function getDirectionsUrl(lat: number, lng: number, venueName: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(venueName)}`
}
