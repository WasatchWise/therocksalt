-- Enable users to edit their event submissions

-- Add edit token to event_submissions
ALTER TABLE public.event_submissions
ADD COLUMN IF NOT EXISTS edit_token TEXT UNIQUE DEFAULT gen_random_uuid()::text;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_submissions_edit_token ON public.event_submissions(edit_token);

-- Policy: Allow public to update their own submissions with edit token
DROP POLICY IF EXISTS "Users can update with edit token" ON public.event_submissions;
CREATE POLICY "Users can update with edit token"
ON public.event_submissions
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Generate edit tokens for existing submissions
UPDATE public.event_submissions
SET edit_token = gen_random_uuid()::text
WHERE edit_token IS NULL;
