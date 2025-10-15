-- ============================================================================
-- SAFE MIGRATION: Artists to Bands
-- This handles all edge cases and provides detailed feedback
-- ============================================================================

-- STEP 1: Verify current state
SELECT 'BEFORE MIGRATION' as phase;
SELECT 'Artists count' as metric, COUNT(*) as value FROM artists;
SELECT 'Bands count' as metric, COUNT(*) as value FROM bands;

-- STEP 2: Check bands table structure and ensure all needed columns exist
DO $$
BEGIN
    -- Ensure all columns from artists exist in bands
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'bio') THEN
        ALTER TABLE bands ADD COLUMN bio TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'description') THEN
        ALTER TABLE bands ADD COLUMN description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bands' AND column_name = 'image_url') THEN
        ALTER TABLE bands ADD COLUMN image_url TEXT;
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

-- STEP 3: Temporarily disable triggers and constraints if they exist
ALTER TABLE bands DISABLE TRIGGER ALL;

-- STEP 4: Insert artists into bands
INSERT INTO bands (
    id,
    name,
    slug,
    bio,
    hometown,
    image_url,
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
    NULL as image_url, -- Will add later
    COALESCE(profile_views, 0),
    last_active_at,
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW()),
    false -- All start as not featured
FROM artists
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    bio = EXCLUDED.bio,
    hometown = EXCLUDED.hometown,
    profile_views = EXCLUDED.profile_views,
    last_active_at = EXCLUDED.last_active_at,
    updated_at = NOW();

-- STEP 5: Re-enable triggers
ALTER TABLE bands ENABLE TRIGGER ALL;

-- STEP 6: Verify migration
SELECT 'AFTER MIGRATION' as phase;
SELECT 'Bands count' as metric, COUNT(*) as value FROM bands;

-- STEP 7: Show sample of migrated data
SELECT
    'Sample migrated bands' as info,
    id,
    name,
    slug,
    SUBSTRING(bio, 1, 50) as bio_preview
FROM bands
ORDER BY name
LIMIT 10;

-- STEP 8: Check for any artists that didn't migrate
SELECT 'Artists not in bands' as metric, COUNT(*) as value
FROM artists a
WHERE NOT EXISTS (SELECT 1 FROM bands b WHERE b.id = a.id);

-- STEP 9: List any artists that didn't migrate
SELECT
    'UNMIGRATED ARTISTS' as status,
    id,
    name,
    slug
FROM artists a
WHERE NOT EXISTS (SELECT 1 FROM bands b WHERE b.id = a.id);
