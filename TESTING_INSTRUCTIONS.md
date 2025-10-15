# Testing Instructions for Band Claiming Flow

## Issues Identified

1. **RLS Policy Too Restrictive**: The current policy only allows updates when `claimed_by = auth.uid()`, but when claiming an unclaimed band, `claimed_by` is `NULL`, so the policy blocks the update.

2. **Email Confirmation Required**: Supabase project requires email confirmation before users can sign in, which blocks testing without inbox access.

3. **Data Not Seeded**: Remote Supabase project doesn't appear to have the seeded band data yet.

## Solutions

### 1. Fix RLS Policy (REQUIRED)

Run `FIX_RLS_AND_VERIFY.sql` in the Supabase SQL Editor:

1. Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new
2. Paste the contents of `FIX_RLS_AND_VERIFY.sql`
3. Click "Run"

This will:
- Drop the restrictive RLS policy
- Create a new policy that allows claiming unclaimed bands
- Verify the setup and show counts of seeded data

### 2. Disable Email Confirmation (RECOMMENDED FOR TESTING)

**Option A: Via Dashboard (Easiest)**
1. Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/providers
2. Click on "Email" provider
3. Uncheck "Confirm email"
4. Save changes

This allows immediate sign-in without email verification during development.

**Option B: Confirm a Test User Manually**
If you prefer to keep email confirmation enabled:
1. Create a test user via sign-up
2. Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/users
3. Find the user and click the "..." menu
4. Click "Confirm user"

### 3. Verify Data is Seeded

After running `FIX_RLS_AND_VERIFY.sql`, check the results show:
- `bands_count`: 215
- `venues_count`: 62
- `events_count`: 3
- `tracks_count`: 4
- `photos_count`: 4

If counts are 0, run `SEED_NO_CONFLICT.sql` again from the SQL Editor.

### 4. Verify Storage Buckets

The query in `FIX_RLS_AND_VERIFY.sql` will also check that storage buckets exist:
- `band-tracks` (public)
- `band-photos` (public)

If they don't exist, they were created in the original migration. You may need to run `CONSOLIDATED_MIGRATION.sql` again.

## Storage Bucket Policies

The storage buckets need RLS policies to allow authenticated users to upload files. Run this SQL to add them:

```sql
-- Policy for band-tracks bucket
insert into storage.policies (bucket_id, name, definition, operation)
values (
  'band-tracks',
  'Authenticated users can upload tracks',
  '(auth.role() = ''authenticated'')',
  'INSERT'
) on conflict do nothing;

insert into storage.policies (bucket_id, name, definition, operation)
values (
  'band-tracks',
  'Public can read tracks',
  'true',
  'SELECT'
) on conflict do nothing;

-- Policy for band-photos bucket
insert into storage.policies (bucket_id, name, definition, operation)
values (
  'band-photos',
  'Authenticated users can upload photos',
  '(auth.role() = ''authenticated'')',
  'INSERT'
) on conflict do nothing;

insert into storage.policies (bucket_id, name, definition, operation)
values (
  'band-photos',
  'Public can read photos',
  'true',
  'SELECT'
) on conflict do nothing;
```

## Testing the Flow

Once the above fixes are applied:

1. **Sign Up**: http://localhost:3000/auth/signup
   - Use any email (doesn't need to be real if email confirmation is disabled)
   - Password must be 6+ characters

2. **Browse Artists**: http://localhost:3000/bands
   - Find an unclaimed band (most should be unclaimed)

3. **Claim Band**: Click into any band page
   - You should see "Is this your band?" prompt
   - Click "Claim This Page"
   - Should redirect to dashboard after 2 seconds

4. **Manage Band**: In dashboard
   - Click "Manage" on your claimed band
   - Upload a track (MP3, WAV, or M4A)
   - Upload a photo (JPG, PNG, or WebP)

5. **View Public Page**: Click "View Public Page"
   - Verify your uploaded content appears
   - Notice the claim button is gone (band is now claimed)

## Troubleshooting

### "You must be signed in to claim a band page"
- Email confirmation is still enabled and your account isn't verified
- Solution: Disable email confirmation or manually confirm the user

### "This band page has already been claimed"
- The band was already claimed by another user
- Solution: Try a different band or reset `claimed_by` to NULL in the database

### "Upload failed: new row violates row-level security policy"
- Storage bucket policies aren't set up
- Solution: Run the storage policy SQL above

### "Band not found" when querying bands
- Data isn't seeded yet
- Solution: Run `SEED_NO_CONFLICT.sql` in SQL Editor

## Alternative: Service Role Key Testing

If you want to test programmatically without dealing with email confirmation, you can:

1. Get the service role key from: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/settings/api
2. Create a test script that uses the service role key to:
   - Create and auto-confirm users
   - Directly update bands table for testing

**Note**: Never commit the service role key to the repository!
