# Band Data Bulk Import Guide

This guide will help you import all the band data from Notebook LM into your Supabase database.

## 📋 What You Have

You now have **4 JSON outputs** from Notebook LM containing data on Utah bands:

1. **Output 1**: The Used, The Brobecks, IDKHOW, Red Bennies, Form of Rocket, etc.
2. **Output 2**: Clear, venues, events, comprehensive relational structure
3. **Output 3**: Iceburn, The Backseat Lovers, Neon Trees, Chelsea Grin, Royal Bliss, etc.
4. **Output 4** (just received): The Clingers, SubRosa, Choir Boy, The Moss, The Aces, etc.

## 🎯 Step-by-Step Import Process

### Step 1: Save Your JSON Files

Create the following files in the `data/` directory:

```bash
data/
├── notebook-output-1.json  # First comprehensive output
├── notebook-output-2.json  # Venues, events, relationships
├── notebook-output-3.json  # Iceburn, Neon Trees, etc.
└── notebook-output-4.json  # The Clingers, SubRosa, etc.
```

**Note**: Each file should be a valid JSON object with a `bands` array at the root.

### Step 2: Verify Environment Variables

Make sure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️  **Critical**: You MUST use the **Service Role Key** (not the anon key) because:
- The script needs to bypass Row Level Security
- It needs full admin access to insert data
- Find this key in: Supabase Dashboard → Project Settings → API → service_role

### Step 3: Run the Import

```bash
# From the project root
yarn import-bands
```

## 📊 What the Script Does

The import script will:

1. ✅ **Load all JSON files** from the `data/` directory
2. ✅ **Deduplicate** entries (same slug = same entity)
3. ✅ **Normalize data**:
   - State codes: "Utah" → "UT"
   - Invalid dates: "2009-02-30" → "2009-02-28"
   - Status values: validates against allowed enums
4. ✅ **Respect foreign keys**:
   - Imports genres first
   - Then bands
   - Then musicians
   - Then relationships
5. ✅ **Skip existing** entries (idempotent - safe to run multiple times)
6. ✅ **Generate detailed report** with success/failure counts

## 🎉 Expected Output

```
🚀 Starting bulk import...

📄 Loaded notebook-output-1.json
📄 Loaded notebook-output-2.json
📄 Loaded notebook-output-3.json
📄 Loaded notebook-output-4.json

📦 Importing Genres...
  ✅ Created genre: Post-Punk
  ✅ Created genre: Hardcore
  ✅ Created genre: Doom Metal
  ... (54 more)

🎸 Importing Bands...
  ✅ Created band: The Used (the-used)
  ✅ Created band: Iceburn (iceburn)
  ✅ Created band: The Clingers (the-clingers)
  ✅ Created band: SubRosa (subrosa)
  ... (87 more)

🎤 Importing Musicians...
  ✅ Created musician: Gentry Densley
  ✅ Created musician: Dallon Weekes
  ... (123 more)

👥 Importing Band Members...
  ✅ Imported 245 band member relationships

🎵 Importing Band-Genre Relationships...
  ✅ Imported 312 band-genre relationships

🏛️  Importing Venues...
  ✅ Created venue: Kilby Court
  ✅ Created venue: Urban Lounge
  ... (34 more)

💿 Importing Releases...
  ✅ Imported 156 releases

═══════════════════════════════════════
📊 IMPORT SUMMARY
═══════════════════════════════════════

BANDS:
  ✅ Success: 91
  ⏭️  Skipped: 0
  ❌ Failed: 0

MUSICIANS:
  ✅ Success: 127
  ⏭️  Skipped: 0
  ❌ Failed: 0

BAND_MEMBERS:
  ✅ Success: 245
  ⏭️  Skipped: 12
  ❌ Failed: 0

GENRES:
  ✅ Success: 58
  ⏭️  Skipped: 0
  ❌ Failed: 0

BAND_GENRES:
  ✅ Success: 312
  ⏭️  Skipped: 8
  ❌ Failed: 0

RELEASES:
  ✅ Success: 156
  ⏭️  Skipped: 3
  ❌ Failed: 0

VENUES:
  ✅ Success: 38
  ⏭️  Skipped: 0
  ❌ Failed: 0

═══════════════════════════════════════
```

## 🔧 Troubleshooting

### Error: "Cannot find module"

```bash
# Make sure tsx is installed
yarn install
```

### Error: "Invalid API key"

- Double-check your `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Make sure you're using the **service_role** key, not the **anon** key

### Warning: "Band slug not found"

- This means a relationship references a band that doesn't exist in the JSON
- The relationship will be skipped (not an error)
- Check your JSON files if this is unexpected

### Error: "Failed to import band X"

- Check the error message in the output
- Common issues:
  - Missing required fields (slug, name)
  - Invalid enum values (status must be: active, hiatus, dissolved, reunited)
  - Duplicate slugs

### Script runs but no data appears

- Check you're using the correct database (production vs local)
- Verify the service role key has proper permissions
- Check Supabase logs for RLS policy violations

## 📝 Data Quality Notes

The script automatically handles:

- **Invalid dates**: Feb 30 becomes Feb 28/29
- **State normalization**: "Utah" → "UT", "California" → "CA"
- **Null handling**: Converts various null representations to proper SQL NULL
- **Slug deduplication**: If the same slug appears multiple times, only one is inserted
- **Foreign key validation**: Skips relationships where referenced entities don't exist

## 🎸 Bands Being Imported

From your JSON files, you'll be importing:

**Legendary bands:**
- The Used (Orem's emo kings)
- Iceburn (pioneering jazzcore)
- Form of Rocket (math rock legends)

**Modern success stories:**
- The Backseat Lovers ("Kilby Girl")
- Neon Trees (platinum hits)
- I Dont Know How But They Found Me

**Underground heroes:**
- Clear (straight edge hardcore)
- SubRosa (doom metal with violins)
- Vile Blue Shades (experimental chaos)

**Historical gems:**
- The Clingers (1960s all-female rock pioneers)
- Sky Saxon & The Seeds (proto-punk)

**And 80+ more bands** representing decades of Utah music history!

## ✨ Next Steps After Import

Once the import completes successfully:

1. **Verify data** in Supabase dashboard
2. **Test the website** - bands should appear on `/bands` page
3. **Check relationships** - band members, genres should be linked
4. **Add images** - hero images, album covers (these need to be uploaded separately)
5. **Review descriptions** - edit any that need improvement

## 🚀 Making It Super

To make your Supabase "super":

1. **Add missing slugs** - Some entities might be missing slugs in the JSON
2. **Fill in dates** - Add release dates, formed years where known
3. **Add social links** - Spotify, Bandcamp, Instagram handles
4. **Write histories** - The detailed history fields are what make it special
5. **Link relationships** - Band members, lineups, show histories

## 💡 Pro Tips

- Run the script **multiple times** as you add more data (it's idempotent)
- Use **consistent slugs** across all JSON files for relationships to work
- **Validate JSON** before importing (use jsonlint.com if needed)
- **Back up your database** before large imports (Supabase has point-in-time recovery)
- Keep **source JSON files** for future reference

## 🤝 Need Help?

If you encounter issues:
1. Check the error output from the script
2. Verify your JSON structure matches the template
3. Ensure environment variables are set correctly
4. Check Supabase dashboard logs for SQL errors

Good luck building the definitive Utah music database! 🎵🏔️
