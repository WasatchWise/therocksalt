-- ============================================================================
-- DIAGNOSE MIGRATION FAILURE
-- Run each section separately to identify the issue
-- ============================================================================

-- Section 1: Check bands table constraints
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'bands'::regclass
ORDER BY contype;

-- Section 2: Check for triggers on bands table
SELECT
    tgname AS trigger_name,
    tgtype,
    tgenabled,
    pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgrelid = 'bands'::regclass
  AND tgisinternal = false;

-- Section 3: Check bands table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'bands'
ORDER BY ordinal_position;

-- Section 4: Check artists table structure
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'artists'
ORDER BY ordinal_position;

-- Section 5: Test simple insert (should work)
INSERT INTO bands (name, slug, featured, created_at, updated_at)
VALUES ('Test Band', 'test-band', false, NOW(), NOW())
RETURNING id, name, slug;

-- Section 6: Check if test insert worked
SELECT COUNT(*) as bands_count FROM bands;

-- Section 7: Delete test record
DELETE FROM bands WHERE slug = 'test-band';

-- Section 8: Try inserting ONE artist with explicit columns
INSERT INTO bands (id, name, slug, bio, created_at, updated_at, featured)
SELECT
    id,
    name,
    slug,
    bio,
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW()),
    false
FROM artists
WHERE slug = 'red-bennies'
RETURNING id, name, slug;

-- Section 9: Check if single artist insert worked
SELECT * FROM bands WHERE slug = 'red-bennies';

-- Section 10: If single artist worked, check for duplicate IDs
SELECT COUNT(*) as duplicate_id_count
FROM artists a
WHERE EXISTS (
    SELECT 1 FROM bands b WHERE b.id = a.id
);

-- Section 11: Check org_id requirement (if it's a NOT NULL column in bands)
SELECT
    COUNT(*) as artists_without_org_id
FROM artists
WHERE org_id IS NULL;

-- Section 12: Sample artist data to verify it's good
SELECT id, name, slug, bio, created_at, updated_at, is_published
FROM artists
LIMIT 5;
