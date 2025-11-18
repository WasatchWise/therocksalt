-- Add external event tracking fields for API imports
-- Created: 2025-11-18

-- Add external source tracking
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS external_id text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS external_source text CHECK (external_source IN ('bandsintown', 'songkick', 'manual'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS age_restriction text;

-- Add name column as alias for title (for consistency with API naming)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS name text;

-- Create unique index on external_id to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS events_external_id_idx ON public.events(external_id) WHERE external_id IS NOT NULL;

-- Index for external source queries
CREATE INDEX IF NOT EXISTS events_external_source_idx ON public.events(external_source) WHERE external_source IS NOT NULL;

-- Comments
COMMENT ON COLUMN public.events.external_id IS 'Unique identifier from external source (e.g., bandsintown-12345)';
COMMENT ON COLUMN public.events.external_source IS 'Source of the event data (bandsintown, songkick, manual)';
COMMENT ON COLUMN public.events.age_restriction IS 'Age restriction for the event (e.g., 21+, All Ages)';
COMMENT ON COLUMN public.events.name IS 'Event name (alternative to title for API compatibility)';
