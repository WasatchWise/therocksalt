-- Step 1: Delete the 3 fabricated events
DELETE FROM public.events 
WHERE id IN (
  '6fc21363-bd6a-47bd-b298-bc1c2e596e88',  -- Red Pete with Just Hold Still
  '61b5115a-271d-4e54-a86a-09108ac778e7',  -- Winter Showcase 2025
  'b6f67d6b-bded-44af-9313-349f11f0ef48'   -- Math Rock Marathon
);

DELETE FROM public.event_submissions 
WHERE id IN (
  '6fc21363-bd6a-47bd-b298-bc1c2e596e88',
  '61b5115a-271d-4e54-a86a-09108ac778e7',
  'b6f67d6b-bded-44af-9313-349f11f0ef48'
);

-- Step 2: Add tier columns to bands and events
ALTER TABLE public.bands
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'featured', 'hof'));

ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'featured', 'hof'));

-- Step 3: Set Red Pete to Rock & Roll HOF tier
UPDATE public.bands
SET tier = 'hof'
WHERE name ILIKE '%red pete%';

UPDATE public.events
SET tier = 'hof'
WHERE name ILIKE '%red pete%';

-- Show results
SELECT '=== REMAINING EVENTS ===' as status;
SELECT id, name, tier, start_time FROM public.events ORDER BY created_at;

SELECT '=== HOF TIER BANDS ===' as status;
SELECT name, tier FROM public.bands WHERE tier = 'hof';
