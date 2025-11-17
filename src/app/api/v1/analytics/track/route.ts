import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics/track'
import type { AnalyticsEventType } from '@/lib/analytics/track'

/**
 * Track an analytics event
 * POST /api/v1/analytics/track
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      eventType,
      bandId,
      mediaId,
      eventId,
      metadata,
    } = body

    if (!eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      )
    }

    await trackEvent({
      eventType: eventType as AnalyticsEventType,
      bandId,
      mediaId,
      eventId,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      {
        error: 'Failed to track event',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

