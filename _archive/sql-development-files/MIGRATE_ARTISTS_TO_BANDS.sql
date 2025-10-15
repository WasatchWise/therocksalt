-- MIGRATE ARTISTS TO BANDS
-- Step-by-step migration with verification

-- ============================================================================
-- STEP 1: CHECK CURRENT STATE
-- ============================================================================

-- See what's in each table
SELECT 'artists' as table_name, COUNT(*) as count FROM artists
UNION ALL
SELECT 'bands' as table_name, COUNT(*) as count FROM bands;

-- Check structure of artists table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'artists'
ORDER BY ordinal_position;

-- Sample data from artists
SELECT * FROM artists LIMIT 5;

-- ============================================================================
-- STEP 2: MIGRATE ARTISTS TO BANDS
-- ============================================================================

-- Insert all artists into bands table
-- Adjust column names based on what actually exists in your artists table
INSERT INTO bands (
  id,
  name,
  slug,
  featured,
  bio,
  description,
  image_url,
  claimed_by,
  claimed_at,
  custom_html,
  created_at,
  updated_at
)
SELECT
  id,
  name,
  -- Generate slug from name
  COALESCE(
    slug,
    lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
  ) as slug,
  COALESCE(featured, false) as featured,
  bio,
  description,
  image_url,
  NULL as claimed_by,  -- No one has claimed yet
  NULL as claimed_at,
  NULL as custom_html,
  COALESCE(created_at, NOW()) as created_at,
  COALESCE(updated_at, NOW()) as updated_at
FROM artists
WHERE id NOT IN (SELECT id FROM bands)  -- Only insert if not already in bands
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  featured = EXCLUDED.featured,
  bio = EXCLUDED.bio,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

-- ============================================================================
-- STEP 3: CHECK band_links - MIGRATE IF NEEDED
-- ============================================================================

-- Check if there are artist_links that need to be migrated
-- (Assuming band_links already uses band_id, but check)

-- See what's in band_links
SELECT COUNT(*) as band_links_count FROM band_links;
SELECT * FROM band_links LIMIT 5;

-- If you have an artists_links table, migrate it:
-- INSERT INTO band_links (id, band_id, label, url, created_at)
-- SELECT id, artist_id as band_id, label, url, created_at
-- FROM artists_links
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 4: CHECK band_genres - MIGRATE IF NEEDED
-- ============================================================================

-- See what's in band_genres
SELECT COUNT(*) as band_genres_count FROM band_genres;
SELECT * FROM band_genres LIMIT 5;

-- If you have an artists_genres table, migrate it:
-- INSERT INTO band_genres (id, band_id, genre_id)
-- SELECT id, artist_id as band_id, genre_id
-- FROM artists_genres
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 5: UPDATE RELATIONSHIPS (if needed)
-- ============================================================================

-- Update event_bands if they reference artist_id instead of band_id
-- (Check the column name first)
-- UPDATE event_bands SET band_id = artist_id WHERE band_id IS NULL;

-- Update any other tables that reference artists
-- Check: episode_tracks, show_lineups, music_submissions, etc.

-- ============================================================================
-- STEP 6: VERIFY MIGRATION
-- ============================================================================

-- Count records
SELECT 'Artists migrated' as status, COUNT(*) as count FROM bands;

-- Check for duplicate slugs (should be 0)
SELECT slug, COUNT(*) as count
FROM bands
GROUP BY slug
HAVING COUNT(*) > 1;

-- Sample the data
SELECT id, name, slug, featured, created_at
FROM bands
ORDER BY name
LIMIT 20;

-- ============================================================================
-- STEP 7: FIX SLUG UNIQUENESS (if duplicates found)
-- ============================================================================

-- If you have duplicate slugs, make them unique:
/*
UPDATE bands
SET slug = slug || '-' || SUBSTRING(id::text, 1, 8)
WHERE id IN (
  SELECT id FROM (
    SELECT id, slug,
           ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
    FROM bands
  ) t
  WHERE rn > 1
);
*/

-- ============================================================================
-- STEP 8: UPDATE band_links, band_genres to reference migrated bands
-- ============================================================================

-- Make sure band_links references the correct bands
-- If band_links has an artist_id column instead of band_id:
/*
ALTER TABLE band_links RENAME COLUMN artist_id TO band_id;
*/

-- Same for band_genres if needed:
/*
ALTER TABLE band_genres RENAME COLUMN artist_id TO band_id;
*/

-- ============================================================================
-- STEP 9: CLEAN UP (ONLY AFTER VERIFYING EVERYTHING WORKS!)
-- ============================================================================

-- DON'T RUN THIS YET! Only after you've verified the migration worked!

/*
-- Optional: Drop the artists table after confirming migration
-- CAREFUL! This is irreversible!

-- First, check if anything still references artists
SELECT
  tc.table_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND kcu.table_name = 'artists';

-- If nothing references it, you can drop it:
-- DROP TABLE IF EXISTS artists CASCADE;
*/

-- ============================================================================
-- FINAL VERIFICATION QUERIES
-- ============================================================================

-- Total bands
SELECT COUNT(*) as total_bands FROM bands;

-- Bands with slugs
SELECT COUNT(*) as bands_with_slugs FROM bands WHERE slug IS NOT NULL;

-- Bands with links
SELECT
  b.name,
  COUNT(bl.id) as link_count
FROM bands b
LEFT JOIN band_links bl ON b.id = bl.band_id
GROUP BY b.id, b.name
ORDER BY link_count DESC
LIMIT 10;

-- Bands with genres
SELECT
  b.name,
  COUNT(bg.id) as genre_count
FROM bands b
LEFT JOIN band_genres bg ON b.id = bg.band_id
GROUP BY b.id, b.name
ORDER BY genre_count DESC
LIMIT 10;

-- Sample of complete band data
SELECT
  b.name,
  b.slug,
  b.featured,
  COUNT(DISTINCT bl.id) as links,
  COUNT(DISTINCT bg.id) as genres
FROM bands b
LEFT JOIN band_links bl ON b.id = bl.band_id
LEFT JOIN band_genres bg ON b.id = bg.band_id
GROUP BY b.id, b.name, b.slug, b.featured
ORDER BY b.name
LIMIT 20;
