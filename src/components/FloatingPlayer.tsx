'use client'

import { useState } from 'react'
import { useAudioPlayer } from '@/contexts/AudioPlayerContext'
import Image from 'next/image'

export default function FloatingPlayer() {
  const { isPlaying, isLoading, nowPlaying, togglePlay } = useAudioPlayer()
  const [isExpanded, setIsExpanded] = useState(false)

  const hasValidTrack = nowPlaying &&
    nowPlaying.song.title !== 'Station Offline' &&
    nowPlaying.song.artist !== 'Unknown Artist'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-pink-500/20 to-transparent blur-xl -z-10 pointer-events-none" />

      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 border-t-4 border-yellow-400 shadow-2xl backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Player Bar */}
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Left: Album Art + Now Playing */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Album Art */}
              <div className="relative group">
                {hasValidTrack && nowPlaying.song.art ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                    <img
                      src={nowPlaying.song.art}
                      alt="Album Art"
                      className="relative w-14 h-14 rounded-lg shadow-xl border-2 border-yellow-400 object-cover transform group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-yellow-400 shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-bold text-base truncate drop-shadow-lg">
                    {hasValidTrack ? nowPlaying.song.title : 'The Rock Salt Radio'}
                  </p>
                  {isPlaying && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse shadow-lg">
                      <span className="w-2 h-2 bg-white rounded-full animate-ping absolute"></span>
                      <span className="w-2 h-2 bg-white rounded-full relative"></span>
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-white/90 text-sm truncate drop-shadow-md">
                  {hasValidTrack ? nowPlaying.song.artist : 'Salt Lake\'s Music Hub'}
                </p>
                {nowPlaying?.live.is_live && nowPlaying.live.streamer_name && (
                  <p className="text-yellow-300 text-xs font-semibold mt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    {nowPlaying.live.streamer_name}
                  </p>
                )}
              </div>
            </div>

            {/* Center: Play Button */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="relative w-16 h-16 flex items-center justify-center bg-white hover:bg-yellow-50 text-orange-600 rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-3 border-yellow-400 group"
              aria-label={isPlaying ? 'Pause stream' : 'Play stream'}
            >
              {/* Glow effect on play button */}
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />

              {isLoading ? (
                <svg className="relative w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isPlaying ? (
                <svg className="relative w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="relative w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Right: UMR Logo & Expand Button */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.utahmusicradio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block transform hover:scale-105 transition-transform"
              >
                <Image
                  src="/UMR.png"
                  alt="Utah Music Radio"
                  width={100}
                  height={33}
                  className="h-8 w-auto hover:opacity-80 transition-opacity drop-shadow-lg"
                />
              </a>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:text-yellow-400 transition-all transform hover:scale-110"
                aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
              >
                <svg
                  className={`w-7 h-7 transition-transform duration-300 drop-shadow-lg ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded View */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pb-6 pt-2 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recently Played */}
                <div className="group">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-yellow-400/50 transition-all transform hover:scale-[1.02] shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-white font-bold text-sm">Recently Played</h4>
                    </div>
                    <div className="h-40 overflow-y-auto rounded-lg bg-black/20">
                      <iframe
                        src="https://a8.asurahosting.com/public/therocksalt/history?theme=dark"
                        className="w-full h-64 border-0"
                        title="Recently Played"
                      />
                    </div>
                  </div>
                </div>

                {/* Request a Song */}
                <div className="group">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-yellow-400/50 transition-all transform hover:scale-[1.02] shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                      <h4 className="text-white font-bold text-sm">Request a Song</h4>
                    </div>
                    <div className="h-40 overflow-y-auto rounded-lg bg-black/20">
                      <iframe
                        src="https://a8.asurahosting.com/public/therocksalt/embed-requests?theme=dark"
                        className="w-full h-64 border-0"
                        title="Request Songs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
