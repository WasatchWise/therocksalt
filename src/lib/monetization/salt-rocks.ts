/**
 * Salt Rocks Currency System
 * Virtual currency for platform actions
 */

import { createClient } from '@/lib/supabase/server'

export type SaltRocksAction =
  | 'daily_login'
  | 'share_profile'
  | 'submit_event'
  | 'refer_friend'
  | 'song_request'
  | 'featured_comment'
  | 'boost_post'
  | 'unlock_content'

const SALT_ROCKS_REWARDS: Record<SaltRocksAction, number> = {
  daily_login: 10,
  share_profile: 25,
  submit_event: 50,
  refer_friend: 100,
  song_request: -50, // Cost
  featured_comment: -25, // Cost
  boost_post: -100, // Cost
  unlock_content: -200, // Cost
}

/**
 * Award Salt Rocks to a user
 */
export async function awardSaltRocks(
  userId: string,
  action: SaltRocksAction,
  metadata?: Record<string, any>
): Promise<{ success: boolean; newBalance: number }> {
  const supabase = await createClient()
  const amount = SALT_ROCKS_REWARDS[action]

  if (amount === 0) {
    return { success: false, newBalance: 0 }
  }

  // Get user's band (if they have one)
  const { data: band } = await supabase
    .from('bands')
    .select('id, salt_rocks_balance')
    .eq('claimed_by', userId)
    .single()

  if (!band) {
    // User doesn't have a claimed band, can't earn rocks
    return { success: false, newBalance: 0 }
  }

  const newBalance = (band.salt_rocks_balance || 0) + amount

  // Update balance
  const { error } = await supabase
    .from('bands')
    .update({ salt_rocks_balance: newBalance })
    .eq('id', band.id)

  if (error) {
    console.error('Failed to update Salt Rocks balance:', error)
    return { success: false, newBalance: band.salt_rocks_balance || 0 }
  }

  // Log transaction (if you create a salt_rocks_transactions table)
  // For now, we'll just update the balance

  return { success: true, newBalance }
}

/**
 * Spend Salt Rocks
 */
export async function spendSaltRocks(
  userId: string,
  action: SaltRocksAction,
  amount?: number
): Promise<{ success: boolean; newBalance: number }> {
  const supabase = await createClient()
  const cost = amount || Math.abs(SALT_ROCKS_REWARDS[action])

  // Get user's band
  const { data: band } = await supabase
    .from('bands')
    .select('id, salt_rocks_balance')
    .eq('claimed_by', userId)
    .single()

  if (!band) {
    return { success: false, newBalance: 0 }
  }

  const currentBalance = band.salt_rocks_balance || 0

  if (currentBalance < cost) {
    return { success: false, newBalance: currentBalance }
  }

  const newBalance = currentBalance - cost

  const { error } = await supabase
    .from('bands')
    .update({ salt_rocks_balance: newBalance })
    .eq('id', band.id)

  if (error) {
    console.error('Failed to spend Salt Rocks:', error)
    return { success: false, newBalance: currentBalance }
  }

  return { success: true, newBalance }
}

/**
 * Get Salt Rocks balance
 */
export async function getSaltRocksBalance(userId: string): Promise<number> {
  const supabase = await createClient()

  const { data: band } = await supabase
    .from('bands')
    .select('salt_rocks_balance')
    .eq('claimed_by', userId)
    .single()

  return band?.salt_rocks_balance || 0
}

