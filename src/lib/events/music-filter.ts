/**
 * Music Event Filter
 * Filters events to only include music/band-related events
 */

/**
 * Keywords that indicate a music/band event
 */
const MUSIC_KEYWORDS = [
  // Music genres and types
  'concert', 'show', 'gig', 'performance', 'live music', 'live band',
  'band', 'bands', 'musician', 'musicians', 'singer', 'singer-songwriter',
  'dj', 'dj set', 'dj night', 'dance party', 'rave',
  'acoustic', 'rock', 'punk', 'metal', 'jazz', 'blues', 'folk', 'country',
  'indie', 'alternative', 'pop', 'hip hop', 'rap', 'reggae', 'soul', 'funk',
  'electronic', 'edm', 'techno', 'house', 'trance', 'dubstep',
  'bluegrass', 'americana', 'singer-songwriter',
  
  // Event types
  'album release', 'album launch', 'single release',
  'tour', 'tour date', 'tour stop',
  'festival', 'music festival',
  'open mic', 'open mic night',
  'karaoke', 'karaoke night',
  'open jam', 'jam session', 'jam night',
  'battle of the bands',
  'music night', 'music series',
  
  // Venue indicators (music venues)
  'venue', 'club', 'bar', 'pub', 'tavern', 'lounge',
  'theater', 'theatre', 'hall', 'auditorium',
  'stage', 'stages',
  
  // Common music venue names in SLC
  'commonwealth room', 'state room', 'urban lounge', 'kilby court',
  'metropolitan', 'metro', 'depot', 'complex', 'eccles',
  'red butte', 'usana', 'vivint', 'delta center',
  'tavernacle', 'twist', 'piper down', 'beer bar',
  'quarters', 'why kiki', 'beehive', 'handle bar',
  'scion', 'hopkins', '2 row', 'kiitos', 'fisher',
  'garage', 'soundwell', 'in the venue', 'the depot'
]

/**
 * Keywords that indicate a NON-music event (to exclude)
 */
const EXCLUDE_KEYWORDS = [
  'dance recital', 'dance class', 'dance workshop', 'dance performance',
  'ballet', 'tap dance', 'jazz dance', 'modern dance',
  'yoga', 'yoga class', 'meditation', 'wellness',
  'art class', 'art workshop', 'art camp', 'art market',
  'craft', 'crafting', 'sewing', 'knitting', 'crochet',
  'cooking class', 'cooking workshop', 'culinary',
  'fitness', 'workout', 'gym', 'exercise',
  'theater', 'theatre', 'play', 'musical (non-music)', 'drama',
  'comedy show', 'stand-up', 'improv',
  'trivia', 'bingo', 'game night', 'board game',
  'book club', 'book reading', 'author talk',
  'lecture', 'seminar', 'workshop (non-music)',
  'film', 'movie', 'screening', 'cinema',
  'sports', 'football', 'basketball', 'baseball',
  'market', 'marketplace', 'vendor', 'vendor market',
  'festival (non-music)', 'art festival', 'food festival',
  'exhibition', 'gallery', 'museum',
  'tour (non-music)', 'walking tour', 'food tour',
  'fundraiser (non-music)', 'charity event',
  'conference', 'convention', 'expo',
  'class (non-music)', 'training', 'course',
  'meetup', 'networking', 'social',
  'brunch (non-music)', 'dinner (non-music)',
  'holiday market', 'christmas market', 'craft fair'
]

/**
 * Check if an event is music/band-related
 */
export function isMusicEvent(
  title: string,
  category: string | null = null,
  venue: string | null = null,
  description: string | null = null
): boolean {
  const searchText = [
    title,
    category,
    venue,
    description
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  // First check for exclusion keywords (higher priority)
  for (const excludeKeyword of EXCLUDE_KEYWORDS) {
    if (searchText.includes(excludeKeyword.toLowerCase())) {
      // Exception: if it's a music venue AND has music keywords, it might still be music
      if (isMusicVenue(venue) && hasMusicKeywords(searchText)) {
        continue
      }
      return false
    }
  }

  // Check for music keywords
  return hasMusicKeywords(searchText) || isMusicVenue(venue)
}

/**
 * Check if text contains music-related keywords
 */
function hasMusicKeywords(text: string): boolean {
  const lowerText = text.toLowerCase()
  
  for (const keyword of MUSIC_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return true
    }
  }
  
  return false
}

/**
 * Check if venue is a known music venue
 */
function isMusicVenue(venue: string | null): boolean {
  if (!venue) return false
  
  const lowerVenue = venue.toLowerCase()
  const musicVenues = [
    'commonwealth room', 'state room', 'urban lounge', 'kilby court',
    'metropolitan', 'metro', 'depot', 'complex', 'eccles',
    'red butte', 'usana', 'vivint', 'delta center',
    'tavernacle', 'twist', 'piper down', 'beer bar',
    'quarters', 'why kiki', 'beehive', 'handle bar',
    'scion', 'hopkins', '2 row', 'kiitos', 'fisher',
    'garage', 'soundwell', 'in the venue', 'the depot',
    'club', 'bar', 'pub', 'tavern', 'lounge'
  ]
  
  return musicVenues.some(mv => lowerVenue.includes(mv))
}

/**
 * Filter events to only include music-related ones
 */
export function filterMusicEvents<T extends { title: string; category?: string | null; venue?: string | null; description?: string | null }>(
  events: T[]
): T[] {
  return events.filter(event => 
    isMusicEvent(
      event.title,
      event.category || null,
      event.venue || null,
      event.description || null
    )
  )
}

