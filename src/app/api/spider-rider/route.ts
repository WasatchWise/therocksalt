import { NextRequest, NextResponse } from 'next/server'
import { upsertSpiderRider } from '@/lib/supabase/spider-rider-queries'
import type { SpiderRiderData } from '@/lib/supabase/spider-rider-queries'

export async function POST(request: NextRequest) {
  try {
    const data: SpiderRiderData = await request.json()

    // Validate minimum budget
    if (data.guarantee_min && data.guarantee_min < 10000) {
      return NextResponse.json(
        { error: 'Minimum guarantee must be at least $100. We don\'t do "exposure" gigs.' },
        { status: 400 }
      )
    }

    // Validate band_id
    if (!data.band_id) {
      return NextResponse.json(
        { error: 'band_id is required' },
        { status: 400 }
      )
    }

    // Create/update the spider rider
    const rider = await upsertSpiderRider(data)

    return NextResponse.json({ success: true, rider }, { status: 200 })
  } catch (error: any) {
    console.error('Error creating spider rider:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create Spider Rider' },
      { status: 500 }
    )
  }
}
