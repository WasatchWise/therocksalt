-- Add Spider Rider System (Tour Booking Pre-Approval)
-- Created: 2025-11-15

-- Tour Spider Riders table (the "general offer of terms")
CREATE TABLE IF NOT EXISTS public.spider_riders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,

  version text NOT NULL, -- e.g., "v2.3" or "Club Tour 2025"
  is_active boolean DEFAULT true,

  -- Performance Terms
  guarantee_min decimal(10,2),
  guarantee_max decimal(10,2),
  door_split_percentage integer,
  notes_financial text,

  -- Technical Rider
  min_stage_width_feet integer,
  min_stage_depth_feet integer,
  min_input_channels integer,
  requires_house_drums boolean DEFAULT false,
  stage_plot_url text,
  input_list_url text,
  notes_technical text,

  -- Hospitality
  green_room_requirements text,
  meal_buyout_amount decimal(10,2),
  drink_tickets_count integer,
  guest_list_allocation integer,
  notes_hospitality text,

  -- Business Terms
  merch_split_to_venue_percentage integer DEFAULT 15,
  age_restriction text CHECK (age_restriction IN ('all_ages', '18+', '21+')),
  notes_business text,

  -- Analytics
  acceptance_count integer DEFAULT 0,
  booking_count integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(band_id, version)
);

-- Spider Rider Acceptances (venues pre-approving bands)
CREATE TABLE IF NOT EXISTS public.spider_rider_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spider_rider_id uuid REFERENCES public.spider_riders(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,

  accepted_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,

  notes text, -- Venue-specific notes or modifications

  UNIQUE(spider_rider_id, venue_id)
);

-- Booking Requests (band requests specific date at pre-approved venue)
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spider_rider_id uuid REFERENCES public.spider_riders(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,

  requested_date date NOT NULL,
  requested_time time,
  requested_guarantee decimal(10,2), -- If band wants specific amount within range

  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'canceled', 'completed')),

  venue_response text, -- Venue's message
  responded_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spider_riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spider_rider_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spider_riders
CREATE POLICY "Anyone can view active spider riders"
  ON public.spider_riders FOR SELECT
  USING (is_active = true);

CREATE POLICY "Bands can manage their own spider riders"
  ON public.spider_riders FOR ALL
  USING (
    band_id IN (
      SELECT id FROM public.bands WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all spider riders"
  ON public.spider_riders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE id = auth.uid()
    )
  );

-- RLS Policies for spider_rider_acceptances
CREATE POLICY "Anyone can view acceptances"
  ON public.spider_rider_acceptances FOR SELECT
  USING (true);

CREATE POLICY "Venue owners can manage their acceptances"
  ON public.spider_rider_acceptances FOR ALL
  USING (
    venue_id IN (
      SELECT id FROM public.venues WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all acceptances"
  ON public.spider_rider_acceptances FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE id = auth.uid()
    )
  );

-- RLS Policies for booking_requests
CREATE POLICY "Bands can view their own booking requests"
  ON public.booking_requests FOR SELECT
  USING (
    band_id IN (
      SELECT id FROM public.bands WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Venue owners can view their booking requests"
  ON public.booking_requests FOR SELECT
  USING (
    venue_id IN (
      SELECT id FROM public.venues WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Bands can create booking requests"
  ON public.booking_requests FOR INSERT
  WITH CHECK (
    band_id IN (
      SELECT id FROM public.bands WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Venue owners can update booking requests"
  ON public.booking_requests FOR UPDATE
  USING (
    venue_id IN (
      SELECT id FROM public.venues WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all booking requests"
  ON public.booking_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS spider_riders_band_id_idx ON public.spider_riders(band_id);
CREATE INDEX IF NOT EXISTS spider_riders_active_idx ON public.spider_riders(is_active);
CREATE INDEX IF NOT EXISTS spider_rider_acceptances_spider_rider_id_idx ON public.spider_rider_acceptances(spider_rider_id);
CREATE INDEX IF NOT EXISTS spider_rider_acceptances_venue_id_idx ON public.spider_rider_acceptances(venue_id);
CREATE INDEX IF NOT EXISTS booking_requests_band_id_idx ON public.booking_requests(band_id);
CREATE INDEX IF NOT EXISTS booking_requests_venue_id_idx ON public.booking_requests(venue_id);
CREATE INDEX IF NOT EXISTS booking_requests_status_idx ON public.booking_requests(status);
CREATE INDEX IF NOT EXISTS booking_requests_date_idx ON public.booking_requests(requested_date);

-- Triggers for updated_at
CREATE TRIGGER spider_riders_updated_at
  BEFORE UPDATE ON public.spider_riders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Comments
COMMENT ON TABLE public.spider_riders IS 'Tour Spider Riders - bands general touring terms that venues can pre-approve';
COMMENT ON TABLE public.spider_rider_acceptances IS 'Venues that have pre-approved a bands spider rider';
COMMENT ON TABLE public.booking_requests IS 'Specific date booking requests at pre-approved venues';
COMMENT ON COLUMN public.spider_riders.version IS 'Version identifier like "v2.3" or "Club Tour 2025"';
COMMENT ON COLUMN public.spider_riders.door_split_percentage IS 'Percentage of door revenue to band (e.g., 80 = 80/20 split)';
COMMENT ON COLUMN public.spider_riders.merch_split_to_venue_percentage IS 'Percentage of merch sales to venue (typically 10-20%)';
