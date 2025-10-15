-- Check what columns exist in the bands table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'bands'
ORDER BY ordinal_position;
