/**
 * Stripe Webhook Handlers
 * Process Stripe webhook events
 */

import { stripe } from './client'
import { createClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

/**
 * Handle successful payment
 */
export async function handlePaymentSuccess(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const supabase = await createClient()
  const metadata = paymentIntent.metadata

  // Handle different payment types based on metadata
  if (metadata.type === 'song_request') {
    // Update song request status
    if (metadata.request_id) {
      await supabase
        .from('song_requests')
        .update({
          payment_status: 'completed',
          status: 'queued',
          queued_at: new Date().toISOString(),
        })
        .eq('id', metadata.request_id)

      // Submit to AzuraCast if media_id is available
      if (metadata.media_id) {
        // This would trigger AzuraCast API call
        // For now, just mark as queued
      }
    }
  } else if (metadata.type === 'tip') {
    // Record tip in tips table
    if (metadata.artist_id && metadata.amount) {
      await supabase.from('tips').insert({
        artist_id: metadata.artist_id,
        amount_cents: parseInt(metadata.amount),
        stripe_payment_intent_id: paymentIntent.id,
        status: 'completed',
      })
    }
  } else if (metadata.type === 'event_boost') {
    // Update event boost status
    if (metadata.event_id) {
      await supabase
        .from('events')
        .update({ boosted: true, boost_expires_at: metadata.expires_at })
        .eq('id', metadata.event_id)
    }
  }
}

/**
 * Handle subscription created/updated
 */
export async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = await createClient()
  const metadata = subscription.metadata

  if (metadata.band_id) {
    await supabase
      .from('bands')
      .update({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        subscription_status: subscription.status,
        subscription_ends_at: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null,
      })
      .eq('id', metadata.band_id)
  }

  // Handle fan club subscriptions
  if (metadata.type === 'fan_club' && metadata.user_id && metadata.band_id) {
    await supabase.from('fan_club_members').upsert({
      user_id: metadata.user_id,
      band_id: metadata.band_id,
      tier: metadata.tier || 'bronze',
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      expires_at: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
    }, {
      onConflict: 'user_id,band_id',
    })
  }
}

/**
 * Handle subscription canceled
 */
export async function handleSubscriptionCanceled(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = await createClient()
  const metadata = subscription.metadata

  if (metadata.band_id) {
    await supabase
      .from('bands')
      .update({
        subscription_status: 'canceled',
      })
      .eq('id', metadata.band_id)
  }
}

