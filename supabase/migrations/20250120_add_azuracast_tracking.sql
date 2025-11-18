-- Add AzuraCast tracking to music_submissions
-- This migration adds fields to track AzuraCast media IDs and upload status

-- Add AzuraCast media ID to music_submissions links JSONB
-- The links field already exists, we'll just document that it can contain:
-- - azuracast_media_id: integer (AzuraCast media file ID)
-- - azuracast_uploaded_at: timestamp (when it was uploaded)
-- - azuracast_playlist_added: boolean (whether it was added to playlist)

-- Create a separate table for better tracking and querying
CREATE TABLE IF NOT EXISTS public.azuracast_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES public.music_submissions(id) ON DELETE CASCADE NOT NULL,
  media_id integer NOT NULL,
  path text,
  uploaded_at timestamptz DEFAULT now() NOT NULL,
  playlist_added boolean DEFAULT false,
  playlist_id integer,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(submission_id)
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS azuracast_media_submission_id_idx ON public.azuracast_media(submission_id);
CREATE INDEX IF NOT EXISTS azuracast_media_media_id_idx ON public.azuracast_media(media_id);

-- Enable RLS
ALTER TABLE public.azuracast_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access"
  ON public.azuracast_media FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage all"
  ON public.azuracast_media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER azuracast_media_updated_at
  BEFORE UPDATE ON public.azuracast_media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Comments
COMMENT ON TABLE public.azuracast_media IS 'Tracks AzuraCast media uploads for music submissions';
COMMENT ON COLUMN public.azuracast_media.media_id IS 'AzuraCast media file ID';
COMMENT ON COLUMN public.azuracast_media.playlist_added IS 'Whether the track was successfully added to a playlist';

