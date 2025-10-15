-- ============================================================
-- COMPLETE SETUP - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================================
-- This file combines all necessary fixes:
-- 1. Fix RLS policy for band claiming
-- 2. Create storage buckets if needed
-- 3. Set up storage policies for uploads
-- 4. Verify everything is working
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
-- PART 3: STORAGE POLICIES
-- ============================================================

-- Ensure storage.objects has RLS enabled
alter table storage.objects enable row level security;

-- Drop existing storage policies if they exist
drop policy if exists "Authenticated users can upload tracks" on storage.objects;
drop policy if exists "Public can read tracks" on storage.objects;
drop policy if exists "Authenticated users can upload photos" on storage.objects;
drop policy if exists "Public can read photos" on storage.objects;
drop policy if exists "Anyone can read public files" on storage.objects;
drop policy if exists "Authenticated users can upload to band buckets" on storage.objects;

-- Allow authenticated users to upload to band-tracks and band-photos buckets
create policy "Authenticated users can upload to band buckets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('band-tracks', 'band-photos')
  );

-- Allow anyone to read files from public buckets
create policy "Anyone can read public files"
  on storage.objects for select
  to public
  using (
    bucket_id in ('band-tracks', 'band-photos')
  );

-- ============================================================
-- PART 4: VERIFICATION
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

-- Check storage policies
select
  policyname,
  cmd as operation,
  roles
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- If you see the verification results above with:
-- - bands_count: 215 (or more)
-- - Storage buckets: band-tracks and band-photos
-- - RLS policies: "bands authenticated update claim or own"
-- - Storage policies: upload and read policies
--
-- Then you're ready to test the claim flow!
--
-- Next step: Disable email confirmation in the dashboard
-- https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/providers
-- ============================================================
