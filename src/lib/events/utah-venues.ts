/**
 * Utah Venue Configuration
 * List of specific Utah venues to target for local shows
 */

export interface UtahVenue {
  name: string
  slug: string
  address?: string
  city: string
  state: string
  website?: string
  songkick_id?: number
  bandsintown_id?: string
}

export const UTAH_VENUES: UtahVenue[] = [
  {
    name: 'Urban Lounge',
    slug: 'urban-lounge',
    address: '241 S 500 E',
    city: 'Salt Lake City',
    state: 'UT',
    website: 'https://www.theurbanloungeslc.com',
    songkick_id: 15245, // Songkick venue ID
    bandsintown_id: '10001067'
  },
  {
    name: 'Kilby Court',
    slug: 'kilby-court',
    address: '741 S Kilby Ct',
    city: 'Salt Lake City',
    state: 'UT',
    website: 'https://www.kilbycourt.com',
    songkick_id: 11445,
    bandsintown_id: '10001654'
  },
  {
    name: 'The Depot',
    slug: 'the-depot',
    address: '400 W South Temple',
    city: 'Salt Lake City',
    state: 'UT',
    website: 'https://depotslc.com'
  },
  {
    name: 'Metro Music Hall',
    slug: 'metro-music-hall',
    address: '615 W 100 S',
    city: 'Salt Lake City',
    state: 'UT',
    website: 'https://metromusichall.com'
  },
  {
    name: 'The State Room',
    slug: 'the-state-room',
    address: '638 S State St',
    city: 'Salt Lake City',
    state: 'UT'
  },
  {
    name: 'Piper Down',
    slug: 'piper-down',
    address: '1492 S State St',
    city: 'Salt Lake City',
    state: 'UT'
  },
  {
    name: 'Aces High Saloon',
    slug: 'aces-high-saloon',
    address: '1550 S State St',
    city: 'Salt Lake City',
    state: 'UT'
  },
  {
    name: 'The Commonwealth Room',
    slug: 'the-commonwealth-room',
    address: '195 W 2100 S',
    city: 'Salt Lake City',
    state: 'UT'
  },
  {
    name: 'Soundwell',
    slug: 'soundwell',
    address: '149 W 200 S',
    city: 'Salt Lake City',
    state: 'UT',
    website: 'https://www.soundwellslc.com'
  },
  {
    name: 'Ice Haus',
    slug: 'ice-haus',
    city: 'Salt Lake City',
    state: 'UT'
  },
  {
    name: 'Barbary Coast',
    slug: 'barbary-coast',
    city: 'Salt Lake City',
    state: 'UT'
  },
  {
    name: 'Velour Live Music Gallery',
    slug: 'velour',
    address: '135 N University Ave',
    city: 'Provo',
    state: 'UT',
    website: 'https://velourlive.com'
  },
  {
    name: 'The Complex',
    slug: 'the-complex',
    address: '536 W 100 S',
    city: 'Salt Lake City',
    state: 'UT'
  },
  {
    name: 'Vivint Arena',
    slug: 'vivint-arena',
    address: '301 S Temple',
    city: 'Salt Lake City',
    state: 'UT'
  },
  {
    name: 'Red Butte Garden Amphitheatre',
    slug: 'red-butte-garden',
    city: 'Salt Lake City',
    state: 'UT'
  }
]

/**
 * Get venue by slug
 */
export function getVenueBySlug(slug: string): UtahVenue | undefined {
  return UTAH_VENUES.find(v => v.slug === slug)
}

/**
 * Get all venue names for matching
 */
export function getAllVenueNames(): string[] {
  return UTAH_VENUES.map(v => v.name)
}

/**
 * Fuzzy match venue name
 */
export function matchVenueName(name: string): UtahVenue | undefined {
  const normalized = name.toLowerCase().trim()
  return UTAH_VENUES.find(v =>
    v.name.toLowerCase() === normalized ||
    v.slug === normalized ||
    normalized.includes(v.slug) ||
    v.slug.includes(normalized)
  )
}
