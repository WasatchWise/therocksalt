# Preparing Data for Import

## Step 1: Save Your JSON Files

Save each of the JSON outputs from Notebook LM into the `data/` directory:

1. **First output** (The Used, The Brobecks, IDKHOW, Red Bennies, etc.)
   - Save as: `data/notebook-output-1.json`

2. **Second output** (Clear, Form of Rocket, venues, events, comprehensive structure)
   - Save as: `data/notebook-output-2.json`

3. **Third output** (Iceburn, The Backseat Lovers, Neon Trees, etc.)
   - Save as: `data/notebook-output-3.json`

## Step 2: Set Environment Variables

Make sure your `.env.local` file has:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

⚠️  **IMPORTANT**: Use the **Service Role Key**, not the anon key, as this script needs admin access.

## Step 3: Run the Import

```bash
# Install dependencies if needed
npm install

# Run the import script
npm run import-bands
```

## What the Script Does

1. **Deduplicates** all data across the three files
2. **Validates** dates, state codes, and enum values
3. **Normalizes** data (e.g., "Utah" → "UT")
4. **Respects foreign keys** (imports in correct order)
5. **Skips existing** entries (idempotent - safe to run multiple times)
6. **Reports** detailed stats and errors

## Expected Output

```
🚀 Starting bulk import...

📄 Loaded notebook-output-1.json
📄 Loaded notebook-output-2.json
📄 Loaded notebook-output-3.json

📦 Importing Genres...
  ✅ Created genre: Post-Punk
  ✅ Created genre: Hardcore
  ...

🎸 Importing Bands...
  ✅ Created band: The Used (the-used)
  ✅ Created band: Iceburn (iceburn)
  ...

📊 IMPORT SUMMARY
═══════════════════════════════════════
BANDS:
  ✅ Success: 45
  ⏭️  Skipped: 3
  ❌ Failed: 0
...
```

## Troubleshooting

### "Band slug not found" warnings
- The script will skip relationships where the referenced band/musician doesn't exist
- Check that all slugs match between entities

### "Invalid date" warnings
- The script auto-corrects invalid dates (e.g., Feb 30 → Feb 28)
- Check the console output for corrections

### Failed imports
- Check the error summary at the end
- Most common issues: missing required fields, foreign key violations
- Fix the JSON and re-run (script is idempotent)
