# Final Setup Checklist - Testing Readiness

## Current Status

✅ **Completed:**
- Database schema migrated
- 215 bands seeded
- 62 venues seeded
- 3 events seeded
- 3 episodes seeded
- RLS policies configured (public read, authenticated write)
- Storage buckets created (band-tracks, band-photos)
- Storage policies configured
- Auth pages built (signup/signin)
- Dashboard built
- Claim flow implemented
- Upload forms created

❌ **Blocking Issue:**
- **Email confirmation is still enabled** - prevents immediate sign-in after signup

---

## Critical: Disable Email Confirmation

**You MUST do this to test the platform:**

### Step 1: Go to Auth Settings
https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/providers

### Step 2: Configure Email Provider
1. Click on "Email" in the providers list
2. Scroll down to "Confirm email" setting
3. **UNCHECK "Enable email confirmations"**
4. Click "Save"

### Step 3: Verify the Change
After saving, new signups should work immediately without email confirmation.

---

## Alternative: Manually Confirm Existing Users

If you want to keep email confirmation enabled but test with existing accounts:

### Via Dashboard:
1. Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/users
2. Find the user (codex1759709925987@gmail.com)
3. Click the "..." menu on the right
4. Click "Confirm user"
5. User can now sign in

---

## Verification Steps

After disabling email confirmation:

### 1. Create Test Account
```
Email: test@example.com (can be fake)
Password: test123 (min 6 chars)
```

Go to: http://localhost:3000/auth/signup

Should:
- ✅ Create account
- ✅ Sign in immediately
- ✅ Redirect to dashboard
- ✅ No email confirmation required

### 2. Test Band Claiming
1. Go to: http://localhost:3000/bands
2. Click any band (e.g., "The Brobecks")
3. Should see "Is this your band?" section
4. Click "Claim This Page"
5. Should redirect to dashboard after 2 seconds

### 3. Test File Uploads

In dashboard:
1. Click "Manage" on your claimed band
2. Upload a track:
   - Title: "Test Demo"
   - Type: Demo
   - File: Any MP3/WAV/M4A file
3. Upload a photo:
   - File: Any JPG/PNG/WebP image
   - Optional: Set as primary
4. Verify uploads appear in the lists

### 4. Verify Public Page
1. Click "View Public Page" button
2. Should see:
   - ✅ Uploaded track with audio player
   - ✅ Uploaded photo in gallery
   - ✅ No "Claim This Page" button (already claimed)
   - ✅ Track play counter increments when played

---

## Troubleshooting

### "Email not confirmed" error
**Solution:** Disable email confirmation in Auth settings (see above)

### Bands directory empty
**Solution:** Run `SEED_NO_CONFLICT.sql` in SQL Editor

### "new row violates row-level security policy"
**Solution:** Run `MASTER_SETUP_SAFE.sql` to configure all RLS policies

### Upload fails with storage error
**Solution:** Verify storage policies exist (should be in `MASTER_SETUP_SAFE.sql`)

### Can't claim band - "already claimed"
**Solution:** Pick a different band or reset with:
```sql
UPDATE public.bands
SET claimed_by = NULL, claimed_at = NULL
WHERE slug = 'the-brobecks';
```

---

## Quick Links

- **Auth Providers:** https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/providers
- **Users List:** https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/users
- **SQL Editor:** https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new
- **Storage:** https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/storage/buckets

- **Local App:** http://localhost:3000
- **Sign Up:** http://localhost:3000/auth/signup
- **Bands:** http://localhost:3000/bands
- **Dashboard:** http://localhost:3000/dashboard

---

## Expected Flow (After Email Confirmation Disabled)

1. **Sign Up** → Immediate sign-in, redirect to dashboard
2. **Browse Bands** → See 215 bands
3. **View Band** → See "Claim This Page" button
4. **Claim Band** → Success message, redirect to dashboard
5. **Dashboard** → See claimed band with 0 tracks, 0 photos
6. **Manage Band** → Upload track and photo
7. **View Public Page** → See uploads, play audio
8. **Dashboard** → See updated stats (1 track, 1 photo, play count)

---

## Data Verification SQL

Run this to verify everything is set up:

```sql
-- Check data counts
SELECT
  (SELECT COUNT(*) FROM public.bands) AS bands,
  (SELECT COUNT(*) FROM public.venues) AS venues,
  (SELECT COUNT(*) FROM public.events) AS events,
  (SELECT COUNT(*) FROM public.episodes) AS episodes,
  (SELECT COUNT(*) FROM public.bands WHERE claimed_by IS NOT NULL) AS claimed_bands;

-- Check storage buckets
SELECT id, name, public
FROM storage.buckets
WHERE id IN ('band-tracks', 'band-photos');

-- Check RLS policies
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'bands'
ORDER BY policyname;

-- Check storage policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;
```

Expected results:
- bands: 215
- venues: 62
- events: 3
- episodes: 3
- claimed_bands: 0 (until you claim one)
- 2 storage buckets
- 2 RLS policies on bands table
- 4 storage policies

---

## Summary

**The platform is fully built and ready to test.**

The ONLY thing blocking testing is **email confirmation being enabled**.

Once you disable it (takes 30 seconds in the dashboard), the entire flow will work end-to-end.
