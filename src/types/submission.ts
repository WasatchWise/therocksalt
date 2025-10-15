// Type definitions for music submission form

export interface MusicSubmissionForm {
  // Band Information
  bandName: string
  hometown: string
  bio: string
  description?: string

  // Files
  bandPhoto?: File
  musicFile?: File

  // Genre
  primaryGenre: string
  additionalGenres?: string[]

  // Contact Information
  contactName: string
  contactEmail: string
  contactPhone?: string

  // Social Links
  website?: string
  instagram?: string
  facebook?: string
  spotify?: string
  bandcamp?: string
  tiktok?: string

  // Music Details
  songTitle?: string
  songDescription?: string
  streamingLinks?: string[]

  // Additional
  ffo?: string // For Fans Of
  howDidYouHear?: string
  bookingAvailable?: 'yes' | 'no' | 'maybe'
  additionalComments?: string

  // Consent
  agreeToTerms: boolean
  emailOptIn?: boolean
}

export interface MusicSubmissionData {
  band_name: string
  contact_name: string
  contact_email: string
  hometown: string
  links: {
    band_photo?: string
    music_file?: string
    song_title?: string
    song_description?: string
    website?: string
    instagram?: string
    facebook?: string
    spotify?: string
    bandcamp?: string
    tiktok?: string
    streaming_links?: string[]
  }
  notes?: string
  genre_preferences: string[]
  status: 'pending' | 'reviewed' | 'accepted' | 'declined'
}

export const GENRE_OPTIONS = [
  'Rock',
  'Punk',
  'Indie',
  'Metal',
  'Folk',
  'Hip-Hop',
  'Electronic',
  'Pop',
  'Alternative',
  'Hardcore',
  'Emo',
  'Country',
  'Experimental',
  'Other'
] as const

export const REFERRAL_SOURCE_OPTIONS = [
  'Social media (Instagram/Facebook/TikTok)',
  'Friend/band referral',
  'Local venue',
  'RockSalt event/show',
  'Web search',
  'SLUG Magazine',
  'Rock Salt Radio or Utah Musicians Radio',
  'Other'
] as const

export type Genre = typeof GENRE_OPTIONS[number]
export type ReferralSource = typeof REFERRAL_SOURCE_OPTIONS[number]
