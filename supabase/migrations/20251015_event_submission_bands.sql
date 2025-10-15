-- Add band relationship to event submissions

-- Add venue_id to link to existing venues
ALTER TABLE public.event_submissions
ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL;

-- Create junction table for bands on event submissions
CREATE TABLE IF NOT EXISTS public.event_submission_bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_submission_id UUID NOT NULL REFERENCES public.event_submissions(id) ON DELETE CASCADE,
  band_id UUID REFERENCES public.bands(id) ON DELETE SET NULL,
  band_name TEXT NOT NULL, -- Store name in case band is not in our DB yet
  is_headliner BOOLEAN DEFAULT false,
  slot_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.event_submission_bands ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert bands for their event submissions
CREATE POLICY IF NOT EXISTS "Allow public to insert event submission bands"
ON public.event_submission_bands
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow public to read event submission bands
CREATE POLICY IF NOT EXISTS "Allow public to read event submission bands"
ON public.event_submission_bands
FOR SELECT
TO public
USING (true);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_submission_bands_event_id
ON public.event_submission_bands(event_submission_id);

CREATE INDEX IF NOT EXISTS idx_event_submission_bands_band_id
ON public.event_submission_bands(band_id);
