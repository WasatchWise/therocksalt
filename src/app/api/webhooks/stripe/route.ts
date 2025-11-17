import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, handlePaymentSuccess, handleSubscriptionUpdate, handleSubscriptionCanceled } from '@/lib/stripe/webhooks'
import { stripe } from '@/lib/stripe/client'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  try {
    const event = verifyWebhookSignature(body, signature, webhookSecret)

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        // Handle checkout completion
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            typeof session.subscription === 'string' 
              ? session.subscription 
              : session.subscription.id
          )
          await handleSubscriptionUpdate(subscription)
        } else if (session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent.id
          )
          await handlePaymentSuccess(paymentIntent)
        }
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    )
  }
}

