-- First, let's see what columns the events table actually has
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'events' AND table_schema = 'public'
ORDER BY ordinal_position;
