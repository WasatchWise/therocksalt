import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOneTimeCheckout, createSubscriptionCheckout } from '@/lib/stripe/checkout'

/**
 * Create a Stripe checkout session
 * POST /api/v1/checkout/create
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
    const {
      type, // 'one-time' | 'subscription'
      amount, // in cents (for one-time)
      priceId, // Stripe price ID (for subscription)
      description,
      metadata = {},
      successUrl,
      cancelUrl,
    } = body

    if (!type || !description || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user's email for checkout
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    const customerEmail = profile?.email || user.email

    // Add user metadata
    const checkoutMetadata = {
      ...metadata,
      user_id: user.id,
    }

    let session

    if (type === 'one-time') {
      if (!amount) {
        return NextResponse.json(
          { error: 'Amount required for one-time payments' },
          { status: 400 }
        )
      }

      session = await createOneTimeCheckout(amount, description, {
        customerEmail,
        successUrl,
        cancelUrl,
        metadata: checkoutMetadata,
      })
    } else if (type === 'subscription') {
      if (!priceId) {
        return NextResponse.json(
          { error: 'Price ID required for subscriptions' },
          { status: 400 }
        )
      }

      session = await createSubscriptionCheckout(priceId, {
        customerEmail,
        successUrl,
        cancelUrl,
        metadata: checkoutMetadata,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

