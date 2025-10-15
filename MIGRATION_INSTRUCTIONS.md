# Database Migration Instructions

## Quick Start - Run the Migration

### Option 1: Via Supabase Dashboard (Recommended)

1. **Open the SQL Editor**:
   ```
   https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new
   ```

2. **Copy and paste** the contents of `CONSOLIDATED_MIGRATION.sql` into the SQL Editor

3. **Click "Run"** to execute the migration

4. **Verify success** - You should see "Migration completed successfully!" at the bottom

### Option 2: Via CLI (if you have DB password)

If you have your database password:

```bash
supabase db push --linked --password YOUR_DB_PASSWORD
```

## What This Migration Does

✅ **Band Pages Enhancement**
- Adds `bio`, `description`, `image_url` to bands
- Adds `claimed_by` and `claimed_at` for ownership
- Creates `band_tracks` table for MP3 uploads
- Creates `band_photos` table for image galleries
- Adds slugs with unique index

✅ **Venue Enhancement**
- Adds `address`, `website`, `capacity` fields

✅ **Event Enhancement**
- Adds `name`, `description`, `end_time`, `ticket_url`, `featured` fields

✅ **RLS & Security**
- Sets up Row Level Security policies
- Authenticated users can manage their claimed bands
- Anonymous users can read all content
- Storage buckets for audio/photos with proper policies

✅ **Performance**
- Indexes on band_id, created_at, claimed_by
- Optimized for queries

## After Migration

Once migration is complete, run:

```bash
# Regenerate TypeScript types
yarn db:types

# Or manually:
supabase gen types typescript --linked > src/types/supabase.ts
```

## Troubleshooting

**If migration fails:**
1. Check if tables already exist (migration is idempotent, should be safe to re-run)
2. Verify you're logged into Supabase CLI: `supabase login`
3. Verify project is linked: `supabase projects list`
4. Check for any data conflicts (especially slug uniqueness)

**If you see "password authentication failed":**
- Use Option 1 (Dashboard) instead
- Or get your DB password from: Dashboard → Settings → Database → Connection String
