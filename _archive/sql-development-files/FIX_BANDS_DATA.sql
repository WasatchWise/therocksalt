-- Fix: Migrate bands from wrong table to correct bands table
-- Run this in Supabase SQL Editor

-- Step 1: Check what tables exist and where data is
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Step 2: Check if there's an 'artists' table
-- (Uncomment and run after checking table list)

-- SELECT COUNT(*) as artist_count FROM artists;
-- SELECT COUNT(*) as band_count FROM bands;

-- Step 3: If bands are in 'artists' table, migrate them
-- (Adjust column names based on what actually exists in your 'artists' table)

/*
INSERT INTO bands (
  id,
  name,
  slug,
  featured,
  bio,
  description,
  image_url,
  created_at,
  updated_at
)
SELECT
  id,
  name,
  -- Generate slug from name if it doesn't exist
  COALESCE(
    slug,
    lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
  ) as slug,
  COALESCE(featured, false) as featured,
  bio,
  description,
  image_url,
  COALESCE(created_at, NOW()) as created_at,
  COALESCE(updated_at, NOW()) as updated_at
FROM artists
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  featured = EXCLUDED.featured,
  bio = EXCLUDED.bio,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();
*/

-- Step 4: Migrate related data (links, genres, etc)
-- Only run if the above worked

/*
-- Migrate band_links (if they exist in artists_links or similar)
INSERT INTO band_links (id, band_id, label, url, created_at)
SELECT id, artist_id, label, url, created_at
FROM artists_links
ON CONFLICT (id) DO NOTHING;

-- Migrate band_genres (if they exist)
INSERT INTO band_genres (id, band_id, genre_id)
SELECT id, artist_id, genre_id
FROM artists_genres
ON CONFLICT (id) DO NOTHING;
*/

-- Step 5: Verify migration
-- SELECT COUNT(*) as total_bands FROM bands;
-- SELECT name, slug FROM bands LIMIT 10;

-- Step 6: Clean up (ONLY after verifying data is correct!)
-- DROP TABLE IF EXISTS artists CASCADE;
-- DROP TABLE IF EXISTS artists_links CASCADE;
-- DROP TABLE IF EXISTS artists_genres CASCADE;
