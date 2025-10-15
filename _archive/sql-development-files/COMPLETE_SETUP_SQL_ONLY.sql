-- ============================================================
-- COMPLETE SETUP - SQL ONLY (NO STORAGE POLICIES)
-- ============================================================
-- This file includes only what can be done via SQL.
-- Storage policies must be set up via the Dashboard UI.
-- See STORAGE_SETUP_GUIDE.md for dashboard instructions.
-- ============================================================

-- ============================================================
-- PART 1: FIX RLS POLICY FOR BAND CLAIMING
-- ============================================================

-- Drop the existing restrictive update policy
drop policy if exists "bands authenticated update own" on public.bands;
drop policy if exists "bands authenticated update claim or own" on public.bands;

-- Create new policy that allows:
-- 1. Claiming unclaimed bands (claimed_by IS NULL)
-- 2. Updating your own claimed bands
create policy "bands authenticated update claim or own"
  on public.bands for update
  to authenticated
  using (
    claimed_by is null  -- Allow claiming unclaimed bands
    or claimed_by = auth.uid()  -- Allow updating own bands
  )
  with check (
    claimed_by = auth.uid()  -- Can only set claimed_by to your own user ID
  );

-- ============================================================
-- PART 2: CREATE STORAGE BUCKETS (IF NEEDED)
-- ============================================================

-- Create band-tracks bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'band-tracks',
  'band-tracks',
  true,
  52428800,  -- 50MB limit
  array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a'];

-- Create band-photos bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'band-photos',
  'band-photos',
  true,
  5242880,  -- 5MB limit
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Check seeded data counts
select
  (select count(*) from public.bands) as bands_count,
  (select count(*) from public.venues) as venues_count,
  (select count(*) from public.events) as events_count,
  (select count(*) from public.band_tracks) as tracks_count,
  (select count(*) from public.band_photos) as photos_count;

-- Check RLS policies on bands table
select
  policyname,
  cmd,
  qual::text as using_clause,
  with_check::text as with_check_clause
from pg_policies
where schemaname = 'public'
  and tablename = 'bands'
order by policyname;

-- Check storage buckets
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('band-tracks', 'band-photos');

-- ============================================================
-- NEXT STEP: SET UP STORAGE POLICIES VIA DASHBOARD
-- ============================================================
-- Storage policies cannot be created via SQL.
-- Follow the instructions in STORAGE_SETUP_GUIDE.md to:
-- 1. Create upload policies for authenticated users
-- 2. Create read policies for public access
-- ============================================================
