import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOneTimeCheckout } from '@/lib/stripe/checkout'
import { azuraCastClient } from '@/lib/azuracast/client'

/**
 * Create a paid priority song request
 * POST /api/v1/song-requests/priority
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
    const { mediaId, priority, bandId, trackTitle, artistName } = body

    if (!mediaId || !priority) {
      return NextResponse.json(
        { error: 'mediaId and priority are required' },
        { status: 400 }
      )
    }

    // Validate priority level
    const validPriorities = ['normal', 'next_5', 'play_next', 'play_now']
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority level' },
        { status: 400 }
      )
    }

    // Pricing based on priority
    const pricing: Record<string, number> = {
      normal: 0, // Free
      next_5: 200, // $2.00
      play_next: 500, // $5.00
      play_now: 1000, // $10.00
    }

    const amount = pricing[priority]
    if (amount === undefined) {
      return NextResponse.json(
        { error: 'Invalid priority level' },
        { status: 400 }
      )
    }

    // Create song request record
    const { data: songRequest, error: requestError } = await supabase
      .from('song_requests')
      .insert({
        user_id: user.id,
        media_id: mediaId,
        band_id: bandId,
        track_title: trackTitle,
        artist_name: artistName,
        amount_cents: amount,
        priority,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (requestError) {
      return NextResponse.json(
        { error: 'Failed to create song request', message: requestError.message },
        { status: 500 }
      )
    }

    // If free, process immediately
    if (amount === 0) {
      try {
        await azuraCastClient.submitRequest(mediaId)
        await supabase
          .from('song_requests')
          .update({ status: 'queued', payment_status: 'completed' })
          .eq('id', songRequest.id)
        
        return NextResponse.json({
          success: true,
          requestId: songRequest.id,
          message: 'Song request submitted',
        })
      } catch (error) {
        console.error('Failed to submit request:', error)
        return NextResponse.json(
          { error: 'Failed to submit request to AzuraCast' },
          { status: 500 }
        )
      }
    }

    // Create Stripe checkout session for paid requests
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    const successUrl = `${request.nextUrl.origin}/dashboard/song-requests?success=true`
    const cancelUrl = `${request.nextUrl.origin}/dashboard/song-requests?canceled=true`

    const session = await createOneTimeCheckout(
      amount,
      `Priority Song Request: ${trackTitle || 'Track'}`,
      {
        customerEmail: profile?.email || user.email,
        successUrl,
        cancelUrl,
        metadata: {
          type: 'song_request',
          request_id: songRequest.id,
          media_id: mediaId.toString(),
          priority,
        },
      }
    )

    // Update request with payment intent ID
    await supabase
      .from('song_requests')
      .update({ stripe_payment_intent_id: session.payment_intent as string })
      .eq('id', songRequest.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      requestId: songRequest.id,
    })
  } catch (error) {
    console.error('Song request error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create song request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

