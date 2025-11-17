import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.X_API_Key
    const stationId = '693' // The Rock Salt station ID

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Fetch now playing data from AzuraCast
    const response = await fetch(
      `https://a8.asurahosting.com/api/station/${stationId}/nowplaying`,
      {
        headers: {
          'X-API-Key': apiKey,
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(`AzuraCast API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the AzuraCast response to our format
    const nowPlaying = {
      song: {
        title: data.now_playing?.song?.title || 'Unknown Track',
        artist: data.now_playing?.song?.artist || 'Unknown Artist',
        album: data.now_playing?.song?.album || undefined,
        art: data.now_playing?.song?.art || undefined,
      },
      live: {
        is_live: data.live?.is_live || false,
        streamer_name: data.live?.streamer_name || undefined,
      },
    }

    return NextResponse.json(nowPlaying)
  } catch (error) {
    console.error('Failed to fetch now playing data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch now playing data' },
      { status: 500 }
    )
  }
}
