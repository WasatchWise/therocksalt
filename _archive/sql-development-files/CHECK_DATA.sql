-- Quick check to see if data is seeded
SELECT
  (SELECT COUNT(*) FROM public.bands) AS bands_count,
  (SELECT COUNT(*) FROM public.genres) AS genres_count,
  (SELECT COUNT(*) FROM public.venues) AS venues_count,
  (SELECT COUNT(*) FROM public.events) AS events_count;

-- If bands_count is 0, you need to run SEED_NO_CONFLICT.sql
-- If bands_count > 0, let's check a few bands
SELECT id, name, slug, featured, claimed_by
FROM public.bands
ORDER BY featured DESC, name ASC
LIMIT 10;
