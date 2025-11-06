-- Populate Utah Bands with Real Information
-- This migration adds comprehensive data for verified Utah bands

-- First, ensure we have all the necessary genres (insert only if they don't exist)
INSERT INTO public.genres (name)
SELECT genre_name FROM (VALUES
  ('Hard Rock'),
  ('Emo'),
  ('Post-Hardcore'),
  ('Screamo'),
  ('Deathcore'),
  ('Extreme Metal'),
  ('Jazzcore'),
  ('Progressive Metal'),
  ('Experimental'),
  ('Avant-Garde Jazz'),
  ('Hardcore'),
  ('Americana'),
  ('Singer-Songwriter'),
  ('Soul')
) AS new_genres(genre_name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.genres WHERE name = genre_name
);

-- Remove duplicate Royal Bliss entries (keep the one with more data)
DELETE FROM public.bands
WHERE name = 'Royal Bliss'
AND id NOT IN (
  SELECT id FROM public.bands
  WHERE name = 'Royal Bliss'
  ORDER BY created_at DESC
  LIMIT 1
);

-- Insert/Update Royal Bliss
INSERT INTO public.bands (name, slug, bio, hometown, featured, description)
VALUES (
  'Royal Bliss',
  'royal-bliss',
  'Royal Bliss is a hard rock band formed in 1997 that has become one of Utah''s most successful rock acts. Known for blending classic rock with modern rock elements, they''ve achieved national success while maintaining their Salt Lake City roots.',
  'Salt Lake City, UT',
  true,
  'Hit #1 on Billboard Heatseekers, charted on Billboard Top 200 twice, 10 singles broke top 50 on Active Rock radio. The band has accumulated over 100 million streams on Spotify and signed with Capitol Records in 2007, celebrating 25+ years as a band.'
)
ON CONFLICT (slug) DO UPDATE SET
  bio = EXCLUDED.bio,
  hometown = EXCLUDED.hometown,
  featured = EXCLUDED.featured,
  description = EXCLUDED.description;

-- Insert/Update Fictionist
INSERT INTO public.bands (name, slug, bio, hometown, featured, description)
VALUES (
  'Fictionist',
  'fictionist',
  'Fictionist is an alternative rock band formed in 2007, known for their layered indie rock sound and powerful live performances. After signing with Atlantic Records in 2011 and later parting ways, they independently released critically acclaimed albums and became a staple of Utah''s indie scene.',
  'Provo, UT',
  true,
  'Won City Weekly "Best Band In Utah" 2015, Independent Music Award for Best Pop/Rock Song. Rolling Stone "Do You Wanna Be A Rock ''n Roll Star?" contest finalist. Released album REPEATER in March 2025.'
)
ON CONFLICT (slug) DO UPDATE SET
  bio = EXCLUDED.bio,
  hometown = EXCLUDED.hometown,
  featured = EXCLUDED.featured,
  description = EXCLUDED.description;

-- Insert/Update The Used
INSERT INTO public.bands (name, slug, bio, hometown, featured, description)
VALUES (
  'The Used',
  'the-used',
  'The Used is a post-hardcore/emo band formed in 2000 that became one of the most successful rock acts to emerge from Utah. Led by vocalist Bert McCracken, the band achieved mainstream success in the early 2000s emo scene with their emotionally charged sound and raw intensity.',
  'Orem, UT',
  true,
  'Self-titled debut album certified platinum by RIAA. "In Love and Death" (2004) debuted at #6 on Billboard 200 and certified platinum. Gold and platinum certifications in 6+ countries. Alternative Press called them "kings of the 2000s emo scene". Celebrating 25th anniversary in 2025.'
)
ON CONFLICT (slug) DO UPDATE SET
  bio = EXCLUDED.bio,
  hometown = EXCLUDED.hometown,
  featured = EXCLUDED.featured,
  description = EXCLUDED.description;

-- Insert/Update Chelsea Grin
INSERT INTO public.bands (name, slug, bio, hometown, featured, description)
VALUES (
  'Chelsea Grin',
  'chelsea-grin',
  'Chelsea Grin is a deathcore band formed in 2007 that helped pioneer and popularize the deathcore subgenre. Known for their brutal breakdowns and technical precision, the band has released seven full-length albums and maintained relevance in the extreme metal scene for nearly two decades.',
  'Salt Lake City, UT',
  true,
  '506K+ monthly listeners on Spotify. Released double album "Suffer in Hell" (2022) and "Suffer in Heaven" (2023). "Eternal Nightmare" (2018) featured new vocalist Tom Barber. Featured posthumous collaboration with Trevor Strnad of The Black Dahlia Murder.'
)
ON CONFLICT (slug) DO UPDATE SET
  bio = EXCLUDED.bio,
  hometown = EXCLUDED.hometown,
  featured = EXCLUDED.featured,
  description = EXCLUDED.description;

-- Insert/Update Iceburn
INSERT INTO public.bands (name, slug, bio, hometown, featured, description)
VALUES (
  'Iceburn',
  'iceburn',
  'Iceburn (later The Iceburn Collective) was a groundbreaking experimental band formed in 1991, known for their unique fusion of hardcore punk, jazz, and progressive rock. Led by guitarist Gentry Densley, the band evolved from aggressive jazzcore to completely improvised avant-garde jazz before disbanding around 2000.',
  'Salt Lake City, UT',
  true,
  'Released albums on Revelation Records and Victory Records. Released "Asclepius" (2021) on Southern Lord Records after 20-year hiatus. Gentry Densley is a University of Utah graduate in music composition. Pioneered jazzcore genre blending speed/energy of hardcore with complexity of jazz. Reunited in 2021.'
)
ON CONFLICT (slug) DO UPDATE SET
  bio = EXCLUDED.bio,
  hometown = EXCLUDED.hometown,
  featured = EXCLUDED.featured,
  description = EXCLUDED.description;

-- Insert/Update Joshua James
INSERT INTO public.bands (name, slug, bio, hometown, featured, description)
VALUES (
  'Joshua James',
  'joshua-james',
  'Joshua James is a folk singer-songwriter known for his raw, emotionally honest songs and fingerpicking guitar style. His debut album "The Sun is Always Brighter" hit #1 on iTunes Folk chart in 2007 and established him as one of Utah''s premier folk artists.',
  'American Fork, UT',
  true,
  '#1 on iTunes Folk Album chart for 3 months (2007). Sold 25,000+ copies of debut album. Named one of Paste Magazine''s "Next 25 Artists You Need To Know" (2008). Songs featured on Sons of Anarchy. "FM Radio" amassed 150,000+ downloads on iTunes.'
)
ON CONFLICT (slug) DO UPDATE SET
  bio = EXCLUDED.bio,
  hometown = EXCLUDED.hometown,
  featured = EXCLUDED.featured,
  description = EXCLUDED.description;

-- Insert/Update Red Bennies
INSERT INTO public.bands (name, slug, bio, hometown, featured, description)
VALUES (
  'Red Bennies',
  'red-bennies',
  'Red Bennies is a veteran rock band led by Dave Payne, known for their self-described "rock soul punk" sound that blends punk energy with soulful elements. Active for over 16 years with a rotating lineup of local musicians, the band has released over ten albums.',
  'Salt Lake City, UT',
  false,
  'Over 10 releases spanning 16+ years on REST 30 Records. Latest album "FUNIPOCY ANTIHUMU" (Futurist, Nihilist, Post-rock, Cyberpunk, Anti-humanist Music). Leader Dave Payne hosts Doom Lounge events at Twilite Lounge.'
)
ON CONFLICT (slug) DO UPDATE SET
  bio = EXCLUDED.bio,
  hometown = EXCLUDED.hometown,
  description = EXCLUDED.description;

-- Insert/Update Static Waves
INSERT INTO public.bands (name, slug, bio, hometown, description)
VALUES (
  'Static Waves',
  'static-waves',
  'Static Waves is an indie rock band formed in early 2014, featuring Jesse Williams on lead vocals. Known for their infectious sound with authentic vocal hooks, stubborn guitar riffs, and moody backbeats, the quintet quickly gained popularity in the Provo and Salt Lake City scenes.',
  'Provo, UT',
  'Released self-titled 6-track album in September 2014. Lineup includes Jesse Williams (vocals), Austin Cross (guitar), Cade Tueller (bass), Justin Woods (synth), Cory Beighley (drums). Active in Provo/SLC indie scene at venues like Kilby Court.'
)
ON CONFLICT (slug) DO UPDATE SET
  bio = EXCLUDED.bio,
  hometown = EXCLUDED.hometown,
  description = EXCLUDED.description;

-- Now add band links (Spotify, Instagram, websites)
DO $$
DECLARE
  v_band_id uuid;
BEGIN
  -- Royal Bliss Links
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'royal-bliss';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_links WHERE band_id = v_band_id; -- Clear existing to avoid duplicates
    INSERT INTO public.band_links (band_id, label, url) VALUES
      (v_band_id, 'Spotify', 'https://open.spotify.com/artist/2DntubHirEICSdXa23WNpV'),
      (v_band_id, 'Instagram', 'https://www.instagram.com/royalblissband'),
      (v_band_id, 'Official Website', 'https://www.royalbliss.com');
  END IF;

  -- Fictionist Links
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'fictionist';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_links WHERE band_id = v_band_id;
    INSERT INTO public.band_links (band_id, label, url) VALUES
      (v_band_id, 'Spotify', 'https://open.spotify.com/artist/2R9cF9ZqGGfTpXwgi3yiN2'),
      (v_band_id, 'Instagram', 'https://www.instagram.com/fictionistnoise');
  END IF;

  -- The Used Links
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'the-used';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_links WHERE band_id = v_band_id;
    INSERT INTO public.band_links (band_id, label, url) VALUES
      (v_band_id, 'Spotify', 'https://open.spotify.com/artist/55VydwMyCuGcavwPuhutPL'),
      (v_band_id, 'Instagram', 'https://www.instagram.com/theused'),
      (v_band_id, 'Official Website', 'https://theused.net');
  END IF;

  -- Chelsea Grin Links
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'chelsea-grin';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_links WHERE band_id = v_band_id;
    INSERT INTO public.band_links (band_id, label, url) VALUES
      (v_band_id, 'Spotify', 'https://open.spotify.com/artist/4UgQ3EFa8fEeaIEg54uV5b'),
      (v_band_id, 'Instagram', 'https://www.instagram.com/chelseagrinofficial'),
      (v_band_id, 'Official Website', 'https://chelseagrinband.com');
  END IF;

  -- Iceburn Links
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'iceburn';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_links WHERE band_id = v_band_id;
    INSERT INTO public.band_links (band_id, label, url) VALUES
      (v_band_id, 'Spotify', 'https://open.spotify.com/artist/2qAgcJvHLC06soAmks23aE'),
      (v_band_id, 'Southern Lord Records', 'https://southernlord.com/band/iceburn/');
  END IF;

  -- Joshua James Links
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'joshua-james';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_links WHERE band_id = v_band_id;
    INSERT INTO public.band_links (band_id, label, url) VALUES
      (v_band_id, 'Spotify', 'https://open.spotify.com/artist/0YLUOdFiedWIWBttlDAQeO'),
      (v_band_id, 'Instagram', 'https://www.instagram.com/joshua_james_official'),
      (v_band_id, 'Official Website', 'https://www.joshuajames.tv');
  END IF;

  -- Red Bennies Links
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'red-bennies';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_links WHERE band_id = v_band_id;
    INSERT INTO public.band_links (band_id, label, url) VALUES
      (v_band_id, 'Spotify', 'https://open.spotify.com/artist/2iwlTDOsuEoIxFaFyAUVWn'),
      (v_band_id, 'Website', 'http://www.rest30.com/wordpress/red-bennies/');
  END IF;

  -- Static Waves Links
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'static-waves';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_links WHERE band_id = v_band_id;
    INSERT INTO public.band_links (band_id, label, url) VALUES
      (v_band_id, 'Bandcamp', 'https://staticwavesmusic.bandcamp.com');
  END IF;
END $$;

-- Add genre associations
DO $$
DECLARE
  v_band_id uuid;
  v_genre_id uuid;
BEGIN
  -- Royal Bliss: Rock, Hard Rock, Alternative Rock
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'royal-bliss';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_genres WHERE band_id = v_band_id;
    FOR v_genre_id IN SELECT id FROM public.genres WHERE name IN ('Rock', 'Hard Rock', 'Alternative') LOOP
      INSERT INTO public.band_genres (band_id, genre_id) VALUES (v_band_id, v_genre_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Fictionist: Alternative Rock, Indie Rock
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'fictionist';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_genres WHERE band_id = v_band_id;
    FOR v_genre_id IN SELECT id FROM public.genres WHERE name IN ('Alternative', 'Indie Rock') LOOP
      INSERT INTO public.band_genres (band_id, genre_id) VALUES (v_band_id, v_genre_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- The Used: Emo, Post-Hardcore, Punk, Alternative
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'the-used';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_genres WHERE band_id = v_band_id;
    FOR v_genre_id IN SELECT id FROM public.genres WHERE name IN ('Emo', 'Post-Hardcore', 'Punk', 'Alternative') LOOP
      INSERT INTO public.band_genres (band_id, genre_id) VALUES (v_band_id, v_genre_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Chelsea Grin: Deathcore, Metal, Extreme Metal
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'chelsea-grin';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_genres WHERE band_id = v_band_id;
    FOR v_genre_id IN SELECT id FROM public.genres WHERE name IN ('Deathcore', 'Metal', 'Extreme Metal') LOOP
      INSERT INTO public.band_genres (band_id, genre_id) VALUES (v_band_id, v_genre_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Iceburn: Jazzcore, Progressive Metal, Experimental, Hardcore
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'iceburn';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_genres WHERE band_id = v_band_id;
    FOR v_genre_id IN SELECT id FROM public.genres WHERE name IN ('Jazzcore', 'Progressive Metal', 'Experimental', 'Hardcore') LOOP
      INSERT INTO public.band_genres (band_id, genre_id) VALUES (v_band_id, v_genre_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Joshua James: Folk, Singer-Songwriter, Americana
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'joshua-james';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_genres WHERE band_id = v_band_id;
    FOR v_genre_id IN SELECT id FROM public.genres WHERE name IN ('Folk', 'Singer-Songwriter', 'Americana') LOOP
      INSERT INTO public.band_genres (band_id, genre_id) VALUES (v_band_id, v_genre_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Red Bennies: Rock, Punk, Soul, Experimental
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'red-bennies';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_genres WHERE band_id = v_band_id;
    FOR v_genre_id IN SELECT id FROM public.genres WHERE name IN ('Rock', 'Punk', 'Soul', 'Experimental') LOOP
      INSERT INTO public.band_genres (band_id, genre_id) VALUES (v_band_id, v_genre_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Static Waves: Indie Rock, Alternative
  SELECT id INTO v_band_id FROM public.bands WHERE slug = 'static-waves';
  IF v_band_id IS NOT NULL THEN
    DELETE FROM public.band_genres WHERE band_id = v_band_id;
    FOR v_genre_id IN SELECT id FROM public.genres WHERE name IN ('Indie Rock', 'Alternative') LOOP
      INSERT INTO public.band_genres (band_id, genre_id) VALUES (v_band_id, v_genre_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
END $$;

-- Verify the data
SELECT
  b.name,
  b.hometown,
  b.featured,
  COUNT(DISTINCT bl.id) as link_count,
  COUNT(DISTINCT bg.genre_id) as genre_count
FROM public.bands b
LEFT JOIN public.band_links bl ON b.id = bl.band_id
LEFT JOIN public.band_genres bg ON b.id = bg.band_id
WHERE b.slug IN ('royal-bliss', 'fictionist', 'the-used', 'chelsea-grin', 'iceburn', 'joshua-james', 'red-bennies', 'static-waves')
GROUP BY b.id, b.name, b.hometown, b.featured
ORDER BY b.name;
