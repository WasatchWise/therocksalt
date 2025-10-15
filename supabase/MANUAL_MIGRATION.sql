-- ============================================================
-- MANUAL MIGRATION - Run in Supabase SQL Editor
-- ============================================================
-- This migration adds:
-- 1. ticket_price and flyer support to event submissions
-- 2. venue_id relationship to existing venues
-- 3. Band tagging for event submissions
-- 4. Storage bucket for event flyers

-- Step 1: Add fields to event_submissions table
ALTER TABLE public.event_submissions
ADD COLUMN IF NOT EXISTS ticket_price TEXT;

ALTER TABLE public.event_submissions
ADD COLUMN IF NOT EXISTS flyer_url TEXT;

ALTER TABLE public.event_submissions
ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.event_submissions.ticket_price IS 'Ticket price as text to allow for flexible formats like "$10", "Free", "$10-15", etc.';
COMMENT ON COLUMN public.event_submissions.flyer_url IS 'URL to uploaded event flyer (JPG/PDF) in Supabase storage';
COMMENT ON COLUMN public.event_submissions.venue_id IS 'Reference to venue in venues table';

-- Step 2: Create junction table for bands on event submissions
CREATE TABLE IF NOT EXISTS public.event_submission_bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_submission_id UUID NOT NULL REFERENCES public.event_submissions(id) ON DELETE CASCADE,
  band_id UUID REFERENCES public.bands(id) ON DELETE SET NULL,
  band_name TEXT NOT NULL,
  is_headliner BOOLEAN DEFAULT false,
  slot_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on event_submission_bands
ALTER TABLE public.event_submission_bands ENABLE ROW LEVEL SECURITY;

-- Policies for event_submission_bands
DROP POLICY IF EXISTS "Allow public to insert event submission bands" ON public.event_submission_bands;
CREATE POLICY "Allow public to insert event submission bands"
ON public.event_submission_bands
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public to read event submission bands" ON public.event_submission_bands;
CREATE POLICY "Allow public to read event submission bands"
ON public.event_submission_bands
FOR SELECT
TO public
USING (true);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_event_submission_bands_event_id
ON public.event_submission_bands(event_submission_id);

CREATE INDEX IF NOT EXISTS idx_event_submission_bands_band_id
ON public.event_submission_bands(band_id);

-- Step 3: Create storage bucket for event flyers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-flyers',
  'event-flyers',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Step 4: Storage policies for event flyers
DROP POLICY IF EXISTS "Public can view event flyers" ON storage.objects;
CREATE POLICY "Public can view event flyers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-flyers');

DROP POLICY IF EXISTS "Anyone can upload event flyers" ON storage.objects;
CREATE POLICY "Anyone can upload event flyers"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'event-flyers');

DROP POLICY IF EXISTS "Users can update their own flyers" ON storage.objects;
CREATE POLICY "Users can update their own flyers"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'event-flyers');

DROP POLICY IF EXISTS "Users can delete their own flyers" ON storage.objects;
CREATE POLICY "Users can delete their own flyers"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'event-flyers');

-- ============================================================
-- ADMIN AUTHENTICATION
-- ============================================================

-- Step 5: Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read their own admin status
DROP POLICY IF EXISTS "Users can read their own admin status" ON public.admin_users;
CREATE POLICY "Users can read their own admin status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Super admins can manage admin users
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;
CREATE POLICY "Super admins can manage admin users"
ON public.admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trigger_update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION update_admin_users_updated_at();

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- ============================================================
-- INSTRUCTIONS TO ADD YOURSELF AS ADMIN
-- ============================================================
-- After running this migration, you'll need to:
-- 1. Sign up for an account on your site at /auth/login (or use Supabase dashboard to create)
-- 2. Get your user ID from Supabase Auth dashboard
-- 3. Run this query to make yourself an admin:
--
-- INSERT INTO public.admin_users (id, email, role)
-- VALUES ('YOUR-USER-ID-HERE', 'your-email@example.com', 'super_admin')
-- ON CONFLICT (id) DO NOTHING;
