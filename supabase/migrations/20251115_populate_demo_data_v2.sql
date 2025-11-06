-- Populate Demo Data for Rock Salt (Adapted to existing schema)
-- Created: 2025-11-15
-- Creates Manlyman HOF band only (venues exist in different structure)

-- Create or update Manlyman as Hall of Fame tier demo band
INSERT INTO public.bands (
  id,
  name,
  slug,
  tier,
  salt_rocks_balance,
  bio,
  hometown,
  created_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- Fixed UUID for demo purposes
  'Manlyman',
  'manlyman',
  'hof',
  1000, -- Give them 1000 demo Salt Rocks
  'Legendary rock band from Salt Lake City. Hall of Fame tier showcase.',
  'Salt Lake City, UT',
  now()
)
ON CONFLICT (slug) DO UPDATE
SET
  tier = 'hof',
  salt_rocks_balance = GREATEST(bands.salt_rocks_balance, 1000),
  bio = COALESCE(bands.bio, 'Legendary rock band from Salt Lake City. Hall of Fame tier showcase.'),
  hometown = COALESCE(bands.hometown, 'Salt Lake City, UT');

-- Add a genre for Manlyman (if genres table exists and band doesn't have one)
DO $$
DECLARE
  v_rock_genre_id uuid;
  v_manlyman_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Get or create Rock genre
  SELECT id INTO v_rock_genre_id FROM public.genres WHERE name = 'Rock' LIMIT 1;

  IF v_rock_genre_id IS NOT NULL THEN
    -- Add genre to Manlyman if not already there
    INSERT INTO public.band_genres (band_id, genre_id)
    VALUES (v_manlyman_id, v_rock_genre_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

COMMENT ON TABLE public.bands IS 'Bands and artists in the Rock Salt music scene';
