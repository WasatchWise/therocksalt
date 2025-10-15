-- ============================================================
-- FIX RLS POLICY FOR BAND CLAIMING
-- ============================================================
-- This fixes the RLS policy to allow authenticated users to
-- claim unclaimed bands (where claimed_by IS NULL)
-- ============================================================

-- Drop the existing restrictive update policy
drop policy if exists "bands authenticated update own" on public.bands;

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
-- VERIFY SETUP
-- ============================================================

-- Check if data is seeded
select
  (select count(*) from public.bands) as bands_count,
  (select count(*) from public.venues) as venues_count,
  (select count(*) from public.events) as events_count,
  (select count(*) from public.band_tracks) as tracks_count,
  (select count(*) from public.band_photos) as photos_count;

-- Check RLS policies on bands table
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where tablename = 'bands'
order by policyname;

-- Check storage buckets exist
select id, name, public from storage.buckets
where id in ('band-tracks', 'band-photos');

-- ============================================================
-- TEMPORARILY DISABLE EMAIL CONFIRMATION (OPTIONAL)
-- ============================================================
-- Run this section if you want to test without email confirmation.
-- You can re-enable it later in the Supabase Dashboard under:
-- Authentication > Providers > Email > Confirm email
--
-- Note: This can only be done via the Supabase Dashboard UI,
-- not via SQL. Go to:
-- https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/providers
--
-- Uncheck "Confirm email" to allow immediate sign-in without verification.
-- ============================================================
