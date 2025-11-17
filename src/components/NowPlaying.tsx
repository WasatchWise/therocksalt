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
      <div className="flex items-center justify-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    )
  }

  if (!nowPlaying || !nowPlaying.song) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No track information available
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
      {nowPlaying.song.art && (
        <img
          src={nowPlaying.song.art}
          alt={`${nowPlaying.song.artist} - ${nowPlaying.song.title}`}
          className="w-16 h-16 rounded-lg object-cover shadow-md"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            Now Playing
          </span>
        </div>
        <p className="text-base font-bold text-gray-900 dark:text-white truncate">
          {nowPlaying.song.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {nowPlaying.song.artist}
        </p>
      </div>
    </div>
  )
}

