/**
 * Analytics Tracking
 * Track user events for analytics
 */

import { createClient } from '@/lib/supabase/server'

export type AnalyticsEventType =
  | 'profile_view'
  | 'track_play'
  | 'song_request'
  | 'tip_sent'
  | 'event_view'
  | 'band_saved'
  | 'affiliate_click'
  | 'subscription_started'
  | 'subscription_canceled'

export interface AnalyticsEvent {
  eventType: AnalyticsEventType
  bandId?: string
  userId?: string
  mediaId?: number
  eventId?: string
  metadata?: Record<string, any>
}

/**
 * Track an analytics event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const supabase = await createClient()
    
    // Get user if available
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('analytics_events').insert({
      event_type: event.eventType,
      band_id: event.bandId,
      user_id: event.userId || user?.id,
      media_id: event.mediaId,
      event_id: event.eventId,
      metadata: event.metadata || {},
    })

    // Update analytics summary (async, don't wait)
    if (event.bandId) {
      updateAnalyticsSummary(event.bandId, event.eventType).catch(console.error)
    }
  } catch (error) {
    console.error('Failed to track event:', error)
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Update analytics summary for a band
 */
async function updateAnalyticsSummary(
  bandId: string,
  eventType: AnalyticsEventType
): Promise<void> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // Get or create today's summary
  const { data: summary } = await supabase
    .from('analytics_summary')
    .select('*')
    .eq('band_id', bandId)
    .eq('period_start', today)
    .eq('period_type', 'day')
    .single()

  const updates: any = {}

  switch (eventType) {
    case 'profile_view':
      updates.profile_views = (summary?.profile_views || 0) + 1
      break
    case 'track_play':
      updates.track_plays = (summary?.track_plays || 0) + 1
      break
    case 'song_request':
      updates.song_requests = (summary?.song_requests || 0) + 1
      break
  }

  if (Object.keys(updates).length > 0) {
    if (summary) {
      await supabase
        .from('analytics_summary')
        .update(updates)
        .eq('id', summary.id)
    } else {
      await supabase.from('analytics_summary').insert({
        band_id: bandId,
        period_start: today,
        period_end: today,
        period_type: 'day',
        ...updates,
      })
    }
  }
}

/**
 * Track profile view
 */
export async function trackProfileView(bandId: string): Promise<void> {
  await trackEvent({
    eventType: 'profile_view',
    bandId,
  })
}

/**
 * Track track play
 */
export async function trackTrackPlay(
  bandId: string,
  mediaId: number
): Promise<void> {
  await trackEvent({
    eventType: 'track_play',
    bandId,
    mediaId,
  })
}

/**
 * Track song request
 */
export async function trackSongRequest(
  bandId: string,
  mediaId: number
): Promise<void> {
  await trackEvent({
    eventType: 'song_request',
    bandId,
    mediaId,
  })
}

