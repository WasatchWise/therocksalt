-- ============================================================================
-- ULTIMATE MIGRATION: Artists to Bands
-- Handles RLS, triggers, constraints, and provides detailed diagnostics
-- ============================================================================

-- IMPORTANT: Run this in Supabase SQL Editor
-- The SQL Editor runs with elevated privileges and bypasses RLS

-- ============================================================================
-- DIAGNOSTICS FIRST
-- ============================================================================

-- Check current state
SELECT 'CURRENT STATE' as section, '---' as detail;
SELECT 'Artists' as table_name, COUNT(*) as count FROM artists;
SELECT 'Bands' as table_name, COUNT(*) as count FROM bands;

-- Check RLS status on bands table
SELECT
    'RLS STATUS' as section,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('bands', 'artists');

-- Check existing policies on bands table
SELECT
    'POLICIES ON BANDS' as section,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'bands';

-- ============================================================================
-- PREPARATION
-- ============================================================================

-- Temporarily disable RLS for this migration
-- (will re-enable at the end)
ALTER TABLE bands DISABLE ROW LEVEL SECURITY;

-- Disable triggers
ALTER TABLE bands DISABLE TRIGGER ALL;

-- ============================================================================
-- ENSURE BANDS TABLE HAS ALL NEEDED COLUMNS
-- ============================================================================

-- Add columns that exist in artists but not in bands
DO $$
BEGIN
    -- Bio
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'bands' AND column_name = 'bio'
    ) THEN
        ALTER TABLE bands ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio column';
    END IF;

    -- Hometown
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'bands' AND column_name = 'hometown'
    ) THEN
        ALTER TABLE bands ADD COLUMN hometown TEXT;
        RAISE NOTICE 'Added hometown column';
    END IF;

    -- Profile views
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'bands' AND column_name = 'profile_views'
    ) THEN
        ALTER TABLE bands ADD COLUMN profile_views INT DEFAULT 0;
        RAISE NOTICE 'Added profile_views column';
    END IF;

    -- Last active
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'bands' AND column_name = 'last_active_at'
    ) THEN
        ALTER TABLE bands ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added last_active_at column';
    END IF;
END $$;

-- ============================================================================
-- MIGRATION
-- ============================================================================

-- Insert all artists into bands
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
    COALESCE(profile_views, 0) as profile_views,
    last_active_at,
    COALESCE(created_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at,
    false as featured
FROM artists
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    bio = EXCLUDED.bio,
    hometown = EXCLUDED.hometown,
    profile_views = EXCLUDED.profile_views,
    last_active_at = EXCLUDED.last_active_at,
    updated_at = NOW();

-- ============================================================================
-- RE-ENABLE PROTECTIONS
-- ============================================================================

-- Re-enable triggers
ALTER TABLE bands ENABLE TRIGGER ALL;

-- Re-enable RLS
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'MIGRATION COMPLETE' as section, '---' as detail;

-- Count results
SELECT 'Bands after migration' as metric, COUNT(*) as count FROM bands;

-- Show sample
SELECT
    'Sample migrated bands' as section,
    name,
    slug,
    hometown,
    CASE WHEN bio IS NOT NULL THEN 'Yes' ELSE 'No' END as has_bio,
    created_at
FROM bands
ORDER BY name
LIMIT 10;

-- Check for unmigrated artists
SELECT
    'Unmigrated artists' as section,
    COUNT(*) as count
FROM artists a
WHERE NOT EXISTS (SELECT 1 FROM bands b WHERE b.id = a.id);

-- If any weren't migrated, list them
SELECT
    'Artists that failed to migrate' as section,
    id,
    name,
    slug
FROM artists a
WHERE NOT EXISTS (SELECT 1 FROM bands b WHERE b.id = a.id)
LIMIT 10;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
DECLARE
    band_count INT;
BEGIN
    SELECT COUNT(*) INTO band_count FROM bands;
    RAISE NOTICE '✓ Migration complete! % bands now in database', band_count;
END $$;
