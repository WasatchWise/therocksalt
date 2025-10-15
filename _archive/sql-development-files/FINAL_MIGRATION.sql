-- ============================================================================
-- MIGRATE 214 ARTISTS TO BANDS TABLE
-- Preserves all social links and data
-- ============================================================================

-- Step 1: Insert all artists into bands table
INSERT INTO bands (
  id,
  name,
  slug,
  bio,
  created_at,
  updated_at,
  featured
)
SELECT
  id,
  name,
  slug,
  bio,
  COALESCE(created_at, NOW()),
  COALESCE(updated_at, NOW()),
  false -- Default all to not featured
FROM artists
WHERE is_published = true; -- Only migrate published artists

-- Step 2: Migrate social links to band_links table
-- Website
INSERT INTO band_links (band_id, label, url, created_at)
SELECT id, 'Website', website, NOW()
FROM artists
WHERE website IS NOT NULL AND website != '';

-- Instagram
INSERT INTO band_links (band_id, label, url, created_at)
SELECT id, 'Instagram', instagram, NOW()
FROM artists
WHERE instagram IS NOT NULL AND instagram != '';

-- Facebook
INSERT INTO band_links (band_id, label, url, created_at)
SELECT id, 'Facebook', facebook, NOW()
FROM artists
WHERE facebook IS NOT NULL AND facebook != '';

-- Twitter
INSERT INTO band_links (band_id, label, url, created_at)
SELECT id, 'Twitter', twitter, NOW()
FROM artists
WHERE twitter IS NOT NULL AND twitter != '';

-- Spotify
INSERT INTO band_links (band_id, label, url, created_at)
SELECT id, 'Spotify', spotify, NOW()
FROM artists
WHERE spotify IS NOT NULL AND spotify != '';

-- Bandcamp
INSERT INTO band_links (band_id, label, url, created_at)
SELECT id, 'Bandcamp', bandcamp, NOW()
FROM artists
WHERE bandcamp IS NOT NULL AND bandcamp != '';

-- SoundCloud
INSERT INTO band_links (band_id, label, url, created_at)
SELECT id, 'SoundCloud', soundcloud, NOW()
FROM artists
WHERE soundcloud IS NOT NULL AND soundcloud != '';

-- YouTube
INSERT INTO band_links (band_id, label, url, created_at)
SELECT id, 'YouTube', youtube, NOW()
FROM artists
WHERE youtube IS NOT NULL AND youtube != '';

-- Step 3: Migrate genre tags to band_genres
-- First, ensure genres exist in the genres table
INSERT INTO genres (name)
SELECT DISTINCT UNNEST(genre_tags) as genre_name
FROM artists
WHERE genre_tags IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Then link bands to genres
INSERT INTO band_genres (band_id, genre_id)
SELECT DISTINCT
  a.id as band_id,
  g.id as genre_id
FROM artists a
CROSS JOIN UNNEST(a.genre_tags) as genre_name
JOIN genres g ON g.name = genre_name
WHERE a.genre_tags IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Count migrated bands
SELECT 'Total bands migrated' as status, COUNT(*) as count FROM bands;

-- Count links migrated
SELECT 'Total links migrated' as status, COUNT(*) as count FROM band_links;

-- Count genre connections
SELECT 'Total genre connections' as status, COUNT(*) as count FROM band_genres;

-- Count unique genres
SELECT 'Unique genres' as status, COUNT(*) as count FROM genres;

-- Sample of migrated data
SELECT
  b.name,
  b.slug,
  b.bio,
  COUNT(DISTINCT bl.id) as link_count,
  COUNT(DISTINCT bg.id) as genre_count
FROM bands b
LEFT JOIN band_links bl ON b.id = bl.band_id
LEFT JOIN band_genres bg ON b.id = bg.band_id
GROUP BY b.id, b.name, b.slug, b.bio
ORDER BY b.name
LIMIT 10;

-- Check for any missing slugs (should be 0)
SELECT COUNT(*) as bands_without_slugs
FROM bands
WHERE slug IS NULL OR slug = '';

-- List all genres found
SELECT g.name, COUNT(bg.band_id) as band_count
FROM genres g
LEFT JOIN band_genres bg ON g.id = bg.id
GROUP BY g.id, g.name
ORDER BY band_count DESC;

-- Sample complete band with all links and genres
SELECT
  b.name,
  b.slug,
  json_agg(DISTINCT jsonb_build_object('label', bl.label, 'url', bl.url)) FILTER (WHERE bl.id IS NOT NULL) as links,
  array_agg(DISTINCT g.name) FILTER (WHERE g.id IS NOT NULL) as genres
FROM bands b
LEFT JOIN band_links bl ON b.id = bl.band_id
LEFT JOIN band_genres bg ON b.id = bg.band_id
LEFT JOIN genres g ON bg.genre_id = g.id
GROUP BY b.id, b.name, b.slug
LIMIT 5;
