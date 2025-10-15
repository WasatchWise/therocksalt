-- ==============================================================================
-- MUSIC SUBMISSION FORM - STORAGE SETUP & RLS POLICIES
-- ==============================================================================
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new
--
-- This sets up:
-- 1. Storage buckets for band photos and music files
-- 2. RLS policies to allow public uploads and reads
-- 3. Ensures the music_submissions table has proper insert policy
-- ==============================================================================

-- ==============================================================================
-- 1. CREATE STORAGE BUCKETS
-- ==============================================================================

-- Create band-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'band-photos',
  'band-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Create band-music bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'band-music',
  'band-music',
  true,
  26214400, -- 25MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav'];

-- ==============================================================================
-- 2. STORAGE POLICIES FOR BAND-PHOTOS BUCKET
-- ==============================================================================

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Public can upload band photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can read band photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own band photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own band photos" ON storage.objects;

-- Allow public uploads
CREATE POLICY "Public can upload band photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'band-photos');

-- Allow public reads
CREATE POLICY "Public can read band photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'band-photos');

-- Allow users to update their own uploads (future feature)
CREATE POLICY "Users can update own band photos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'band-photos')
WITH CHECK (bucket_id = 'band-photos');

-- Allow users to delete their own uploads (future feature)
CREATE POLICY "Users can delete own band photos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'band-photos');

-- ==============================================================================
-- 3. STORAGE POLICIES FOR BAND-MUSIC BUCKET
-- ==============================================================================

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Public can upload band music" ON storage.objects;
DROP POLICY IF EXISTS "Public can read band music" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own band music" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own band music" ON storage.objects;

-- Allow public uploads
CREATE POLICY "Public can upload band music"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'band-music');

-- Allow public reads
CREATE POLICY "Public can read band music"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'band-music');

-- Allow users to update their own uploads (future feature)
CREATE POLICY "Users can update own band music"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'band-music')
WITH CHECK (bucket_id = 'band-music');

-- Allow users to delete their own uploads (future feature)
CREATE POLICY "Users can delete own band music"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'band-music');

-- ==============================================================================
-- 4. VERIFY MUSIC_SUBMISSIONS TABLE AND RLS
-- ==============================================================================

-- Ensure RLS is enabled on music_submissions
ALTER TABLE public.music_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Allow anonymous submissions" ON public.music_submissions;

-- Allow anonymous submissions (public inserts)
CREATE POLICY "Allow anonymous submissions"
ON public.music_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- ==============================================================================
-- 5. VERIFICATION QUERIES
-- ==============================================================================

-- Run these separately to verify everything is set up correctly:

-- Check buckets were created:
-- SELECT * FROM storage.buckets WHERE id IN ('band-photos', 'band-music');

-- Check storage policies:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%band%';

-- Check music_submissions policies:
-- SELECT * FROM pg_policies WHERE tablename = 'music_submissions';

-- ==============================================================================
-- SUCCESS!
-- ==============================================================================
-- If this SQL ran without errors, your storage buckets and RLS policies are
-- ready for the music submission form!
--
-- Next steps:
-- 1. Visit http://localhost:3000/submit to test the form
-- 2. Check submissions in your Supabase dashboard:
--    https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/editor
-- ==============================================================================
