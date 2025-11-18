/**
 * Cron job endpoint to sync events from external APIs
 * Called by Vercel Cron or manually
 */

import { NextResponse } from 'next/server'
import { curateEvents } from '@/lib/events/curator'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max

export async function GET(request: Request) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting event curation...')
    const results = await curateEvents()

    return NextResponse.json({
      success: results.success,
      message: `Event sync complete: ${results.created} created, ${results.updated} updated`,
      details: {
        created: results.created,
        updated: results.updated,
        errors: results.errors.length > 0 ? results.errors : undefined
      }
    })

  } catch (error) {
    console.error('Event sync failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also allow POST for manual triggers
export async function POST(request: Request) {
  return GET(request)
}
