'use client'

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react'

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

interface AudioPlayerContextType {
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  nowPlaying: NowPlayingData | null
  togglePlay: () => Promise<void>
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null)

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null)

  // Initialize audio element once
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('https://a8.asurahosting.com/listen/therocksalt/radio.mp3')
      audioRef.current.preload = 'none'

      const audio = audioRef.current

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
    }
  }, [])

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

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 15000)

    return () => clearInterval(interval)
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
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        isLoading,
        error,
        nowPlaying,
        togglePlay,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider')
  }
  return context
}
