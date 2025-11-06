-- Add tier system to venues table

-- Step 1: Add tier column (all venues start as 'free')
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'featured', 'hof'));

-- Step 2: Show results
SELECT '=== VENUE TIER DISTRIBUTION ===' as status;
SELECT tier, COUNT(*) as count
FROM public.venues
GROUP BY tier
ORDER BY
  CASE tier
    WHEN 'hof' THEN 1
    WHEN 'featured' THEN 2
    WHEN 'free' THEN 3
    ELSE 4
  END;

SELECT '=== ALL VENUES WITH TIERS ===' as status;
SELECT id, name, tier, city, capacity
FROM public.venues
ORDER BY
  CASE tier
    WHEN 'hof' THEN 1
    WHEN 'featured' THEN 2
    WHEN 'free' THEN 3
    ELSE 4
  END,
  name;
