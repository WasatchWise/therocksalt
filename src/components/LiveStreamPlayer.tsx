'use client'

import { useState, useRef, useEffect } from 'react'

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

interface LiveStreamPlayerProps {
  streamUrl: string
  title?: string
  description?: string
}

export default function LiveStreamPlayer({
  streamUrl,
  title = 'The Rock Salt Live',
  description = 'Salt Lake City\'s Independent Music Radio'
}: LiveStreamPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null)

  // Fetch Now Playing data
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/now-playing')
        if (response.ok) {
          const data = await response.json()
          setNowPlaying(data)
        }
      } catch (err) {
        console.error('Failed to fetch now playing data:', err)
      }
    }

    // Fetch immediately
    fetchNowPlaying()

    // Then fetch every 15 seconds
    const interval = setInterval(fetchNowPlaying, 15000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setError('Unable to connect to stream. The stream may be offline.')
      setIsPlaying(false)
      setIsLoading(false)
    }
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    setError(null)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        setError('Unable to start playback. Please try again.')
        setIsPlaying(false)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 shadow-2xl">
      <audio ref={audioRef} src={streamUrl} preload="none" />

      <div className="flex flex-col items-center text-center">
        {/* Live Indicator */}
        {isPlaying && (
          <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full font-bold text-sm animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            LIVE
          </div>
        )}

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {title}
        </h2>
        <p className="text-indigo-100 mb-8 text-lg">
          {description}
        </p>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-24 h-24 flex items-center justify-center bg-white hover:bg-gray-100 text-indigo-600 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          aria-label={isPlaying ? 'Pause stream' : 'Play stream'}
        >
          {isLoading ? (
            <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-12 h-12 ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Status Text */}
        <div className="text-white text-sm">
          {isLoading && <p>Connecting to stream...</p>}
          {isPlaying && !isLoading && <p>Now streaming live from Salt Lake City</p>}
          {!isPlaying && !isLoading && !error && <p>Click play to start listening</p>}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-300 rounded-lg text-white text-sm">
            {error}
          </div>
        )}

        {/* Now Playing Info */}
        {nowPlaying && (
          <div className="mt-8 pt-8 border-t border-indigo-400/30 w-full">
            <div className="flex items-center gap-4">
              {nowPlaying.song.art && (
                <img
                  src={nowPlaying.song.art}
                  alt="Album Art"
                  className="w-16 h-16 rounded-lg shadow-lg"
                />
              )}
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-lg">
                  {nowPlaying.song.title}
                </p>
                <p className="text-indigo-200 text-sm">
                  {nowPlaying.song.artist}
                </p>
                {nowPlaying.song.album && (
                  <p className="text-indigo-300 text-xs">
                    {nowPlaying.song.album}
                  </p>
                )}
                {nowPlaying.live.is_live && nowPlaying.live.streamer_name && (
                  <p className="text-red-300 text-xs mt-1 font-semibold">
                    🎙️ Live: {nowPlaying.live.streamer_name}
                  </p>
                )}
              </div>
            </div>
            <p className="text-indigo-100 text-xs mt-4">
              Broadcasting at 192 kbps MP3
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
