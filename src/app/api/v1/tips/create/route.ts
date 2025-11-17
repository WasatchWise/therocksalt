import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentLink } from '@/lib/stripe/checkout'

/**
 * Create a tip payment link
 * POST /api/v1/tips/create
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
    const { artistId, amount, message } = body

    if (!artistId || !amount) {
      return NextResponse.json(
        { error: 'artistId and amount are required' },
        { status: 400 }
      )
    }

    // Validate amount (min $1, max $50)
    const amountCents = Math.round(amount * 100)
    if (amountCents < 100 || amountCents > 5000) {
      return NextResponse.json(
        { error: 'Amount must be between $1 and $50' },
        { status: 400 }
      )
    }

    // Calculate revenue split (95% artist, 5% platform)
    const artistPayout = Math.round(amountCents * 0.95)
    const platformFee = amountCents - artistPayout

    // Create tip record
    const { data: tip, error: tipError } = await supabase
      .from('tips')
      .insert({
        from_user_id: user.id,
        artist_id: artistId,
        amount_cents: amountCents,
        message: message || null,
        artist_payout_cents: artistPayout,
        platform_fee_cents: platformFee,
        payment_status: 'pending',
        payout_status: 'pending',
      })
      .select()
      .single()

    if (tipError) {
      return NextResponse.json(
        { error: 'Failed to create tip', message: tipError.message },
        { status: 500 }
      )
    }

    // Create Stripe payment link
    const paymentLink = await createPaymentLink(
      amountCents,
      `Tip to ${body.artistName || 'Artist'}`,
      {
        type: 'tip',
        tip_id: tip.id,
        artist_id: artistId,
        amount: amountCents.toString(),
      }
    )

    // Update tip with payment link
    await supabase
      .from('tips')
      .update({ stripe_payment_intent_id: paymentLink.id })
      .eq('id', tip.id)

    return NextResponse.json({
      tipId: tip.id,
      paymentUrl: paymentLink.url,
    })
  } catch (error) {
    console.error('Tip creation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create tip',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

