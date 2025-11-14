# The Rock Salt - Deployment Checklist

**Date:** October 15, 2025
**Features Complete:** Admin UI for Music Submissions + Save Band Feature + UX Improvements

---

## ✅ Completed Work

### 1. Database Schema Updates
- ✅ Created migration: `supabase/migrations/20251015_add_admin_feedback_to_music_submissions.sql`
- ✅ Created manual SQL script: `supabase/MANUAL_RUN_add_admin_feedback.sql`
- ✅ Added `admin_feedback` TEXT column to `music_submissions` table
- ✅ Added `updated_at` TIMESTAMPTZ column to `music_submissions` table
- ✅ Updated RLS policies to check `admin_users` table for admin access
- ✅ Seeded 8 test music submissions (complete, incomplete, edge cases)

### 2. Admin UI for Music Submissions
- ✅ Created `/admin/music-submissions` page (`src/app/admin/music-submissions/page.tsx`)
- ✅ Filter tabs: All / Pending / Reviewed / Accepted / Declined (with counts)
- ✅ Bulk action checkboxes for multi-select
- ✅ Individual submission cards with:
  - Band name, genres, contact info, location
  - Band photo preview
  - Audio player for music samples
  - Full submission notes
  - Social media links
  - Admin feedback history
- ✅ Action buttons: Accept, Decline with Feedback, Mark Reviewed, Delete
- ✅ Feedback modal for decline messages
- ✅ Added "Music Submissions" button to main admin dashboard (`src/app/admin/page.tsx`)

### 3. Save Band Feature (Phase 1: localStorage)
- ✅ Created localStorage utilities (`src/lib/savedBands.ts`):
  - `saveBand()`, `unsaveBand()`, `isBandSaved()`
  - `getSavedBands()`, `getSavedBandsCount()`
  - `getSavedBandsGenres()`, `sortSavedBands()`
  - `clearAllSavedBands()`
- ✅ Created SaveBandButton component (`src/components/SaveBandButton.tsx`)
  - Heart icon (filled when saved, outline when not)
  - Pulse animation on save
  - Emits custom 'bandSaved' event
- ✅ Created /my-bands page (`src/app/my-bands/page.tsx`)
  - Grid layout of saved bands
  - Genre filter dropdown
  - Sort by: Newest / Oldest / Alphabetical
  - Clear All button with confirmation modal
  - Empty state with "Explore Bands" CTA
- ✅ Added "My Bands" link to navigation (`src/components/Header.tsx`)
  - Desktop nav with heart icon + badge count
  - Mobile nav with heart icon + badge count
  - Badge only shows if savedCount > 0
- ✅ Added heart icon pulse animation to global CSS (`src/app/globals.css`)

### 4. UX Improvements to Submission Form
- ✅ Updated bio help text to explain WHY 50-character minimum exists (`src/components/MusicSubmissionForm.tsx`)
- ✅ Added example bio text
- ✅ "For Fans Of" field already has placeholder text (e.g., "The National Parks, Red Bennies")
- ✅ Form redirects to `/submit/success` page on successful submission
- ✅ Success page created (`src/app/submit/success/page.tsx`)

### 5. Documentation
- ✅ Created admin review criteria checklist (`MUSIC_SUBMISSION_REVIEW_CRITERIA.md`)
- ✅ Created Save Band implementation plan (`SAVE_BAND_FEATURE_IMPLEMENTATION.md`)
- ✅ Created this deployment checklist

---

## 🚀 Deployment Steps

### Step 1: Run Database Migration

**Option A: Supabase CLI (if password configured)**
```bash
cd the-rock-salt
supabase db push
```

**Option B: Manual SQL (recommended if CLI fails)**
1. Go to https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new
2. Copy entire contents of `supabase/MANUAL_RUN_add_admin_feedback.sql`
3. Paste into SQL editor
4. Click "Run"
5. Verify: You should see 8 test submissions in the output

**Verification:**
```sql
-- Run this in SQL editor to verify columns exist:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'music_submissions'
AND column_name IN ('admin_feedback', 'updated_at');

-- Should return 2 rows
```

### Step 2: Deploy Code to Production

**If using Vercel:**
```bash
cd the-rock-salt
git add .
git commit -m "feat: Add music submission admin UI, save band feature, and UX improvements

- Admin can now review/approve/decline music submissions at /admin/music-submissions
- Users can save favorite bands to My Bands page
- Improved submission form with better help text
- Post-submission confirmation page

🤖 Generated with Claude Code"

git push origin main
```

Vercel will auto-deploy from main branch.

**If manual deployment:**
```bash
yarn build
# Deploy dist folder to hosting
```

### Step 3: Test Admin UI

1. **Login as admin:**
   - Go to `/admin/music-submissions`
   - Should see 8 test submissions

2. **Test filtering:**
   - Click "Pending" tab → Should show all 8 submissions
   - Click "Approved" tab → Should show 0 submissions

3. **Test single approval:**
   - Find "Electric Haze" submission (complete, ready to approve)
   - Click "Accept" button
   - Submission should disappear from "Pending" and appear in "Approved"

4. **Test decline with feedback:**
   - Find "The Neon Wolves" submission (incomplete bio)
   - Click "Decline with Feedback"
   - In modal, enter: "Your bio is too short. Please expand to at least 50 characters with details about your sound and influences."
   - Click "Send Feedback & Decline"
   - Submission should move to "Declined" tab
   - Feedback should be visible in submission card

5. **Test bulk actions:**
   - Go to "Pending" tab
   - Check boxes for 2-3 submissions
   - Click "Bulk Accept"
   - Confirm modal
   - All selected submissions should move to "Approved"

6. **Test search/filter:**
   - Use genre filter dropdown
   - Verify only matching genre submissions show

### Step 4: Test Save Band Feature

1. **Save a band:**
   - Go to `/bands` (Explore Artists)
   - Find any band card
   - Click heart icon → Should fill with red and pulse
   - Nav badge should show "My Bands (1)"

2. **View My Bands:**
   - Click "My Bands" in navigation
   - Should see saved band in grid
   - Verify genre tags, saved date, and "View Profile" button

3. **Test filtering:**
   - Save 2-3 bands with different genres
   - Use genre dropdown filter
   - Verify list narrows correctly

4. **Test sorting:**
   - Change sort order (Newest / Oldest / Alphabetical)
   - Verify bands re-order correctly

5. **Unsave a band:**
   - Click red heart on a saved band card
   - Band should disappear from list
   - Nav badge count should decrease

6. **Test Clear All:**
   - Click "Clear All" button
   - Confirm modal
   - All bands should disappear
   - Empty state should show with "Explore Bands" CTA

7. **Cross-tab sync:**
   - Open two browser tabs with `/my-bands`
   - In Tab 1, save a band
   - Tab 2 should update count automatically (via storage event)

### Step 5: Test Submission Form Improvements

1. **Submit a band:**
   - Go to `/submit`
   - Fill out form (use test data)
   - For bio, write exactly 30 characters
   - Try to submit → Should see error: "Bio must be between 50 and 300 characters"
   - Read new help text → Should explain WHY 50 is required
   - Expand bio to 60 characters
   - Submit form

2. **Verify success page:**
   - Should redirect to `/submit/success?band=[name]&email=[email]&id=[uuid]`
   - Page should show:
     - Green checkmark icon
     - "Submission Received!" heading
     - Band name in personalized message
     - 3-step "What Happens Next" timeline
     - Confirmation number (shortened submission ID)
     - "While You Wait" tips
   - Click "Explore Bands" link → Should go to `/bands`

3. **Verify email sent (if email system configured):**
   - Check inbox at submitted email address
   - Should receive confirmation email (if email integration is set up)

### Step 6: Accessibility Audit

**Keyboard Navigation:**
```bash
# Manual testing checklist:
1. Tab through submission form
   - All fields should be reachable via Tab
   - Focus indicators should be visible
   - Save Band button should be tabbable

2. Tab through admin UI
   - Checkboxes, buttons, links should be focusable
   - Modal should trap focus

3. Tab through My Bands page
   - Heart buttons should be tabbable
   - Links and filters should be keyboard accessible
```

**Screen Reader Testing:**
- Test with VoiceOver (Mac) or NVDA (Windows)
- Verify ARIA labels on SaveBandButton
- Verify form labels are announced correctly

**Color Contrast:**
```bash
# Use browser DevTools > Lighthouse > Accessibility
# Should pass WCAG 2.1 AA (4.5:1 text contrast)
```

---

## ⚠️ Known Issues / Future Improvements

### Admin UI
- ❌ No pagination (will be slow with 100+ submissions)
- ❌ No search by band name
- ❌ Feedback sent in modal but no email integration yet (need SendGrid/Mailgun)
- ❌ No keyboard shortcuts (planned: A=approve, D=decline, R=reviewed)

### Save Band Feature
- ❌ localStorage only (Phase 2: database sync for logged-in users not implemented)
- ❌ No "Recently Viewed" bands feature
- ❌ Saved bands don't show upcoming events yet
- ❌ No export to Spotify playlist (future)

### General
- ❌ No analytics tracking for "band saved" events
- ❌ Mobile testing needed (works on desktop, but tap targets should be verified)
- ❌ No email notifications when saved band has new show

---

## 📊 Success Metrics to Monitor (30 Days Post-Launch)

### Admin Efficiency
- **Average review time per submission** (target: <2 minutes)
- **Acceptance rate** (target: 60-80%)
- **Time to first review** (target: <48 hours)

### Save Band Adoption
- **% of visitors who save ≥1 band** (target: 30%)
- **Avg bands saved per active user** (target: 3.5)
- **Return visit rate: saved bands vs. no saved bands** (should be 2x higher)
- **Saved → Social link clicks** (target: 40%)

### Submission Form
- **Form completion rate** (target: >70%)
- **Post-submission redirect success** (target: 100%)
- **50-char bio validation errors** (should decrease with new help text)

### Setup Analytics Tracking:
```typescript
// Add to SaveBandButton.tsx handleToggle():
gtag('event', 'band_saved', {
  band_id: bandId,
  band_name: bandName,
  timestamp: Date.now()
});

// Add to admin UI updateStatus():
gtag('event', 'submission_reviewed', {
  status: newStatus,
  review_time_seconds: timeToReview,
  admin_id: user.id
});
```

---

## 🐛 Rollback Plan

If critical bugs are found:

### Rollback Code (Vercel):
```bash
# Go to Vercel dashboard
# Deployments → Find previous deployment → Promote to Production
```

### Rollback Database (if needed):
```sql
-- Only if migration causes issues
-- Run in Supabase SQL Editor:

-- Remove new columns
ALTER TABLE public.music_submissions
DROP COLUMN IF EXISTS admin_feedback,
DROP COLUMN IF EXISTS updated_at;

-- Revert to old RLS policies (if needed)
-- Check git history for old policies
```

### Disable Features Without Rollback:
```typescript
// In admin/music-submissions/page.tsx
// Add at top of component:
if (process.env.NEXT_PUBLIC_DISABLE_ADMIN_UI === 'true') {
  return <div>Admin UI temporarily unavailable</div>
}

// Set in Vercel env vars: NEXT_PUBLIC_DISABLE_ADMIN_UI=true
```

---

## 📞 Support Contacts

**If issues arise:**
- Engineering Lead: [Your name]
- Database Admin: [Name]
- Vercel Support: support@vercel.com
- Supabase Support: https://supabase.com/dashboard/support

---

## ✨ Next Features to Build (Backlog)

1. **Admin UI Phase 2:**
   - Pagination (10 submissions per page)
   - Search by band name or contact email
   - Export submissions to CSV
   - Email integration (SendGrid) for feedback notifications

2. **Save Band Phase 2:**
   - Database sync for authenticated users
   - Email notifications: "Your saved band has a show this weekend"
   - "Recommended For You" based on saved genres
   - Public profile: `/users/[username]/saved-bands`

3. **Submission Form Phase 2:**
   - Autosave drafts to localStorage
   - Allow edit after submission (before review)
   - Progress indicator (Step 1 of 6)
   - File upload progress bars

4. **General Improvements:**
   - Band profile → Upcoming Events link
   - Event page → Filter by saved bands only
   - "Recently Viewed Bands" feature
   - Mobile app considerations (API-first for save functionality)

---

**Last Updated:** October 15, 2025
**Status:** ✅ Ready for Production Deployment
