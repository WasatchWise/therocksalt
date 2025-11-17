/**
 * Social Media Post Templates
 * Templates for automated social media posts
 */

import type { SocialMediaPost } from './client'

export interface EventPostData {
  eventName: string
  venueName: string
  date: string
  time: string
  ticketUrl?: string
  bandNames: string[]
}

export interface ArtistSpotlightData {
  artistName: string
  bio: string
  imageUrl?: string
  profileUrl: string
  genres: string[]
}

export interface TrackMilestoneData {
  artistName: string
  trackTitle: string
  playCount: number
  trackUrl?: string
}

/**
 * Create event announcement post
 */
export function createEventPost(data: EventPostData): SocialMediaPost {
  const bandList = data.bandNames.length > 1
    ? `${data.bandNames.slice(0, -1).join(', ')} & ${data.bandNames[data.bandNames.length - 1]}`
    : data.bandNames[0]

  const text = `🎸 LIVE MUSIC ALERT 🎸

${bandList}
📍 ${data.venueName}
📅 ${data.date} at ${data.time}

${data.ticketUrl ? `🎫 Get tickets: ${data.ticketUrl}` : ''}

#SLCmusic #LiveMusic #TheRockSalt`

  return {
    text,
    link: data.ticketUrl,
    platform: 'all',
  }
}

/**
 * Create artist spotlight post
 */
export function createArtistSpotlightPost(data: ArtistSpotlightData): SocialMediaPost {
  const genreTags = data.genres.map(g => `#${g.replace(/\s+/g, '')}`).join(' ')

  const text = `🌟 ARTIST SPOTLIGHT 🌟

${data.artistName}
${data.bio.substring(0, 200)}${data.bio.length > 200 ? '...' : ''}

Check them out: ${data.profileUrl}

${genreTags} #SLCmusic #TheRockSalt`

  return {
    text,
    imageUrl: data.imageUrl,
    link: data.profileUrl,
    platform: 'all',
  }
}

/**
 * Create track milestone post
 */
export function createTrackMilestonePost(data: TrackMilestoneData): SocialMediaPost {
  const text = `🎵 MILESTONE ALERT 🎵

${data.artistName}'s "${data.trackTitle}" just hit ${data.playCount.toLocaleString()} plays on Rock Salt Radio! 🎉

Keep the music playing! 🎸

#SLCmusic #TheRockSalt #LocalMusic`

  return {
    text,
    link: data.trackUrl,
    platform: 'all',
  }
}

