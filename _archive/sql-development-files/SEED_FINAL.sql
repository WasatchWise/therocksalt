-- FINAL SEED DATA FOR THE ROCK SALT
-- Org ID: 4cadb578-b415-461f-8039-1fd02f68a030

-- Insert Genres
insert into public.genres (name) values
  ('Rock'),
  ('Punk'),
  ('Indie Rock'),
  ('Emo-core'),
  ('Math Rock'),
  ('Experimental'),
  ('Post-Hardcore'),
  ('Alternative'),
  ('Garage Rock')
on conflict (name) do nothing;

-- Insert Bands with new migration fields
insert into public.bands (name, slug, featured, bio, description, image_url, hometown) values
  (
    'The Red Bennies',
    'the-red-bennies',
    true,
    'High-energy punk rock from Salt Lake City. Known for their explosive live shows and DIY ethic.',
    'The Red Bennies are a staple of the SLC punk scene, bringing raw energy and authentic rock n roll to every performance.',
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&h=600&fit=crop',
    'Salt Lake City, UT'
  ),
  (
    'Form of Rocket',
    'form-of-rocket',
    true,
    'Experimental math rock collective pushing the boundaries of instrumental complexity.',
    'Form of Rocket blends intricate time signatures with atmospheric soundscapes, creating a unique sonic experience.',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop',
    'Salt Lake City, UT'
  ),
  (
    'Starmy',
    'starmy',
    false,
    'Indie rock with a local heart and national ambitions.',
    'Starmy delivers catchy hooks and heartfelt lyrics that resonate with the Salt Lake City underground.',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    'Salt Lake City, UT'
  ),
  (
    'The New Transit Direction',
    'the-new-transit-direction',
    true,
    'Seminal early 2000s SLC emo-core outfit. Formed in 1999, toured nationally including the 2003 Warped Tour run.',
    'The New Transit Direction defined an era of Salt Lake City music with their emotive post-hardcore sound.',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    'Salt Lake City, UT'
  ),
  (
    'The Brobecks',
    'the-brobecks',
    true,
    'Influential indie / pop rock band led by Dallon Weekes. Known for their packed early 2000s Kilby Court appearances.',
    'The Brobecks captured the hearts of SLC indie fans with their infectious melodies and charismatic performances.',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    'Salt Lake City, UT'
  ),
  (
    'Iceburn',
    'iceburn',
    true,
    'Genre-defying collective blending jazz, hardcore, and metal. Founded by Gentry Densley with rotating memberships for three decades.',
    'Iceburn has been a cornerstone of experimental music in Salt Lake City since the early 90s.',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
    'Salt Lake City, UT'
  )
on conflict (slug) do update set
  bio = excluded.bio,
  description = excluded.description,
  image_url = excluded.image_url,
  hometown = excluded.hometown,
  updated_at = now();

-- Insert Band Links (only if not exists)
insert into public.band_links (band_id, label, url)
select b.id, 'Spotify', 'https://open.spotify.com/search/' || replace(b.name, ' ', '%20')
from public.bands b
where b.slug in ('the-red-bennies', 'form-of-rocket', 'starmy', 'the-new-transit-direction', 'the-brobecks', 'iceburn')
  and not exists (
    select 1 from public.band_links bl
    where bl.band_id = b.id and bl.label = 'Spotify'
  );

-- Insert Band Genres (only if not exists)
insert into public.band_genres (band_id, genre_id)
select b.id, g.id from public.bands b, public.genres g
where ((b.slug = 'the-red-bennies' and g.name in ('Rock', 'Punk', 'Garage Rock'))
   or (b.slug = 'form-of-rocket' and g.name in ('Math Rock', 'Experimental'))
   or (b.slug = 'starmy' and g.name in ('Indie Rock', 'Alternative'))
   or (b.slug = 'the-new-transit-direction' and g.name in ('Emo-core', 'Post-Hardcore', 'Indie Rock'))
   or (b.slug = 'the-brobecks' and g.name in ('Indie Rock', 'Alternative'))
   or (b.slug = 'iceburn' and g.name in ('Experimental', 'Post-Hardcore')))
  and not exists (
    select 1 from public.band_genres bg
    where bg.band_id = b.id and bg.genre_id = g.id
  );

-- Insert Band Photos (only if not exists)
insert into public.band_photos (band_id, url, caption, source, is_primary, photo_order)
select
  b.id,
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=800&fit=crop',
  'Live at Kilby Court 2024',
  'unsplash',
  true,
  1
from public.bands b
where b.slug = 'the-new-transit-direction'
  and not exists (
    select 1 from public.band_photos bp
    where bp.band_id = b.id and bp.photo_order = 1
  )
union all
select
  b.id,
  'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=1200&h=800&fit=crop',
  'Studio session',
  'unsplash',
  false,
  2
from public.bands b
where b.slug = 'the-new-transit-direction'
  and not exists (
    select 1 from public.band_photos bp
    where bp.band_id = b.id and bp.photo_order = 2
  )
union all
select
  b.id,
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop',
  'Band promo photo',
  'unsplash',
  true,
  1
from public.bands b
where b.slug = 'the-brobecks'
  and not exists (
    select 1 from public.band_photos bp
    where bp.band_id = b.id and bp.photo_order = 1
  )
union all
select
  b.id,
  'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=1200&h=800&fit=crop',
  'Outdoor festival performance',
  'unsplash',
  true,
  1
from public.bands b
where b.slug = 'the-red-bennies'
  and not exists (
    select 1 from public.band_photos bp
    where bp.band_id = b.id and bp.photo_order = 1
  );

-- Insert Sample Tracks (only if not exists)
insert into public.band_tracks (band_id, title, description, file_url, track_type, is_featured, play_count, duration_seconds)
select
  b.id,
  'Breaking Point',
  'Our latest single - recorded at June Audio',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'single',
  true,
  142,
  240
from public.bands b
where b.slug = 'the-new-transit-direction'
  and not exists (
    select 1 from public.band_tracks bt
    where bt.band_id = b.id and bt.title = 'Breaking Point'
  )
union all
select
  b.id,
  'Last Dance',
  'Live recording from Urban Lounge 2023',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'live',
  true,
  89,
  195
from public.bands b
where b.slug = 'the-brobecks'
  and not exists (
    select 1 from public.band_tracks bt
    where bt.band_id = b.id and bt.title = 'Last Dance'
  )
union all
select
  b.id,
  'Velocity',
  'Math rock instrumental showcase',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'demo',
  false,
  67,
  312
from public.bands b
where b.slug = 'form-of-rocket'
  and not exists (
    select 1 from public.band_tracks bt
    where bt.band_id = b.id and bt.title = 'Velocity'
  )
union all
select
  b.id,
  'Red Line',
  'Punk anthem',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'single',
  true,
  203,
  178
from public.bands b
where b.slug = 'the-red-bennies'
  and not exists (
    select 1 from public.band_tracks bt
    where bt.band_id = b.id and bt.title = 'Red Line'
  );

-- Insert Venues with org_id
insert into public.venues (name, slug, city, state, address, website, capacity, org_id) values
  ('Kilby Court', 'kilby-court', 'Salt Lake City', 'UT', '741 S Kilby Ct, Salt Lake City, UT 84102', 'https://kilbycourt.com', 200, '4cadb578-b415-461f-8039-1fd02f68a030'),
  ('The Urban Lounge', 'the-urban-lounge', 'Salt Lake City', 'UT', '241 S 500 E, Salt Lake City, UT 84102', 'https://theurbanloungeslc.com', 400, '4cadb578-b415-461f-8039-1fd02f68a030'),
  ('The State Room', 'the-state-room', 'Salt Lake City', 'UT', '638 S State St, Salt Lake City, UT 84111', 'https://thestateroomslc.com', 300, '4cadb578-b415-461f-8039-1fd02f68a030'),
  ('The Complex', 'the-complex', 'Salt Lake City', 'UT', '536 W 100 S, Salt Lake City, UT 84101', 'https://thecomplexslc.com', 1000, '4cadb578-b415-461f-8039-1fd02f68a030'),
  ('Velour Live Music Gallery', 'velour', 'Provo', 'UT', '135 N University Ave, Provo, UT 84601', 'https://velourlive.com', 250, '4cadb578-b415-461f-8039-1fd02f68a030')
on conflict (slug) do update set
  address = excluded.address,
  website = excluded.website,
  capacity = excluded.capacity;

-- Insert Events with new migration fields (only if not exists)
insert into public.events (name, venue_id, start_time, end_time, description, ticket_url, featured)
select
  'Red Pete with Just Hold Still',
  v.id,
  '2025-11-15T20:00:00Z',
  '2025-11-15T23:30:00Z',
  'A blistering night of SLC indie featuring Red Pete and Just Hold Still. Doors at 7PM, show at 8PM.',
  'https://dice.fm/event/example',
  true
from public.venues v
where v.slug = 'the-urban-lounge'
  and not exists (
    select 1 from public.events e
    where e.name = 'Red Pete with Just Hold Still'
  )
union all
select
  'Winter Showcase 2025',
  v.id,
  '2025-12-10T19:00:00Z',
  '2025-12-10T23:00:00Z',
  'Annual winter showcase featuring the best of Salt Lake''s underground scene.',
  null,
  true
from public.venues v
where v.slug = 'kilby-court'
  and not exists (
    select 1 from public.events e
    where e.name = 'Winter Showcase 2025'
  )
union all
select
  'Math Rock Marathon',
  v.id,
  '2025-11-22T18:00:00Z',
  '2025-11-23T01:00:00Z',
  'An evening of complex rhythms and experimental sounds.',
  null,
  false
from public.venues v
where v.slug = 'the-state-room'
  and not exists (
    select 1 from public.events e
    where e.name = 'Math Rock Marathon'
  );

-- Link bands to events (only if not exists)
insert into public.event_bands (event_id, band_id, slot_order, is_headliner)
select e.id, b.id, 1, true
from public.events e, public.bands b
where e.name = 'Red Pete with Just Hold Still' and b.slug = 'the-red-bennies'
  and not exists (
    select 1 from public.event_bands eb
    where eb.event_id = e.id and eb.band_id = b.id
  )
union all
select e.id, b.id, 2, false
from public.events e, public.bands b
where e.name = 'Red Pete with Just Hold Still' and b.slug = 'starmy'
  and not exists (
    select 1 from public.event_bands eb
    where eb.event_id = e.id and eb.band_id = b.id
  )
union all
select e.id, b.id, 1, true
from public.events e, public.bands b
where e.name = 'Winter Showcase 2025' and b.slug = 'the-new-transit-direction'
  and not exists (
    select 1 from public.event_bands eb
    where eb.event_id = e.id and eb.band_id = b.id
  )
union all
select e.id, b.id, 2, true
from public.events e, public.bands b
where e.name = 'Winter Showcase 2025' and b.slug = 'the-brobecks'
  and not exists (
    select 1 from public.event_bands eb
    where eb.event_id = e.id and eb.band_id = b.id
  )
union all
select e.id, b.id, 1, true
from public.events e, public.bands b
where e.name = 'Math Rock Marathon' and b.slug = 'form-of-rocket'
  and not exists (
    select 1 from public.event_bands eb
    where eb.event_id = e.id and eb.band_id = b.id
  );

-- Insert Episodes with org_id
insert into public.episodes (title, slug, description, featured, org_id) values
  (
    '801 and Done - Episode 1',
    '801-and-done-1',
    'Latest episode featuring SLC scene highlights, interviews with The New Transit Direction, and a deep dive into Kilby Court history.',
    true,
    '4cadb578-b415-461f-8039-1fd02f68a030'
  ),
  (
    'Salt Lake Sounds - Winter 2024',
    'slc-sounds-winter-2024',
    'A celebration of winter releases from local artists, featuring exclusive tracks and live performances.',
    true,
    '4cadb578-b415-461f-8039-1fd02f68a030'
  ),
  (
    'The Emo-core Era',
    'emocore-era',
    'Exploring the golden age of Salt Lake emo-core with rare recordings and interviews.',
    false,
    '4cadb578-b415-461f-8039-1fd02f68a030'
  )
on conflict (slug) do update set
  description = excluded.description,
  featured = excluded.featured;

-- Insert Episode Links (only if not exists)
insert into public.episode_links (episode_id, label, url)
select e.id, 'Listen on Google Drive', 'https://drive.google.com/uc?export=download&id=1Z5wbNRqueG-Lg2KEX01nKuxNWfya14nZ'
from public.episodes e
where e.slug = '801-and-done-1'
  and not exists (
    select 1 from public.episode_links el
    where el.episode_id = e.id and el.label = 'Listen on Google Drive'
  );

-- Success message
select 'Seed data inserted successfully!' as status,
       (select count(*) from public.bands) as bands_count,
       (select count(*) from public.band_tracks) as tracks_count,
       (select count(*) from public.band_photos) as photos_count,
       (select count(*) from public.venues) as venues_count,
       (select count(*) from public.events) as events_count,
       (select count(*) from public.episodes) as episodes_count;
