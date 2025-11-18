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
      label: 'On Hiatus',
      className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    },
    dissolved: {
      label: 'Salt Vault',
      className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    },
    reunited: {
      label: 'Reunited',
      className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    },
  }

  const config = badgeConfig[status as keyof typeof badgeConfig]
  if (!config) return null

  return (
    <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-md text-xs font-semibold border ${config.className}`}>
      {config.label}
    </div>
  )
}

function TierBadge({ tier }: { tier: string }) {
  const badges = {
    hof: { label: 'Hall of Fame', className: 'bg-yellow-500 text-white' },
    platinum: { label: 'Platinum', className: 'bg-purple-500 text-white' },
    national_act: { label: 'National Act', className: 'bg-blue-500 text-white' },
    headliner: { label: 'Featured', className: 'bg-yellow-400 text-gray-900' },
    featured: { label: 'Featured', className: 'bg-yellow-400 text-gray-900' },
    garage: { label: 'Garage', className: 'bg-orange-500 text-white' },
  }

  const badge = badges[tier as keyof typeof badges]
  if (!badge) return null

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${badge.className}`}>
      {badge.label}
    </span>
  )
}

export default function BandCard({ band }: BandCardProps) {
  const tier = band.tier || 'anon'

  // ROCK & ROLL HALL OF FAME TIER - Still special but more refined
  if (tier === 'hof') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="group relative block bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l-4 border-yellow-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
      >
        <StatusBadge status={band.status} />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <TierBadge tier={tier} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                {band.name}
              </h2>
            </div>
          </div>

          {band.bio && (
            <p className="text-white/80 text-sm mb-4 line-clamp-2 leading-relaxed">
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
                    className="px-2.5 py-1 text-xs font-medium bg-yellow-400/20 text-yellow-300 rounded-md border border-yellow-400/30"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          ) : null}

          {band.band_links?.length ? (
            <div className="flex flex-wrap gap-2">
              {band.band_links.slice(0, 3).map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-md transition-colors"
                >
                  {link.label || 'Link'}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

  // PLATINUM TIER - Clean and refined
  if (tier === 'platinum') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="group relative block bg-white dark:bg-gray-800 border-l-4 border-purple-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
      >
        <StatusBadge status={band.status} />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <TierBadge tier={tier} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {band.name}
              </h2>
            </div>
          </div>

          {band.bio && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {band.bio}
            </p>
          )}

          {band.band_genres?.length ? (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {band.band_genres
                ?.map((bg) => bg.genre?.name)
                .filter(Boolean)
                .map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          ) : null}

          {band.band_links?.length ? (
            <div className="flex flex-wrap gap-2">
              {band.band_links.slice(0, 2).map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  {link.label || 'Link'}
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
        className="group relative block bg-white dark:bg-gray-800 border-l-4 border-blue-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
      >
        <StatusBadge status={band.status} />

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <TierBadge tier={tier} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate flex-1">
              {band.name}
            </h2>
          </div>

          {band.band_genres?.length ? (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {band.band_genres
                ?.map((bg) => bg.genre?.name)
                .filter(Boolean)
                .map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          ) : null}

          {band.band_links?.length ? (
            <div className="flex flex-wrap gap-2">
              {band.band_links.slice(0, 2).map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  {link.label || 'Link'}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    )
  }

  // HEADLINER/FEATURED TIER
  if (tier === 'headliner' || tier === 'featured') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="group relative block bg-white dark:bg-gray-800 border-l-4 border-yellow-400 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
      >
        <StatusBadge status={band.status} />

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <TierBadge tier={tier} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate flex-1">
              {band.name}
            </h2>
          </div>

          {band.band_genres?.length ? (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {band.band_genres
                ?.map((bg) => bg.genre?.name)
                .filter(Boolean)
                .map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          ) : null}

          {band.band_links?.length ? (
            <div className="flex flex-wrap gap-2">
              {band.band_links.slice(0, 2).map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded transition-colors"
                >
                  {link.label || 'Link'}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    )
  }

  // GARAGE TIER
  if (tier === 'garage') {
    return (
      <Link
        href={`/bands/${band.slug}`}
        className="group relative block bg-white dark:bg-gray-800 border-l-4 border-orange-400 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
      >
        <StatusBadge status={band.status} />

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TierBadge tier={tier} />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate flex-1">
              {band.name}
            </h2>
          </div>

          {band.band_genres?.length ? (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {band.band_genres
                ?.map((bg) => bg.genre?.name)
                .filter(Boolean)
                .map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          ) : null}

          {band.band_links?.length ? (
            <div className="flex flex-wrap gap-2">
              {band.band_links.slice(0, 2).map((link) => (
                <a
                  key={link.id}
                  href={link.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                >
                  {link.label || 'Link'}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    )
  }

  // ANON TIER (default)
  return (
    <Link
      href={`/bands/${band.slug}`}
      className="group relative block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
    >
      <StatusBadge status={band.status} />

      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {band.name}
        </h2>

        {band.band_genres?.length ? (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {band.band_genres
              ?.map((bg) => bg.genre?.name)
              .filter(Boolean)
              .map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {genre}
                </span>
              ))}
          </div>
        ) : null}

        {band.band_links?.length ? (
          <div className="flex flex-wrap gap-2">
            {band.band_links.slice(0, 2).map((link) => (
              <a
                key={link.id}
                href={link.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
              >
                {link.label || 'Link'}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
