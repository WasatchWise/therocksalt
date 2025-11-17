'use client'

import { useAudioPlayer } from '@/contexts/AudioPlayerContext'

interface LiveStreamPlayerProps {
  title?: string
  description?: string
}

export default function LiveStreamPlayer({
  title = 'The Rock Salt Live',
  description = 'Salt Lake City\'s Independent Music Radio'
}: LiveStreamPlayerProps) {
  const { isPlaying, isLoading, error, nowPlaying, togglePlay } = useAudioPlayer()

  return (
    <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-xl p-4 md:p-6 shadow-2xl border-4 border-cyan-500">

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side: Large UMR Logo (1/3) */}
        <div className="flex items-center justify-center md:w-1/3">
          <img
            src="/UMR.png"
            alt="Utah Music Radio"
            className="w-full h-auto max-h-64 md:max-h-80"
          />
        </div>

        {/* Right side: Player info and controls (2/3) */}
        <div className="flex flex-col justify-between md:w-2/3 gap-3">
          {/* Top section: Stream info */}
          <div>
            {/* Stream Info Badge */}
            <div className="inline-block px-3 py-1 bg-cyan-500 rounded-md shadow-lg mb-2">
              <p className="text-white text-xs font-semibold">
                Currently Streaming: <span className="font-bold">The Rock Salt</span>
              </p>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              {title}
            </h2>
            <p className="text-white text-sm drop-shadow-md mb-3">
              {description}
            </p>

            {/* Utah Music Radio Link */}
            <a
              href="https://www.utahmusicradio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white hover:text-cyan-100 font-bold text-sm transition-colors"
            >
              Explore more streams at Utah Music Radio
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Bottom section: Player controls and now playing */}
          <div className="flex items-end justify-between gap-4">
            {/* Now Playing Info */}
            <div className="flex-1">
              {nowPlaying && nowPlaying.song.title !== 'Station Offline' && nowPlaying.song.artist !== 'Unknown Artist' && (
                <div className="flex items-center gap-3">
                  {nowPlaying.song.art && (
                    <img
                      src={nowPlaying.song.art}
                      alt="Album Art"
                      className="w-12 h-12 rounded-md shadow-lg border-2 border-cyan-500"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm drop-shadow-md truncate">
                      {nowPlaying.song.title}
                    </p>
                    <p className="text-white/90 text-xs truncate">
                      {nowPlaying.song.artist}
                    </p>
                    {nowPlaying.live.is_live && nowPlaying.live.streamer_name && (
                      <p className="text-red-200 text-xs font-semibold">
                        🎙️ {nowPlaying.live.streamer_name}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Player Controls - Bottom Right */}
            <div className="flex flex-col items-center gap-2">
              {/* Live Indicator */}
              {isPlaying && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-full font-bold text-xs animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  LIVE
                </div>
              )}

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white hover:bg-gray-100 text-orange-600 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-4 border-cyan-500"
                aria-label={isPlaying ? 'Pause stream' : 'Play stream'}
              >
                {isLoading ? (
                  <svg className="w-8 h-8 md:w-10 md:h-10 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isPlaying ? (
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 md:w-10 md:h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Status Text */}
              <div className="text-white text-xs font-semibold drop-shadow-md text-center">
                {isLoading && <p>Connecting...</p>}
                {isPlaying && !isLoading && <p>Streaming Live</p>}
                {!isPlaying && !isLoading && !error && <p>Click to Listen</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-500/20 border border-red-300 rounded-lg text-white text-xs">
          {error}
        </div>
      )}
    </div>
  )
}
