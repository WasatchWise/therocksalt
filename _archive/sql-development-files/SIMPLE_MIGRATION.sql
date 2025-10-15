-- ============================================================================
-- SIMPLE MIGRATION: Artists to Bands
-- No trigger disabling - just works around RLS
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: CHECK CURRENT STATE
-- ============================================================================

SELECT '======================================' as info;
SELECT 'MIGRATION STARTING' as info;
SELECT '======================================' as info;

SELECT 'Artists count' as metric, COUNT(*) as count FROM artists;
SELECT 'Bands count (before)' as metric, COUNT(*) as count FROM bands;

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
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create band_genres junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS band_genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID REFERENCES bands(id) ON DELETE CASCADE NOT NULL,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'band_genres_band_id_genre_id_key'
    ) THEN
        ALTER TABLE band_genres ADD CONSTRAINT band_genres_band_id_genre_id_key UNIQUE (band_id, genre_id);
    END IF;
END $$;

-- ============================================================================
-- PART 3: ENSURE BANDS TABLE HAS ALL NEEDED COLUMNS
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'bio') THEN
        ALTER TABLE bands ADD COLUMN bio TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'hometown') THEN
        ALTER TABLE bands ADD COLUMN hometown TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'profile_views') THEN
        ALTER TABLE bands ADD COLUMN profile_views INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'last_active_at') THEN
        ALTER TABLE bands ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- ============================================================================
-- PART 4: TEMPORARILY DISABLE RLS (This is the key!)
-- ============================================================================

ALTER TABLE bands DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 5: MIGRATE ARTISTS TO BANDS
-- ============================================================================

SELECT '======================================' as info;
SELECT 'MIGRATING ARTISTS...' as info;
SELECT '======================================' as info;

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

SELECT 'Bands count (after)' as metric, COUNT(*) as count FROM bands;

-- ============================================================================
-- PART 6: MIGRATE SOCIAL LINKS
-- ============================================================================

SELECT '======================================' as info;
SELECT 'MIGRATING SOCIAL LINKS...' as info;
SELECT '======================================' as info;

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

SELECT 'Links migrated' as metric, COUNT(*) as count FROM band_links;

-- ============================================================================
-- PART 7: MIGRATE GENRES
-- ============================================================================

SELECT '======================================' as info;
SELECT 'MIGRATING GENRES...' as info;
SELECT '======================================' as info;

-- Create all unique genres (only if they don't already exist)
INSERT INTO genres (name)
SELECT DISTINCT
    TRIM(genre_name) as name
FROM artists,
    UNNEST(genre_tags) as genre_name
WHERE genre_tags IS NOT NULL
    AND genre_name IS NOT NULL
    AND TRIM(genre_name) != ''
    AND NOT EXISTS (
        SELECT 1 FROM genres g WHERE g.name = TRIM(genre_name)
    );

SELECT 'Genres created' as metric, COUNT(*) as count FROM genres;

-- Link bands to genres (only insert if not already exists)
INSERT INTO band_genres (band_id, genre_id)
SELECT DISTINCT
    a.id as band_id,
    g.id as genre_id
FROM artists a,
    UNNEST(a.genre_tags) as genre_name
JOIN genres g ON TRIM(g.name) = TRIM(genre_name)
WHERE a.genre_tags IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM band_genres bg
        WHERE bg.band_id = a.id AND bg.genre_id = g.id
    );

SELECT 'Genre connections' as metric, COUNT(*) as count FROM band_genres;

-- ============================================================================
-- PART 8: RE-ENABLE RLS
-- ============================================================================

ALTER TABLE bands ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 9: VERIFICATION
-- ============================================================================

SELECT '======================================' as info;
SELECT 'VERIFICATION RESULTS' as info;
SELECT '======================================' as info;

SELECT 'Total bands' as metric, COUNT(*) as count FROM bands;
SELECT 'Total links' as metric, COUNT(*) as count FROM band_links;
SELECT 'Total genres' as metric, COUNT(*) as count FROM genres;
SELECT 'Total connections' as metric, COUNT(*) as count FROM band_genres;

-- Sample migrated data
SELECT
    b.name,
    b.slug,
    b.hometown,
    COUNT(DISTINCT bl.id) as links,
    COUNT(DISTINCT bg.id) as genres
FROM bands b
LEFT JOIN band_links bl ON b.id = bl.band_id
LEFT JOIN band_genres bg ON b.id = bg.band_id
GROUP BY b.id, b.name, b.slug, b.hometown
ORDER BY b.name
LIMIT 10;

-- Genre distribution
SELECT
    g.name as genre,
    COUNT(bg.band_id) as bands
FROM genres g
LEFT JOIN band_genres bg ON g.id = bg.genre_id
GROUP BY g.id, g.name
ORDER BY bands DESC
LIMIT 15;

-- Link types
SELECT
    label,
    COUNT(*) as count
FROM band_links
GROUP BY label
ORDER BY count DESC;

SELECT '======================================' as info;
SELECT 'MIGRATION COMPLETE!' as info;
SELECT '======================================' as info;
