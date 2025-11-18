'use client'

import { useState, useEffect } from 'react'

interface NowPlayingData {
  song: {
    title: string
    artist: string
    album?: string
    art?: string
  }
  live: {
    is_live: boolean
    streamer_name?: string
  }
}

export default function NowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/now-playing')
        if (response.ok) {
          const data = await response.json()
          setNowPlaying(data)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch now playing data:', err)
        setIsLoading(false)
      }
    }

    // Fetch immediately
    fetchNowPlaying()

    // Then fetch every 10 seconds
    const interval = setInterval(fetchNowPlaying, 10000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 p-4">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span className="text-sm text-white/70">Loading...</span>
      </div>
    )
  }

  if (!nowPlaying || !nowPlaying.song) {
    return (
      <div className="p-4">
        <p className="text-sm text-white/50 text-center">
          No track information available
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {nowPlaying.song.art && (
        <img
          src={nowPlaying.song.art}
          alt={`${nowPlaying.song.artist} - ${nowPlaying.song.title}`}
          className="w-16 h-16 rounded-lg object-cover shadow-lg border-2 border-white/10"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
            Now Playing
          </span>
        </div>
        <p className="text-base font-bold text-white truncate">
          {nowPlaying.song.title}
        </p>
        <p className="text-sm text-white/70 truncate">
          {nowPlaying.song.artist}
        </p>
      </div>
    </div>
  )
}

