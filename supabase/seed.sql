insert into public.bands (name, slug, featured) values
  ('The Red Bennies', 'the-red-bennies', true),
  ('Form of Rocket', 'form-of-rocket', true),
  ('Starmy', 'starmy', false),
  ('The New Transit Direction', 'the-new-transit-direction', false),
  ('The Brobecks', 'the-brobecks', false),
  ('Iceburn', 'iceburn', false);

insert into public.genres (name) values
  ('Rock'),
  ('Punk'),
  ('Indie Rock'),
  ('Emo-core'),
  ('Math Rock'),
  ('Experimental')
on conflict do nothing;

-- Simple band_genres associations (best-effort using subselects)
insert into public.band_genres (band_id, genre_id)
select b.id, g.id from public.bands b, public.genres g
where (b.slug = 'the-red-bennies' and g.name in ('Rock','Punk'))
   or (b.slug = 'form-of-rocket' and g.name in ('Math Rock','Experimental'))
   or (b.slug = 'starmy' and g.name in ('Rock'))
   or (b.slug = 'the-new-transit-direction' and g.name in ('Indie Rock','Emo-core'))
   or (b.slug = 'the-brobecks' and g.name in ('Indie Rock'))
   or (b.slug = 'iceburn' and g.name in ('Experimental'));

insert into public.band_links (band_id, label, url)
select id, 'Spotify', 'https://open.spotify.com/search/' || replace(name, ' ', '%20') from public.bands;

insert into public.episodes (title, date, description) values
  ('801 and Done', '2024-10-01', 'Latest episode featuring SLC scene highlights.');

insert into public.episode_links (episode_id, label, url)
select id, 'Google Drive', 'https://drive.google.com/uc?export=download&id=1Z5wbNRqueG-Lg2KEX01nKuxNWfya14nZ'
from public.episodes where title = '801 and Done';

insert into public.venues (name, city, state) values
  ('Kilby Court', 'Salt Lake City', 'UT'),
  ('The Urban Lounge', 'Salt Lake City', 'UT'),
  ('The State Room', 'Salt Lake City', 'UT');

insert into public.events (title, venue_id, start_time)
select 'Red Pete with Just Hold Still', v.id, '2025-10-18T20:00:00Z' from public.venues v where v.name = 'The Urban Lounge';

insert into public.event_bands (event_id, band_id, slot_order, is_headliner)
select e.id, b.id, 1, true from public.events e, public.bands b where e.title = 'Red Pete with Just Hold Still' and b.slug = 'the-red-bennies';

-- Seed data for The Rock Salt demo environment
-- Safe to run multiple times (uses upsert patterns on unique columns).

insert into public.genres (id, name, description)
values
  ('4f00b663-6c0a-4a17-8e02-6a5fa08eb375', 'indie rock', 'Independent rock from the Wasatch Front.'),
  ('8b743654-14ea-4c65-9e46-3ae5a9608f80', 'emo-core', 'Emotive post-hardcore sounds.'),
  ('5df1fb13-7b68-4d32-b5b7-2f3170f12da4', 'experimental', 'Boundary-pushing experimental music.')
on conflict (name) do update set description = excluded.description;

insert into public.bands (id, slug, name, origin_city, state, status, description, history, spotify_url, featured)
values
  (
    '5f5b1b5a-5ac0-4e9d-9a62-857c88840ff9',
    'the-new-transit-direction',
    'The New Transit Direction',
    'Salt Lake City',
    'UT',
    'reunited',
    'Seminal early 2000s SLC emo-core outfit.',
    'Formed in 1999, toured nationally including the 2003 Warped Tour run.',
    'https://open.spotify.com/artist/33z2xioJjNavgUwTfPEu6N?si=sjaukFbKQWy1-nHq_fDQwA',
    true
  ),
  (
    '2ba7bb53-f8d4-4146-97f7-0d310112dc1e',
    'the-brobecks',
    'The Brobecks',
    'Salt Lake City',
    'UT',
    'dissolved',
    'Influential indie / pop rock band led by Dallon Weekes.',
    'Known for their packed early 2000s Kilby Court appearances.',
    null,
    false
  ),
  (
    'f0a9b6c0-0fa3-4b73-8afd-0fa65a5d2296',
    'iceburn',
    'Iceburn',
    'Salt Lake City',
    'UT',
    'active',
    'Genre-defying collective blending jazz, hardcore, and metal.',
    'Founded by Gentry Densley, rotating memberships for three decades.',
    null,
    false
  )
on conflict (slug) do update set
  name = excluded.name,
  origin_city = excluded.origin_city,
  state = excluded.state,
  status = excluded.status,
  description = excluded.description,
  history = excluded.history,
  spotify_url = excluded.spotify_url,
  featured = excluded.featured,
  updated_at = now();

insert into public.band_links (id, band_id, label, url, kind, sort_order)
values
  ('9d5e38bb-8cef-4bee-a05f-63ee4d16b6c2', '5f5b1b5a-5ac0-4e9d-9a62-857c88840ff9', 'Spotify', 'https://open.spotify.com/artist/33z2xioJjNavgUwTfPEu6N?si=sjaukFbKQWy1-nHq_fDQwA', 'spotify', 1),
  ('cfacb5a4-704f-4485-90cf-d0f01c0633fb', '5f5b1b5a-5ac0-4e9d-9a62-857c88840ff9', 'Instagram', 'https://www.instagram.com/thenewtransitdirection', 'instagram', 2)
  
on conflict (id) do update set
  url = excluded.url,
  sort_order = excluded.sort_order;

insert into public.band_genres (band_id, genre_id)
values
  ('5f5b1b5a-5ac0-4e9d-9a62-857c88840ff9', '4f00b663-6c0a-4a17-8e02-6a5fa08eb375'),
  ('5f5b1b5a-5ac0-4e9d-9a62-857c88840ff9', '8b743654-14ea-4c65-9e46-3ae5a9608f80'),
  ('2ba7bb53-f8d4-4146-97f7-0d310112dc1e', '4f00b663-6c0a-4a17-8e02-6a5fa08eb375'),
  ('f0a9b6c0-0fa3-4b73-8afd-0fa65a5d2296', '5df1fb13-7b68-4d32-b5b7-2f3170f12da4')
on conflict do nothing;

insert into public.venues (id, slug, name, city, state, status, website_url)
values
  (
    '0ab25592-0439-4a1f-9df5-407cf58f50de',
    'kilby-court',
    'Kilby Court',
    'Salt Lake City',
    'UT',
    'active',
    'https://kilbycourt.com'
  )
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  state = excluded.state,
  status = excluded.status,
  website_url = excluded.website_url,
  updated_at = now();

insert into public.events (id, slug, title, venue_id, venue_name, city, state, start_time, description, facebook_url, ticket_url, status, is_all_ages, headline)
values
  (
    '64c074aa-13e4-4ba9-9107-165b52e0a31a',
    'red-pete-just-hold-still',
    'Red Pete w/ Just Hold Still',
    '0ab25592-0439-4a1f-9df5-407cf58f50de',
    'Piper Down',
    'Salt Lake City',
    'UT',
    '2025-02-14T20:00:00Z',
    'A blistering night of SLC indie featuring Red Pete and Just Hold Still.',
    'https://www.facebook.com/events/1106680557727159/',
    null,
    'scheduled',
    true,
    'Live show highlight'
  )
on conflict (slug) do update set
  title = excluded.title,
  venue_id = excluded.venue_id,
  venue_name = excluded.venue_name,
  city = excluded.city,
  state = excluded.state,
  start_time = excluded.start_time,
  description = excluded.description,
  facebook_url = excluded.facebook_url,
  ticket_url = excluded.ticket_url,
  status = excluded.status,
  is_all_ages = excluded.is_all_ages,
  headline = excluded.headline,
  updated_at = now();

insert into public.event_bands (event_id, band_id, slot_order, is_headliner)
values
  ('64c074aa-13e4-4ba9-9107-165b52e0a31a', '5f5b1b5a-5ac0-4e9d-9a62-857c88840ff9', 1, true)
  on conflict (event_id, band_id) do update set
  slot_order = excluded.slot_order,
  is_headliner = excluded.is_headliner;

insert into public.episodes (id, slug, title, episode_number, episode_type, date, duration_seconds, description, audio_url, thumbnail_url, show_notes)
values
  (
    'a782c6a3-7a6b-4f18-8728-5d6c0d1b1b66',
    '801-and-done',
    '801 and Done',
    1,
    'audio',
    '2024-10-01',
    2520,
    'A primer on the SLC underground with deep cuts and scene history.',
    'https://drive.google.com/uc?export=download&id=1Z5wbNRqueG-Lg2KEX01nKuxNWfya14nZ',
    null,
    'Featuring tracks from The New Transit Direction and more.'
  )
on conflict (slug) do update set
  title = excluded.title,
  episode_number = excluded.episode_number,
  episode_type = excluded.episode_type,
  date = excluded.date,
  duration_seconds = excluded.duration_seconds,
  description = excluded.description,
  audio_url = excluded.audio_url,
  thumbnail_url = excluded.thumbnail_url,
  show_notes = excluded.show_notes,
  updated_at = now();

insert into public.episode_links (id, episode_id, label, url, kind, sort_order)
values
  ('e78a2fc4-b5b5-4461-8f6f-634541dff6a7', 'a782c6a3-7a6b-4f18-8728-5d6c0d1b1b66', 'Open in Drive', 'https://drive.google.com/file/d/1Z5wbNRqueG-Lg2KEX01nKuxNWfya14nZ/view?usp=drive_link', 'drive', 1)
  on conflict (id) do update set
  url = excluded.url,
  sort_order = excluded.sort_order;

insert into public.rock_facts (id, title, fact, source_name, source_url, tags, is_featured)
values
  (
    '1f0732bd-4d49-4d5b-84d4-5d76f6a7285d',
    'Kilby Court Origins',
    'Kilby Court launched in 1999 and quickly became the go-to all-ages venue for SLC DIY music.',
    'Salt Lake Tribune',
    'https://www.sltrib.com',
    array['venues','history'],
    true
  )
on conflict (id) do update set
  fact = excluded.fact,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  tags = excluded.tags,
  is_featured = excluded.is_featured,
  updated_at = now();

insert into public.trivia_facts (id, prompt, answer, source_name, source_url, tags)
values
  (
    'aee75ce4-6d7f-4d6e-886f-fd0dc6e5b08d',
    'Which SLC venue hosted The New Transit Direction''s first record release?',
    'Kilby Court hosted the 2001 release party for The New Transit Direction.',
    'Kilby Court Archives',
    'https://kilbycourt.com',
    array['bands','venues']
  )
on conflict (id) do update set
  prompt = excluded.prompt,
  answer = excluded.answer,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  tags = excluded.tags;

insert into public.articles (id, slug, title, summary, content, article_type, hero_image_url, published_at, author_name, tags)
values
  (
    '30402915-2a4a-4b3b-b403-b53f86b584ec',
    'kilby-court-legend',
    'Kilby Court: 25 Years of DIY Magic',
    'Tracing the rise of SLC\'s most beloved all-ages venue.',
    'Kilby Court opened in a dusty garage and evolved into a national tour stop.',
    'history',
    null,
    '2024-09-20T12:00:00Z',
    'Alex Rockwell',
    array['venues','history']
  )
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  article_type = excluded.article_type,
  hero_image_url = excluded.hero_image_url,
  published_at = excluded.published_at,
  author_name = excluded.author_name,
  tags = excluded.tags,
  updated_at = now();

insert into public.community_spotlights (id, title, summary, link_url, link_label, image_url, published_at, priority)
values
  (
    '64063e4d-3d7a-4f6b-9dff-8c6064a1c3ba',
    'Join The Rock Salt Discord',
    'Meet the scene, share gig tips, and plug your latest release.',
    'https://discord.gg/yKK4PSjT',
    'Enter the server',
    null,
    now(),
    10
  )
on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  link_url = excluded.link_url,
  link_label = excluded.link_label,
  image_url = excluded.image_url,
  published_at = excluded.published_at,
  priority = excluded.priority,
  updated_at = now();

