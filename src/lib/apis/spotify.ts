// Spotify Web API client for fetching artist images and data

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

interface SpotifyImage {
  url: string
  height: number
  width: number
}

interface SpotifyArtist {
  id: string
  name: string
  images: SpotifyImage[]
  genres: string[]
  followers: {
    total: number
  }
  popularity: number
  external_urls: {
    spotify: string
  }
}

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[]
    total: number
  }
}

export interface ArtistDetails {
  id: string
  name: string
  imageUrl: string | null
  images: SpotifyImage[]
  genres: string[]
  followers: number
  popularity: number
  spotifyUrl: string
}

// Token cache
let accessToken: string | null = null
let tokenExpiry: number = 0

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string | null> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.warn('Spotify API credentials not configured')
    return null
  }

  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    })

    if (!response.ok) {
      console.error('Failed to get Spotify access token:', response.status)
      return null
    }

    const data = await response.json()
    accessToken = data.access_token
    // Set expiry 5 minutes before actual expiry to be safe
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000

    return accessToken
  } catch (error) {
    console.error('Error getting Spotify access token:', error)
    return null
  }
}

/**
 * Extract Spotify artist ID from various URL formats
 * Supports:
 * - https://open.spotify.com/artist/1234567890
 * - spotify:artist:1234567890
 * - Just the ID itself
 */
export function extractArtistId(spotifyUrl: string): string | null {
  if (!spotifyUrl) return null

  // Already just an ID (22 char alphanumeric)
  if (/^[a-zA-Z0-9]{22}$/.test(spotifyUrl)) {
    return spotifyUrl
  }

  // URL format: https://open.spotify.com/artist/ID or with query params
  const urlMatch = spotifyUrl.match(/spotify\.com\/artist\/([a-zA-Z0-9]+)/)
  if (urlMatch) {
    return urlMatch[1]
  }

  // URI format: spotify:artist:ID
  const uriMatch = spotifyUrl.match(/spotify:artist:([a-zA-Z0-9]+)/)
  if (uriMatch) {
    return uriMatch[1]
  }

  return null
}

/**
 * Get artist details by Spotify artist ID
 */
export async function getArtistById(artistId: string): Promise<ArtistDetails | null> {
  const token = await getAccessToken()
  if (!token) return null

  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Spotify artist not found: ${artistId}`)
      } else {
        console.error('Spotify API error:', response.status)
      }
      return null
    }

    const artist: SpotifyArtist = await response.json()

    return {
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url || null,
      images: artist.images,
      genres: artist.genres,
      followers: artist.followers.total,
      popularity: artist.popularity,
      spotifyUrl: artist.external_urls.spotify
    }
  } catch (error) {
    console.error('Error fetching Spotify artist:', error)
    return null
  }
}

/**
 * Search for an artist by name
 */
export async function searchArtist(artistName: string): Promise<ArtistDetails | null> {
  const token = await getAccessToken()
  if (!token) return null

  try {
    const params = new URLSearchParams({
      q: artistName,
      type: 'artist',
      limit: '5'
    })

    const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      console.error('Spotify search error:', response.status)
      return null
    }

    const data: SpotifySearchResponse = await response.json()

    if (data.artists.items.length === 0) {
      return null
    }

    // Try to find exact match first
    const exactMatch = data.artists.items.find(
      a => a.name.toLowerCase() === artistName.toLowerCase()
    )
    const artist = exactMatch || data.artists.items[0]

    return {
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url || null,
      images: artist.images,
      genres: artist.genres,
      followers: artist.followers.total,
      popularity: artist.popularity,
      spotifyUrl: artist.external_urls.spotify
    }
  } catch (error) {
    console.error('Error searching Spotify artist:', error)
    return null
  }
}

/**
 * Get artist details from a Spotify URL or by searching for the artist name
 * This is the main entry point for getting band photos
 */
export async function getArtistDetails(
  spotifyUrlOrId: string | null,
  bandName: string
): Promise<ArtistDetails | null> {
  // First try to get by ID if we have a Spotify URL
  if (spotifyUrlOrId) {
    const artistId = extractArtistId(spotifyUrlOrId)
    if (artistId) {
      const artist = await getArtistById(artistId)
      if (artist) {
        return artist
      }
    }
  }

  // Fall back to searching by name
  return searchArtist(bandName)
}

// In-memory cache for artist details
const artistCache = new Map<string, ArtistDetails | null>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

/**
 * Get artist details with caching
 */
export async function getArtistDetailsCached(
  spotifyUrlOrId: string | null,
  bandName: string
): Promise<ArtistDetails | null> {
  const cacheKey = spotifyUrlOrId || bandName

  if (artistCache.has(cacheKey)) {
    return artistCache.get(cacheKey) || null
  }

  const details = await getArtistDetails(spotifyUrlOrId, bandName)
  artistCache.set(cacheKey, details)

  // Clear from cache after TTL
  setTimeout(() => {
    artistCache.delete(cacheKey)
  }, CACHE_TTL)

  return details
}
