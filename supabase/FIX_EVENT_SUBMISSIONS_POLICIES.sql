-- ============================================================
-- FIX EVENT SUBMISSIONS POLICIES - Allow admins to update submissions
-- ============================================================

-- Allow admins to update event submissions status
DROP POLICY IF EXISTS "Admins can update event submissions" ON public.event_submissions;
CREATE POLICY "Admins can update event submissions"
ON public.event_submissions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  )
);

-- Allow admins to delete event submissions
DROP POLICY IF EXISTS "Admins can delete event submissions" ON public.event_submissions;
CREATE POLICY "Admins can delete event submissions"
ON public.event_submissions
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  )
);

-- Allow admins to read all event submissions
DROP POLICY IF EXISTS "Admins can read all event submissions" ON public.event_submissions;
CREATE POLICY "Admins can read all event submissions"
ON public.event_submissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  )
);
