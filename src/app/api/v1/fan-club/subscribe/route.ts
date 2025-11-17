import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSubscriptionCheckout } from '@/lib/stripe/checkout'

/**
 * Subscribe to a fan club
 * POST /api/v1/fan-club/subscribe
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { bandId, tier, priceId } = body

    if (!bandId || !tier || !priceId) {
      return NextResponse.json(
        { error: 'bandId, tier, and priceId are required' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('fan_club_members')
      .select('*')
      .eq('user_id', user.id)
      .eq('band_id', bandId)
      .single()

    if (existing && existing.subscription_status === 'active') {
      return NextResponse.json(
        { error: 'Already subscribed to this fan club' },
        { status: 400 }
      )
    }

    // Get band info
    const { data: band } = await supabase
      .from('bands')
      .select('name')
      .eq('id', bandId)
      .single()

    if (!band) {
      return NextResponse.json(
        { error: 'Band not found' },
        { status: 404 }
      )
    }

    // Create checkout session
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    const successUrl = `${request.nextUrl.origin}/dashboard/fan-clubs?success=true&bandId=${bandId}`
    const cancelUrl = `${request.nextUrl.origin}/bands/${bandId}?canceled=true`

    const session = await createSubscriptionCheckout(priceId, {
      customerEmail: profile?.email || user.email,
      successUrl,
      cancelUrl,
      metadata: {
        type: 'fan_club',
        band_id: bandId,
        user_id: user.id,
        tier,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Fan club subscription error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create subscription',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

