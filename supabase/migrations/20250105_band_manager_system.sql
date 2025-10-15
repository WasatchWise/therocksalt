-- THE ROCK SALT - BAND MANAGER ADD-ON
-- Revolutionary gig booking and payment system
-- "Exposure does not pay for strings, gas, or gear"

-- ============================================================================
-- ORGANIZATIONS (Bands, Venues, Vendors become "orgs")
-- ============================================================================

-- Enhance existing bands/venues to become orgs
ALTER TABLE bands ADD COLUMN IF NOT EXISTS org_type TEXT DEFAULT 'band';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS org_type TEXT DEFAULT 'venue';

-- Organization members (who can manage this org)
CREATE TABLE IF NOT EXISTS public.org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  org_type TEXT NOT NULL CHECK (org_type IN ('band', 'venue', 'vendor')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'viewer')) DEFAULT 'member',
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SALT ROCKS TOKEN ECONOMY
-- ============================================================================

-- Wallets (one per user OR org)
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('user', 'org')),
  owner_id UUID NOT NULL, -- user_id or org_id
  balance_salt_rocks INT DEFAULT 0 CHECK (balance_salt_rocks >= 0),
  last_recharge_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token transactions (every earn/spend)
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount INT NOT NULL, -- positive = gain, negative = spend
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'spend', 'grant', 'refund', 'monthly_grant')) NOT NULL,
  action TEXT, -- 'post_gig', 'unlock_match', 'boost_post', etc
  reference_type TEXT, -- 'gig_post', 'gig_match', etc
  reference_id UUID,
  balance_after INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token pricing config (easily change prices)
CREATE TABLE IF NOT EXISTS public.token_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_key TEXT UNIQUE NOT NULL,
  cost_salt_rocks INT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- 'Backline', 'Headliner', 'Touring'
  monthly_price_cents INT NOT NULL,
  monthly_tokens INT, -- NULL = unlimited
  perks JSONB, -- ['priority_support', 'calendar_sync', 'tour_spider', etc]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User/Org subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('user', 'org')),
  owner_id UUID NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'expired')) DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- GIG POSTING & MATCHING
-- ============================================================================

-- Gig posts (venue or band posts opportunity)
CREATE TABLE IF NOT EXISTS public.gig_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_org_id UUID NOT NULL, -- band or venue org
  requester_org_type TEXT CHECK (requester_org_type IN ('band', 'venue')) NOT NULL,

  -- Event details
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_window_start TIME,
  event_window_end TIME,
  event_type TEXT CHECK (event_type IN ('club', 'wedding', 'corporate', 'private', 'festival', 'house_show', 'other')),
  genres_wanted TEXT[], -- ['rock', 'punk', 'indie']
  audience_size_est INT,
  venue_id UUID REFERENCES public.venues(id), -- if venue posting, their own ID

  -- Budget (CRITICAL: NO $0 ALLOWED)
  budget_style TEXT CHECK (budget_style IN ('per_member', 'per_hour', 'per_slot', 'flat', 'rfq')) NOT NULL,
  budget_min_cents INT NOT NULL CHECK (budget_min_cents > 0), -- MUST BE > 0
  budget_max_cents INT CHECK (budget_max_cents >= budget_min_cents),

  -- Add-ons
  add_ons JSONB, -- {covers_fee_cents, bring_pa_cents, travel_fee_cents, etc}

  -- Logistics
  set_length_minutes INT,
  load_in_time TIME,
  soundcheck_time TIME,
  backline_provided TEXT[], -- ['drums', 'bass_amp', 'guitar_amp']
  pa_provided BOOLEAN DEFAULT false,
  parking_available BOOLEAN,
  hospitality TEXT, -- 'water', 'drink_tickets', 'meal', 'none'
  merch_allowed BOOLEAN DEFAULT true,
  merch_split_percentage INT,

  -- Meta
  notes TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'closed', 'booked', 'expired')) DEFAULT 'draft',
  expires_at TIMESTAMP WITH TIME ZONE,
  token_cost_spent INT DEFAULT 3, -- Cost to post

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gig matches (algorithmically generated or manual)
CREATE TABLE IF NOT EXISTS public.gig_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_post_id UUID REFERENCES public.gig_posts(id) ON DELETE CASCADE,
  band_org_id UUID NOT NULL, -- Always a band
  venue_org_id UUID, -- May be null if band posted

  -- Match quality
  match_score DECIMAL(3, 2), -- 0.00 to 1.00
  match_reasons JSONB, -- ['genre_fit', 'date_available', 'location_match']

  -- Visibility & unlock
  visibility TEXT CHECK (visibility IN ('locked', 'visible')) DEFAULT 'locked',
  unlocked_by_wallet_id UUID REFERENCES public.wallets(id),
  unlocked_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- GIGS (Confirmed bookings)
-- ============================================================================

-- Confirmed gigs
CREATE TABLE IF NOT EXISTS public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_post_id UUID REFERENCES public.gig_posts(id),
  band_org_id UUID NOT NULL,
  venue_org_id UUID NOT NULL,

  -- Status
  status TEXT CHECK (status IN ('hold', 'confirmed', 'completed', 'canceled')) DEFAULT 'hold',

  -- Agreed terms
  agreed_terms JSONB NOT NULL, -- Full copy of terms at booking time
  payout_cents INT NOT NULL CHECK (payout_cents > 0),
  deposit_cents INT DEFAULT 0,
  deposit_due_at DATE,
  balance_due_at DATE,

  -- Payment tracking
  deposit_paid_at TIMESTAMP WITH TIME ZONE,
  balance_paid_at TIMESTAMP WITH TIME ZONE,
  settlement_status TEXT CHECK (settlement_status IN ('pending', 'deposit_paid', 'fully_paid', 'refunded')) DEFAULT 'pending',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gig events (audit log)
CREATE TABLE IF NOT EXISTS public.gig_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE,
  event_kind TEXT CHECK (event_kind IN ('offer', 'hold', 'confirm', 'cancel', 'pay_deposit', 'pay_balance', 'sign_sheet', 'complete', 'dispute')) NOT NULL,
  actor_org_id UUID NOT NULL,
  actor_user_id UUID REFERENCES public.profiles(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- GIG SHEETS (Contracts)
-- ============================================================================

-- Gig sheets (PDF contracts)
CREATE TABLE IF NOT EXISTS public.gig_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE UNIQUE,
  pdf_url TEXT,
  document_hash TEXT, -- SHA256 of PDF
  version INT DEFAULT 1,

  -- E-signatures
  signed_by_band_user_id UUID REFERENCES public.profiles(id),
  signed_by_band_at TIMESTAMP WITH TIME ZONE,
  signed_by_venue_user_id UUID REFERENCES public.profiles(id),
  signed_by_venue_at TIMESTAMP WITH TIME ZONE,

  -- Lock after both signatures
  is_locked BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TRUST & RATINGS
-- ============================================================================

-- Ratings (after gig completion)
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE,
  rater_org_id UUID NOT NULL,
  ratee_org_id UUID NOT NULL,

  -- Scores
  score_overall INT CHECK (score_overall BETWEEN 1 AND 5) NOT NULL,
  score_professionalism INT CHECK (score_professionalism BETWEEN 1 AND 5),
  score_punctuality INT CHECK (score_punctuality BETWEEN 1 AND 5),
  score_quality INT CHECK (score_quality BETWEEN 1 AND 5),
  score_communication INT CHECK (score_communication BETWEEN 1 AND 5),

  comment TEXT,
  is_public BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE,
  opened_by_org_id UUID NOT NULL,
  opened_by_user_id UUID REFERENCES public.profiles(id),

  reason TEXT NOT NULL,
  description TEXT,
  evidence_urls TEXT[],

  status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'closed')) DEFAULT 'open',
  resolution JSONB,
  resolved_by_admin_id UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trust scores (computed periodically)
CREATE TABLE IF NOT EXISTS public.trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  org_type TEXT CHECK (org_type IN ('band', 'venue')) NOT NULL,

  -- Metrics
  gigs_completed INT DEFAULT 0,
  completion_rate DECIMAL(3, 2) DEFAULT 1.00, -- 0.00 to 1.00
  on_time_load_in_rate DECIMAL(3, 2) DEFAULT 1.00,
  dispute_count INT DEFAULT 0,
  average_rating DECIMAL(3, 2), -- 0.00 to 5.00
  verified_portfolio BOOLEAN DEFAULT false,

  -- Score
  trust_score INT CHECK (trust_score BETWEEN 0 AND 100) DEFAULT 50,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- AVAILABILITY & CALENDARS
-- ============================================================================

-- Calendar connections
CREATE TABLE IF NOT EXISTS public.calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  org_type TEXT CHECK (org_type IN ('band', 'venue')) NOT NULL,

  provider TEXT CHECK (provider IN ('google', 'outlook', 'ical', 'manual')) NOT NULL,
  provider_calendar_id TEXT,
  access_token_encrypted TEXT, -- Encrypted OAuth token
  refresh_token_encrypted TEXT,

  connect_status TEXT CHECK (connect_status IN ('active', 'expired', 'error', 'disconnected')) DEFAULT 'active',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_cursor TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability slots (manual or synced)
CREATE TABLE IF NOT EXISTS public.avail_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  org_type TEXT CHECK (org_type IN ('band', 'venue')) NOT NULL,

  slot_type TEXT CHECK (slot_type IN ('band_free', 'venue_open', 'unavailable')) NOT NULL,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL CHECK (end_at > start_at),

  note TEXT,
  source TEXT CHECK (source IN ('manual', 'calendar_sync')) DEFAULT 'manual',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TOUR SPIDER
-- ============================================================================

-- Tour seeds (starting point for tour planning)
CREATE TABLE IF NOT EXISTS public.tour_seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_org_id UUID NOT NULL,

  -- Starting point
  start_city TEXT NOT NULL,
  start_state TEXT NOT NULL,
  start_date DATE NOT NULL,
  seed_venue_org_id UUID REFERENCES public.venues(id),

  -- Constraints
  max_daily_drive_hours INT DEFAULT 6,
  max_total_days INT DEFAULT 14,
  preferred_genres TEXT[],
  min_capacity INT,
  max_capacity INT,
  allow_off_days BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour routes (generated routes)
CREATE TABLE IF NOT EXISTS public.tour_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_seed_id UUID REFERENCES public.tour_seeds(id) ON DELETE CASCADE,

  route_name TEXT, -- 'Fast Loop', 'Scenic Loop', 'Big Rooms Loop'
  total_miles INT,
  total_drive_hours INT,
  total_days INT,

  -- Stops JSON
  stops JSONB NOT NULL, -- [{venue_id, date, drive_time_from_prev, etc}]

  export_pdf_url TEXT,
  export_ical_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour holds (batch hold requests)
CREATE TABLE IF NOT EXISTS public.tour_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_route_id UUID REFERENCES public.tour_routes(id) ON DELETE CASCADE,
  venue_org_id UUID NOT NULL,
  proposed_date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired')) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- EDUCATION HUB
-- ============================================================================

-- Pro tips (micro-lessons)
CREATE TABLE IF NOT EXISTS public.pro_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  tags TEXT[], -- ['load_in', 'backline', 'etiquette', 'sound', 'payment', 'promo']
  author_org_id UUID,
  author_user_id UUID REFERENCES public.profiles(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venue intel edits (community-contributed venue info)
CREATE TABLE IF NOT EXISTS public.venue_intel_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_org_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  editor_user_id UUID REFERENCES public.profiles(id),

  changes JSONB NOT NULL, -- {load_in_notes: 'Back door on Main St', etc}

  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by_admin_id UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- DUBLIN DRIVE LIVE INTEGRATION
-- ============================================================================

-- Portfolio sessions (recordings at Dublin Drive Live)
CREATE TABLE IF NOT EXISTS public.portfolio_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_org_id UUID NOT NULL,

  session_type TEXT CHECK (session_type IN ('performance', 'interview', 'acoustic', 'full_band')) NOT NULL,
  session_date DATE NOT NULL,
  duration_minutes INT,

  -- Media outputs
  video_url TEXT,
  audio_url TEXT,
  interview_url TEXT,
  photo_urls TEXT[],

  -- EPK
  epk_url TEXT, -- Auto-generated EPK page
  is_verified BOOLEAN DEFAULT true, -- Verified by Dublin Drive Live

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS wallets_owner_idx ON public.wallets(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS token_transactions_wallet_idx ON public.token_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS gig_posts_status_date_idx ON public.gig_posts(status, event_date);
CREATE INDEX IF NOT EXISTS gig_posts_requester_idx ON public.gig_posts(requester_org_type, requester_org_id);
CREATE INDEX IF NOT EXISTS gig_matches_post_idx ON public.gig_matches(gig_post_id);
CREATE INDEX IF NOT EXISTS gig_matches_visibility_idx ON public.gig_matches(visibility);
CREATE INDEX IF NOT EXISTS gigs_band_idx ON public.gigs(band_org_id);
CREATE INDEX IF NOT EXISTS gigs_venue_idx ON public.gigs(venue_org_id);
CREATE INDEX IF NOT EXISTS gigs_status_idx ON public.gigs(status);
CREATE INDEX IF NOT EXISTS avail_slots_org_idx ON public.avail_slots(org_type, org_id);
CREATE INDEX IF NOT EXISTS avail_slots_date_idx ON public.avail_slots(start_at, end_at);
CREATE INDEX IF NOT EXISTS ratings_gig_idx ON public.ratings(gig_id);
CREATE INDEX IF NOT EXISTS ratings_ratee_idx ON public.ratings(ratee_org_id);

-- ============================================================================
-- DEFAULT TOKEN PRICES
-- ============================================================================

INSERT INTO token_prices (action_key, cost_salt_rocks, description) VALUES
  ('post_gig', 3, 'Post a gig opportunity'),
  ('unlock_match', 1, 'Unlock a gig match'),
  ('boost_post', 2, 'Boost gig post to venue inboxes'),
  ('confirm_hold', 1, 'Confirm a hold on a gig'),
  ('tour_spider_generate', 5, 'Generate a tour route'),
  ('tour_spider_batch_holds', 10, 'Send batch hold requests for tour')
ON CONFLICT (action_key) DO NOTHING;

-- ============================================================================
-- DEFAULT SUBSCRIPTION PLANS
-- ============================================================================

INSERT INTO subscription_plans (name, monthly_price_cents, monthly_tokens, perks) VALUES
  ('Backline', 1000, 30, '["priority_support"]'),
  ('Headliner', 2900, 60, '["calendar_auto_sync", "priority_support", "advanced_analytics"]'),
  ('Touring', 7900, 150, '["tour_spider_pro", "unlimited_posts", "contract_templates", "dispute_priority", "calendar_auto_sync"]')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if wallet has sufficient tokens
CREATE OR REPLACE FUNCTION check_token_balance(p_wallet_id UUID, p_cost INT)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INT;
BEGIN
  SELECT balance_salt_rocks INTO current_balance
  FROM wallets WHERE id = p_wallet_id;

  RETURN current_balance >= p_cost;
END;
$$ LANGUAGE plpgsql;

-- Spend tokens from wallet
CREATE OR REPLACE FUNCTION spend_tokens(
  p_wallet_id UUID,
  p_amount INT,
  p_action TEXT,
  p_ref_type TEXT DEFAULT NULL,
  p_ref_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  new_balance INT;
BEGIN
  -- Check balance
  IF NOT check_token_balance(p_wallet_id, p_amount) THEN
    RETURN FALSE;
  END IF;

  -- Deduct tokens
  UPDATE wallets
  SET balance_salt_rocks = balance_salt_rocks - p_amount,
      updated_at = NOW()
  WHERE id = p_wallet_id
  RETURNING balance_salt_rocks INTO new_balance;

  -- Log transaction
  INSERT INTO token_transactions (
    wallet_id, amount, transaction_type, action,
    reference_type, reference_id, balance_after
  ) VALUES (
    p_wallet_id, -p_amount, 'spend', p_action,
    p_ref_type, p_ref_id, new_balance
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Grant tokens to wallet
CREATE OR REPLACE FUNCTION grant_tokens(
  p_wallet_id UUID,
  p_amount INT,
  p_reason TEXT DEFAULT 'monthly_grant'
)
RETURNS VOID AS $$
DECLARE
  new_balance INT;
BEGIN
  UPDATE wallets
  SET balance_salt_rocks = balance_salt_rocks + p_amount,
      updated_at = NOW()
  WHERE id = p_wallet_id
  RETURNING balance_salt_rocks INTO new_balance;

  INSERT INTO token_transactions (
    wallet_id, amount, transaction_type, balance_after
  ) VALUES (
    p_wallet_id, p_amount, 'grant', new_balance
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Public read for active gig posts
CREATE POLICY "Public read active gig posts" ON gig_posts
  FOR SELECT USING (status = 'active');

-- Users can manage their own wallet
CREATE POLICY "Users manage own wallet" ON wallets
  FOR ALL USING (
    (owner_type = 'user' AND owner_id = auth.uid()) OR
    (owner_type = 'org' AND owner_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ))
  );

-- Users can view their own transactions
CREATE POLICY "Users view own transactions" ON token_transactions
  FOR SELECT USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE
        (owner_type = 'user' AND owner_id = auth.uid()) OR
        (owner_type = 'org' AND owner_id IN (
          SELECT org_id FROM org_members WHERE user_id = auth.uid()
        ))
    )
  );

-- Gig visibility policies
CREATE POLICY "Users view visible matches" ON gig_matches
  FOR SELECT USING (visibility = 'visible');

-- Users involved in gig can see sheet
CREATE POLICY "Gig parties view sheet" ON gig_sheets
  FOR SELECT USING (
    gig_id IN (
      SELECT id FROM gigs WHERE
        band_org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()) OR
        venue_org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER gig_posts_updated_at BEFORE UPDATE ON gig_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER gigs_updated_at BEFORE UPDATE ON gigs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
