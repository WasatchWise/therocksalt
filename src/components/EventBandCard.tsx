'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

interface BandTrack {
  id: string
  title: string
  file_url: string
  is_featured: boolean | null
}

interface Band {
  id: string
  name: string
  slug: string
  band_tracks?: BandTrack[] | null
}

interface EventBandCardProps {
  band: Band
  isHeadliner?: boolean
}

export default function EventBandCard({ band, isHeadliner }: EventBandCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasIncremented, setHasIncremented] = useState(false)

  // Get the featured track or first track
  const track = band.band_tracks?.find(t => t.is_featured) || band.band_tracks?.[0]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)

    // Increment play count after 30 seconds or 50% played
    const checkPlayCount = async () => {
      if (!hasIncremented && track.id && audio.duration) {
        const threshold = Math.min(30, audio.duration * 0.5)
        if (audio.currentTime >= threshold) {
          setHasIncremented(true)
          try {
            await fetch(`/api/tracks/${track.id}/play`, {
              method: 'POST'
            })
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to increment play count:', error)
            }
          }
        }
      }
    }

    audio.addEventListener('timeupdate', checkPlayCount)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('timeupdate', checkPlayCount)
    }
  }, [track, hasIncremented])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      // Pause other audio players
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) a.pause()
      })
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  if (isHeadliner) {
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-2xl p-6 shadow-2xl border-4 border-white">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xs font-black uppercase tracking-wider mb-1">Headliner</div>
            <Link
              href={`/bands/${band.slug}`}
              className="text-3xl font-black uppercase hover:underline block mb-2"
            >
              {band.name}
            </Link>
            {track && (
              <div className="text-sm font-semibold text-gray-800">
                {track.title}
              </div>
            )}
          </div>

          {track && (
            <button
              onClick={togglePlay}
              className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-yellow-400 rounded-full transition-all shadow-lg hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
        {track && <audio ref={audioRef} src={track.file_url} preload="metadata" />}
      </div>
    )
  }

  return (
    <div className="bg-gray-800 text-white rounded-xl p-4 shadow-lg border-2 border-gray-600 hover:border-yellow-400 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/bands/${band.slug}`}
            className="text-lg font-bold hover:text-yellow-400 transition-colors block truncate"
          >
            {band.name}
          </Link>
          {track && (
            <div className="text-sm text-gray-400 truncate">
              {track.title}
            </div>
          )}
        </div>

        {track && (
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full transition-all shadow hover:scale-105"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {track && <audio ref={audioRef} src={track.file_url} preload="metadata" />}
    </div>
  )
}
