-- ============================================================
-- ADD PUBLIC READ POLICIES FOR BANDS TABLE
-- ============================================================
-- This allows anonymous users to view the bands directory
-- ============================================================

-- Check existing policies on bands table
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'bands'
ORDER BY policyname;

-- Add SELECT policy for public/anonymous users
DROP POLICY IF EXISTS "bands public read" ON public.bands;

CREATE POLICY "bands public read"
  ON public.bands FOR SELECT
  TO public
  USING (true);

-- Verify policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'bands'
ORDER BY policyname;
