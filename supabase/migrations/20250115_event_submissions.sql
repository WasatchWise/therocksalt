-- Create event_submissions table for community event submissions
CREATE TABLE IF NOT EXISTS public.event_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  organizer_phone TEXT,
  event_description TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'UT',
  ticket_url TEXT,
  event_url TEXT,
  social_media_links JSONB,
  expected_attendance TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.event_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert event submissions
CREATE POLICY "Allow public event submissions"
  ON public.event_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow public to read their own submissions (optional, based on email)
CREATE POLICY "Allow public to read all event submissions"
  ON public.event_submissions
  FOR SELECT
  TO public
  USING (true);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_submissions_status ON public.event_submissions(status);
CREATE INDEX IF NOT EXISTS idx_event_submissions_created_at ON public.event_submissions(created_at DESC);
