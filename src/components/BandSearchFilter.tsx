'use client'

import { useState, useMemo } from 'react'
import BandCard from './BandCard'

interface Band {
  id: string
  name: string
  slug: string
  status?: string | null
  tier?: string | null
  band_genres?: Array<{
    genre: {
      id: string
      name: string
    } | null
  }> | null
  [key: string]: unknown
}

interface BandSearchFilterProps {
  bands: Band[]
}

export default function BandSearchFilter({ bands }: BandSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')

  // Extract unique genres from all bands
  const genres = useMemo(() => {
    const genreSet = new Set<string>()
    bands.forEach(band => {
      band.band_genres?.forEach(bg => {
        if (bg.genre?.name) {
          genreSet.add(bg.genre.name)
        }
      })
    })
    return Array.from(genreSet).sort()
  }, [bands])

  // Filter bands based on search and genre
  const filteredBands = useMemo(() => {
    return bands.filter(band => {
      // Search filter
      const matchesSearch = !searchQuery ||
        band.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Genre filter
      const matchesGenre = selectedGenre === 'all' ||
        band.band_genres?.some(bg => bg.genre?.name === selectedGenre)

      return matchesSearch && matchesGenre
    })
  }, [bands, searchQuery, selectedGenre])

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Genre Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredBands.length}</span> of <span className="font-bold">{bands.length}</span> artists
          {selectedGenre !== 'all' && <span> in {selectedGenre}</span>}
          {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
        </div>
      </div>

      {/* Render filtered bands */}
      <>
        {/* ROCK & ROLL HALL OF FAME TIER - Full width, massive cards */}
        {filteredBands.filter(b => b.tier === 'hof').length > 0 && (
          <section className="mb-16">
            <div className="space-y-8">
              {filteredBands.filter(b => b.tier === 'hof').map((band) => (
                <BandCard key={band.id} band={band} />
              ))}
            </div>
          </section>
        )}

        {/* REGULAR BANDS LIST */}
        {filteredBands.filter(b => b.tier !== 'hof').length > 0 && (
          <div className="space-y-4">
            {filteredBands.filter(b => b.tier !== 'hof').map((band) => (
              <BandCard key={band.id} band={band} />
            ))}
          </div>
        )}

        {filteredBands.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎸</div>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No artists found matching your filters. Try adjusting your search!
            </p>
          </div>
        )}
      </>
    </div>
  )
}
