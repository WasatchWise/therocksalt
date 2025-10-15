-- ============================================================
-- COMPLETE SETUP - ALL-IN-ONE (FINAL VERSION)
-- ============================================================
-- Run this entire file in the Supabase SQL Editor.
-- This sets up everything needed for the claim & upload flow.
-- ============================================================

-- ============================================================
-- PART 1: FIX RLS POLICY FOR BAND CLAIMING
-- ============================================================

-- Drop existing policies
DROP POLICY IF EXISTS "bands authenticated update own" ON public.bands;
DROP POLICY IF EXISTS "bands authenticated update claim or own" ON public.bands;

-- Create new policy that allows claiming unclaimed bands
CREATE POLICY "bands authenticated update claim or own"
  ON public.bands FOR UPDATE
  TO authenticated
  USING (
    claimed_by IS NULL  -- Allow claiming unclaimed bands
    OR claimed_by = auth.uid()  -- Allow updating own bands
  )
  WITH CHECK (
    claimed_by = auth.uid()  -- Can only set claimed_by to your own user ID
  );

-- ============================================================
-- PART 2: CREATE STORAGE BUCKETS
-- ============================================================

-- Create band-tracks bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'band-tracks',
  'band-tracks',
  true,
  52428800,  -- 50MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a'];

-- Create band-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'band-photos',
  'band-photos',
  true,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- ============================================================
-- PART 3: STORAGE POLICIES
-- ============================================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload tracks" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read tracks" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read photos" ON storage.objects;

-- Policies for band-tracks bucket
CREATE POLICY "Authenticated users can upload tracks"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'band-tracks');

CREATE POLICY "Anyone can read tracks"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'band-tracks');

-- Policies for band-photos bucket
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'band-photos');

CREATE POLICY "Anyone can read photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'band-photos');

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Check seeded data counts
SELECT
  (SELECT COUNT(*) FROM public.bands) AS bands_count,
  (SELECT COUNT(*) FROM public.venues) AS venues_count,
  (SELECT COUNT(*) FROM public.events) AS events_count,
  (SELECT COUNT(*) FROM public.band_tracks) AS tracks_count,
  (SELECT COUNT(*) FROM public.band_photos) AS photos_count;

-- Check RLS policies on bands table
SELECT
  policyname,
  cmd,
  qual::text AS using_clause,
  with_check::text AS with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'bands'
ORDER BY policyname;

-- Check storage buckets
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('band-tracks', 'band-photos');

-- Check storage policies
SELECT
  policyname,
  cmd AS operation,
  roles
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%track%' OR policyname LIKE '%photo%'
ORDER BY policyname;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- If you see the verification results above, you're ready!
--
-- Next steps:
-- 1. Disable email confirmation (optional for testing):
--    https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/providers
--
-- 2. Test the flow:
--    - Sign up at http://localhost:3000/auth/signup
--    - Browse bands at http://localhost:3000/bands
--    - Claim a band page
--    - Upload tracks and photos
--    - View your public band page
-- ============================================================
