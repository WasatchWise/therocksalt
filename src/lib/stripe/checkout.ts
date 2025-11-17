/**
 * Stripe Checkout Utilities
 * Create checkout sessions for one-time payments and subscriptions
 */

import { stripe } from './client'
import type Stripe from 'stripe'

export interface CheckoutSessionParams {
  customerId?: string
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

/**
 * Create a checkout session for a one-time payment
 */
export async function createOneTimeCheckout(
  amount: number, // in cents
  description: string,
  params: CheckoutSessionParams
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    customer: params.customerId,
    customer_email: params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata || {},
  })
}

/**
 * Create a checkout session for a subscription
 */
export async function createSubscriptionCheckout(
  priceId: string,
  params: CheckoutSessionParams
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: params.customerId,
    customer_email: params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata || {},
    subscription_data: {
      metadata: params.metadata || {},
    },
  })
}

/**
 * Create a payment link for tips (simpler flow)
 */
export async function createPaymentLink(
  amount: number, // in cents
  description: string,
  metadata?: Record<string, string>
): Promise<Stripe.PaymentLink> {
  const product = await stripe.products.create({
    name: description,
  })

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency: 'usd',
  })

  return stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    metadata: metadata || {},
  })
}

