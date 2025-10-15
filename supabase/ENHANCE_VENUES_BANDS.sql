-- ============================================================
-- ENHANCE VENUES & BANDS - Add full editing and claiming capabilities
-- ============================================================

-- VENUES ENHANCEMENTS
-- Add more fields to venues table
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS venue_type TEXT,
ADD COLUMN IF NOT EXISTS social_media_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

COMMENT ON COLUMN public.venues.phone IS 'Venue contact phone number';
COMMENT ON COLUMN public.venues.email IS 'Venue contact email';
COMMENT ON COLUMN public.venues.website IS 'Venue website URL';
COMMENT ON COLUMN public.venues.description IS 'Venue description/bio';
COMMENT ON COLUMN public.venues.capacity IS 'Maximum capacity';
COMMENT ON COLUMN public.venues.venue_type IS 'Type: bar, club, theater, outdoor, etc';
COMMENT ON COLUMN public.venues.claimed_by IS 'User ID of person who claimed this venue';
COMMENT ON COLUMN public.venues.image_url IS 'Venue photo/logo URL';

-- Create updated_at trigger for venues
CREATE OR REPLACE FUNCTION update_venues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_venues_updated_at ON public.venues;
CREATE TRIGGER trigger_update_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW
EXECUTE FUNCTION update_venues_updated_at();

-- Venues RLS policies
DROP POLICY IF EXISTS "Public can read venues" ON public.venues;
CREATE POLICY "Public can read venues"
ON public.venues
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can update venues" ON public.venues;
CREATE POLICY "Admins can update venues"
ON public.venues
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
  OR claimed_by = auth.uid()
);

DROP POLICY IF EXISTS "Admins can delete venues" ON public.venues;
CREATE POLICY "Admins can delete venues"
ON public.venues
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can claim venues" ON public.venues;
CREATE POLICY "Users can claim venues"
ON public.venues
FOR UPDATE
TO authenticated
USING (claimed_by IS NULL OR claimed_by = auth.uid());

-- BANDS ENHANCEMENTS
-- Add more fields to bands table
ALTER TABLE public.bands
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS formed_year INTEGER,
ADD COLUMN IF NOT EXISTS disbanded_year INTEGER,
ADD COLUMN IF NOT EXISTS genre TEXT,
ADD COLUMN IF NOT EXISTS social_media_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

COMMENT ON COLUMN public.bands.bio IS 'Short band bio/description';
COMMENT ON COLUMN public.bands.description IS 'Longer band history/description';
COMMENT ON COLUMN public.bands.formed_year IS 'Year band was formed';
COMMENT ON COLUMN public.bands.disbanded_year IS 'Year band disbanded (NULL if still active)';
COMMENT ON COLUMN public.bands.claimed_by IS 'User ID of person who claimed this band profile';
COMMENT ON COLUMN public.bands.image_url IS 'Band photo/logo URL';
COMMENT ON COLUMN public.bands.banner_url IS 'Band banner image URL';

-- Create updated_at trigger for bands
CREATE OR REPLACE FUNCTION update_bands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_bands_updated_at ON public.bands;
CREATE TRIGGER trigger_update_bands_updated_at
BEFORE UPDATE ON public.bands
FOR EACH ROW
EXECUTE FUNCTION update_bands_updated_at();

-- Bands RLS policies
DROP POLICY IF EXISTS "Public can read bands" ON public.bands;
CREATE POLICY "Public can read bands"
ON public.bands
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can update bands" ON public.bands;
CREATE POLICY "Admins can update bands"
ON public.bands
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
  OR claimed_by = auth.uid()
);

DROP POLICY IF EXISTS "Admins can delete bands" ON public.bands;
CREATE POLICY "Admins can delete bands"
ON public.bands
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can claim bands" ON public.bands;
CREATE POLICY "Users can claim bands"
ON public.bands
FOR UPDATE
TO authenticated
USING (claimed_by IS NULL OR claimed_by = auth.uid());

-- BAND MEMBERS - Add RLS policies for admin management
DROP POLICY IF EXISTS "Public can read band members" ON public.band_members;
CREATE POLICY "Public can read band members"
ON public.band_members
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can insert band members" ON public.band_members;
CREATE POLICY "Admins can insert band members"
ON public.band_members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.bands WHERE id = band_id AND claimed_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can update band members" ON public.band_members;
CREATE POLICY "Admins can update band members"
ON public.band_members
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.bands WHERE id = band_id AND claimed_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can delete band members" ON public.band_members;
CREATE POLICY "Admins can delete band members"
ON public.band_members
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.bands WHERE id = band_id AND claimed_by = auth.uid()
  )
);

-- Enable RLS on band_members if not already enabled
ALTER TABLE public.band_members ENABLE ROW LEVEL SECURITY;
