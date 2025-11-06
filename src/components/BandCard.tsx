import Link from 'next/link'

interface BandLink {
  id: string
  label: string | null
  url: string | null
}

interface Genre {
  id: string
  name: string
}

interface Band {
  id: string
  name: string
  slug: string
  bio?: string | null
  status?: string | null
  tier?: string | null
  band_links?: BandLink[] | null
  band_genres?: Array<{
    genre: Genre | null
  }> | null
}

interface BandCardProps {
  band: Band
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status || status === 'active') return null

  const badgeConfig = {
    hiatus: {
      label: 'ON HIATUS',
      icon: '⏸',
      className: 'bg-gradient-to-r from-orange-400 to-amber-500 text-white border-2 border-white',
    },
    dissolved: {
      label: 'SALT VAULT',
      icon: '📚',
      className: 'bg-gradient-to-r from-gray-600 to-gray-800 text-white border-2 border-gray-400',
    },
    reunited: {
      label: 'REUNITED',
      icon: '🔥',
      className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-white',
    },
  }

  const config = badgeConfig[status as keyof typeof badgeConfig]
  if (!config) return null

  return (
    <div className={`absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full font-black text-xs uppercase shadow-lg ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </div>
  )
}

export default function BandCard({ band }: BandCardProps) {
  const tier = band.tier || 'anon'

  // ROCK & ROLL HALL OF FAME TIER
  if (tier === 'hof') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="block relative bg-gradient-to-br from-red-900 via-purple-900 to-red-900 border-8 border-yellow-400 rounded-3xl overflow-hidden shadow-2xl hover:shadow-yellow-400/70 transition-all duration-500 hover:scale-[1.02]"
      >
        <StatusBadge status={band.status} />

        {/* PREMIUM BADGE */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-gray-900 px-8 py-3 rounded-full font-black text-xl uppercase shadow-2xl border-4 border-white">
          ⭐ ROCK & ROLL HALL OF FAME ⭐
        </div>

        {/* SPOTLIGHT BARS */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-red-500 via-purple-500 to-yellow-400"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-red-500 via-purple-500 to-yellow-400"></div>

        <div className="p-8 md:p-12 pt-20">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* LEFT: Band Info */}
            <div className="flex-1">
              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mb-6 leading-tight tracking-tight uppercase">
                {band.name}
              </h2>

              {band.bio && (
                <p className="text-white text-xl mb-6 leading-relaxed line-clamp-3">
                  {band.bio}
                </p>
              )}

              {band.band_genres?.length ? (
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="text-lg font-black text-yellow-300 uppercase tracking-wide">
                    Genres:
                  </span>
                  {band.band_genres
                    ?.map((bg) => bg.genre?.name)
                    .filter(Boolean)
                    .map((genre, index) => (
                      <span
                        key={index}
                        className="px-6 py-3 text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-full font-black uppercase shadow-xl border-2 border-white"
                      >
                        {genre}
                      </span>
                    ))}
                </div>
              ) : null}
            </div>

            {/* RIGHT: Links */}
            {band.band_links?.length ? (
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 text-gray-900 rounded-3xl p-8 shadow-2xl border-8 border-white">
                  <h3 className="text-2xl font-black uppercase tracking-wider mb-4">Listen Now</h3>
                  <div className="flex flex-col gap-3">
                    {band.band_links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white text-lg font-black rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 uppercase border-2 border-yellow-400"
                      >
                        {link.label || 'Link'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    )
  }

  // PLATINUM TIER
  if (tier === 'platinum') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="block relative bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 border-6 border-purple-400 rounded-2xl overflow-hidden shadow-xl hover:shadow-purple-400/60 transition-all duration-500 hover:scale-[1.03]"
      >
        <StatusBadge status={band.status} />

        {/* PLATINUM BADGE */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 text-gray-900 px-6 py-2 rounded-full font-black text-lg uppercase shadow-xl border-2 border-white">
          💎 PLATINUM 💎
        </div>

        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-400"></div>

        <div className="p-8 pt-16">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-purple-400 mb-4 leading-tight tracking-tight uppercase">
            {band.name}
          </h2>

          {band.bio && (
            <p className="text-white text-lg mb-4 leading-relaxed line-clamp-2">
              {band.bio}
            </p>
          )}

          {band.band_genres?.length ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {band.band_genres
                ?.map((bg) => bg.genre?.name)
                .filter(Boolean)
                .map((genre, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold uppercase shadow-lg"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          ) : null}

          {band.band_links?.length ? (
            <div className="flex flex-wrap gap-2">
              {band.band_links.map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:scale-105 font-bold"
                >
                  {link.label || 'Link'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    )
  }

  // NATIONAL ACT TIER
  if (tier === 'national_act') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="block relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 border-4 border-blue-400 rounded-xl p-6 shadow-xl hover:shadow-blue-400/50 transition-all hover:scale-[1.05]"
      >
        <StatusBadge status={band.status} />

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400 rounded-t-xl"></div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-blue-400 text-2xl">🎤</span>
          <h2 className="text-xl font-black text-white uppercase truncate">
            {band.name}
          </h2>
        </div>

        {band.band_genres?.length ? (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {band.band_genres
                ?.map((bg) => bg.genre?.name)
                .filter(Boolean)
                .map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-black bg-blue-400 text-gray-900 rounded-full uppercase"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        {band.band_links?.length ? (
          <div className="flex flex-wrap gap-2">
            {band.band_links.map((link) => (
              <a
                key={link.id}
                href={link.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-bold"
              >
                {link.label || 'Link'}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        ) : null}
      </Link>
    )
  }

  // HEADLINER TIER
  if (tier === 'headliner' || tier === 'featured') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="block relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-4 border-yellow-400 rounded-xl p-6 shadow-xl hover:shadow-yellow-400/50 transition-all hover:scale-[1.05]"
      >
        <StatusBadge status={band.status} />

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-t-xl"></div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-400 text-2xl">★</span>
          <h2 className="text-xl font-black text-white uppercase truncate">
            {band.name}
          </h2>
        </div>

        {band.band_genres?.length ? (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {band.band_genres
                ?.map((bg) => bg.genre?.name)
                .filter(Boolean)
                .map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-black bg-yellow-400 text-gray-900 rounded-full uppercase"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        {band.band_links?.length ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {band.band_links.map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-bold"
                >
                  {link.label || 'Link'}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </Link>
    )
  }

  // GARAGE TIER
  if (tier === 'garage') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="relative bg-white dark:bg-gray-800 border-2 border-orange-400 dark:border-orange-500 rounded-lg p-6 shadow-md hover:shadow-lg transition-all hover:scale-[1.03] block"
      >
        <StatusBadge status={band.status} />

        <div className="flex items-center gap-2 mb-3">
          <span className="text-orange-500 text-xl">🎸</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {band.name}
          </h2>
        </div>

        {band.band_genres?.length ? (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {band.band_genres
                ?.map((bg) => bg.genre?.name)
                .filter(Boolean)
                .map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-bold bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        {band.band_links?.length ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {band.band_links.map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                >
                  {link.label || 'Link'}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </Link>
    )
  }

  // ANON TIER (and legacy 'free' tier)
  return (
    <Link
      href={`/bands/${band.slug}`}
      className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] block"
    >
      <StatusBadge status={band.status} />

      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {band.name}
        </h2>
      </div>

      {band.band_genres?.length ? (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {band.band_genres
              ?.map((bg) => bg.genre?.name)
              .filter(Boolean)
              .map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                >
                  {genre}
                </span>
              ))}
          </div>
        </div>
      ) : null}

      {band.band_links?.length ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Listen:
          </h3>
          <div className="flex flex-wrap gap-2">
            {band.band_links.map((link) => (
              <a
                key={link.id}
                href={link.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {link.label || 'Link'}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </Link>
  )
}
