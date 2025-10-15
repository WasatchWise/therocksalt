-- Add ticket_price and flyer fields to event_submissions table

-- Add ticket_price field
ALTER TABLE public.event_submissions
ADD COLUMN IF NOT EXISTS ticket_price TEXT;

-- Add flyer_url field for storing uploaded flyers
ALTER TABLE public.event_submissions
ADD COLUMN IF NOT EXISTS flyer_url TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.event_submissions.ticket_price IS 'Ticket price as text to allow for flexible formats like "$10", "Free", "$10-15", etc.';
COMMENT ON COLUMN public.event_submissions.flyer_url IS 'URL to uploaded event flyer (JPG/PDF) in Supabase storage';
