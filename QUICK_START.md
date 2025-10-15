# Quick Start - Music Submission Form Setup

## You're Almost Done! Just 2 Steps:

### Step 1: Run SQL in Supabase (2 minutes)

1. **Open this URL** (already opened for you):
   https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new

2. **Copy** the entire contents of `SETUP_STORAGE_AND_RLS.sql` in your project

3. **Paste** it into the Supabase SQL editor

4. **Click "Run"** (bottom right corner)

5. **Wait** for the success message (should see "Success. No rows returned")

### Step 2: Test the Form (1 minute)

1. **Start your dev server:**
   ```bash
   cd "the-rock-salt"
   yarn dev
   ```

2. **Open in browser:**
   ```
   http://localhost:3000/submit
   ```

3. **Fill out the form** with test data and submit

4. **Check it worked:**
   - Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/storage/buckets
   - You should see `band-photos` and `band-music` buckets
   - Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/editor
   - Click on `music_submissions` table
   - Your test submission should be there with status='pending'

## That's It!

You now have a fully functional music submission form.

---

## Common Issues

**"Run button is grayed out"**
- Make sure you pasted the SQL into the editor
- Make sure you're logged into Supabase

**"Error running SQL"**
- The buckets might already exist - this is OK!
- Check the error message - if it says "already exists" you're good to go

**"Form doesn't submit"**
- Check browser console (F12) for errors
- Make sure you filled all required fields (marked with *)
- Make sure bio is at least 50 characters

**"Can't find /submit page"**
- Make sure dev server is running (`yarn dev`)
- Make sure you're on `http://localhost:3000/submit` not `http://localhost:3001`

---

## Docker? Not Needed!

You saw Docker Desktop - you don't need it for this project.

You're using **Supabase Cloud** (hosted), not **Supabase Local** (Docker).

Feel free to close Docker Desktop!
