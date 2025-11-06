-- Migration: Add band pages features
-- Created: 2025-01-05

-- Add new columns to bands table
alter table public.bands add column if not exists bio text;
alter table public.bands add column if not exists description text;
alter table public.bands add column if not exists image_url text;
alter table public.bands add column if not exists claimed_by uuid references auth.users(id) on delete set null;
alter table public.bands add column if not exists claimed_at timestamp with time zone;
alter table public.bands add column if not exists custom_html text;

-- Create unique index on slug
create unique index if not exists bands_slug_idx on public.bands(slug);

-- Function to generate slug from name
create or replace function public.generate_slug(name text)
returns text as $$
begin
  return lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
end;
$$ language plpgsql immutable;

-- Update existing bands to have slugs if they don't
update public.bands
set slug = public.generate_slug(name)
where slug is null or slug = '';

-- Make slug not null going forward
alter table public.bands alter column slug set not null;

-- Create band_tracks table for MP3 uploads
create table if not exists public.band_tracks (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references public.bands(id) on delete cascade not null,
  title text not null,
  description text,
  file_url text not null,
  file_size bigint,
  duration_seconds int,
  track_type text check (track_type in ('demo', 'live', 'single', 'album_track')),
  track_order int,
  is_featured boolean default false,
  play_count int default 0,
  uploaded_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create band_photos table for image galleries
create table if not exists public.band_photos (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references public.bands(id) on delete cascade not null,
  url text not null,
  caption text,
  source text, -- 'upload', 'unsplash', 'external_api', etc.
  source_attribution text,
  is_primary boolean default false,
  photo_order int,
  uploaded_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Add missing columns to venues
alter table public.venues add column if not exists address text;
alter table public.venues add column if not exists website text;
alter table public.venues add column if not exists capacity int;

-- Add missing columns to events
alter table public.events add column if not exists name text;
alter table public.events add column if not exists description text;
alter table public.events add column if not exists end_time timestamp with time zone;
alter table public.events add column if not exists ticket_url text;
alter table public.events add column if not exists featured boolean default false;

-- Add missing column to episodes
alter table public.episodes add column if not exists featured boolean default false;

-- Enable RLS
alter table public.band_tracks enable row level security;
alter table public.band_photos enable row level security;

-- RLS Policies for band_tracks
create policy "band_tracks anon read"
  on public.band_tracks for select
  using (true);

create policy "band_tracks authenticated insert"
  on public.band_tracks for insert
  to authenticated
  with check (
    exists (
      select 1 from public.bands
      where id = band_id
      and claimed_by = auth.uid()
    )
  );

create policy "band_tracks authenticated update"
  on public.band_tracks for update
  to authenticated
  using (
    exists (
      select 1 from public.bands
      where id = band_id
      and claimed_by = auth.uid()
    )
  );

create policy "band_tracks authenticated delete"
  on public.band_tracks for delete
  to authenticated
  using (
    exists (
      select 1 from public.bands
      where id = band_id
      and claimed_by = auth.uid()
    )
  );

-- RLS Policies for band_photos
create policy "band_photos anon read"
  on public.band_photos for select
  using (true);

create policy "band_photos authenticated insert"
  on public.band_photos for insert
  to authenticated
  with check (
    exists (
      select 1 from public.bands
      where id = band_id
      and claimed_by = auth.uid()
    )
  );

create policy "band_photos authenticated update"
  on public.band_photos for update
  to authenticated
  using (
    exists (
      select 1 from public.bands
      where id = band_id
      and claimed_by = auth.uid()
    )
  );

create policy "band_photos authenticated delete"
  on public.band_photos for delete
  to authenticated
  using (
    exists (
      select 1 from public.bands
      where id = band_id
      and claimed_by = auth.uid()
    )
  );

-- Update policies for bands table to allow claimed users to update
create policy "bands authenticated update own"
  on public.bands for update
  to authenticated
  using (claimed_by = auth.uid())
  with check (claimed_by = auth.uid());

-- Triggers for updated_at
create trigger band_tracks_updated_at
  before update on public.band_tracks
  for each row execute function public.set_updated_at();

-- Create storage bucket for band audio files
insert into storage.buckets (id, name, public)
values ('band-tracks', 'band-tracks', true)
on conflict (id) do nothing;

-- Storage policies for band-tracks
create policy "Band tracks are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'band-tracks');

create policy "Authenticated users can upload band tracks"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'band-tracks');

create policy "Users can update their band's tracks"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'band-tracks');

create policy "Users can delete their band's tracks"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'band-tracks');

-- Create storage bucket for band photos
insert into storage.buckets (id, name, public)
values ('band-photos', 'band-photos', true)
on conflict (id) do nothing;

-- Storage policies for band-photos
create policy "Band photos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'band-photos');

create policy "Authenticated users can upload band photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'band-photos');

create policy "Users can update their band's photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'band-photos');

create policy "Users can delete their band's photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'band-photos');

-- Indexes for performance
create index if not exists band_tracks_band_id_idx on public.band_tracks(band_id);
create index if not exists band_tracks_created_at_idx on public.band_tracks(created_at desc);
create index if not exists band_photos_band_id_idx on public.band_photos(band_id);
create index if not exists bands_claimed_by_idx on public.bands(claimed_by);

-- Comments
comment on column public.bands.bio is 'Short bio/description of the band';
comment on column public.bands.custom_html is 'Sanitized custom HTML for band page';
comment on column public.bands.claimed_by is 'User who has claimed/owns this band page';
comment on table public.band_tracks is 'Audio tracks (demos, live recordings, etc.) uploaded by bands';
comment on table public.band_photos is 'Photo gallery for band pages';
