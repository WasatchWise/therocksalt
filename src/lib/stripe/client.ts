/**
 * Stripe Client
 * Server-side Stripe client for payment processing
 */

import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripeInstance(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  }

  return stripeInstance
}

export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    const instance = getStripeInstance()
    const value = instance[prop as keyof Stripe]
    return typeof value === 'function' ? value.bind(instance) : value
  }
})

/**
 * Get Stripe publishable key for client-side
 */
export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
  }
  return key
}

