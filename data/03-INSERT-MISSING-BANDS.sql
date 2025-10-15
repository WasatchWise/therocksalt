-- Insert bands that don't exist yet (with ON CONFLICT DO NOTHING for safety)
-- Run this AFTER genres and venues, BEFORE updates

INSERT INTO public.bands (slug, name, hometown, tier, description, bio) VALUES
('insight', 'Insight', 'Salt Lake City, UT', 'hof',
 'The first SLC band to fully embrace straight-edge hardcore movement.',
 'Active 1987-1990, Insight was the first SLC band to fully embrace the straight-edge hardcore movement. Built a dedicated local and national following in the hardcore scene. They espoused drug-free and progressive ideals, influencing countless SLC hardcore bands that followed. Their 1989 EP Standing Strong on Soulforce Records is a touchstone of SLC hardcore history.'),

('the-osmonds', 'The Osmonds', 'Ogden, UT', 'hof',
 'Utah''s original pop superstars with international fame in the 70s.',
 'Utah''s original pop superstars from Ogden, active since the 1960s. While not part of the underground scene, their international fame in the ''70s put Utah on the music industry''s radar. They paved the way for Utah''s entertainment industry and are cultural icons.'),

('swim-herschel-swim', 'Swim Herschel Swim', 'Salt Lake City, UT', 'hof',
 'Legendary SLC ska/punk band known for wild live shows.',
 'A legendary SLC ska/punk band active in the late ''80s/early ''90s. Known for wild live shows and helped establish Utah''s ska scene. One of the first Utah ska bands to tour regionally, they hold a fond place in local music history.'),

('talia-keys', 'Talia Keys', 'Salt Lake City, UT', 'headliner',
 'Prolific singer-songwriter and multi-instrumentalist known for high-energy funk/rock/soul.',
 'A prolific SLC singer-songwriter and multi-instrumentalist known for high-energy performances with her band (Talia Keys & The Love). Active since the 2010s, she''s a staple at Utah music festivals and a vocal activist. Has been featured on KRCL and opened for national acts, making her one of the prominent faces of the current local music scene.'),

('victims-willing', 'Victims Willing', 'Salt Lake City, UT', 'hof',
 'One of SLC''s longest-running punk bands, mainstay of ''80s hardcore.',
 'Formed in 1983, one of SLC''s longest-running punk bands. Mainstay of the ''80s hardcore scene, known for a crossover punk/metal sound and relentless DIY spirit. Played with punk legends (opening for Danzig and D.R.I.) and is revered as an OG band in SLC''s punk history.'),

('club-mungo', 'CLUB MUNGO', 'Salt Lake City, UT', 'garage',
 'Local hip-hop group, made first performance at Kilby Court in February 2023.', NULL),

('strawberry-cough', 'Strawberry Cough', 'Salt Lake City, UT', 'garage',
 'Local band that performed their first show at Kilby Court.', NULL),

('spitting-teeth', 'Spitting Teeth', 'Salt Lake City, UT', 'headliner',
 '1978 punk pioneers, hosted one of SLC''s first punk shows at University of Utah.', NULL),

('the-atheists', 'The Atheists', 'Salt Lake City, UT', 'featured',
 'Late 1970s punk band.', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Show newly inserted bands
SELECT COUNT(*) as total_bands FROM public.bands;
SELECT slug, name, tier FROM public.bands WHERE slug IN (
  'insight', 'the-osmonds', 'swim-herschel-swim', 'talia-keys', 'victims-willing',
  'club-mungo', 'strawberry-cough', 'spitting-teeth', 'the-atheists'
);
