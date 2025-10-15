-- ========================================
-- VERIFICATION QUERY
-- Run this after completing all imports
-- ========================================

-- Overall counts
SELECT 'TOTAL COUNTS:' as section;
SELECT
  'Bands' as table_name,
  COUNT(*) as count
FROM public.bands
UNION ALL
SELECT 'Genres', COUNT(*) FROM public.genres
UNION ALL
SELECT 'Venues', COUNT(*) FROM public.venues;

-- Bands by tier
SELECT 'BANDS BY TIER:' as section;
SELECT
  tier,
  COUNT(*) as count
FROM public.bands
GROUP BY tier
ORDER BY
  CASE tier
    WHEN 'hof' THEN 1
    WHEN 'platinum' THEN 2
    WHEN 'national_act' THEN 3
    WHEN 'headliner' THEN 4
    WHEN 'featured' THEN 5
    WHEN 'garage' THEN 6
    WHEN 'free' THEN 7
    ELSE 8
  END;

-- Show the enhanced bands (non-free tier)
SELECT 'ENHANCED BANDS:' as section;
SELECT
  name,
  tier,
  hometown,
  CASE
    WHEN description IS NOT NULL THEN '✓ Has description'
    ELSE '✗ No description'
  END as description_status,
  CASE
    WHEN bio IS NOT NULL THEN '✓ Has bio'
    ELSE '✗ No bio'
  END as bio_status
FROM public.bands
WHERE tier != 'free'
ORDER BY
  CASE tier
    WHEN 'hof' THEN 1
    WHEN 'platinum' THEN 2
    WHEN 'national_act' THEN 3
    WHEN 'headliner' THEN 4
    WHEN 'featured' THEN 5
    WHEN 'garage' THEN 6
  END,
  name;

-- Hall of Fame bands specifically
SELECT 'HALL OF FAME BANDS:' as section;
SELECT name, hometown FROM public.bands
WHERE tier = 'hof'
ORDER BY name;

-- Check for missing key bands
SELECT 'CHECKING FOR KEY BANDS:' as section;
SELECT
  slug,
  CASE
    WHEN slug IN ('chelsea-grin', 'neon-trees', 'the-used', 'iceburn',
                  'the-backseat-lovers', 'idkhow', 'imagine-dragons',
                  'insight', 'victims-willing', 'the-osmonds', 'swim-herschel-swim')
    THEN '✓ Found'
    ELSE '? Unknown'
  END as status
FROM public.bands
WHERE slug IN (
  'chelsea-grin', 'neon-trees', 'the-used', 'iceburn',
  'the-backseat-lovers', 'idkhow', 'imagine-dragons',
  'insight', 'victims-willing', 'the-osmonds', 'swim-herschel-swim'
);
