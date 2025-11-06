-- Add admin_feedback column to music_submissions table
-- This allows admins to provide detailed feedback when declining submissions

ALTER TABLE public.music_submissions
ADD COLUMN IF NOT EXISTS admin_feedback TEXT;

-- Add updated_at column for tracking when submissions are modified
ALTER TABLE public.music_submissions
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS trigger_update_music_submissions_updated_at ON public.music_submissions;

CREATE TRIGGER trigger_update_music_submissions_updated_at
BEFORE UPDATE ON public.music_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Update RLS policies to allow admins to read all submissions
-- (The existing policies may be too restrictive)

-- Drop existing policies
DROP POLICY IF EXISTS "Staff can review submissions" ON public.music_submissions;
DROP POLICY IF EXISTS "Staff can update submissions" ON public.music_submissions;
DROP POLICY IF EXISTS "Staff can delete submissions" ON public.music_submissions;

-- Create new admin policies (checking admin_users table)
CREATE POLICY "Admins can view all submissions"
ON public.music_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  )
);

CREATE POLICY "Admins can update submissions"
ON public.music_submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  )
);

CREATE POLICY "Admins can delete submissions"
ON public.music_submissions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Verify the table structure
COMMENT ON COLUMN public.music_submissions.admin_feedback IS 'Feedback from admin when declining or requesting changes';
COMMENT ON COLUMN public.music_submissions.updated_at IS 'Timestamp of last update to this submission';
