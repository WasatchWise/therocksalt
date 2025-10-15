-- Add tier system to bands and events

-- Add tier column to bands
ALTER TABLE public.bands
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'featured', 'hof'));

-- Add tier column to events (can override band tier)
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'featured', 'hof'));

-- Set Red Pete to Rock & Roll HOF tier
UPDATE public.bands
SET tier = 'hof'
WHERE name ILIKE '%red pete%';

-- Set Red Pete's event to HOF tier too
UPDATE public.events
SET tier = 'hof'
WHERE name ILIKE '%red pete%';

-- Show results
SELECT 'Bands' as type, name, tier FROM public.bands WHERE tier != 'free'
UNION ALL
SELECT 'Events', name, tier FROM public.events WHERE tier != 'free';
