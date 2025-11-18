-- Add monetization tables for song requests, tips, and analytics
-- Created: 2025-01-20

-- Song Requests (paid priority requests)
CREATE TABLE IF NOT EXISTS public.song_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  media_id integer, -- AzuraCast media ID
  band_id uuid REFERENCES public.bands(id) ON DELETE SET NULL,
  track_title text,
  artist_name text,
  
  -- Payment info
  amount_cents integer NOT NULL,
  stripe_payment_intent_id text,
  payment_status text CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  
  -- Priority level
  priority text CHECK (priority IN ('normal', 'next_5', 'play_next', 'play_now')) DEFAULT 'normal',
  
  -- Status
  status text CHECK (status IN ('pending', 'queued', 'played', 'cancelled')) DEFAULT 'pending',
  queued_at timestamptz,
  played_at timestamptz,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS song_requests_user_id_idx ON public.song_requests(user_id);
CREATE INDEX IF NOT EXISTS song_requests_media_id_idx ON public.song_requests(media_id);
CREATE INDEX IF NOT EXISTS song_requests_status_idx ON public.song_requests(status);
CREATE INDEX IF NOT EXISTS song_requests_priority_idx ON public.song_requests(priority);

-- Tips
CREATE TABLE IF NOT EXISTS public.tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  artist_id uuid REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  
  amount_cents integer NOT NULL,
  message text,
  
  -- Payment info
  stripe_payment_intent_id text,
  stripe_charge_id text,
  payment_status text CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  
  -- Payout info
  artist_payout_cents integer, -- 95% of amount
  platform_fee_cents integer, -- 5% of amount
  payout_status text CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed')) DEFAULT 'pending',
  paid_out_at timestamptz,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS tips_artist_id_idx ON public.tips(artist_id);
CREATE INDEX IF NOT EXISTS tips_from_user_id_idx ON public.tips(from_user_id);
CREATE INDEX IF NOT EXISTS tips_payment_status_idx ON public.tips(payment_status);

-- Analytics Events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  band_id uuid REFERENCES public.bands(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  media_id integer, -- AzuraCast media ID
  event_id uuid, -- Related event ID
  
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Location data (optional)
  ip_address inet,
  user_agent text,
  referrer text,
  
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS analytics_events_event_type_idx ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_events_band_id_idx ON public.analytics_events(band_id);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS analytics_events_media_id_idx ON public.analytics_events(media_id);

-- Analytics Summary (for faster queries)
CREATE TABLE IF NOT EXISTS public.analytics_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  period_type text CHECK (period_type IN ('day', 'week', 'month')) NOT NULL,
  
  -- Metrics
  profile_views integer DEFAULT 0,
  track_plays integer DEFAULT 0,
  unique_listeners integer DEFAULT 0,
  song_requests integer DEFAULT 0,
  tips_received_cents integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  UNIQUE(band_id, period_start, period_type)
);

CREATE INDEX IF NOT EXISTS analytics_summary_band_id_idx ON public.analytics_summary(band_id);
CREATE INDEX IF NOT EXISTS analytics_summary_period_idx ON public.analytics_summary(period_start, period_end);

-- Affiliate Clicks
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  affiliate_type text NOT NULL, -- 'equipment', 'streaming', 'tickets', 'merch', 'studio'
  affiliate_partner text NOT NULL, -- 'sweetwater', 'spotify', etc.
  affiliate_url text NOT NULL,
  referral_code text,
  
  -- Conversion tracking
  converted boolean DEFAULT false,
  conversion_value_cents integer,
  commission_cents integer,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  converted_at timestamptz
);

CREATE INDEX IF NOT EXISTS affiliate_clicks_user_id_idx ON public.affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS affiliate_clicks_affiliate_type_idx ON public.affiliate_clicks(affiliate_type);
CREATE INDEX IF NOT EXISTS affiliate_clicks_converted_idx ON public.affiliate_clicks(converted);

-- Enable RLS
ALTER TABLE public.song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for song_requests
CREATE POLICY "Users can view their own requests"
  ON public.song_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
  ON public.song_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
  ON public.song_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- RLS Policies for tips
CREATE POLICY "Users can view tips they sent"
  ON public.tips FOR SELECT
  USING (auth.uid() = from_user_id);

CREATE POLICY "Artists can view tips they received"
  ON public.tips FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bands 
      WHERE id = artist_id AND claimed_by = auth.uid()
    )
  );

CREATE POLICY "Users can create tips"
  ON public.tips FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- RLS Policies for analytics_events
CREATE POLICY "Public can create analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Artists can view their analytics"
  ON public.analytics_events FOR SELECT
  USING (
    band_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.bands 
      WHERE id = band_id AND claimed_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all analytics"
  ON public.analytics_events FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- RLS Policies for analytics_summary
CREATE POLICY "Artists can view their summary"
  ON public.analytics_summary FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bands 
      WHERE id = band_id AND claimed_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all summaries"
  ON public.analytics_summary FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- RLS Policies for affiliate_clicks
CREATE POLICY "Users can view their clicks"
  ON public.affiliate_clicks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can create affiliate clicks"
  ON public.affiliate_clicks FOR INSERT
  WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER song_requests_updated_at
  BEFORE UPDATE ON public.song_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tips_updated_at
  BEFORE UPDATE ON public.tips
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER analytics_summary_updated_at
  BEFORE UPDATE ON public.analytics_summary
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Comments
COMMENT ON TABLE public.song_requests IS 'Paid song requests with priority levels';
COMMENT ON TABLE public.tips IS 'Tips from fans to artists with revenue split';
COMMENT ON TABLE public.analytics_events IS 'Event tracking for analytics';
COMMENT ON TABLE public.analytics_summary IS 'Aggregated analytics by period';
COMMENT ON TABLE public.affiliate_clicks IS 'Affiliate link click tracking';

