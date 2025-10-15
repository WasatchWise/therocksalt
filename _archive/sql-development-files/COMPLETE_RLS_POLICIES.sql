-- ============================================================
-- COMPLETE RLS POLICIES FOR ALL TABLES
-- ============================================================
-- This sets up read access for all public-facing content
-- and appropriate write access for authenticated users
-- ============================================================

-- ============================================================
-- BANDS TABLE (already configured, but including for completeness)
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
-- BAND LINKS TABLE
-- ============================================================

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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bands
      WHERE bands.id = band_links.band_id
      AND bands.claimed_by = auth.uid()
    )
  );

-- ============================================================
-- BAND GENRES TABLE
-- ============================================================

DROP POLICY IF EXISTS "band_genres public read" ON public.band_genres;

CREATE POLICY "band_genres public read"
  ON public.band_genres FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- BAND TRACKS TABLE
-- ============================================================

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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bands
      WHERE bands.id = band_tracks.band_id
      AND bands.claimed_by = auth.uid()
    )
  );

-- ============================================================
-- BAND PHOTOS TABLE
-- ============================================================

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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bands
      WHERE bands.id = band_photos.band_id
      AND bands.claimed_by = auth.uid()
    )
  );

-- ============================================================
-- GENRES TABLE
-- ============================================================

DROP POLICY IF EXISTS "genres public read" ON public.genres;

CREATE POLICY "genres public read"
  ON public.genres FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- VENUES TABLE
-- ============================================================

DROP POLICY IF EXISTS "venues public read" ON public.venues;

CREATE POLICY "venues public read"
  ON public.venues FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- VENUE LINKS TABLE (if it exists)
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'venue_links'
  ) THEN
    DROP POLICY IF EXISTS "venue_links public read" ON public.venue_links;

    CREATE POLICY "venue_links public read"
      ON public.venue_links FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- ============================================================
-- EVENTS TABLE
-- ============================================================

DROP POLICY IF EXISTS "events public read" ON public.events;

CREATE POLICY "events public read"
  ON public.events FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- EVENT BANDS TABLE
-- ============================================================

DROP POLICY IF EXISTS "event_bands public read" ON public.event_bands;

CREATE POLICY "event_bands public read"
  ON public.event_bands FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- EPISODES TABLE
-- ============================================================

DROP POLICY IF EXISTS "episodes public read" ON public.episodes;

CREATE POLICY "episodes public read"
  ON public.episodes FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- EPISODE LINKS TABLE
-- ============================================================

DROP POLICY IF EXISTS "episode_links public read" ON public.episode_links;

CREATE POLICY "episode_links public read"
  ON public.episode_links FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- EPISODE BANDS TABLE
-- ============================================================

DROP POLICY IF EXISTS "episode_bands public read" ON public.episode_bands;

CREATE POLICY "episode_bands public read"
  ON public.episode_bands FOR SELECT
  TO public
  USING (true);

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Show all policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Count records in each table
SELECT
  (SELECT COUNT(*) FROM public.bands) AS bands_count,
  (SELECT COUNT(*) FROM public.venues) AS venues_count,
  (SELECT COUNT(*) FROM public.events) AS events_count,
  (SELECT COUNT(*) FROM public.episodes) AS episodes_count,
  (SELECT COUNT(*) FROM public.genres) AS genres_count,
  (SELECT COUNT(*) FROM public.band_tracks) AS band_tracks_count,
  (SELECT COUNT(*) FROM public.band_photos) AS band_photos_count;
