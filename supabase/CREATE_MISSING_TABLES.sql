-- ============================================================
-- CREATE MISSING TABLES - Create musicians and band_members tables
-- ============================================================

-- Create musicians table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.musicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  bio TEXT,
  instrument TEXT,
  origin_city TEXT,
  state TEXT,
  image_url TEXT,
  social_media_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create band_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.band_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,
  musician_id UUID REFERENCES public.musicians(id) ON DELETE SET NULL,
  instrument TEXT,
  role TEXT,
  tenure_start INTEGER,
  tenure_end INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.musicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_members ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_band_members_band_id ON public.band_members(band_id);
CREATE INDEX IF NOT EXISTS idx_band_members_musician_id ON public.band_members(musician_id);
CREATE INDEX IF NOT EXISTS idx_musicians_slug ON public.musicians(slug);

-- Public read access
DROP POLICY IF EXISTS "Public can read musicians" ON public.musicians;
CREATE POLICY "Public can read musicians"
ON public.musicians
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Public can read band members" ON public.band_members;
CREATE POLICY "Public can read band members"
ON public.band_members
FOR SELECT
TO public
USING (true);
