-- Check what's in event_submissions
SELECT
  id,
  event_name,
  status,
  start_time,
  organizer_name
FROM public.event_submissions
ORDER BY created_at DESC
LIMIT 10;

-- Check what's in events table
SELECT
  id,
  name,
  start_time,
  created_at
FROM public.events
ORDER BY created_at DESC
LIMIT 10;

-- Check if the trigger exists
SELECT
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_promote_approved_event';

-- Check event_bands table
SELECT
  event_id,
  band_name,
  created_at
FROM public.event_bands
ORDER BY created_at DESC
LIMIT 10;
