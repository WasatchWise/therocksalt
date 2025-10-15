# Supabase Setup Checklist

Run these SQL files in order in the Supabase SQL Editor:
https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new

## ✅ Already Completed
- [x] Database schema migrations (`CONSOLIDATED_MIGRATION.sql`)
- [x] Seed data (`SEED_NO_CONFLICT.sql`)
- [x] TypeScript types generated

## 🔧 Required Fixes

### 1. Run Complete SQL Setup (ONE FILE!)
**File**: `COMPLETE_SETUP_FINAL.sql`

**What it does**:
- ✅ Fixes RLS policy for claiming unclaimed bands
- ✅ Creates/configures storage buckets
- ✅ Creates storage policies for uploads
- ✅ Verifies all setup with queries

**Run this**: Copy entire file to SQL Editor and execute once
- Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new
- Paste contents of `COMPLETE_SETUP_FINAL.sql`
- Click "Run"
- Check verification results at bottom

**This is now truly all-in-one!** No need for separate storage policy setup.

---

### 2. Disable Email Confirmation (Recommended for Testing)

**Via Dashboard**:
1. Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/auth/providers
2. Click "Email" provider
3. Uncheck "Confirm email"
4. Save

**Why**: Allows testing the claim flow without needing email inbox access

---

## 🧪 Verification

After running the above:

1. **Check data counts** (from `FIX_RLS_AND_VERIFY.sql` output):
   - bands: 215
   - venues: 62
   - events: 3
   - tracks: 4
   - photos: 4

2. **Check RLS policies exist**:
   - `bands authenticated update claim or own` on bands table
   - Storage policies for both buckets

3. **Test the flow**:
   - Sign up at http://localhost:3000/auth/signup
   - Browse bands at http://localhost:3000/bands
   - Claim a band
   - Upload a track and photo
   - View the public band page to verify uploads appear

---

## 📝 Summary of Changes Made

### Auth & Claiming
- ✅ Sign in/sign up pages with email/password
- ✅ Auth callback handler
- ✅ `useAuth` hook for session management
- ✅ Header with conditional auth UI
- ✅ `claimBand` server action
- ✅ `ClaimBandButton` component
- ✅ Claim button on band pages

### Dashboard & Uploads
- ✅ Main dashboard showing claimed bands
- ✅ Individual band management page
- ✅ Track upload form with storage integration
- ✅ Photo upload form with storage integration
- ✅ Stats display (tracks, photos, plays)

### Issues Fixed
- 🔧 RLS policy updated to allow claiming unclaimed bands
- 🔧 Storage bucket policies created for uploads
- 📝 Email confirmation can be disabled for testing

---

## 🚀 Next Steps After Setup

Once the above fixes are applied, you can:

1. Create a test account
2. Claim any band from the directory
3. Upload demo tracks and photos
4. View your band's public page
5. Test the audio player and photo gallery

**Need Help?** See `TESTING_INSTRUCTIONS.md` for detailed troubleshooting.
