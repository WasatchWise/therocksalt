'use client'

import { useState } from 'react'
import { useAudioPlayer } from '@/contexts/AudioPlayerContext'
import Image from 'next/image'

export default function FloatingPlayer() {
  const { isPlaying, isLoading, nowPlaying, togglePlay } = useAudioPlayer()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-t-4 border-yellow-400 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Compact Player Bar */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Left: Now Playing */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {nowPlaying?.song.art && (
              <img
                src={nowPlaying.song.art}
                alt="Album Art"
                className="w-12 h-12 rounded-md shadow-lg border-2 border-yellow-400"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm truncate">
                  {nowPlaying?.song.title || 'The Rock Salt Radio'}
                </p>
                {isPlaying && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-white/90 text-xs truncate">
                {nowPlaying?.song.artist || 'Salt Lake\'s Music Hub'}
              </p>
            </div>
          </div>

          {/* Center: Play Button */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-100 text-orange-600 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-yellow-400"
            aria-label={isPlaying ? 'Pause stream' : 'Play stream'}
          >
            {isLoading ? (
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Right: UMR Logo & Expand */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.utahmusicradio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <Image
                src="/UMR.png"
                alt="Utah Music Radio"
                width={80}
                height={27}
                className="h-7 w-auto hover:opacity-80 transition-opacity"
              />
            </a>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:text-yellow-400 transition-colors"
              aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
            >
              <svg
                className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="pb-4 pt-2 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recently Played */}
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <h4 className="text-white font-bold text-sm mb-2">Recently Played</h4>
                <div className="h-32 overflow-y-auto">
                  <iframe
                    src="https://a8.asurahosting.com/public/therocksalt/history?theme=dark"
                    className="w-full h-48 border-0"
                    title="Recently Played"
                  />
                </div>
              </div>

              {/* Request a Song */}
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <h4 className="text-white font-bold text-sm mb-2">Request a Song</h4>
                <div className="h-32 overflow-y-auto">
                  <iframe
                    src="https://a8.asurahosting.com/public/therocksalt/embed-requests?theme=dark"
                    className="w-full h-48 border-0"
                    title="Request Songs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
