# The Rock Salt - Complete Data Import Guide

## Run these SQL files in Supabase SQL Editor in this exact order:

### Step 1: Import Genres (29 genres)
**File:** `01-JUST-GENRES.sql`
- Imports all 29 genre types
- No unique constraint, so duplicates may occur if run twice
- Safe to run multiple times (will just add duplicates)

### Step 2: Import Venues (7 missing historic venues)
**File:** `02-JUST-VENUES.sql`
- Imports ONLY the 7 missing historic Utah music venues
- Uses existing org_id: `4cadb578-b415-461f-8039-1fd02f68a030` (same as your 62 existing venues)
- Skips 9 venues that already exist (Kilby Court, Liquid Joe's, Urban Lounge, etc.)
- ⚠️ **WARNING:** Run this ONLY ONCE - no ON CONFLICT, will create duplicates if run twice

### Step 3: Insert Missing Bands (9 new bands)
**File:** `03-INSERT-MISSING-BANDS.sql`
- Inserts bands that don't exist in your current 234 bands:
  - Insight (HOF)
  - The Osmonds (HOF)
  - Swim Herschel Swim (HOF)
  - Victims Willing (HOF)
  - Talia Keys (headliner)
  - Spitting Teeth (headliner)
  - CLUB MUNGO (garage)
  - Strawberry Cough (garage)
  - The Atheists (featured)
- Uses ON CONFLICT DO NOTHING, so 100% safe to run multiple times

### Step 4: Update Existing Bands (21 bands enhanced)
**File:** `UPDATE-EXISTING-BANDS.sql`
- Updates existing bands with proper tier classifications and full bios:
  - HOF (Hall of Fame): Iceburn, Neon Trees, The Used
  - Platinum: Chelsea Grin, Imagine Dragons, IDKHOW, The Backseat Lovers
  - National Act: Cult Leader, Eagle Twin, The National Parks, Royal Bliss, SubRosa, Clear
  - Headliner: Fictionist, Form of Rocket, Red Bennies, The Brobecks, Gaza
  - Featured: American Humor, Fancy Ladz, Worlds Worst
- Safe to run multiple times (just updates same records)

### Step 5: Verify Results
**File:** `CHECK-WHAT-EXISTS.sql`
- Shows counts of bands, genres, venues
- Lists all bands with their tiers

## Expected Final Counts:
- **Genres:** 29
- **Venues:** 69 (62 existing + 7 new historic venues)
- **Bands:** 243 (234 existing + 9 new)
  - 7 HOF (Hall of Fame)
  - 4 Platinum
  - 6 National Act
  - 8 Headliner
  - 3 Featured
  - 2 Garage
  - ~213 Free tier (untouched from original 234)

## Notes:
- Your database already had 234 bands with tier='free' and minimal data
- Your database already had 62 venues (9 of our historic venues already exist)
- This process enhances 21 of those bands with full research data
- Adds 9 historically significant bands that were missing
- Adds 7 new historic Utah music venues (The Speedway Café, The Roxy, Club DV8, The Word, Zephyr Club, In The Venue, Black Lung Society)
- ⚠️ **IMPORTANT:** The venues file (02-JUST-VENUES.sql) should only be run ONCE - it will create duplicates if run again
- Bands scripts use ON CONFLICT DO NOTHING and are safe to run multiple times
- Genres may create duplicates if run multiple times (no unique constraint)
