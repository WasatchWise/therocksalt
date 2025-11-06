/**
 * Local Storage utilities for saving/unsaving bands
 * Provides localStorage-based favorites for anonymous users
 * Future: Will sync with database for authenticated users
 */

export type SavedBand = {
  id: string;
  name: string;
  slug: string;
  savedAt: string; // ISO timestamp
  genres?: string[];
};

const STORAGE_KEY = 'rocksalt_saved_bands';

/**
 * Get all saved bands from localStorage
 */
export function getSavedBands(): SavedBand[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading saved bands from localStorage:', error);
    return [];
  }
}

/**
 * Save a band to localStorage
 * Prevents duplicates
 */
export function saveBand(band: Omit<SavedBand, 'savedAt'>): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const saved = getSavedBands();

    // Check if already saved
    if (saved.some((b) => b.id === band.id)) {
      return false; // Already saved
    }

    const newBand: SavedBand = {
      ...band,
      savedAt: new Date().toISOString(),
    };

    saved.push(newBand);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return true;
  } catch (error) {
    console.error('Error saving band to localStorage:', error);
    return false;
  }
}

/**
 * Remove a band from localStorage
 */
export function unsaveBand(bandId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const saved = getSavedBands();
    const filtered = saved.filter((b) => b.id !== bandId);

    if (filtered.length === saved.length) {
      return false; // Band wasn't saved
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing band from localStorage:', error);
    return false;
  }
}

/**
 * Check if a band is currently saved
 */
export function isBandSaved(bandId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const saved = getSavedBands();
    return saved.some((b) => b.id === bandId);
  } catch (error) {
    console.error('Error checking if band is saved:', error);
    return false;
  }
}

/**
 * Get count of saved bands
 */
export function getSavedBandsCount(): number {
  return getSavedBands().length;
}

/**
 * Clear all saved bands
 */
export function clearAllSavedBands(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing saved bands:', error);
    return false;
  }
}

/**
 * Get saved bands filtered by genre
 */
export function getSavedBandsByGenre(genre: string): SavedBand[] {
  const saved = getSavedBands();
  return saved.filter((band) =>
    band.genres?.some((g) => g.toLowerCase() === genre.toLowerCase())
  );
}

/**
 * Get all unique genres from saved bands
 */
export function getSavedBandsGenres(): string[] {
  const saved = getSavedBands();
  const allGenres = saved.flatMap((band) => band.genres || []);
  return Array.from(new Set(allGenres)).sort();
}

/**
 * Sort saved bands by date (newest or oldest)
 */
export function sortSavedBands(
  bands: SavedBand[],
  order: 'newest' | 'oldest' | 'alphabetical'
): SavedBand[] {
  const copy = [...bands];

  switch (order) {
    case 'newest':
      return copy.sort(
        (a, b) =>
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );
    case 'oldest':
      return copy.sort(
        (a, b) =>
          new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
      );
    case 'alphabetical':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy;
  }
}
