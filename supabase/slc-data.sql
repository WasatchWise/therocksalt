-- Salt Lake City Music Scene Data
-- Insert real SLC venues, bands, and genres

-- Insert Genres
INSERT INTO public.genres (id, name) VALUES
  (gen_random_uuid(), 'Rock'),
  (gen_random_uuid(), 'Alternative'),
  (gen_random_uuid(), 'Indie Pop'),
  (gen_random_uuid(), 'Indie Rock'),
  (gen_random_uuid(), 'Pop Rock'),
  (gen_random_uuid(), 'Electronic'),
  (gen_random_uuid(), 'Hip Hop'),
  (gen_random_uuid(), 'Metal'),
  (gen_random_uuid(), 'Punk'),
  (gen_random_uuid(), 'Folk')
ON CONFLICT DO NOTHING;

-- Insert Salt Lake City Venues
INSERT INTO public.venues (id, name, city, state) VALUES
  (gen_random_uuid(), 'The Depot', 'Salt Lake City', 'UT'),
  (gen_random_uuid(), 'Urban Lounge', 'Salt Lake City', 'UT'),
  (gen_random_uuid(), 'Kilby Court', 'Salt Lake City', 'UT'),
  (gen_random_uuid(), 'Soundwell', 'Salt Lake City', 'UT'),
  (gen_random_uuid(), 'The Complex', 'Salt Lake City', 'UT'),
  (gen_random_uuid(), 'The State Room', 'Salt Lake City', 'UT'),
  (gen_random_uuid(), 'Red Butte Garden Amphitheatre', 'Salt Lake City', 'UT'),
  (gen_random_uuid(), 'Velour Live Music Gallery', 'Provo', 'UT'),
  (gen_random_uuid(), 'The Commonwealth Room', 'Salt Lake City', 'UT'),
  (gen_random_uuid(), 'Granary Live', 'Salt Lake City', 'UT')
ON CONFLICT DO NOTHING;

-- Insert Notable Utah/SLC Bands
DO $$
DECLARE
  imagine_dragons_id uuid := gen_random_uuid();
  neon_trees_id uuid := gen_random_uuid();
  the_aces_id uuid := gen_random_uuid();
  the_backseat_lovers_id uuid := gen_random_uuid();
  willoh_id uuid := gen_random_uuid();

  rock_genre_id uuid;
  alt_genre_id uuid;
  indie_pop_genre_id uuid;
  indie_rock_genre_id uuid;
  pop_rock_genre_id uuid;
  punk_genre_id uuid;
BEGIN
  -- Get genre IDs
  SELECT id INTO rock_genre_id FROM public.genres WHERE name = 'Rock' LIMIT 1;
  SELECT id INTO alt_genre_id FROM public.genres WHERE name = 'Alternative' LIMIT 1;
  SELECT id INTO indie_pop_genre_id FROM public.genres WHERE name = 'Indie Pop' LIMIT 1;
  SELECT id INTO indie_rock_genre_id FROM public.genres WHERE name = 'Indie Rock' LIMIT 1;
  SELECT id INTO pop_rock_genre_id FROM public.genres WHERE name = 'Pop Rock' LIMIT 1;
  SELECT id INTO punk_genre_id FROM public.genres WHERE name = 'Punk' LIMIT 1;

  -- Insert Bands
  INSERT INTO public.bands (id, name, slug, featured) VALUES
    (imagine_dragons_id, 'Imagine Dragons', 'imagine-dragons', true),
    (neon_trees_id, 'Neon Trees', 'neon-trees', true),
    (the_aces_id, 'The Aces', 'the-aces', true),
    (the_backseat_lovers_id, 'The Backseat Lovers', 'the-backseat-lovers', true),
    (willoh_id, 'Willöh', 'willoh', false);

  -- Insert Band Genres
  INSERT INTO public.band_genres (band_id, genre_id) VALUES
    -- Imagine Dragons: Alternative Rock, Pop Rock
    (imagine_dragons_id, alt_genre_id),
    (imagine_dragons_id, pop_rock_genre_id),

    -- Neon Trees: Alternative, Indie Pop
    (neon_trees_id, alt_genre_id),
    (neon_trees_id, indie_pop_genre_id),

    -- The Aces: Indie Pop, Pop Rock
    (the_aces_id, indie_pop_genre_id),
    (the_aces_id, pop_rock_genre_id),

    -- The Backseat Lovers: Indie Rock, Alternative
    (the_backseat_lovers_id, indie_rock_genre_id),
    (the_backseat_lovers_id, alt_genre_id),

    -- Willöh: Punk
    (willoh_id, punk_genre_id);

  -- Insert Band Links
  INSERT INTO public.band_links (band_id, label, url) VALUES
    -- Imagine Dragons
    (imagine_dragons_id, 'Official Website', 'https://www.imaginedragonsmusic.com'),
    (imagine_dragons_id, 'Spotify', 'https://open.spotify.com/artist/53XhwfbYqKCa1cC15pYq2q'),
    (imagine_dragons_id, 'Instagram', 'https://www.instagram.com/imaginedragons'),

    -- Neon Trees
    (neon_trees_id, 'Official Website', 'https://www.neontreesmusic.com'),
    (neon_trees_id, 'Spotify', 'https://open.spotify.com/artist/0RpddSzUHfncUWNJXKOsjy'),
    (neon_trees_id, 'Instagram', 'https://www.instagram.com/neontrees'),

    -- The Aces
    (the_aces_id, 'Official Website', 'https://www.theacesofficial.com'),
    (the_aces_id, 'Spotify', 'https://open.spotify.com/artist/3SupOw0UgkkJ6Y6N0HI3Zc'),
    (the_aces_id, 'Instagram', 'https://www.instagram.com/theaces'),

    -- The Backseat Lovers
    (the_backseat_lovers_id, 'Spotify', 'https://open.spotify.com/artist/4KGA23JpCwUlqWIJw6sdru'),
    (the_backseat_lovers_id, 'Instagram', 'https://www.instagram.com/thebackseatlovers'),

    -- Willöh
    (willoh_id, 'Instagram', 'https://www.instagram.com/willohband');
END $$;
