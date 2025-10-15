-- Core tables
create table if not exists public.bands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.band_links (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references public.bands(id) on delete cascade,
  label text,
  url text,
  created_at timestamp with time zone default now()
);

create table if not exists public.genres (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table if not exists public.band_genres (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references public.bands(id) on delete cascade,
  genre_id uuid references public.genres(id) on delete cascade
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  title text,
  date date,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists public.episode_links (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid references public.episodes(id) on delete cascade,
  label text,
  url text
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text,
  venue_id uuid references public.venues(id) on delete set null,
  start_time timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists public.event_bands (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  band_id uuid references public.bands(id) on delete cascade,
  slot_order int,
  is_headliner boolean
);

-- Enable RLS and add permissive policies for anon reads
alter table public.bands enable row level security;
alter table public.band_links enable row level security;
alter table public.genres enable row level security;
alter table public.band_genres enable row level security;
alter table public.episodes enable row level security;
alter table public.episode_links enable row level security;
alter table public.venues enable row level security;
alter table public.events enable row level security;
alter table public.event_bands enable row level security;

do $$ begin
  create policy if not exists "bands anon read" on public.bands for select using (true);
  create policy if not exists "band_links anon read" on public.band_links for select using (true);
  create policy if not exists "genres anon read" on public.genres for select using (true);
  create policy if not exists "band_genres anon read" on public.band_genres for select using (true);
  create policy if not exists "episodes anon read" on public.episodes for select using (true);
  create policy if not exists "episode_links anon read" on public.episode_links for select using (true);
  create policy if not exists "venues anon read" on public.venues for select using (true);
  create policy if not exists "events anon read" on public.events for select using (true);
  create policy if not exists "event_bands anon read" on public.event_bands for select using (true);
exception when others then null; end $$;

-- Supabase schema for The Rock Salt - Local Music Hub
-- Run in Supabase SQL editor or via `supabase db push`.

create extension if not exists "pgcrypto";

-- Helper trigger for updated_at columns
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =====================================================================
-- Core music entities
-- =====================================================================

create table if not exists public.bands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  origin_city text,
  state text,
  country text default 'USA',
  formed_year int,
  disbanded_year int,
  status text check (status in ('active','hiatus','dissolved','reunited')),
  description text,
  history text,
  hero_image_url text,
  spotify_url text,
  bandcamp_url text,
  website_url text,
  instagram_handle text,
  facebook_url text,
  youtube_url text,
  press_contact text,
  featured boolean default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_bands_updated_at
before update on public.bands
for each row execute function public.set_updated_at();

create index if not exists bands_slug_idx on public.bands(slug);
create index if not exists bands_featured_idx on public.bands(featured);

alter table public.bands enable row level security;
do $$ begin
  create policy "Public read" on public.bands for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.musicians (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  role text,
  location text,
  bio text,
  website_url text,
  instagram_handle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_musicians_updated_at
before update on public.musicians
for each row execute function public.set_updated_at();

alter table public.musicians enable row level security;
do $$ begin
  create policy "Public read" on public.musicians for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.band_members (
  band_id uuid not null references public.bands(id) on delete cascade,
  musician_id uuid not null references public.musicians(id) on delete cascade,
  instrument text,
  role text,
  tenure_start int,
  tenure_end int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (band_id, musician_id)
);

create trigger trigger_update_band_members_updated_at
before update on public.band_members
for each row execute function public.set_updated_at();

alter table public.band_members enable row level security;
do $$ begin
  create policy "Public read" on public.band_members for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.genres (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz not null default now()
);

alter table public.genres enable row level security;
do $$ begin
  create policy "Public read" on public.genres for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.band_genres (
  band_id uuid not null references public.bands(id) on delete cascade,
  genre_id uuid not null references public.genres(id) on delete cascade,
  primary key (band_id, genre_id)
);

alter table public.band_genres enable row level security;
do $$ begin
  create policy "Public read" on public.band_genres for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.band_links (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references public.bands(id) on delete cascade,
  label text not null,
  url text not null,
  kind text check (kind in ('website','spotify','bandcamp','youtube','instagram','facebook','press','merch','other')) default 'other',
  sort_order int default 0,
  created_at timestamptz not null default now()
);

alter table public.band_links enable row level security;
do $$ begin
  create policy "Public read" on public.band_links for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references public.bands(id) on delete cascade,
  slug text,
  title text not null,
  release_year int,
  release_date date,
  format text,
  rarity_notes text,
  cover_image_url text,
  spotify_url text,
  bandcamp_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_releases_updated_at
before update on public.releases
for each row execute function public.set_updated_at();

alter table public.releases enable row level security;
do $$ begin
  create policy "Public read" on public.releases for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.local_resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  focus_area text,
  contact_info text,
  website_url text,
  instagram_handle text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_local_resources_updated_at
before update on public.local_resources
for each row execute function public.set_updated_at();

alter table public.local_resources enable row level security;
do $$ begin
  create policy "Public read" on public.local_resources for select using (true);
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Venues and events
-- =====================================================================

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  address text,
  city text,
  state text,
  postal_code text,
  country text default 'USA',
  latitude double precision,
  longitude double precision,
  status text,
  website_url text,
  phone text,
  instagram_handle text,
  facebook_url text,
  capacity int,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_venues_updated_at
before update on public.venues
for each row execute function public.set_updated_at();

alter table public.venues enable row level security;
do $$ begin
  create policy "Public read" on public.venues for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  venue_id uuid references public.venues(id) on delete set null,
  venue_name text,
  city text,
  state text,
  start_time timestamptz,
  end_time timestamptz,
  door_time timestamptz,
  description text,
  facebook_url text,
  ticket_url text,
  ticket_price numeric(10,2),
  ticket_currency text default 'USD',
  status text check (status in ('scheduled','postponed','canceled','completed')) default 'scheduled',
  is_all_ages boolean,
  headline text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create index if not exists events_start_time_idx on public.events(start_time);
create index if not exists events_status_idx on public.events(status);

alter table public.events enable row level security;
do $$ begin
  create policy "Public read" on public.events for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.event_bands (
  event_id uuid not null references public.events(id) on delete cascade,
  band_id uuid not null references public.bands(id) on delete cascade,
  slot_order int,
  is_headliner boolean default false,
  notes text,
  primary key (event_id, band_id)
);

alter table public.event_bands enable row level security;
do $$ begin
  create policy "Public read" on public.event_bands for select using (true);
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Audio / video programming (podcast + livestream)
-- =====================================================================

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  episode_number int,
  season_number int,
  episode_type text check (episode_type in ('audio','video')) default 'audio',
  date date,
  duration_seconds int,
  description text,
  show_notes text,
  audio_url text,
  video_url text,
  youtube_url text,
  spotify_url text,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_episodes_updated_at
before update on public.episodes
for each row execute function public.set_updated_at();

alter table public.episodes enable row level security;
do $$ begin
  create policy "Public read" on public.episodes for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.episode_segments (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.episodes(id) on delete cascade,
  title text not null,
  description text,
  starts_at_seconds int,
  ends_at_seconds int,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_episode_segments_updated_at
before update on public.episode_segments
for each row execute function public.set_updated_at();

alter table public.episode_segments enable row level security;
do $$ begin
  create policy "Public read" on public.episode_segments for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.episode_links (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.episodes(id) on delete cascade,
  label text not null,
  url text not null,
  kind text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

alter table public.episode_links enable row level security;
do $$ begin
  create policy "Public read" on public.episode_links for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.livestreams (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  scheduled_for timestamptz,
  end_time timestamptz,
  status text check (status in ('upcoming','live','completed','canceled')) default 'upcoming',
  stream_url text,
  backup_stream_url text,
  youtube_url text,
  thumbnail_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_livestreams_updated_at
before update on public.livestreams
for each row execute function public.set_updated_at();

alter table public.livestreams enable row level security;
do $$ begin
  create policy "Public read" on public.livestreams for select using (true);
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Editorial content (Salt Vault, community, facts)
-- =====================================================================

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  content text,
  article_type text check (article_type in ('history','profile','feature','interview','list')) default 'feature',
  hero_image_url text,
  published_at timestamptz,
  author_name text,
  tags text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.articles enable row level security;
do $$ begin
  create policy "Public read" on public.articles for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.article_sections (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  heading text,
  body text,
  media_url text,
  media_caption text,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_article_sections_updated_at
before update on public.article_sections
for each row execute function public.set_updated_at();

alter table public.article_sections enable row level security;
do $$ begin
  create policy "Public read" on public.article_sections for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.rock_facts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  fact text not null,
  source_name text,
  source_url text,
  tags text[],
  is_featured boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_rock_facts_updated_at
before update on public.rock_facts
for each row execute function public.set_updated_at();

alter table public.rock_facts enable row level security;
do $$ begin
  create policy "Public read" on public.rock_facts for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.trivia_facts (
  id uuid primary key default gen_random_uuid(),
  prompt text not null,
  answer text,
  source_name text,
  source_url text,
  tags text[],
  created_at timestamptz not null default now()
);

alter table public.trivia_facts enable row level security;
do $$ begin
  create policy "Public read" on public.trivia_facts for select using (true);
exception when duplicate_object then null; end $$;

create table if not exists public.community_spotlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  link_url text,
  link_label text,
  image_url text,
  published_at timestamptz,
  expires_at timestamptz,
  priority int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trigger_update_community_spotlights_updated_at
before update on public.community_spotlights
for each row execute function public.set_updated_at();

alter table public.community_spotlights enable row level security;
do $$ begin
  create policy "Public read" on public.community_spotlights for select using (true);
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Submissions / forms
-- =====================================================================

create table if not exists public.music_submissions (
  id uuid primary key default gen_random_uuid(),
  band_name text not null,
  contact_name text,
  contact_email text,
  hometown text,
  links jsonb,
  notes text,
  genre_preferences text[],
  status text check (status in ('pending','reviewed','accepted','declined')) default 'pending',
  internal_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now()
);

alter table public.music_submissions enable row level security;
do $$ begin
  create policy "Allow anonymous submissions" on public.music_submissions
    for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Staff can review submissions" on public.music_submissions
    for select using (auth.role() = 'authenticated' and coalesce(auth.jwt()->> 'is_staff', 'false') = 'true');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Staff can update submissions" on public.music_submissions
    for update using (auth.role() = 'authenticated' and coalesce(auth.jwt()->> 'is_staff', 'false') = 'true');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Staff can delete submissions" on public.music_submissions
    for delete using (auth.role() = 'authenticated' and coalesce(auth.jwt()->> 'is_staff', 'false') = 'true');
exception when duplicate_object then null; end $$;

-- Service role bypasses RLS, so no public read policy is defined yet.

*** End of File
