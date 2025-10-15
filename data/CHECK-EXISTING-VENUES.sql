-- Check if any venues already exist and what org_id they use
SELECT id, org_id, name, slug, city, tier
FROM public.venues
ORDER BY name
LIMIT 20;

-- Count total venues
SELECT COUNT(*) as total_venues FROM public.venues;
