'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getSavedBands,
  getSavedBandsGenres,
  sortSavedBands,
  clearAllSavedBands,
  type SavedBand,
} from '@/lib/savedBands';
import SaveBandButton from '@/components/SaveBandButton';

export default function MyBandsPage() {
  const [savedBands, setSavedBands] = useState<SavedBand[]>([]);
  const [filteredBands, setFilteredBands] = useState<SavedBand[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [genres, setGenres] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load saved bands on mount
  useEffect(() => {
    loadBands();
    const genresList = getSavedBandsGenres();
    setGenres(genresList);

    // Listen for band saved/unsaved events
    const handleBandSaved = () => {
      loadBands();
      setGenres(getSavedBandsGenres());
    };

    window.addEventListener('bandSaved', handleBandSaved);
    return () => window.removeEventListener('bandSaved', handleBandSaved);
  }, []);

  // Update filtered bands when filter/sort changes
  useEffect(() => {
    let bands = [...savedBands];

    // Filter by genre
    if (selectedGenre !== 'all') {
      bands = bands.filter((band) =>
        band.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // Sort
    bands = sortSavedBands(bands, sortOrder);

    setFilteredBands(bands);
  }, [savedBands, selectedGenre, sortOrder]);

  const loadBands = () => {
    const bands = getSavedBands();
    setSavedBands(bands);
  };

  const handleClearAll = () => {
    const success = clearAllSavedBands();
    if (success) {
      setSavedBands([]);
      setFilteredBands([]);
      setGenres([]);
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                The Rock Salt
              </Link>
            </div>
            <Link
              href="/bands"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Explore Bands
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Saved Bands</h1>
          <p className="text-gray-600">
            {savedBands.length === 0
              ? 'Start saving bands to keep track of your favorite local artists'
              : `You have ${savedBands.length} saved band${savedBands.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Empty State */}
        {savedBands.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Saved Bands Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Discover local artists and save your favorites to keep track of them!
            </p>
            <Link
              href="/bands"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Explore Bands
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
              {/* Genre Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="genre-filter" className="text-sm font-semibold text-gray-700">
                  Filter by Genre:
                </label>
                <select
                  id="genre-filter"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Genres ({savedBands.length})</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-order" className="text-sm font-semibold text-gray-700">
                    Sort by:
                  </label>
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="newest">Date Saved (Newest)</option>
                    <option value="oldest">Date Saved (Oldest)</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>

                {/* Clear All Button */}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Bands Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBands.map((band) => (
                <div
                  key={band.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow relative"
                >
                  {/* Heart Button (top-right) */}
                  <div className="absolute top-2 right-2">
                    <SaveBandButton
                      bandId={band.id}
                      bandName={band.name}
                      bandSlug={band.slug}
                      genres={band.genres}
                      size="md"
                    />
                  </div>

                  {/* Band Info */}
                  <div className="pr-10">
                    <h3 className="text-lg font-bold mb-2">{band.name}</h3>

                    {/* Genres */}
                    {band.genres && band.genres.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-3">
                        {band.genres.map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Saved Date */}
                    <p className="text-sm text-gray-500 mb-4">
                      Saved on {new Date(band.savedAt).toLocaleDateString()}
                    </p>

                    {/* View Profile Button */}
                    <Link
                      href={`/bands/${band.slug}`}
                      className="inline-block w-full text-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results After Filter */}
            {filteredBands.length === 0 && selectedGenre !== 'all' && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  No saved bands in the <strong>{selectedGenre}</strong> genre.
                </p>
                <button
                  onClick={() => setSelectedGenre('all')}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Show all genres
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Clear All Saved Bands?</h2>
            <p className="text-gray-700 mb-6">
              This will remove all {savedBands.length} saved band{savedBands.length !== 1 ? 's' : ''} from
              your list. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
