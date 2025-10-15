-- Check what data we have for bands
SELECT 
  id,
  name,
  slug,
  bio,
  description,
  hometown,
  featured,
  image_url
FROM bands
WHERE name ILIKE '%royal%bliss%'
ORDER BY name
LIMIT 5;

-- Get a sample of bands with their links
SELECT 
  b.name,
  b.slug,
  COUNT(bl.id) as link_count,
  STRING_AGG(bl.label, ', ') as link_labels
FROM bands b
LEFT JOIN band_links bl ON b.id = bl.band_id
GROUP BY b.id, b.name, b.slug
HAVING COUNT(bl.id) > 0
ORDER BY b.name
LIMIT 10;
