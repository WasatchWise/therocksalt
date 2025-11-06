-- =====================================================
-- TOUR SPIDER RIDER V2 - ALL EVENT TYPES
-- =====================================================
-- Expanded to handle:
-- - Venue shows (clubs, bars, concert halls)
-- - Corporate events (company parties, conferences)
-- - Weddings (ceremonies, receptions)
-- - Private parties (birthdays, anniversaries)
-- - Festivals (multi-day, multi-stage)
--
-- IMPORTANT: Exposure is NOT payment. All bookings require real money.
-- =====================================================

-- ============================================
-- 1. EVENT ORGANIZERS
-- ============================================
-- Anyone who books bands: venues, wedding planners,
-- corporate event managers, private party hosts
-- ============================================

CREATE TABLE IF NOT EXISTS public.event_organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (organization_type IN (
    'venue',
    'wedding_planner',
    'corporate',
    'private_individual',
    'festival_promoter',
    'booking_agency',
    'other'
  )),

  -- Contact
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,

  -- Location
  city TEXT,
  state TEXT,
  region TEXT, -- west_coast, mountain, midwest, etc.

  -- Verification (to prevent fake/exposure-only organizers)
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  requires_payment BOOLEAN DEFAULT true, -- If false, flag as "exposure only" (not allowed)

  -- Subscription Tier
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  subscription_expires TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizers_type ON event_organizers(organization_type);
CREATE INDEX IF NOT EXISTS idx_organizers_verified ON event_organizers(is_verified);
CREATE INDEX IF NOT EXISTS idx_organizers_tier ON event_organizers(tier);


-- ============================================
-- 2. EVENT RFPS (Request for Proposal)
-- ============================================
-- Organizers post what they need, bands respond
-- This is the flip side of Tour Spider Riders
-- ============================================

CREATE TABLE IF NOT EXISTS public.event_rfps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.event_organizers(id) ON DELETE CASCADE,

  -- Event Details
  event_type TEXT NOT NULL CHECK (event_type IN (
    'venue_show',
    'corporate_event',
    'wedding',
    'private_party',
    'festival',
    'outdoor_event',
    'other'
  )),
  event_name TEXT NOT NULL, -- "Annual Company Holiday Party"
  event_description TEXT,

  -- Date & Time
  event_date DATE NOT NULL,
  event_end_date DATE, -- For multi-day events
  load_in_time TIME,
  performance_start TIME,
  performance_end TIME,
  total_performance_hours NUMERIC(3,1), -- 2.5 hours

  -- Location
  venue_name TEXT, -- "Salt Palace Convention Center"
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  is_indoor BOOLEAN DEFAULT true,
  is_outdoor BOOLEAN DEFAULT false,

  -- Audience
  expected_attendance INTEGER,
  audience_type TEXT, -- "corporate_professionals", "wedding_guests", "general_public"
  age_range TEXT, -- "25-45", "all_ages", "21+"

  -- Budget (REQUIRED - no "exposure" bullshit)
  budget_min INTEGER NOT NULL, -- In cents, minimum $100 = 10000
  budget_max INTEGER NOT NULL,
  budget_includes JSONB DEFAULT '{}', -- {"travel": true, "lodging": false, "meals": true}

  -- Requirements
  genre_preferences TEXT[], -- ["jazz", "acoustic", "cover_band"]
  required_set_length INTEGER, -- Minutes
  multiple_sets BOOLEAN DEFAULT false,
  requires_mc_duties BOOLEAN DEFAULT false, -- Band needs to MC/announce
  requires_specific_songs BOOLEAN DEFAULT false,
  specific_song_list TEXT[],

  -- Technical
  sound_system_provided BOOLEAN DEFAULT false,
  lighting_provided BOOLEAN DEFAULT false,
  stage_size TEXT, -- "20x16", "small", "medium", "large"
  power_available TEXT, -- "standard_110v", "220v", "generator"
  load_in_restrictions TEXT, -- "Elevator only, no stairs"

  -- Additional Details
  attire_requirements TEXT, -- "Formal black tie", "Casual", "Band merch OK"
  parking_info TEXT,
  meal_provided BOOLEAN DEFAULT false,
  green_room_available BOOLEAN DEFAULT false,

  -- RFP Status
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'reviewing', 'closed', 'cancelled')),
  closes_at TIMESTAMPTZ, -- Deadline for proposals
  decision_by TIMESTAMPTZ, -- When they'll choose a band

  -- Selection
  selected_proposal_id UUID, -- Will reference event_proposals table

  -- Metadata
  views_count INTEGER DEFAULT 0,
  proposals_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints: Budget must be real money, not exposure
  CONSTRAINT minimum_budget_check CHECK (budget_min >= 10000) -- Minimum $100
);

CREATE INDEX IF NOT EXISTS idx_rfps_organizer ON event_rfps(organizer_id);
CREATE INDEX IF NOT EXISTS idx_rfps_date ON event_rfps(event_date);
CREATE INDEX IF NOT EXISTS idx_rfps_status ON event_rfps(status);
CREATE INDEX IF NOT EXISTS idx_rfps_type ON event_rfps(event_type);
CREATE INDEX IF NOT EXISTS idx_rfps_location ON event_rfps(city, state);


-- ============================================
-- 3. EVENT PROPOSALS
-- ============================================
-- Bands submit proposals to RFPs
-- ============================================

CREATE TABLE IF NOT EXISTS public.event_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id UUID NOT NULL REFERENCES public.event_rfps(id) ON DELETE CASCADE,
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,

  -- Proposal Details
  proposed_fee INTEGER NOT NULL, -- In cents
  proposed_set_list TEXT[], -- Song titles
  why_us TEXT, -- Band's pitch: "We've played 50 weddings, excellent crowd engagement"

  -- Additional Offerings
  includes_sound_system BOOLEAN DEFAULT false,
  includes_lighting BOOLEAN DEFAULT false,
  includes_mc_services BOOLEAN DEFAULT false,
  travel_included_in_fee BOOLEAN DEFAULT true,

  -- Availability
  confirmed_available BOOLEAN DEFAULT true,
  alternative_dates DATE[], -- If they can't make the date but offer alternatives

  -- Media
  sample_video_urls TEXT[], -- Links to performance videos
  sample_audio_urls TEXT[], -- Links to recordings
  previous_similar_events TEXT[], -- "We played Megacorp's 2023 holiday party"

  -- Terms
  deposit_required INTEGER, -- 50% upfront = half of proposed_fee
  cancellation_policy TEXT,
  contract_notes TEXT,

  -- Status
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'draft',
    'submitted',
    'viewed',
    'shortlisted',
    'rejected',
    'accepted',
    'withdrawn'
  )),
  viewed_at TIMESTAMPTZ,
  rejected_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposals_rfp ON event_proposals(rfp_id);
CREATE INDEX IF NOT EXISTS idx_proposals_band ON event_proposals(band_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON event_proposals(status);

-- Unique: One proposal per band per RFP
CREATE UNIQUE INDEX IF NOT EXISTS idx_proposals_unique
ON event_proposals(rfp_id, band_id);


-- ============================================
-- 4. TOUR SPIDER RIDERS (Updated)
-- ============================================
-- Now includes fields for all event types
-- ============================================

ALTER TABLE public.tour_spider_riders
ADD COLUMN IF NOT EXISTS available_for_event_types TEXT[] DEFAULT ARRAY['venue_show'],
ADD COLUMN IF NOT EXISTS corporate_events_experience INTEGER DEFAULT 0, -- Number of corporate gigs done
ADD COLUMN IF NOT EXISTS wedding_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_mc_experience BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS can_learn_specific_songs BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS owns_sound_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS owns_lighting BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS formal_attire_available BOOLEAN DEFAULT false;

-- Add check constraint for budget minimums (no free gigs)
ALTER TABLE public.tour_spider_riders
ADD CONSTRAINT minimum_guarantee_check CHECK (guarantee_min >= 10000); -- Minimum $100


-- ============================================
-- 5. SUBSCRIPTION TIERS
-- ============================================

-- Event Organizers Subscription Benefits
CREATE TABLE IF NOT EXISTS public.organizer_subscription_benefits (
  tier TEXT PRIMARY KEY CHECK (tier IN ('free', 'pro', 'enterprise')),
  monthly_price INTEGER NOT NULL, -- In cents
  rfps_per_month INTEGER,
  can_see_all_bands BOOLEAN DEFAULT false,
  priority_listing BOOLEAN DEFAULT false,
  contract_templates BOOLEAN DEFAULT false,
  escrow_service BOOLEAN DEFAULT false,
  description TEXT
);

INSERT INTO public.organizer_subscription_benefits (tier, monthly_price, rfps_per_month, can_see_all_bands, priority_listing, contract_templates, escrow_service, description)
VALUES
('free', 0, 1, false, false, false, false, 'Post 1 RFP per month, receive proposals'),
('pro', 4900, 5, true, true, true, false, 'Post 5 RFPs/month, browse all bands, priority listing, contract templates'),
('enterprise', 19900, 999, true, true, true, true, 'Unlimited RFPs, escrow service, dedicated support')
ON CONFLICT (tier) DO UPDATE SET
  monthly_price = EXCLUDED.monthly_price,
  rfps_per_month = EXCLUDED.rfps_per_month,
  can_see_all_bands = EXCLUDED.can_see_all_bands,
  priority_listing = EXCLUDED.priority_listing,
  contract_templates = EXCLUDED.contract_templates,
  escrow_service = EXCLUDED.escrow_service,
  description = EXCLUDED.description;


-- ============================================
-- 6. AUTOMATED MATCHING
-- ============================================
-- Match RFPs to bands automatically
-- ============================================

CREATE TABLE IF NOT EXISTS public.rfp_band_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id UUID NOT NULL REFERENCES public.event_rfps(id) ON DELETE CASCADE,
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,

  -- Match Score
  match_score INTEGER DEFAULT 0, -- 0-100
  is_recommended BOOLEAN DEFAULT false,

  -- Match Breakdown
  budget_match BOOLEAN DEFAULT false, -- Band's rate fits RFP budget
  genre_match BOOLEAN DEFAULT false,
  experience_match BOOLEAN DEFAULT false, -- Has done this event type before
  location_match BOOLEAN DEFAULT false, -- Within reasonable travel distance
  availability_match BOOLEAN DEFAULT false, -- Not already booked that date

  -- Details
  match_details JSONB DEFAULT '{}',
  disqualification_reasons TEXT[],

  -- Notification
  band_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,

  -- Metadata
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfp_matches_rfp ON rfp_band_matches(rfp_id);
CREATE INDEX IF NOT EXISTS idx_rfp_matches_band ON rfp_band_matches(band_id);
CREATE INDEX IF NOT EXISTS idx_rfp_matches_score ON rfp_band_matches(match_score DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rfp_matches_unique
ON rfp_band_matches(rfp_id, band_id);


-- ============================================
-- 7. RLS POLICIES
-- ============================================

ALTER TABLE public.event_organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfp_band_matches ENABLE ROW LEVEL SECURITY;

-- Public can view open RFPs
DROP POLICY IF EXISTS "Anyone can view open RFPs" ON public.event_rfps;
CREATE POLICY "Anyone can view open RFPs"
ON public.event_rfps
FOR SELECT
TO public
USING (status = 'open');

-- Bands can submit proposals
DROP POLICY IF EXISTS "Bands can submit proposals" ON public.event_proposals;
CREATE POLICY "Bands can submit proposals"
ON public.event_proposals
FOR INSERT
TO public
WITH CHECK (true); -- Add auth logic later

-- Bands can view their own proposals
DROP POLICY IF EXISTS "Bands can view their proposals" ON public.event_proposals;
CREATE POLICY "Bands can view their proposals"
ON public.event_proposals
FOR SELECT
TO public
USING (true); -- Add auth logic later


-- ============================================
-- 8. TRIGGERS
-- ============================================

-- Update proposals count on RFP
CREATE OR REPLACE FUNCTION update_rfp_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE event_rfps
  SET proposals_count = (
    SELECT COUNT(*) FROM event_proposals
    WHERE rfp_id = COALESCE(NEW.rfp_id, OLD.rfp_id)
  )
  WHERE id = COALESCE(NEW.rfp_id, OLD.rfp_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_rfp_count ON event_proposals;
CREATE TRIGGER update_rfp_count
AFTER INSERT OR DELETE ON event_proposals
FOR EACH ROW
EXECUTE FUNCTION update_rfp_proposal_count();


-- ============================================
-- VERIFICATION
-- ============================================

SELECT '=== TOUR SPIDER RIDER V2 (ALL EVENTS) CREATED ===' as status;

SELECT 'event_organizers' as table_name, COUNT(*) as rows FROM event_organizers
UNION ALL
SELECT 'event_rfps', COUNT(*) FROM event_rfps
UNION ALL
SELECT 'event_proposals', COUNT(*) FROM event_proposals
UNION ALL
SELECT 'rfp_band_matches', COUNT(*) FROM rfp_band_matches;

SELECT '=== READY FOR ALL EVENT TYPES ===' as status;
