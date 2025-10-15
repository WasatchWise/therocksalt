# Storage Policy Setup Guide

Storage policies can be created either via the **Dashboard UI** (easier) or via **SQL with proper syntax** (faster if you know SQL).

---

## Option 1: Quick SQL Setup (FASTEST)

If you prefer SQL, you can run this directly in the SQL Editor:

```sql
-- Policies for band-tracks bucket
CREATE POLICY "Authenticated users can upload tracks"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'band-tracks');

CREATE POLICY "Anyone can read tracks"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'band-tracks');

-- Policies for band-photos bucket
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'band-photos');

CREATE POLICY "Anyone can read photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'band-photos');
```

**That's it!** Skip to [Verification](#verification) section.

---

## Option 2: Dashboard UI Setup (EASIER FOR NON-SQL USERS)

Storage policies can also be set up through the Supabase Dashboard UI.

## Step 1: Navigate to Storage Settings

Go to: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/storage/buckets

You should see two buckets:
- `band-tracks`
- `band-photos`

If you don't see them, run `COMPLETE_SETUP_SQL_ONLY.sql` first.

---

## Step 2: Set Up Policies for `band-tracks`

### 2a. Click on `band-tracks` bucket

### 2b. Go to "Policies" tab

### 2c. Click "New Policy"

### 2d. Create INSERT policy for uploads

**Policy Name**: `Authenticated users can upload tracks`

**Allowed operation**: `INSERT`

**Target roles**: `authenticated`

**Policy definition** (USING expression):
```sql
true
```

**WITH CHECK expression**:
```sql
bucket_id = 'band-tracks'
```

Click "Save policy"

### 2e. Create SELECT policy for public reading

Click "New Policy" again

**Policy Name**: `Anyone can read tracks`

**Allowed operation**: `SELECT`

**Target roles**: `public`, `authenticated`, `anon`

**Policy definition** (USING expression):
```sql
bucket_id = 'band-tracks'
```

Click "Save policy"

---

## Step 3: Set Up Policies for `band-photos`

Repeat the same process for the `band-photos` bucket:

### 3a. Click on `band-photos` bucket

### 3b. Go to "Policies" tab

### 3c. Create INSERT policy

**Policy Name**: `Authenticated users can upload photos`

**Allowed operation**: `INSERT`

**Target roles**: `authenticated`

**Policy definition** (USING expression):
```sql
true
```

**WITH CHECK expression**:
```sql
bucket_id = 'band-photos'
```

Click "Save policy"

### 3d. Create SELECT policy

**Policy Name**: `Anyone can read photos`

**Allowed operation**: `SELECT`

**Target roles**: `public`, `authenticated`, `anon`

**Policy definition** (USING expression):
```sql
bucket_id = 'band-photos'
```

Click "Save policy"

---

## Alternative: Use Policy Templates

If available, you can use Supabase's built-in policy templates:

1. Click "New Policy"
2. Select "Get started with a template"
3. Choose "Allow public read access" for SELECT
4. Choose "Allow authenticated uploads" for INSERT
5. Modify the bucket_id condition as needed

---

## Verification

After setting up policies, you should have:

### band-tracks bucket:
- ✅ INSERT policy for authenticated users
- ✅ SELECT policy for public access

### band-photos bucket:
- ✅ INSERT policy for authenticated users
- ✅ SELECT policy for public access

---

## Testing

Once policies are set up:

1. Sign in to your app
2. Claim a band
3. Try uploading a track - should succeed
4. Try uploading a photo - should succeed
5. View the public band page - files should be visible

If uploads fail with "new row violates row-level security", the policies aren't set up correctly.

---

## Quick Reference: Direct Links

- **Storage Dashboard**: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/storage/buckets
- **band-tracks policies**: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/storage/buckets/band-tracks
- **band-photos policies**: https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/storage/buckets/band-photos
