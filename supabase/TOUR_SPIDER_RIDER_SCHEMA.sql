-- =====================================================
-- TOUR SPIDER RIDER DATABASE SCHEMA
-- =====================================================
-- This creates the database structure for the revolutionary
-- Tour Spider Rider system - where bands post terms once
-- and qualified venues can instantly request bookings.
-- =====================================================

-- ============================================
-- 1. TOUR SPIDER RIDERS
-- ============================================
-- A band's touring terms and preferences
-- One rider per band (can be updated over time)
-- ============================================

CREATE TABLE IF NOT EXISTS public.tour_spider_riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,

  -- Financial Terms
  guarantee_min INTEGER, -- Minimum guarantee in cents (e.g., 50000 = $500)
  guarantee_max INTEGER, -- Maximum guarantee in cents
  percentage_split JSONB, -- e.g., {"type": "door_split", "band_percent": 80, "venue_percent": 20}
  payment_terms TEXT DEFAULT 'night_of', -- 'night_of', 'net_7', 'net_30', '50_50_split'

  -- Lodging & Hospitality
  lodging_requirements JSONB DEFAULT '{}', -- {"hotel": true, "rooms_needed": 2, "green_room": true, "catering": "full"}
  hospitality_rider JSONB DEFAULT '{}', -- Detailed hospitality needs

  -- Technical Requirements (link to existing tech rider or store here)
  tech_rider_url TEXT, -- Link to uploaded PDF/doc
  stage_plot_url TEXT,
  input_list JSONB, -- Detailed channel list
  backline_requirements JSONB, -- {"drums": false, "bass_amp": true, "guitar_amp": true}

  -- Routing Preferences
  routing_preferences JSONB DEFAULT '{}', -- {"weekdays_only": false, "regions": ["west_coast", "mountain"], "blackout_dates": []}
  min_days_notice INTEGER DEFAULT 30, -- Minimum booking notice in days
  preferred_months TEXT[], -- e.g., ["march", "april", "september", "october"]

  -- Capacity Preferences
  min_venue_capacity INTEGER, -- Won't play rooms smaller than this
  max_venue_capacity INTEGER, -- Won't play rooms larger than this

  -- Other Terms
  merchandise_split JSONB, -- {"band_keeps": 100, "venue_commission": 0}
  promotion_requirements JSONB, -- {"social_posts": 3, "email_blast": true, "posters": 50}

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'inactive')),
  is_public BOOLEAN DEFAULT true, -- If false, only manually-approved venues can see

  -- Metadata
  notes TEXT, -- Internal notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_spider_riders_band ON tour_spider_riders(band_id);
CREATE INDEX IF NOT EXISTS idx_spider_riders_status ON tour_spider_riders(status);
CREATE INDEX IF NOT EXISTS idx_spider_riders_public ON tour_spider_riders(is_public);

-- Unique constraint: one active rider per band
CREATE UNIQUE INDEX IF NOT EXISTS idx_spider_riders_band_active
ON tour_spider_riders(band_id)
WHERE status = 'active';


-- ============================================
-- 2. VENUE QUALIFICATIONS
-- ============================================
-- Pre-computed matches between venues and riders
-- Cached for performance (recalculated daily or on-demand)
-- ============================================

CREATE TABLE IF NOT EXISTS public.venue_qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES public.tour_spider_riders(id) ON DELETE CASCADE,

  -- Overall Match
  qualified BOOLEAN DEFAULT false,
  match_score INTEGER DEFAULT 0, -- 0-100 score

  -- Individual Match Criteria
  capacity_match BOOLEAN DEFAULT false,
  financial_match BOOLEAN DEFAULT false, -- Can afford the guarantee
  genre_match BOOLEAN DEFAULT false,
  location_match BOOLEAN DEFAULT true, -- For routing preferences

  -- Details
  disqualification_reasons JSONB DEFAULT '[]', -- ["capacity_too_small", "budget_too_low"]
  match_details JSONB DEFAULT '{}', -- Detailed scoring breakdown

  -- Metadata
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_venue_quals_venue ON venue_qualifications(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_quals_rider ON venue_qualifications(rider_id);
CREATE INDEX IF NOT EXISTS idx_venue_quals_qualified ON venue_qualifications(qualified);
CREATE INDEX IF NOT EXISTS idx_venue_quals_score ON venue_qualifications(match_score DESC);

-- Unique constraint: one qualification per venue-rider pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_venue_quals_unique
ON venue_qualifications(venue_id, rider_id);


-- ============================================
-- 3. BOOKING REQUESTS
-- ============================================
-- When a venue requests to book a band (or vice versa)
-- ============================================

CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES public.tour_spider_riders(id) ON DELETE SET NULL,

  -- Event Details
  requested_date DATE NOT NULL,
  load_in_time TIME,
  doors_time TIME,
  show_time TIME,

  -- Who initiated
  initiated_by TEXT NOT NULL CHECK (initiated_by IN ('band', 'venue')),

  -- Offer Terms (from venue)
  venue_offer JSONB DEFAULT '{}', -- {"guarantee": 100000, "percentage": 80, "lodging": "hotel_2_rooms"}

  -- Counter Offer (from band)
  band_counter JSONB, -- {"guarantee": 150000, "percentage": 85}
  counter_reason TEXT,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'cancelled', 'confirmed')),

  -- Contract Generation
  contract_generated BOOLEAN DEFAULT false,
  contract_pdf_url TEXT,
  contract_signed_by_band TIMESTAMPTZ,
  contract_signed_by_venue TIMESTAMPTZ,

  -- Communication
  messages JSONB DEFAULT '[]', -- [{"from": "venue", "message": "Can we move to 8pm?", "timestamp": "..."}]

  -- Metadata
  rejected_reason TEXT,
  cancelled_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_booking_requests_band ON booking_requests(band_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_venue ON booking_requests(venue_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_date ON booking_requests(requested_date);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);


-- ============================================
-- 4. TOUR ROUTES
-- ============================================
-- Planned multi-city tours with routing AI
-- ============================================

CREATE TABLE IF NOT EXISTS public.tour_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,

  -- Route Details
  route_name TEXT NOT NULL, -- "West Coast Spring Tour 2025"
  description TEXT,
  start_date DATE,
  end_date DATE,

  -- Financial Projections
  estimated_revenue INTEGER, -- Total in cents
  estimated_expenses INTEGER, -- Gas, hotels, food
  profitability_score INTEGER, -- 0-100

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'proposed', 'confirmed', 'completed', 'cancelled')),

  -- AI Routing Data
  routing_data JSONB DEFAULT '{}', -- AI-calculated optimal path, suggestions, etc.

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tour_routes_band ON tour_routes(band_id);
CREATE INDEX IF NOT EXISTS idx_tour_routes_dates ON tour_routes(start_date, end_date);


-- ============================================
-- 5. TOUR ROUTE DATES
-- ============================================
-- Individual shows within a tour route
-- ============================================

CREATE TABLE IF NOT EXISTS public.tour_route_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES public.tour_routes(id) ON DELETE CASCADE,

  -- Show Details
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  booking_request_id UUID REFERENCES public.booking_requests(id) ON DELETE SET NULL,
  show_date DATE NOT NULL,
  sequence_order INTEGER NOT NULL, -- 1st show, 2nd show, etc.

  -- Routing Info
  drive_time_from_previous INTEGER, -- Minutes
  distance_from_previous INTEGER, -- Miles
  overnight_location TEXT, -- "Denver, CO" if staying overnight

  -- Status
  is_confirmed BOOLEAN DEFAULT false,
  is_day_off BOOLEAN DEFAULT false, -- Travel day or rest day

  -- Notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tour_dates_route ON tour_route_dates(route_id);
CREATE INDEX IF NOT EXISTS idx_tour_dates_venue ON tour_route_dates(venue_id);
CREATE INDEX IF NOT EXISTS idx_tour_dates_date ON tour_route_dates(show_date);
CREATE INDEX IF NOT EXISTS idx_tour_dates_order ON tour_route_dates(route_id, sequence_order);


-- ============================================
-- 6. EXTEND VENUES TABLE
-- ============================================
-- Add columns to venues table for Spider Rider matching
-- ============================================

-- Booking budget and preferences
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS typical_budget_min INTEGER, -- Typical guarantee range in cents
ADD COLUMN IF NOT EXISTS typical_budget_max INTEGER,
ADD COLUMN IF NOT EXISTS booking_lead_time INTEGER DEFAULT 30, -- Days notice they need
ADD COLUMN IF NOT EXISTS preferred_genres TEXT[], -- Array of genre slugs
ADD COLUMN IF NOT EXISTS booking_contact_email TEXT,
ADD COLUMN IF NOT EXISTS booking_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS available_weekdays TEXT[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];


-- ============================================
-- 7. RLS POLICIES
-- ============================================
-- Row Level Security for Tour Spider Rider tables
-- ============================================

-- Enable RLS
ALTER TABLE public.tour_spider_riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_route_dates ENABLE ROW LEVEL SECURITY;

-- Spider Riders: Public can view active public riders, bands can manage their own
DROP POLICY IF EXISTS "Anyone can view active public riders" ON public.tour_spider_riders;
CREATE POLICY "Anyone can view active public riders"
ON public.tour_spider_riders
FOR SELECT
TO public
USING (is_public = true AND status = 'active');

DROP POLICY IF EXISTS "Bands can manage their own riders" ON public.tour_spider_riders;
CREATE POLICY "Bands can manage their own riders"
ON public.tour_spider_riders
FOR ALL
TO authenticated
USING (
  band_id IN (
    SELECT b.id FROM bands b
    WHERE b.id = band_id
    -- Add authentication logic here when band ownership is implemented
  )
);

-- Venue Qualifications: Venues can see their own, bands can see venues qualified for them
DROP POLICY IF EXISTS "Venues can view their qualifications" ON public.venue_qualifications;
CREATE POLICY "Venues can view their qualifications"
ON public.venue_qualifications
FOR SELECT
TO public
USING (true); -- Will add auth logic later

-- Booking Requests: Bands and venues can see their own requests
DROP POLICY IF EXISTS "Users can view their booking requests" ON public.booking_requests;
CREATE POLICY "Users can view their booking requests"
ON public.booking_requests
FOR SELECT
TO public
USING (true); -- Will add auth logic later

DROP POLICY IF EXISTS "Users can create booking requests" ON public.booking_requests;
CREATE POLICY "Users can create booking requests"
ON public.booking_requests
FOR INSERT
TO public
WITH CHECK (true); -- Will add auth logic later

-- Tour Routes: Bands can manage their own routes
DROP POLICY IF EXISTS "Bands can manage their routes" ON public.tour_routes;
CREATE POLICY "Bands can manage their routes"
ON public.tour_routes
FOR ALL
TO public
USING (true); -- Will add auth logic later

DROP POLICY IF EXISTS "Bands can manage their route dates" ON public.tour_route_dates;
CREATE POLICY "Bands can manage their route dates"
ON public.tour_route_dates
FOR ALL
TO public
USING (true); -- Will add auth logic later


-- ============================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
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

DROP TRIGGER IF EXISTS update_tour_routes_updated_at ON tour_routes;
CREATE TRIGGER update_tour_routes_updated_at
BEFORE UPDATE ON tour_routes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT '=== TOUR SPIDER RIDER SCHEMA CREATED ===' as status;

SELECT 'tour_spider_riders' as table_name, COUNT(*) as rows FROM tour_spider_riders
UNION ALL
SELECT 'venue_qualifications', COUNT(*) FROM venue_qualifications
UNION ALL
SELECT 'booking_requests', COUNT(*) FROM booking_requests
UNION ALL
SELECT 'tour_routes', COUNT(*) FROM tour_routes
UNION ALL
SELECT 'tour_route_dates', COUNT(*) FROM tour_route_dates;

SELECT '=== SCHEMA READY ===' as status;
