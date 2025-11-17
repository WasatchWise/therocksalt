/**
 * AzuraCast API Client
 * Handles authentication and API requests to AzuraCast
 */

const AZURACAST_BASE_URL = 'https://a8.asurahosting.com'
const STATION_ID = '1'

export interface AzuraCastConfig {
  baseUrl?: string
  stationId?: string
  apiKey?: string
}

export class AzuraCastClient {
  private baseUrl: string
  private stationId: string
  private apiKey: string

  constructor(config?: AzuraCastConfig) {
    this.baseUrl = config?.baseUrl || AZURACAST_BASE_URL
    this.stationId = config?.stationId || STATION_ID
    this.apiKey = config?.apiKey || process.env.X_API_Key || ''
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `AzuraCast API error (${response.status}): ${errorText}`
      )
    }

    return response.json()
  }

  /**
   * Upload a media file to AzuraCast
   */
  async uploadMedia(
    file: File | Blob,
    metadata: {
      title: string
      artist: string
      album?: string
      genre?: string
      artworkUrl?: string
    }
  ): Promise<{ id: number; path: string; name: string }> {
    // First, we need to upload the file
    // AzuraCast requires multipart/form-data for file uploads
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', metadata.title)
    formData.append('artist', metadata.artist)
    if (metadata.album) formData.append('album', metadata.album)
    if (metadata.genre) formData.append('genre', metadata.genre)

    const url = `${this.baseUrl}/api/station/${this.stationId}/files/upload`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        // Don't set Content-Type - let browser set it with boundary
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `AzuraCast upload error (${response.status}): ${errorText}`
      )
    }

    const data = await response.json()
    
    // If artwork URL is provided, update the media with artwork
    if (metadata.artworkUrl && data.id) {
      await this.updateMediaArtwork(data.id, metadata.artworkUrl)
    }

    return data
  }

  /**
   * Update media artwork
   */
  async updateMediaArtwork(mediaId: number, artworkUrl: string): Promise<void> {
    // Download artwork and upload it
    const artworkResponse = await fetch(artworkUrl)
    if (!artworkResponse.ok) {
      console.warn('Failed to fetch artwork, skipping')
      return
    }

    const artworkBlob = await artworkResponse.blob()
    const formData = new FormData()
    formData.append('art', artworkBlob, 'artwork.jpg')

    const url = `${this.baseUrl}/api/station/${this.stationId}/files/${mediaId}/art`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        // Don't set Content-Type - let browser set it with boundary
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `AzuraCast artwork upload error (${response.status}): ${errorText}`
      )
    }
  }

  /**
   * Get media file by ID
   */
  async getMedia(mediaId: number): Promise<any> {
    return this.request(`/api/station/${this.stationId}/files/${mediaId}`)
  }

  /**
   * Add media to playlist
   */
  async addToPlaylist(
    mediaId: number,
    playlistId?: number
  ): Promise<void> {
    // If no playlist ID, add to default playlist
    // First, get playlists to find default
    const playlists = await this.getPlaylists()
    const defaultPlaylist = playlists.find((p: any) => p.is_enabled) || playlists[0]

    if (!defaultPlaylist) {
      throw new Error('No active playlist found')
    }

    const targetPlaylistId = playlistId || defaultPlaylist.id

    await this.request(
      `/api/station/${this.stationId}/playlists/${targetPlaylistId}/media`,
      {
        method: 'POST',
        body: JSON.stringify({
          media_id: mediaId,
        }),
      }
    )
  }

  /**
   * Get all playlists
   */
  async getPlaylists(): Promise<any[]> {
    return this.request(`/api/station/${this.stationId}/playlists`)
  }

  /**
   * Get now playing information
   */
  async getNowPlaying(): Promise<any> {
    return this.request(`/api/station/${this.stationId}/nowplaying`)
  }

  /**
   * Submit a song request
   */
  async submitRequest(mediaId: number): Promise<any> {
    return this.request(
      `/api/station/${this.stationId}/requests/${mediaId}`,
      {
        method: 'POST',
      }
    )
  }
}

// Export singleton instance
export const azuraCastClient = new AzuraCastClient()

