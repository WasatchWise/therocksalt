-- ============================================================
-- MASTER SETUP - COMPLETE PLATFORM CONFIGURATION
-- ============================================================
-- Run this file to set up everything needed for the platform:
-- 1. RLS policies for band claiming
-- 2. Storage buckets and policies
-- 3. Public read access for all content
-- 4. Authenticated user write access for owned content
-- ============================================================

-- ============================================================
-- PART 1: STORAGE BUCKETS
-- ============================================================

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
-- PART 2: STORAGE POLICIES
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can upload tracks" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read tracks" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read photos" ON storage.objects;

CREATE POLICY "Authenticated users can upload tracks"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'band-tracks');

CREATE POLICY "Anyone can read tracks"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'band-tracks');

CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'band-photos');

CREATE POLICY "Anyone can read photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'band-photos');

-- ============================================================
-- PART 3: BANDS TABLE POLICIES
-- ============================================================

DROP POLICY IF EXISTS "bands public read" ON public.bands;
DROP POLICY IF EXISTS "bands authenticated update claim or own" ON public.bands;

CREATE POLICY "bands public read"
  ON public.bands FOR SELECT
  TO public
  USING (true);

CREATE POLICY "bands authenticated update claim or own"
  ON public.bands FOR UPDATE
  TO authenticated
  USING (
    claimed_by IS NULL
    OR claimed_by = auth.uid()
  )
  WITH CHECK (
    claimed_by = auth.uid()
  );

-- ============================================================
-- PART 4: BAND RELATED TABLES
-- ============================================================

-- Band Links
DROP POLICY IF EXISTS "band_links public read" ON public.band_links;
DROP POLICY IF EXISTS "band_links authenticated manage own" ON public.band_links;

CREATE POLICY "band_links public read"
  ON public.band_links FOR SELECT
  TO public
  USING (true);

CREATE POLICY "band_links authenticated manage own"
  ON public.band_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bands
      WHERE bands.id = band_links.band_id
      AND bands.claimed_by = auth.uid()
    )
  );

-- Band Genres
DROP POLICY IF EXISTS "band_genres public read" ON public.band_genres;

CREATE POLICY "band_genres public read"
  ON public.band_genres FOR SELECT
  TO public
  USING (true);

-- Band Tracks
DROP POLICY IF EXISTS "band_tracks public read" ON public.band_tracks;
DROP POLICY IF EXISTS "band_tracks authenticated manage own" ON public.band_tracks;

CREATE POLICY "band_tracks public read"
  ON public.band_tracks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "band_tracks authenticated manage own"
  ON public.band_tracks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bands
      WHERE bands.id = band_tracks.band_id
      AND bands.claimed_by = auth.uid()
    )
  );

-- Band Photos
DROP POLICY IF EXISTS "band_photos public read" ON public.band_photos;
DROP POLICY IF EXISTS "band_photos authenticated manage own" ON public.band_photos;

CREATE POLICY "band_photos public read"
  ON public.band_photos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "band_photos authenticated manage own"
  ON public.band_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bands
      WHERE bands.id = band_photos.band_id
      AND bands.claimed_by = auth.uid()
    )
  );

-- ============================================================
-- PART 5: CONTENT TABLES (READ-ONLY FOR NOW)
-- ============================================================

-- Genres
DROP POLICY IF EXISTS "genres public read" ON public.genres;
CREATE POLICY "genres public read" ON public.genres FOR SELECT TO public USING (true);

-- Venues
DROP POLICY IF EXISTS "venues public read" ON public.venues;
CREATE POLICY "venues public read" ON public.venues FOR SELECT TO public USING (true);

-- Events
DROP POLICY IF EXISTS "events public read" ON public.events;
CREATE POLICY "events public read" ON public.events FOR SELECT TO public USING (true);

-- Event Bands
DROP POLICY IF EXISTS "event_bands public read" ON public.event_bands;
CREATE POLICY "event_bands public read" ON public.event_bands FOR SELECT TO public USING (true);

-- Episodes
DROP POLICY IF EXISTS "episodes public read" ON public.episodes;
CREATE POLICY "episodes public read" ON public.episodes FOR SELECT TO public USING (true);

-- Episode Links
DROP POLICY IF EXISTS "episode_links public read" ON public.episode_links;
CREATE POLICY "episode_links public read" ON public.episode_links FOR SELECT TO public USING (true);

-- Episode Bands
DROP POLICY IF EXISTS "episode_bands public read" ON public.episode_bands;
CREATE POLICY "episode_bands public read" ON public.episode_bands FOR SELECT TO public USING (true);

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Show all RLS policies
SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Show storage policies
SELECT
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;

-- Count records
SELECT
  (SELECT COUNT(*) FROM public.bands) AS bands,
  (SELECT COUNT(*) FROM public.venues) AS venues,
  (SELECT COUNT(*) FROM public.events) AS events,
  (SELECT COUNT(*) FROM public.episodes) AS episodes,
  (SELECT COUNT(*) FROM public.band_tracks) AS tracks,
  (SELECT COUNT(*) FROM public.band_photos) AS photos;

-- ============================================================
-- SETUP COMPLETE!
-- ============================================================
-- All tables now have proper RLS policies.
-- Public users can read all content.
-- Authenticated users can manage their claimed bands.
--
-- Next: Disable email confirmation for testing
-- https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/providers
-- ============================================================
