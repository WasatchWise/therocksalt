import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBandAnalytics } from '@/features/analytics/dashboard/lib/queries'

/**
 * Get analytics dashboard data
 * GET /api/v1/analytics/dashboard?bandId=xxx&period=30d
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const bandId = searchParams.get('bandId')
    const period = (searchParams.get('period') as '7d' | '30d' | 'all') || '30d'

    if (!bandId) {
      return NextResponse.json(
        { error: 'bandId is required' },
        { status: 400 }
      )
    }

    // Verify user owns the band or is admin
    const { data: band } = await supabase
      .from('bands')
      .select('claimed_by')
      .eq('id', bandId)
      .single()

    if (!band) {
      return NextResponse.json(
        { error: 'Band not found' },
        { status: 404 }
      )
    }

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()

    const isAdmin = !!adminData
    const isOwner = band.claimed_by === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this band\'s analytics' },
        { status: 403 }
      )
    }

    // Get analytics data
    const analytics = await getBandAnalytics(bandId, period)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics dashboard error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

