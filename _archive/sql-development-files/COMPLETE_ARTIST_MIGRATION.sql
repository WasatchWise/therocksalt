-- ============================================================================
-- COMPLETE ARTIST MIGRATION
-- Migrates 214 artists from artists table to bands table
-- Preserves all social links and genre data
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: PREPARATION & DIAGNOSTICS
-- ============================================================================

SELECT '========================================' as info;
SELECT 'STARTING MIGRATION' as info;
SELECT '========================================' as info;

-- Current state
SELECT 'Source: Artists' as metric, COUNT(*) as count FROM artists;
SELECT 'Target: Bands' as metric, COUNT(*) as count FROM bands;

-- Temporarily disable protections for migration
ALTER TABLE bands DISABLE ROW LEVEL SECURITY;
ALTER TABLE bands DISABLE TRIGGER ALL;

-- ============================================================================
-- PART 2: ENSURE TABLES EXIST
-- ============================================================================

-- Create band_links table if it doesn't exist
CREATE TABLE IF NOT EXISTS band_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID REFERENCES bands(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create genres table if it doesn't exist
CREATE TABLE IF NOT EXISTS genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create band_genres junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS band_genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID REFERENCES bands(id) ON DELETE CASCADE NOT NULL,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(band_id, genre_id)
);

-- ============================================================================
-- PART 3: ENSURE BANDS TABLE HAS ALL NEEDED COLUMNS
-- ============================================================================

DO $$
BEGIN
    -- Add bio if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'bio') THEN
        ALTER TABLE bands ADD COLUMN bio TEXT;
    END IF;

    -- Add hometown if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'hometown') THEN
        ALTER TABLE bands ADD COLUMN hometown TEXT;
    END IF;

    -- Add profile_views if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'profile_views') THEN
        ALTER TABLE bands ADD COLUMN profile_views INT DEFAULT 0;
    END IF;

    -- Add last_active_at if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'last_active_at') THEN
        ALTER TABLE bands ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- ============================================================================
-- PART 4: MIGRATE ARTISTS TO BANDS
-- ============================================================================

SELECT '========================================' as info;
SELECT 'MIGRATING ARTISTS TO BANDS' as info;
SELECT '========================================' as info;

INSERT INTO bands (
    id,
    name,
    slug,
    bio,
    hometown,
    profile_views,
    last_active_at,
    created_at,
    updated_at,
    featured
)
SELECT
    id,
    name,
    slug,
    bio,
    hometown,
    COALESCE(profile_views, 0),
    last_active_at,
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW()),
    false
FROM artists
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    bio = EXCLUDED.bio,
    hometown = EXCLUDED.hometown,
    profile_views = EXCLUDED.profile_views,
    last_active_at = EXCLUDED.last_active_at,
    updated_at = NOW();

-- Verify
SELECT 'Bands after migration' as metric, COUNT(*) as count FROM bands;

-- ============================================================================
-- PART 5: MIGRATE SOCIAL LINKS TO BAND_LINKS
-- ============================================================================

SELECT '========================================' as info;
SELECT 'MIGRATING SOCIAL LINKS' as info;
SELECT '========================================' as info;

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

-- Verify
SELECT 'Social links migrated' as metric, COUNT(*) as count FROM band_links;

-- ============================================================================
-- PART 6: MIGRATE GENRE TAGS TO BAND_GENRES
-- ============================================================================

SELECT '========================================' as info;
SELECT 'MIGRATING GENRES' as info;
SELECT '========================================' as info;

-- First, create all unique genres from genre_tags arrays
INSERT INTO genres (name, slug)
SELECT DISTINCT
    TRIM(genre_name) as name,
    lower(regexp_replace(regexp_replace(TRIM(genre_name), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) as slug
FROM artists,
    UNNEST(genre_tags) as genre_name
WHERE genre_tags IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Verify genres created
SELECT 'Unique genres created' as metric, COUNT(*) as count FROM genres;

-- Then link bands to their genres
INSERT INTO band_genres (band_id, genre_id)
SELECT DISTINCT
    a.id as band_id,
    g.id as genre_id
FROM artists a,
    UNNEST(a.genre_tags) as genre_name
JOIN genres g ON TRIM(g.name) = TRIM(genre_name)
WHERE a.genre_tags IS NOT NULL
ON CONFLICT (band_id, genre_id) DO NOTHING;

-- Verify connections
SELECT 'Band-genre connections' as metric, COUNT(*) as count FROM band_genres;

-- ============================================================================
-- PART 7: RE-ENABLE PROTECTIONS
-- ============================================================================

ALTER TABLE bands ENABLE TRIGGER ALL;
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 8: COMPREHENSIVE VERIFICATION
-- ============================================================================

SELECT '========================================' as info;
SELECT 'MIGRATION VERIFICATION' as info;
SELECT '========================================' as info;

-- Count summary
SELECT 'Total bands migrated' as status, COUNT(*) as count FROM bands;
SELECT 'Total links migrated' as status, COUNT(*) as count FROM band_links;
SELECT 'Total genres created' as status, COUNT(*) as count FROM genres;
SELECT 'Total genre connections' as status, COUNT(*) as count FROM band_genres;

-- Sample of complete band data with links and genres
SELECT
    b.name,
    b.slug,
    b.hometown,
    COUNT(DISTINCT bl.id) as link_count,
    COUNT(DISTINCT bg.id) as genre_count
FROM bands b
LEFT JOIN band_links bl ON b.id = bl.band_id
LEFT JOIN band_genres bg ON b.id = bg.band_id
GROUP BY b.id, b.name, b.slug, b.hometown
ORDER BY b.name
LIMIT 10;

-- Check for any missing slugs (should be 0)
SELECT 'Bands without slugs' as metric, COUNT(*) as count
FROM bands
WHERE slug IS NULL OR slug = '';

-- Show genre distribution
SELECT
    g.name as genre,
    COUNT(bg.band_id) as band_count
FROM genres g
LEFT JOIN band_genres bg ON g.id = bg.genre_id
GROUP BY g.id, g.name
ORDER BY band_count DESC
LIMIT 20;

-- Show link type distribution
SELECT
    label as link_type,
    COUNT(*) as count
FROM band_links
GROUP BY label
ORDER BY count DESC;

-- Sample complete band with all details
SELECT
    b.name,
    b.slug,
    b.hometown,
    json_agg(DISTINCT jsonb_build_object('label', bl.label, 'url', bl.url)) FILTER (WHERE bl.id IS NOT NULL) as links,
    array_agg(DISTINCT g.name) FILTER (WHERE g.id IS NOT NULL) as genres
FROM bands b
LEFT JOIN band_links bl ON b.id = bl.band_id
LEFT JOIN band_genres bg ON b.id = bg.band_id
LEFT JOIN genres g ON bg.genre_id = g.id
GROUP BY b.id, b.name, b.slug, b.hometown
LIMIT 5;

SELECT '========================================' as info;
SELECT 'MIGRATION COMPLETE!' as info;
SELECT '========================================' as info;
