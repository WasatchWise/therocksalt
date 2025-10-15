-- Check what's already in your database

SELECT 'BANDS:' as table_name, COUNT(*) as count FROM public.bands
UNION ALL
SELECT 'GENRES:', COUNT(*) FROM public.genres
UNION ALL
SELECT 'VENUES:', COUNT(*) FROM public.venues;

-- Show which bands are already there
SELECT 'Existing bands:' as info;
SELECT slug, name, tier FROM public.bands ORDER BY name;
