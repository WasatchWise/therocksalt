# Simplified Homepage - Deployment Ready

**Created**: November 6, 2025
**Status**: Ready for deployment

---

## ✅ What Was Done

### New Simplified Homepage

Created a clean, minimal homepage (`src/app/page.tsx`) with:

1. **Logo** - Centered at top
2. **"LISTEN LIVE" Button** - Large, animated, pulsing button linking to `/live`
3. **Music Submission Form** - Full form embedded on homepage
4. **Contact Email** - `music@therocksalt.com`
5. **Footer Links** - Quick navigation to other pages

### Design Features

- Gradient background (light to white / dark mode support)
- Animated "LISTEN LIVE" button with:
  - Pulsing animation
  - Live indicator dot
  - Glow effect on hover
  - Guitar emoji 🎸
- Clean, professional card design for submission form
- Fully responsive (mobile-friendly)

---

## 📂 Files Modified

### Created/Modified
- ✅ `src/app/page.tsx` - **NEW simplified homepage**
- ✅ `src/app/page.full-version.tsx.backup` - **Backup of original homepage**

### Everything Else Intact
- ✅ `/bands` - Band directory (unchanged)
- ✅ `/venues` - Venue directory (unchanged)
- ✅ `/events` - Events calendar (unchanged)
- ✅ `/episodes` - Radio episodes (unchanged)
- ✅ `/live` - Live stream page (unchanged)
- ✅ `/submit` - Music submission page (unchanged)
- ✅ `/admin` - Admin dashboard (unchanged)
- ✅ All components and functionality preserved

---

## 🚀 Deployment Steps

### 1. Test Locally

```bash
# Make sure you're in the project directory
cd /Users/johnlyman/Desktop/the-rock-salt/the-rock-salt

# Start dev server
yarn dev

# Visit http://localhost:3000
# You should see:
# - Logo at top
# - "LISTEN LIVE" pulsing button
# - Music submission form
```

### 2. Build for Production

```bash
# Test production build
yarn build

# If build succeeds, you're ready!
```

### 3. Deploy to Vercel

Your project is already connected to Vercel. Simply push to GitHub:

```bash
# Commit your changes
git add src/app/page.tsx
git commit -m "feat: simplify homepage for launch - logo, live button, submission form"

# Push to main branch
git push origin main

# Vercel will auto-deploy!
```

### 4. Verify Production

Once deployed:
- Visit https://www.therocksalt.com
- Test "LISTEN LIVE" button → should go to `/live`
- Test music submission form
- Verify all footer links work
- Test on mobile device

---

## 🔄 Reverting to Full Homepage

If you ever want the full-featured homepage back:

```bash
# Restore the backup
cp src/app/page.full-version.tsx.backup src/app/page.tsx

# The full homepage with featured bands, events, etc. will return
```

---

## 📋 What The Homepage Includes

### Header (via Layout)
- The Rock Salt logo (clickable, goes to home)
- Navigation: Home, **Listen Live** (red badge), Artists, Venues, Radio Episodes, Events, About
- "My Bands" (saved favorites)
- Discord link
- Sign In / Dashboard

### Main Content (New Simplified Design)
1. **Logo Section**
   - Large, centered Rock Salt logo
   - "Salt Lake City's Independent Music Radio" tagline

2. **Listen Live Button**
   - Huge, eye-catching button
   - Animated pulsing effect
   - Live indicator dot
   - Links to `/live` page

3. **Music Submission Form**
   - Complete 6-section form:
     - Band info (name, hometown, bio)
     - Music upload (photo + audio file)
     - Genre selection
     - Contact details
     - Social links
     - Terms agreement
   - Built-in validation
   - File upload with previews
   - Success/error messaging

4. **Contact Section**
   - Email: music@therocksalt.com
   - Clickable mailto link

5. **Footer Links**
   - About, Artists, Venues, Events, Radio Episodes
   - Quick navigation to full site features

### Footer (via Layout)
- Copyright notice
- Additional links

---

## 🎯 Purpose

This simplified homepage serves as a **temporary landing page** while you:
- Build out the full platform features
- Collect music submissions
- Promote the live stream
- Establish The Rock Salt brand

All existing features remain fully functional - users can still:
- Browse 210+ bands at `/bands`
- View venues at `/venues`
- Check events at `/events`
- Listen to episodes at `/episodes`
- **Listen live at `/live`** ← NEW!

---

## 📧 Contact

Questions about deployment or the simplified homepage?
**music@therocksalt.com**

---

## 🎸 Next Steps

1. **Test the homepage locally**
2. **Push to GitHub** → Vercel auto-deploys
3. **Test on production**
4. **Share the link!**
5. **Start accepting music submissions**
6. **Go live with DJs on the stream**

---

**The Rock Salt is ready to launch!** 🚀
