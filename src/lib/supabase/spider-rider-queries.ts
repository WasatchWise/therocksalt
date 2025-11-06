import { createClient } from '@/lib/supabase/server'

export type SpiderRiderData = {
  band_id: string
  // Financial
  guarantee_min?: number // In cents
  guarantee_max?: number
  percentage_split?: {
    type: 'door_split' | 'guarantee_plus_percentage' | 'flat_fee'
    band_percent?: number
    venue_percent?: number
  }
  payment_terms?: 'night_of' | 'net_7' | 'net_30' | '50_50_split'

  // Event Types
  available_for_event_types?: string[]
  corporate_events_experience?: number
  wedding_experience?: number
  has_mc_experience?: boolean
  can_learn_specific_songs?: boolean

  // Venue Capacity
  min_venue_capacity?: number
  max_venue_capacity?: number

  // Technical
  owns_sound_system?: boolean
  owns_lighting?: boolean
  tech_rider_url?: string
  stage_plot_url?: string
  backline_requirements?: {
    drums?: boolean
    bass_amp?: boolean
    guitar_amp?: boolean
    keyboards?: boolean
    monitors?: number
  }

  // Lodging
  lodging_requirements?: {
    hotel?: boolean
    rooms_needed?: number
    green_room?: boolean
    meals?: 'full' | 'buyout' | 'none'
  }

  // Routing
  routing_preferences?: {
    regions?: string[]
    weekdays_only?: boolean
    blackout_dates?: string[]
  }
  min_days_notice?: number
  preferred_months?: string[]

  // Other
  formal_attire_available?: boolean
  merchandise_split?: {
    band_keeps: number
    venue_commission: number
  }
  promotion_requirements?: {
    social_posts?: number
    email_blast?: boolean
    posters?: number
  }

  status?: 'active' | 'paused' | 'inactive'
  is_public?: boolean
  notes?: string
}

/**
 * Get a band's active Spider Rider
 */
export async function getSpiderRider(bandId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tour_spider_riders')
    .select('*')
    .eq('band_id', bandId)
    .eq('status', 'active')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching spider rider:', error)
    return null
  }

  return data
}

/**
 * Create or update a Spider Rider
 */
export async function upsertSpiderRider(data: SpiderRiderData) {
  const supabase = await createClient()

  // First, deactivate any existing active riders for this band
  await supabase
    .from('tour_spider_riders')
    .update({ status: 'inactive' })
    .eq('band_id', data.band_id)
    .eq('status', 'active')

  // Then create the new one
  const { data: rider, error } = await supabase
    .from('tour_spider_riders')
    .insert({
      ...data,
      status: 'active',
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating spider rider:', error)
    throw error
  }

  return rider
}

/**
 * Update an existing Spider Rider
 */
export async function updateSpiderRider(riderId: string, data: Partial<SpiderRiderData>) {
  const supabase = await createClient()

  const { data: rider, error } = await supabase
    .from('tour_spider_riders')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', riderId)
    .select()
    .single()

  if (error) {
    console.error('Error updating spider rider:', error)
    throw error
  }

  return rider
}

/**
 * Pause/unpause a Spider Rider
 */
export async function toggleSpiderRiderStatus(riderId: string, status: 'active' | 'paused') {
  return updateSpiderRider(riderId, { status })
}

/**
 * Get all active public Spider Riders
 */
export async function getPublicSpiderRiders(limit = 50) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tour_spider_riders')
    .select(`
      *,
      band:bands(
        id,
        name,
        slug,
        bio,
        city,
        state,
        tier,
        band_genres(
          genre:genres(name, slug)
        ),
        band_links(url, label)
      )
    `)
    .eq('status', 'active')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching public spider riders:', error)
    return []
  }

  return data || []
}

/**
 * Get Spider Riders matching specific criteria
 */
export async function searchSpiderRiders(filters: {
  min_budget?: number
  max_budget?: number
  event_type?: string
  region?: string
  min_capacity?: number
  max_capacity?: number
}) {
  const supabase = await createClient()

  let query = supabase
    .from('tour_spider_riders')
    .select(`
      *,
      band:bands(
        id,
        name,
        slug,
        bio,
        city,
        state,
        tier,
        band_genres(
          genre:genres(name, slug)
        )
      )
    `)
    .eq('status', 'active')
    .eq('is_public', true)

  // Budget filters
  if (filters.min_budget) {
    query = query.lte('guarantee_min', filters.min_budget)
  }
  if (filters.max_budget) {
    query = query.gte('guarantee_max', filters.max_budget)
  }

  // Capacity filters
  if (filters.min_capacity) {
    query = query.lte('min_venue_capacity', filters.min_capacity)
  }
  if (filters.max_capacity) {
    query = query.gte('max_venue_capacity', filters.max_capacity)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching spider riders:', error)
    return []
  }

  return data || []
}
