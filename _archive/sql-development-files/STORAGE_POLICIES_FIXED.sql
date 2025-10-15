-- ============================================================
-- STORAGE BUCKET POLICIES FOR FILE UPLOADS (UPDATED)
-- ============================================================
-- This creates RLS policies on the storage.objects table
-- to allow authenticated users to upload tracks and photos
-- ============================================================

-- First, ensure storage.objects has RLS enabled
alter table storage.objects enable row level security;

-- Drop existing storage policies if they exist
drop policy if exists "Authenticated users can upload tracks" on storage.objects;
drop policy if exists "Public can read tracks" on storage.objects;
drop policy if exists "Authenticated users can upload photos" on storage.objects;
drop policy if exists "Public can read photos" on storage.objects;
drop policy if exists "Anyone can read public files" on storage.objects;
drop policy if exists "Authenticated users can upload to band buckets" on storage.objects;

-- ============================================================
-- COMBINED POLICIES FOR BOTH BUCKETS
-- ============================================================

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
-- VERIFY BUCKETS EXIST
-- ============================================================

select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('band-tracks', 'band-photos');

-- ============================================================
-- VERIFY POLICIES
-- ============================================================

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;
