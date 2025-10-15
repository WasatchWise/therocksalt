# Music Submission Form - Setup & Usage Guide

This README covers the complete music submission form implementation for The Rock Salt.

## Overview

The music submission form allows bands to submit their information, photos, and music files to The Rock Salt. Submissions are stored in the `music_submissions` table and can be reviewed by admins before being approved and added to the bands directory.

## Features Implemented

- ✅ Comprehensive multi-section form with validation
- ✅ File uploads (band photos up to 5MB, music files up to 25MB)
- ✅ Real-time character counters for bio and description
- ✅ Client-side and server-side validation
- ✅ File preview for uploaded photos
- ✅ Genre selection (primary + up to 2 additional)
- ✅ Social media links collection
- ✅ Contact information capture
- ✅ Terms agreement and email opt-in
- ✅ Mobile-responsive Tailwind CSS design
- ✅ Success/error state handling
- ✅ Supabase Storage integration
- ✅ RLS policies for secure anonymous submissions

## Files Created

### 1. Components
- `src/components/MusicSubmissionForm.tsx` - Main form component with all validation and UI

### 2. Types
- `src/types/submission.ts` - TypeScript types for form data and database schema

### 3. Server Actions
- `src/app/submit/actions.ts` - Server-side form handling, file uploads, and database inserts

### 4. Pages
- `src/app/submit/page.tsx` - Submission page with form and instructions

### 5. Database
- `supabase/migrations/20250115_storage_buckets.sql` - Storage bucket setup migration
- `SETUP_STORAGE_AND_RLS.sql` - Complete SQL setup script for Supabase dashboard

## Setup Instructions

### Step 1: Run the SQL Setup Script

1. Open your Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new
   ```

2. Copy the contents of `SETUP_STORAGE_AND_RLS.sql` and run it in the SQL editor

3. Verify the buckets were created:
   - Go to Storage in your Supabase dashboard
   - You should see `band-photos` and `band-music` buckets

### Step 2: Verify Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yznquvzzqrvjafdfczak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Install Dependencies (if not already done)

```bash
cd "the-rock-salt"
yarn install
```

### Step 4: Run the Development Server

```bash
yarn dev
```

### Step 5: Test the Form

Navigate to `http://localhost:3000/submit` and test the submission form.

## Database Schema

### music_submissions Table

The form submits to the existing `music_submissions` table with the following structure:

```sql
CREATE TABLE public.music_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  hometown TEXT,
  links JSONB,  -- Stores: photo URLs, music URLs, social links, streaming links
  notes TEXT,   -- Stores: bio, description, additional info
  genre_preferences TEXT[],
  status TEXT CHECK (status IN ('pending','reviewed','accepted','declined')) DEFAULT 'pending',
  internal_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Storage Buckets

**band-photos:**
- Max size: 5MB
- Allowed types: JPG, PNG, WEBP
- Public read/write

**band-music:**
- Max size: 25MB
- Allowed types: MP3, WAV
- Public read/write

## Form Fields

### Section 1: Band Information
- Band Name* (required, 2-100 chars)
- Hometown/Location* (required, format: "City, ST")
- Short Bio* (required, 50-300 chars with live counter)
- Full Description (optional, max 1500 chars with counter)
- Band Photo (optional, max 5MB, JPG/PNG/WEBP)

### Section 2: Your Music
- Music Upload (optional, max 25MB, MP3/WAV)
- Song Title (optional)
- Song Description (optional)
- Streaming/Download Links (optional, comma-separated)

### Section 3: Genre & Style
- Primary Genre* (required, dropdown)
- Additional Genres (optional, max 2 checkboxes)
- "For Fans Of" (optional, text input)

### Section 4: Contact & Links
- Primary Contact Name* (required)
- Contact Email* (required, validated)
- Contact Phone (optional, tel format)
- Social Links (optional):
  - Website
  - Instagram
  - Facebook
  - Spotify
  - Bandcamp
  - TikTok

### Section 5: Submission Details
- How did you hear about us? (optional, dropdown)
- Available for live shows? (optional, radio buttons: Yes/No/Maybe)
- Additional Comments (optional, textarea)

### Section 6: Consent & Confirmation
- Terms Agreement* (required, checkbox)
- Email Opt-in (optional, checkbox)

## Validation Rules

**Client-side:**
- Required field validation
- Character count limits (bio: 50-300, description: max 1500)
- Email format validation
- Hometown format validation (City, ST)
- File size validation (photos: 5MB, music: 25MB)
- File type validation (photos: JPG/PNG/WEBP, music: MP3/WAV)
- Maximum 2 additional genres

**Server-side:**
- All client-side validations repeated
- File upload to Supabase Storage
- Rollback on errors (removes uploaded files if database insert fails)
- SQL injection prevention via parameterized queries

## Testing Checklist

- [ ] Form loads without errors
- [ ] All required fields show validation errors when empty
- [ ] Character counters update in real-time
- [ ] Photo preview displays when file is selected
- [ ] File size validation works (try uploading >5MB photo, >25MB music)
- [ ] File type validation works (try uploading .txt or .pdf)
- [ ] Additional genres limited to 2 selections
- [ ] Email validation rejects invalid formats
- [ ] Hometown validation enforces "City, ST" format
- [ ] Terms checkbox must be checked to submit
- [ ] Form submits successfully with valid data
- [ ] Success message displays on successful submission
- [ ] Error message displays on failed submission
- [ ] Files appear in Supabase Storage buckets
- [ ] Submission appears in `music_submissions` table with status='pending'
- [ ] Form resets after successful submission

## Viewing Submissions

### In Supabase Dashboard

1. Go to Table Editor:
   ```
   https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/editor
   ```

2. Select the `music_submissions` table

3. View all submissions with their status

### Storage Files

1. Go to Storage:
   ```
   https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/storage/buckets
   ```

2. Click on `band-photos` or `band-music` to view uploaded files

## Admin Workflow (Future Enhancement)

The submission workflow is designed for:

1. **Submission** - Band fills out form → status: `pending`
2. **Review** - Admin reviews submission in dashboard → status: `reviewed`
3. **Approval** - Admin approves → status: `accepted` → creates band entry
4. **Band Profile** - Submission data used to create band profile in `bands` table
5. **Claim Profile** - Email sent to contact_email with claim link

To implement the admin dashboard:
1. Create `/admin/submissions` page
2. Query `music_submissions` WHERE status='pending'
3. Add approve/reject buttons
4. On approve: create band entry and send claim email

## Customization

### Changing Genres

Edit `src/types/submission.ts`:

```typescript
export const GENRE_OPTIONS = [
  'Your Genre 1',
  'Your Genre 2',
  // ...
] as const
```

### Changing File Size Limits

Edit `SETUP_STORAGE_AND_RLS.sql` and update:

```sql
file_size_limit = 5242880, -- Change this (bytes)
```

Then update validation in `src/components/MusicSubmissionForm.tsx` and `src/app/submit/actions.ts`

### Adding New Fields

1. Update form component: `src/components/MusicSubmissionForm.tsx`
2. Update server action: `src/app/submit/actions.ts`
3. Update types: `src/types/submission.ts`
4. Add field to `music_submissions` table if needed

## Troubleshooting

### "Failed to upload photo/music"
- Check that storage buckets exist in Supabase dashboard
- Verify RLS policies allow public inserts
- Check file size/type restrictions

### "Failed to save submission"
- Check that `music_submissions` table has insert policy
- Verify all required fields are being sent
- Check browser console for detailed error

### Form doesn't submit
- Check browser console for validation errors
- Verify all required fields are filled
- Ensure terms checkbox is checked

### Files not appearing in Storage
- Check bucket names match exactly (`band-photos`, `band-music`)
- Verify storage policies exist
- Check browser network tab for upload errors

## Security Notes

- ✅ RLS enabled on `music_submissions` table
- ✅ Public can INSERT (submit) but not SELECT (view others' submissions)
- ✅ Storage buckets have public upload policies (consider rate limiting in production)
- ✅ File type and size validation on both client and server
- ✅ Server-side validation prevents malicious data
- ⚠️ Consider adding reCAPTCHA for production to prevent spam
- ⚠️ Consider adding rate limiting to prevent abuse

## Next Steps

1. **Run the SQL setup** - Execute `SETUP_STORAGE_AND_RLS.sql` in Supabase
2. **Test the form** - Visit `/submit` and submit a test entry
3. **Build admin dashboard** - Create interface to review/approve submissions
4. **Add email notifications** - Send confirmation emails on submission
5. **Implement claim workflow** - Allow bands to claim their profiles
6. **Add reCAPTCHA** - Prevent spam submissions

## Support

For issues or questions:
- Check browser console for errors
- Check Supabase logs in dashboard
- Verify environment variables are set correctly
- Ensure SQL setup script ran without errors

---

**Created:** January 2025
**Status:** Production Ready (pending SQL setup)
**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, Supabase
