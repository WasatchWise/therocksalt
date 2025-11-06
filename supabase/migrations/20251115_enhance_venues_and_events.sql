-- Enhance Venues and Events for Spider Riders and Band-Owned Events
-- Created: 2025-11-15

-- Add Spider Rider technical specs to venues
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS stage_width_feet integer;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS stage_depth_feet integer;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS input_channels integer;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS has_house_drums boolean DEFAULT false;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS has_backline boolean DEFAULT false;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS venue_type text CHECK (venue_type IN ('club', 'bar', 'theater', 'arena', 'festival', 'house_show', 'other'));
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS claimed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS claimed_at timestamptz;

-- Add band ownership and promotional fields to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price_advance decimal(10,2);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price_door decimal(10,2);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS show_time time;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS page_views integer DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS tier text CHECK (tier IN ('free', 'featured', 'hof')); -- For event promotion tiers

-- Add featured column if it doesn't exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Create guest list signups table for band events
CREATE TABLE IF NOT EXISTS public.guest_list_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,

  name text NOT NULL,
  email text NOT NULL,
  phone text,

  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),

  created_at timestamptz DEFAULT now()
);

-- Enable RLS on guest_list_signups
ALTER TABLE public.guest_list_signups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guest_list_signups
CREATE POLICY "Anyone can submit guest list signup"
  ON public.guest_list_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Band owners can view their event guest lists"
  ON public.guest_list_signups FOR SELECT
  USING (
    event_id IN (
      SELECT e.id FROM public.events e
      JOIN public.bands b ON b.id = e.band_id
      WHERE b.claimed_by = auth.uid()
    )
  );

CREATE POLICY "Band owners can update their event guest lists"
  ON public.guest_list_signups FOR UPDATE
  USING (
    event_id IN (
      SELECT e.id FROM public.events e
      JOIN public.bands b ON b.id = e.band_id
      WHERE b.claimed_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all guest lists"
  ON public.guest_list_signups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE id = auth.uid()
    )
  );

-- Update events RLS to allow band owners to manage their events
CREATE POLICY "Band owners can insert their own events"
  ON public.events FOR INSERT
  WITH CHECK (
    band_id IN (
      SELECT id FROM public.bands WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Band owners can update their own events"
  ON public.events FOR UPDATE
  USING (
    band_id IN (
      SELECT id FROM public.bands WHERE claimed_by = auth.uid()
    )
  );

CREATE POLICY "Band owners can delete their own events"
  ON public.events FOR DELETE
  USING (
    band_id IN (
      SELECT id FROM public.bands WHERE claimed_by = auth.uid()
    )
  );

-- Update venues RLS to allow venue owners to manage
CREATE POLICY "Venue owners can update their venues"
  ON public.venues FOR UPDATE
  USING (claimed_by = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS venues_claimed_by_idx ON public.venues(claimed_by);
CREATE INDEX IF NOT EXISTS venues_venue_type_idx ON public.venues(venue_type);
CREATE INDEX IF NOT EXISTS events_band_id_idx ON public.events(band_id);
CREATE INDEX IF NOT EXISTS events_tier_idx ON public.events(tier);
CREATE INDEX IF NOT EXISTS guest_list_signups_event_id_idx ON public.guest_list_signups(event_id);
CREATE INDEX IF NOT EXISTS guest_list_signups_status_idx ON public.guest_list_signups(status);

-- Comments
COMMENT ON COLUMN public.venues.stage_width_feet IS 'Stage width in feet for Spider Rider matching';
COMMENT ON COLUMN public.venues.input_channels IS 'Number of available input channels for bands';
COMMENT ON COLUMN public.venues.claimed_by IS 'Venue owner/manager user ID';
COMMENT ON COLUMN public.events.band_id IS 'Band that owns/created this event';
COMMENT ON COLUMN public.events.tier IS 'Promotional tier for event (free, featured, hof)';
COMMENT ON TABLE public.guest_list_signups IS 'Guest list signup requests for band events';
