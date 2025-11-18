# Pre-Deployment Checklist - Final 3 Tasks

**Date:** January 20, 2025  
**Status:** 7/10 Complete - 3 Critical Items Remaining

---

## ✅ Completed (7/10)

1. ✅ **Design System** - Design tokens, global styles, animations
2. ✅ **UMR Partnership Branding** - Header, Footer, Homepage integration
3. ✅ **Enhanced Components** - Button, Header, Footer, NowPlaying
4. ✅ **Homepage Polish** - Visual hierarchy, spacing, animations
5. ✅ **YouTube Live Stream** - Embedded player for tomorrow's stream
6. ✅ **AzuraCast Features** - Player, History, Requests all present
7. ✅ **Branding Updates** - "Salt Lake's Music Hub" messaging

---

## 🔴 Critical - Must Do Before Deploy (3/10)

### Task 1: Verify Database Migrations ✅
**Status:** Check if all new migrations are applied

**Action Required:**
```sql
-- Run in Supabase SQL Editor to verify:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'azuracast_media',
  'song_requests',
  'tips',
  'user_balances',
  'transactions',
  'fan_clubs',
  'fan_club_tiers',
  'fan_club_members',
  'social_posts'
);
```

**Migrations to Apply (if not already):**
- `20250120_add_azuracast_tracking.sql`
- `20250120_add_monetization_tables.sql`
- `20250120_add_social_and_fan_club.sql`

**How to Apply:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy/paste each migration file content
3. Run each one
4. Verify tables exist (use query above)

---

### Task 2: Verify Environment Variables ✅
**Status:** Most are set, but verify critical ones

**Required in Vercel:**
- ✅ `STRIPE_SECRET_KEY` - Set
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Set
- ⚠️ `STRIPE_WEBHOOK_SECRET` - **VERIFY IT'S SET** (`whsec_gUYrSnSBiCcqpDR1Q5CxoPpvYtxpSLlD`)
- ✅ `X_API_Key` - AzuraCast API key
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Verify it's set
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Set

**Action Required:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Verify `STRIPE_WEBHOOK_SECRET` is present
3. Verify `NEXT_PUBLIC_SUPABASE_URL` is present
4. If missing, add them

---

### Task 3: Test Build & Critical Features ✅
**Status:** Need to verify build succeeds and features work

**Action Required:**

**A. Test Build:**
```bash
cd /Users/johnlyman/Desktop/the-rock-salt
rm -rf .next
npm run build
# OR
yarn build
```

**B. Test Critical Features:**
1. **Homepage loads** - Check all sections render
2. **Now Playing component** - Verify it fetches from `/api/now-playing`
3. **AzuraCast player** - Verify embed loads
4. **YouTube embed** - Verify live stream embed works
5. **Navigation** - Header/Footer render correctly
6. **UMR branding** - Partnership badges visible

**C. Check for Errors:**
```bash
# Run linter
npm run lint

# Check TypeScript
npx tsc --noEmit
```

---

## 🟡 Nice to Have (Can Do Post-Deploy)

### Optional Improvements:
1. **Error Handling** - Add fallback if NowPlaying API fails
2. **Loading States** - Enhance loading indicators
3. **Mobile Testing** - Verify responsive design on mobile
4. **Performance** - Check Lighthouse scores

---

## 📋 Quick Pre-Deploy Checklist

Before committing and deploying:

- [ ] **Database migrations applied** (Task 1)
- [ ] **Environment variables verified** (Task 2)
- [ ] **Build succeeds locally** (Task 3)
- [ ] **No TypeScript errors** (Task 3)
- [ ] **No linting errors** (Task 3)
- [ ] **Homepage renders correctly** (Task 3)
- [ ] **NowPlaying component works** (Task 3)
- [ ] **All imports resolve** (Task 3)

---

## 🚀 Deployment Steps

Once all 3 tasks are complete:

```bash
# 1. Stage all changes
git add .

# 2. Commit with descriptive message
git commit -m "feat: Complete UI/UX overhaul with UMR partnership branding

- Add comprehensive design system with tokens
- Integrate UMR partnership branding throughout
- Enhance homepage with polished design
- Add NowPlaying component for current track display
- Embed YouTube live stream for upcoming broadcasts
- Update branding to 'Salt Lake's Music Hub'
- Improve component library (Button, Header, Footer)
- Add smooth animations and micro-interactions

Design improvements:
- Consistent spacing and typography
- Enhanced visual hierarchy
- Professional polish throughout
- Responsive design optimizations"

# 3. Push to trigger deployment
git push origin main
```

---

## 🐛 If Build Fails

**Common Issues:**

1. **Missing imports** - Check `NowPlaying.tsx` imports
2. **TypeScript errors** - Run `npx tsc --noEmit` to see them
3. **Environment variables** - Check Vercel dashboard
4. **Database connection** - Verify Supabase URL/key

**Quick Fixes:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm run build

# Check specific file
npx tsc --noEmit src/components/NowPlaying.tsx
```

---

## ✅ Success Criteria

Deployment is ready when:
- [x] All 3 critical tasks completed
- [ ] Build succeeds without errors
- [ ] All features tested and working
- [ ] Environment variables configured
- [ ] Database migrations applied

---

**Last Updated:** January 20, 2025  
**Next Action:** Complete the 3 critical tasks above

