-- Fix storage RLS: require owner for UPDATE/DELETE on public buckets
-- Buckets: band-photos, band-music
-- This migration preserves existing INSERT/SELECT behavior to avoid breaking current flows.

-- Ensure RLS enabled on storage.objects (no-op if already enabled)
alter table if exists storage.objects enable row level security;

-- Drop weak DELETE policies and recreate with owner checks
drop policy if exists "Users can delete own band photos" on storage.objects;
create policy "Users can delete own band photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'band-photos' and owner = auth.uid()
  );

drop policy if exists "Users can delete own band music" on storage.objects;
create policy "Users can delete own band music"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'band-music' and owner = auth.uid()
  );

-- Tighten UPDATE policies to owner-only as well
drop policy if exists "Users can update own band photos" on storage.objects;
create policy "Users can update own band photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'band-photos' and owner = auth.uid()
  )
  with check (
    bucket_id = 'band-photos' and owner = auth.uid()
  );

drop policy if exists "Users can update own band music" on storage.objects;
create policy "Users can update own band music"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'band-music' and owner = auth.uid()
  )
  with check (
    bucket_id = 'band-music' and owner = auth.uid()
  );

-- Keep existing INSERT/SELECT policies as-is (public uploads and reads),
-- but you may later restrict INSERT to authenticated uploads if your UX allows.

-- Verification
-- Check resulting policies on storage.objects
-- select policyname, roles, cmd
-- from pg_policies
-- where schemaname = 'storage' and tablename = 'objects'
-- order by policyname;


