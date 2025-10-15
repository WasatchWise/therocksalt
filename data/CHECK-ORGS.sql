-- Check what organizations exist in the database
SELECT id, name, slug FROM public.organizations
ORDER BY name;

-- Also check the venues schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'venues'
ORDER BY ordinal_position;
