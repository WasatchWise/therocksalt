-- Correct Red Pete's tier from HOF to Featured
-- Red Pete are headliners, but don't have enough content for HOF tier yet

-- Update bands table
UPDATE public.bands
SET tier = 'featured'
WHERE name ILIKE '%red pete%';

-- Update events table
UPDATE public.events
SET tier = 'featured'
WHERE name ILIKE '%red pete%';

-- Verify the changes
SELECT '=== RED PETE BANDS ===' as status;
SELECT id, name, tier FROM public.bands WHERE name ILIKE '%red pete%';

SELECT '=== RED PETE EVENTS ===' as status;
SELECT id, name, tier, start_time FROM public.events WHERE name ILIKE '%red pete%';

-- Show tier distribution
SELECT '=== TIER DISTRIBUTION ===' as status;
SELECT tier, COUNT(*) as count FROM public.bands GROUP BY tier ORDER BY
  CASE tier
    WHEN 'hof' THEN 1
    WHEN 'featured' THEN 2
    WHEN 'free' THEN 3
    ELSE 4
  END;
