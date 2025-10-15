-- ========================================
-- MINIMAL IMPORT - Just bands and genres
-- Uses only the most basic columns
-- ========================================

-- Import Genres
INSERT INTO public.genres (name) VALUES
('Deathcore'), ('Metal'), ('Hardcore'), ('Metalcore'), ('Doom Metal'),
('Experimental'), ('Indie Rock'), ('Post-Hardcore'), ('Math Rock'), ('Jazz-Core'),
('Pop'), ('Rock'), ('Alternative'), ('Hardcore Punk'), ('Straight Edge'),
('Indie Pop'), ('Folk Pop'), ('New Wave'), ('Pop Rock'), ('Garage Rock'),
('Hard Rock'), ('Ska'), ('Punk'), ('Funk'), ('Soul'), ('Emo'),
('Power Pop'), ('Grindcore'), ('Hip-Hop');

-- Import Bands (minimal columns only)
INSERT INTO public.bands (slug, name, description) VALUES
('chelsea-grin', 'Chelsea Grin', 'Deathcore metal band signed to major labels, one of Utah''s most globally recognized metal acts.'),
('cult-leader', 'Cult Leader', 'Hardcore/metal band spawned from the ashes of Gaza, signed to Deathwish Inc.'),
('eagle-twin', 'Eagle Twin', 'Two-piece experimental doom/blues metal band on Southern Lord Records.'),
('fictionist', 'Fictionist', 'Provo-based indie rock band that nearly signed with Atlantic Records.'),
('form-of-rocket', 'Form of Rocket', 'Post-hardcore/math rock band, a local favorite noted for high-energy sound.'),
('iceburn', 'Iceburn', 'Pioneering jazz-core/post-hardcore band signed to Revelation Records.'),
('imagine-dragons', 'Imagine Dragons', 'Multi-platinum pop/rock band with Utah roots.'),
('insight', 'Insight', 'The first SLC band to fully embrace straight-edge hardcore movement.'),
('idkhow', 'I Don''t Know How But They Found Me', 'Indie pop/alt rock duo featuring Dallon Weekes and Ryan Seaman.'),
('the-national-parks', 'The National Parks', 'Indie folk band beloved statewide with dedicated national fanbase.'),
('neon-trees', 'Neon Trees', 'New wave/pop rock band with platinum hits in the early 2010s.'),
('the-osmonds', 'The Osmonds', 'Utah''s original pop superstars with international fame in the 70s.'),
('red-bennies', 'Red Bennies', 'Long-running SLC garage/alternative rock band led by David Payne.'),
('royal-bliss', 'Royal Bliss', 'Hard rock band known for DIY ethos, played 1000+ shows.'),
('subrosa', 'SubRosa', 'Experimental doom metal band with electric violins, internationally acclaimed.'),
('swim-herschel-swim', 'Swim Herschel Swim', 'Legendary SLC ska/punk band known for wild live shows.'),
('talia-keys', 'Talia Keys', 'Prolific singer-songwriter known for high-energy funk/rock/soul.'),
('the-used', 'The Used', 'Emo/post-hardcore band with platinum debut in 2002.'),
('victims-willing', 'Victims Willing', 'One of SLC''s longest-running punk bands, mainstay of 80s hardcore.'),
('clear', 'Clear', 'Nationally significant straight-edge hardcore band.'),
('the-brobecks', 'The Brobecks', 'Indie rock band fronted by Dallon Weekes, precursor to IDKHOW.'),
('gaza', 'Gaza', 'Mathcore/grindcore band known for extreme sounds.'),
('the-backseat-lovers', 'The Backseat Lovers', 'Indie rock band with viral hit Kilby Girl, signed to Capitol Records.'),
('club-mungo', 'CLUB MUNGO', 'Local hip-hop group.'),
('strawberry-cough', 'Strawberry Cough', 'Local band.'),
('worlds-worst', 'Worlds Worst', 'Punk group with national buzz.'),
('fancy-ladz', 'Fancy Ladz', 'Popular local punk band.'),
('american-humor', 'American Humor', 'Favorite local punk band.'),
('spitting-teeth', 'Spitting Teeth', '1978 punk pioneers.'),
('the-atheists', 'The Atheists', 'Late 1970s punk band.');

-- Import Venues (minimal)
INSERT INTO public.venues (slug, name) VALUES
('speedway-cafe', 'The Speedway Café'),
('kilby-court', 'Kilby Court'),
('urban-lounge', 'Urban Lounge'),
('the-depot', 'The Depot'),
('metro-music-hall', 'Metro Music Hall'),
('the-complex', 'The Complex'),
('the-state-room', 'The State Room'),
('soundwell', 'Soundwell'),
('liquid-joes', 'Liquid Joe''s'),
('the-roxy', 'The Roxy'),
('club-dv8', 'Club DV8'),
('the-word', 'The Word'),
('zephyr-club', 'The Zephyr Club'),
('in-the-venue', 'In The Venue / Bricks'),
('velour', 'Velour Live Music Gallery'),
('black-lung-society', 'Black Lung Society');
