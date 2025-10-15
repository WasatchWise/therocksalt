# Setup Guide: Band Pages Feature

## What Was Built

### 🎸 Individual Band Pages
- Dynamic routes at `/bands/[slug]`
- Each of your 210+ artists now has their own dedicated page
- Displays bio, genres, links, photos, tracks, and show history
- "Claim This Page" button for unclaimed bands

### 🎵 Audio Player
- Custom-built HTML5 audio player
- Supports MP3 uploads for demos and live recordings
- Auto-increments play count after 30s or 50% played
- Shows track title, duration, progress bar

### 📸 Photo Integration
- Photo gallery support for each band
- Unsplash API integration for auto-fetching band photos
- Attribution and source tracking

### 💾 Database Updates
- New tables: `band_tracks`, `band_photos`
- New columns on `bands`: `bio`, `description`, `image_url`, `claimed_by`, `custom_html`
- Storage buckets for audio files and photos
- RLS policies for secure uploads

---

## 🚀 REQUIRED: Apply Database Migrations

You need to run these migrations to enable the new features:

### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure Supabase CLI is running
supabase status

# Apply migrations
supabase db push

# Or apply specific migration files
supabase migration up
```

### Option 2: Supabase Dashboard

1. Go to https://app.supabase.com
2. Open your project: **The Rock Salt**
3. Go to **SQL Editor**
4. Run these files in order:

**File 1:** `supabase/migrations/20250105_band_pages.sql`
**File 2:** `supabase/migrations/20250105_rpc_functions.sql`

Copy/paste each file's contents and click **Run**.

---

## 🔧 Environment Variables

### Optional: Unsplash API (for auto-fetching band photos)

Add to `.env.local`:

```bash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

**How to get it:**
1. Go to https://unsplash.com/developers
2. Create a free account
3. Create a new app
4. Copy the "Access Key"

Without this, the Unsplash integration will use demo mode (limited).

---

## ✅ Verify Everything Works

After applying migrations, test:

1. **Visit any band page:**
   ```
   http://localhost:3000/bands/[any-band-slug]
   ```

   Example slugs (based on your 210 artists):
   - `/bands/the-red-bennies`
   - `/bands/form-of-rocket`
   - `/bands/starmy`

2. **Check the bands directory links:**
   ```
   http://localhost:3000/bands
   ```
   All band cards should now be clickable links to individual pages.

3. **Generate slugs for existing bands:**

   The migration automatically generates slugs from band names. Run this SQL to verify:

   ```sql
   SELECT name, slug FROM bands LIMIT 10;
   ```

   You should see slugs like: `the-red-bennies`, `form-of-rocket`, etc.

---

## 📊 What Each Band Page Shows

### Current Features (v1)
- ✅ Band name with featured indicator
- ✅ Genre tags
- ✅ Bio/description
- ✅ External links (Spotify, Apple Music, etc.)
- ✅ Photo gallery
- ✅ Audio player for demos/tracks
- ✅ Upcoming shows
- ✅ Past shows history
- ✅ "Claim This Page" button (if unclaimed)

### Coming Soon (Phase 2 - Authentication)
- User accounts via Supabase Auth
- Stripe payment integration ($5 to claim)
- Band member verification
- Edit dashboard for claimed bands
- Upload MP3s directly from browser
- Upload photos
- Edit bio and custom HTML

---

## 🎯 Next Steps

### Immediate (Do This Now):
1. Apply the database migrations (see above)
2. Verify band pages are working
3. Optionally add Unsplash API key for photos

### Phase 2 (Auth & Payments):
- Set up Supabase Auth
- Integrate Stripe for $5 page claims
- Build band dashboard for editing
- Add file upload UI

### Phase 3 (Search & Discovery):
- Add search bar to `/bands` directory
- Genre filtering
- Pagination (you have 210+ artists!)
- Sort options

---

## 🗂️ File Structure

```
src/
├── app/
│   └── bands/
│       ├── page.tsx                    # Bands directory (updated with links)
│       └── [slug]/
│           └── page.tsx                # Individual band page (NEW)
├── components/
│   ├── AudioPlayer.tsx                 # Audio player component (NEW)
│   ├── Button.tsx
│   ├── Container.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Logo.tsx
└── lib/
    ├── supabase/
    │   └── queries.ts                  # Updated with band queries
    └── apis/
        └── unsplash.ts                 # Unsplash integration (NEW)

supabase/
└── migrations/
    ├── 20250105_band_pages.sql         # Main migration (NEW)
    └── 20250105_rpc_functions.sql      # RPC functions (NEW)
```

---

## 💡 Tips

1. **Slugs are auto-generated** from band names. If you need custom slugs, update the `slug` column directly in Supabase.

2. **Primary photos** - Set `is_primary = true` on one photo per band to feature it on their page.

3. **Featured tracks** - Set `is_featured = true` on tracks to show them first.

4. **Play counts** increment automatically after 30 seconds or 50% played.

5. **Storage buckets** (`band-tracks` and `band-photos`) are created with public read access.

---

## 🐛 Troubleshooting

**Problem:** Band pages show 404

**Solution:** Make sure migrations are applied and bands have slugs:
```sql
UPDATE bands SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g')) WHERE slug IS NULL;
```

**Problem:** Can't upload files

**Solution:** Check Supabase storage buckets exist and have correct policies.

**Problem:** Unsplash photos not loading

**Solution:** Add `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` to `.env.local` or use demo mode.

---

## 📞 Support

If you run into issues, check:
- Supabase logs: https://app.supabase.com (Logs tab)
- Browser console for errors
- Network tab for failed API calls

---

**Built with ❤️ for The Rock Salt - Salt Lake's Venue, to the World**
