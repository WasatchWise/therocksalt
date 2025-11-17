/**
 * Analytics Dashboard Queries
 * Fetch analytics data for dashboard display
 */

import { createClient } from '@/lib/supabase/server'

export interface AnalyticsData {
  totalPlays: number
  profileViews: number
  songRequests: number
  tipsReceived: number
  uniqueListeners: number
  peakTimes: Array<{ hour: number; plays: number }>
  topTracks: Array<{ mediaId: number; title: string; plays: number }>
  recentActivity: Array<{
    eventType: string
    timestamp: string
    metadata: any
  }>
}

/**
 * Get analytics for a band
 */
export async function getBandAnalytics(
  bandId: string,
  period: '7d' | '30d' | 'all' = '30d'
): Promise<AnalyticsData> {
  const supabase = await createClient()

  // Calculate date range
  const now = new Date()
  let startDate: Date
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(0)
  }

  // Get summary data
  const { data: summary } = await supabase
    .from('analytics_summary')
    .select('*')
    .eq('band_id', bandId)
    .gte('period_start', startDate.toISOString().split('T')[0])
    .order('period_start', { ascending: false })

  // Aggregate totals
  const totalPlays = summary?.reduce((sum, s) => sum + (s.track_plays || 0), 0) || 0
  const profileViews = summary?.reduce((sum, s) => sum + (s.profile_views || 0), 0) || 0
  const songRequests = summary?.reduce((sum, s) => sum + (s.song_requests || 0), 0) || 0

  // Get tips
  const { data: tips } = await supabase
    .from('tips')
    .select('amount_cents')
    .eq('artist_id', bandId)
    .eq('payment_status', 'completed')
    .gte('created_at', startDate.toISOString())

  const tipsReceived = tips?.reduce((sum, t) => sum + (t.amount_cents || 0), 0) || 0

  // Get event data for peak times
  const { data: events } = await supabase
    .from('analytics_events')
    .select('created_at, metadata')
    .eq('band_id', bandId)
    .eq('event_type', 'track_play')
    .gte('created_at', startDate.toISOString())

  // Calculate peak times (by hour)
  const peakTimesMap = new Map<number, number>()
  events?.forEach((event) => {
    const hour = new Date(event.created_at).getHours()
    peakTimesMap.set(hour, (peakTimesMap.get(hour) || 0) + 1)
  })

  const peakTimes = Array.from(peakTimesMap.entries())
    .map(([hour, plays]) => ({ hour, plays }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 24)

  // Get top tracks
  const trackPlaysMap = new Map<number, number>()
  events?.forEach((event) => {
    const mediaId = event.metadata?.media_id
    if (mediaId) {
      trackPlaysMap.set(mediaId, (trackPlaysMap.get(mediaId) || 0) + 1)
    }
  })

  const topTracks = Array.from(trackPlaysMap.entries())
    .map(([mediaId, plays]) => ({
      mediaId,
      title: `Track ${mediaId}`, // Would need to fetch from AzuraCast or store
      plays,
    }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10)

  // Get unique listeners (approximate)
  const { data: uniqueUsers } = await supabase
    .from('analytics_events')
    .select('user_id')
    .eq('band_id', bandId)
    .eq('event_type', 'track_play')
    .gte('created_at', startDate.toISOString())
    .not('user_id', 'is', null)

  const uniqueListeners = new Set(uniqueUsers?.map((e) => e.user_id)).size

  // Get recent activity
  const { data: recentEvents } = await supabase
    .from('analytics_events')
    .select('event_type, created_at, metadata')
    .eq('band_id', bandId)
    .order('created_at', { ascending: false })
    .limit(20)

  const recentActivity = recentEvents?.map((e) => ({
    eventType: e.event_type,
    timestamp: e.created_at,
    metadata: e.metadata,
  })) || []

  return {
    totalPlays,
    profileViews,
    songRequests,
    tipsReceived,
    uniqueListeners,
    peakTimes,
    topTracks,
    recentActivity,
  }
}

