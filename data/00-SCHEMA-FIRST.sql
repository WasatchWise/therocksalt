-- ========================================
-- THE ROCK SALT DATABASE SCHEMA
-- Run this FIRST before importing data
-- ========================================

-- This is the schema from your migration file
-- Copy from: supabase/migrations/20250101_initial_schema.sql

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

-- ========================================
-- SCHEMA CREATED!
-- Now you can run the data import SQL
-- ========================================
