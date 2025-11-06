-- =====================================================
-- TOUR SPIDER RIDER - STEP BY STEP MIGRATION
-- =====================================================
-- Run these one section at a time to avoid errors
-- =====================================================

-- ============================================
-- STEP 1: Verify prerequisites
-- ============================================
-- Check that bands table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bands') THEN
        RAISE EXCEPTION 'bands table does not exist! Create it first.';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'venues') THEN
        RAISE EXCEPTION 'venues table does not exist! Create it first.';
    END IF;

    RAISE NOTICE 'Prerequisites check passed!';
END $$;


-- ============================================
-- STEP 2: Create event_organizers table
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  city TEXT,
  state TEXT,
  region TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  requires_payment BOOLEAN DEFAULT true,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  subscription_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizers_type ON event_organizers(organization_type);
CREATE INDEX IF NOT EXISTS idx_organizers_verified ON event_organizers(is_verified);
CREATE INDEX IF NOT EXISTS idx_organizers_tier ON event_organizers(tier);

SELECT 'event_organizers table created' as status;


-- ============================================
-- STEP 3: Create tour_spider_riders table
-- ============================================
CREATE TABLE IF NOT EXISTS public.tour_spider_riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,

  -- Financial Terms
  guarantee_min INTEGER CHECK (guarantee_min >= 10000),
  guarantee_max INTEGER,
  percentage_split JSONB,
  payment_terms TEXT DEFAULT 'night_of',

  -- Lodging
  lodging_requirements JSONB DEFAULT '{}',
  hospitality_rider JSONB DEFAULT '{}',

  -- Technical
  tech_rider_url TEXT,
  stage_plot_url TEXT,
  input_list JSONB,
  backline_requirements JSONB,

  -- Routing
  routing_preferences JSONB DEFAULT '{}',
  min_days_notice INTEGER DEFAULT 30,
  preferred_months TEXT[],

  -- Capacity
  min_venue_capacity INTEGER,
  max_venue_capacity INTEGER,

  -- Event Types (NEW)
  available_for_event_types TEXT[] DEFAULT ARRAY['venue_show'],
  corporate_events_experience INTEGER DEFAULT 0,
  wedding_experience INTEGER DEFAULT 0,
  has_mc_experience BOOLEAN DEFAULT false,
  can_learn_specific_songs BOOLEAN DEFAULT false,
  owns_sound_system BOOLEAN DEFAULT false,
  owns_lighting BOOLEAN DEFAULT false,
  formal_attire_available BOOLEAN DEFAULT false,

  -- Other
  merchandise_split JSONB,
  promotion_requirements JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'inactive')),
  is_public BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spider_riders_band ON tour_spider_riders(band_id);
CREATE INDEX IF NOT EXISTS idx_spider_riders_status ON tour_spider_riders(status);
CREATE INDEX IF NOT EXISTS idx_spider_riders_public ON tour_spider_riders(is_public);

-- One active rider per band
CREATE UNIQUE INDEX IF NOT EXISTS idx_spider_riders_band_active
ON tour_spider_riders(band_id)
WHERE status = 'active';

SELECT 'tour_spider_riders table created' as status;


-- ============================================
-- STEP 4: Create event_rfps table
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_rfps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.event_organizers(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL CHECK (event_type IN (
    'venue_show',
    'corporate_event',
    'wedding',
    'private_party',
    'festival',
    'outdoor_event',
    'other'
  )),
  event_name TEXT NOT NULL,
  event_description TEXT,

  -- Date & Time
  event_date DATE NOT NULL,
  event_end_date DATE,
  load_in_time TIME,
  performance_start TIME,
  performance_end TIME,
  total_performance_hours NUMERIC(3,1),

  -- Location
  venue_name TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  is_indoor BOOLEAN DEFAULT true,
  is_outdoor BOOLEAN DEFAULT false,

  -- Audience
  expected_attendance INTEGER,
  audience_type TEXT,
  age_range TEXT,

  -- Budget (REQUIRED - minimum $100)
  budget_min INTEGER NOT NULL CHECK (budget_min >= 10000),
  budget_max INTEGER NOT NULL,
  budget_includes JSONB DEFAULT '{}',

  -- Requirements
  genre_preferences TEXT[],
  required_set_length INTEGER,
  multiple_sets BOOLEAN DEFAULT false,
  requires_mc_duties BOOLEAN DEFAULT false,
  requires_specific_songs BOOLEAN DEFAULT false,
  specific_song_list TEXT[],

  -- Technical
  sound_system_provided BOOLEAN DEFAULT false,
  lighting_provided BOOLEAN DEFAULT false,
  stage_size TEXT,
  power_available TEXT,
  load_in_restrictions TEXT,

  -- Additional
  attire_requirements TEXT,
  parking_info TEXT,
  meal_provided BOOLEAN DEFAULT false,
  green_room_available BOOLEAN DEFAULT false,

  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'reviewing', 'closed', 'cancelled')),
  closes_at TIMESTAMPTZ,
  decision_by TIMESTAMPTZ,
  selected_proposal_id UUID,

  -- Metadata
  views_count INTEGER DEFAULT 0,
  proposals_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfps_organizer ON event_rfps(organizer_id);
CREATE INDEX IF NOT EXISTS idx_rfps_date ON event_rfps(event_date);
CREATE INDEX IF NOT EXISTS idx_rfps_status ON event_rfps(status);
CREATE INDEX IF NOT EXISTS idx_rfps_type ON event_rfps(event_type);
CREATE INDEX IF NOT EXISTS idx_rfps_location ON event_rfps(city, state);

SELECT 'event_rfps table created' as status;


-- ============================================
-- STEP 5: Create event_proposals table
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id UUID NOT NULL REFERENCES public.event_rfps(id) ON DELETE CASCADE,
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,

  proposed_fee INTEGER NOT NULL,
  proposed_set_list TEXT[],
  why_us TEXT,

  includes_sound_system BOOLEAN DEFAULT false,
  includes_lighting BOOLEAN DEFAULT false,
  includes_mc_services BOOLEAN DEFAULT false,
  travel_included_in_fee BOOLEAN DEFAULT true,

  confirmed_available BOOLEAN DEFAULT true,
  alternative_dates DATE[],

  sample_video_urls TEXT[],
  sample_audio_urls TEXT[],
  previous_similar_events TEXT[],

  deposit_required INTEGER,
  cancellation_policy TEXT,
  contract_notes TEXT,

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

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposals_rfp ON event_proposals(rfp_id);
CREATE INDEX IF NOT EXISTS idx_proposals_band ON event_proposals(band_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON event_proposals(status);

CREATE UNIQUE INDEX IF NOT EXISTS idx_proposals_unique
ON event_proposals(rfp_id, band_id);

SELECT 'event_proposals table created' as status;


-- ============================================
-- STEP 6: Create booking_requests table
-- ============================================
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES public.tour_spider_riders(id) ON DELETE SET NULL,

  requested_date DATE NOT NULL,
  load_in_time TIME,
  doors_time TIME,
  show_time TIME,

  initiated_by TEXT NOT NULL CHECK (initiated_by IN ('band', 'venue')),

  venue_offer JSONB DEFAULT '{}',
  band_counter JSONB,
  counter_reason TEXT,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'cancelled', 'confirmed')),

  contract_generated BOOLEAN DEFAULT false,
  contract_pdf_url TEXT,
  contract_signed_by_band TIMESTAMPTZ,
  contract_signed_by_venue TIMESTAMPTZ,

  messages JSONB DEFAULT '[]',

  rejected_reason TEXT,
  cancelled_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_band ON booking_requests(band_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_venue ON booking_requests(venue_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_date ON booking_requests(requested_date);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);

SELECT 'booking_requests table created' as status;


-- ============================================
-- STEP 7: Extend venues table
-- ============================================
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS typical_budget_min INTEGER,
ADD COLUMN IF NOT EXISTS typical_budget_max INTEGER,
ADD COLUMN IF NOT EXISTS booking_lead_time INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS preferred_genres TEXT[],
ADD COLUMN IF NOT EXISTS booking_contact_email TEXT,
ADD COLUMN IF NOT EXISTS booking_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS available_weekdays TEXT[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

SELECT 'venues table extended' as status;


-- ============================================
-- STEP 8: Create updated_at triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_spider_riders_updated_at ON tour_spider_riders;
CREATE TRIGGER update_spider_riders_updated_at
BEFORE UPDATE ON tour_spider_riders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_booking_requests_updated_at ON booking_requests;
CREATE TRIGGER update_booking_requests_updated_at
BEFORE UPDATE ON booking_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_organizers_updated_at ON event_organizers;
CREATE TRIGGER update_event_organizers_updated_at
BEFORE UPDATE ON event_organizers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_rfps_updated_at ON event_rfps;
CREATE TRIGGER update_event_rfps_updated_at
BEFORE UPDATE ON event_rfps
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_proposals_updated_at ON event_proposals;
CREATE TRIGGER update_event_proposals_updated_at
BEFORE UPDATE ON event_proposals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

SELECT 'triggers created' as status;


-- ============================================
-- STEP 9: Enable RLS
-- ============================================
ALTER TABLE public.event_organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_spider_riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Public can view open RFPs
DROP POLICY IF EXISTS "Anyone can view open RFPs" ON public.event_rfps;
CREATE POLICY "Anyone can view open RFPs"
ON public.event_rfps
FOR SELECT
TO public
USING (status = 'open');

-- Public can view active Spider Riders
DROP POLICY IF EXISTS "Anyone can view active public riders" ON public.tour_spider_riders;
CREATE POLICY "Anyone can view active public riders"
ON public.tour_spider_riders
FOR SELECT
TO public
USING (is_public = true AND status = 'active');

-- Allow inserts for now (will add auth later)
DROP POLICY IF EXISTS "Anyone can create proposals" ON public.event_proposals;
CREATE POLICY "Anyone can create proposals"
ON public.event_proposals
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view proposals" ON public.event_proposals;
CREATE POLICY "Anyone can view proposals"
ON public.event_proposals
FOR SELECT
TO public
USING (true);

SELECT 'RLS policies created' as status;


-- ============================================
-- VERIFICATION
-- ============================================
SELECT '=== TOUR SPIDER RIDER MIGRATION COMPLETE ===' as status;

SELECT 'event_organizers' as table_name, COUNT(*) as rows FROM event_organizers
UNION ALL
SELECT 'tour_spider_riders', COUNT(*) FROM tour_spider_riders
UNION ALL
SELECT 'event_rfps', COUNT(*) FROM event_rfps
UNION ALL
SELECT 'event_proposals', COUNT(*) FROM event_proposals
UNION ALL
SELECT 'booking_requests', COUNT(*) FROM booking_requests;

SELECT '=== READY TO BUILD UI ===' as status;
