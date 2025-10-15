-- Import ONLY the 7 missing historic Utah music venues
-- Uses existing org_id: 4cadb578-b415-461f-8039-1fd02f68a030
-- Skips venues that already exist (9 venues including Kilby Court, Liquid Joe's, etc.)
-- Run this AFTER genres, BEFORE bands
-- SAFE TO RUN ONLY ONCE (no ON CONFLICT, will create duplicates if run twice)

INSERT INTO public.venues (org_id, slug, name, city, state, tier) VALUES
('4cadb578-b415-461f-8039-1fd02f68a030', 'speedway-cafe', 'The Speedway Café', 'Salt Lake City', 'UT', 'free'),
('4cadb578-b415-461f-8039-1fd02f68a030', 'the-roxy', 'The Roxy', 'Salt Lake City', 'UT', 'free'),
('4cadb578-b415-461f-8039-1fd02f68a030', 'club-dv8', 'Club DV8', 'Salt Lake City', 'UT', 'free'),
('4cadb578-b415-461f-8039-1fd02f68a030', 'the-word', 'The Word', 'Salt Lake City', 'UT', 'free'),
('4cadb578-b415-461f-8039-1fd02f68a030', 'zephyr-club', 'The Zephyr Club', 'Salt Lake City', 'UT', 'free'),
('4cadb578-b415-461f-8039-1fd02f68a030', 'in-the-venue', 'In The Venue / Bricks', 'Salt Lake City', 'UT', 'free'),
('4cadb578-b415-461f-8039-1fd02f68a030', 'black-lung-society', 'Black Lung Society', 'Salt Lake City', 'UT', 'free');

SELECT COUNT(*) as total_venues FROM public.venues;

-- Show the 7 newly added historic venues
SELECT name, city FROM public.venues
WHERE slug IN (
  'speedway-cafe', 'the-roxy', 'club-dv8', 'the-word', 'zephyr-club',
  'in-the-venue', 'black-lung-society'
)
ORDER BY name;
