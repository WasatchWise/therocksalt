'use client'

interface SpotifyEmbedProps {
  artistId: string
  type?: 'artist' | 'track' | 'album'
  theme?: 'dark' | 'light'
  compact?: boolean
}

export default function SpotifyEmbed({
  artistId,
  type = 'artist',
  theme = 'dark',
  compact = false
}: SpotifyEmbedProps) {
  // Spotify embed URL format
  const embedUrl = `https://open.spotify.com/embed/${type}/${artistId}?utm_source=generator&theme=${theme === 'dark' ? '0' : '1'}`

  return (
    <div className="w-full">
      <iframe
        src={embedUrl}
        width="100%"
        height={compact ? 152 : 352}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
        title="Spotify Player"
      />
    </div>
  )
}

// Extract artist ID from Spotify URL
export function extractSpotifyArtistId(url: string): string | null {
  if (!url) return null

  // Already just an ID
  if (/^[a-zA-Z0-9]{22}$/.test(url)) {
    return url
  }

  // URL format
  const match = url.match(/spotify\.com\/artist\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}
