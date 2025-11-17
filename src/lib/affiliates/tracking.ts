/**
 * Affiliate Link Tracking
 * Track affiliate clicks and conversions
 */

import { createClient } from '@/lib/supabase/server'

export type AffiliateType =
  | 'equipment'
  | 'streaming'
  | 'tickets'
  | 'merch'
  | 'studio'

export interface AffiliateClick {
  affiliateType: AffiliateType
  affiliatePartner: string
  affiliateUrl: string
  referralCode?: string
  userId?: string
}

/**
 * Track an affiliate click
 */
export async function trackAffiliateClick(
  click: AffiliateClick
): Promise<{ clickId: string; trackingUrl: string }> {
  const supabase = await createClient()
  
  // Get user if available
  const { data: { user } } = await supabase.auth.getUser()

  // Create tracking record
  const { data: affiliateClick, error } = await supabase
    .from('affiliate_clicks')
    .insert({
      user_id: user?.id,
      affiliate_type: click.affiliateType,
      affiliate_partner: click.affiliatePartner,
      affiliate_url: click.affiliateUrl,
      referral_code: click.referralCode,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to track affiliate click:', error)
    // Return original URL if tracking fails
    return { clickId: '', trackingUrl: click.affiliateUrl }
  }

  // Create tracking URL with click ID
  const trackingUrl = `/api/v1/affiliates/redirect?clickId=${affiliateClick.id}`

  return {
    clickId: affiliateClick.id,
    trackingUrl,
  }
}

/**
 * Get affiliate URL with tracking
 */
export function getAffiliateUrl(
  baseUrl: string,
  partner: string,
  type: AffiliateType
): string {
  // Add referral code based on partner
  const referralCodes: Record<string, string> = {
    sweetwater: 'ROCKSALT',
    guitarcenter: 'ROCKSALT',
    reverb: 'ROCKSALT',
    spotify: 'rocksalt',
    // Add more as needed
  }

  const code = referralCodes[partner.toLowerCase()] || 'ROCKSALT'
  const separator = baseUrl.includes('?') ? '&' : '?'
  
  return `${baseUrl}${separator}ref=${code}&utm_source=rocksalt&utm_medium=affiliate&utm_campaign=${type}`
}

