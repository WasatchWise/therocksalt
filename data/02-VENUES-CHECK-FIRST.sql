-- Check which historic venues already exist before importing
SELECT slug, name, city FROM public.venues
WHERE slug IN (
  'speedway-cafe', 'kilby-court', 'urban-lounge', 'the-depot', 'metro-music-hall',
  'the-complex', 'the-state-room', 'soundwell', 'liquid-joes', 'the-roxy',
  'club-dv8', 'the-word', 'zephyr-club', 'in-the-venue', 'velour', 'black-lung-society'
)
ORDER BY name;

-- Count matches
SELECT COUNT(*) as existing_historic_venues FROM public.venues
WHERE slug IN (
  'speedway-cafe', 'kilby-court', 'urban-lounge', 'the-depot', 'metro-music-hall',
  'the-complex', 'the-state-room', 'soundwell', 'liquid-joes', 'the-roxy',
  'club-dv8', 'the-word', 'zephyr-club', 'in-the-venue', 'velour', 'black-lung-society'
);
