# 🎪 Venues Feature - Setup Guide

## What Was Built

### ✅ Venue System Complete

You now have a full venue directory and individual venue pages, just like the band pages!

**Features:**
- Venue directory at `/venues`
- Individual venue pages at `/venues/[slug]`
- Grid layout with photos
- Location, capacity, amenities
- Booking info
- Upcoming/past events
- "Claim This Venue" button
- Links to website, phone, email
- Photo galleries

---

## 🚀 Required: Generate Slugs for Your Venues

Since you just added venues to the database, you need to generate slugs for them.

### Run this SQL in Supabase:

```sql
-- Generate slugs for all venues that don't have them
UPDATE venues
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Verify slugs were created
SELECT name, slug FROM venues LIMIT 10;
```

**What this does:**
- Converts venue names to URL-friendly slugs
- "The Depot" → `the-depot`
- "Kilby Court" → `kilby-court`
- "Urban Lounge" → `urban-lounge`

---

## 🎯 Pages You Now Have

### Venue Directory (`/venues`)
- Grid of all venues
- Shows:
  - Venue photo (if available)
  - Name with featured star ⭐
  - Location (city, state)
  - Capacity
  - Description preview
  - Amenities (first 3)
- Click any venue → goes to detail page
- Responsive (1-3 columns)

### Individual Venue Page (`/venues/[slug]`)
- Hero photo
- Venue name + featured indicator
- Full address with map icon
- Bio/description
- Capacity display
- Upcoming shows count
- Contact buttons (website, phone, email)
- Full amenities list with checkmarks
- Booking information section
- Photo gallery
- Upcoming events with band lineups
- Past events history
- "Claim This Venue" button (not functional until Phase 2)

---

## 📊 What Data Fields Are Used

### From `venues` table:
- `name` - Venue name
- `slug` - URL slug
- `address`, `city`, `state`, `zip_code` - Location
- `website`, `phone`, `email` - Contact
- `capacity` - Max capacity
- `description`, `bio` - Descriptions
- `image_url` - Primary image
- `amenities` - JSON of amenities (sound_system, parking, bar, etc.)
- `booking_info` - Booking instructions
- `featured` - Featured venue indicator
- `claimed_by` - Owner (for Phase 2)

### From `venue_photos`:
- Multiple photos per venue
- `is_primary` - Featured photo
- `caption` - Photo description

### From `venue_links`:
- Social media links
- Booking links
- Other custom links

### From `events`:
- Shows upcoming/past events at the venue
- Links to band pages

---

## 🎨 Design Features

**Venue Directory:**
- Photo cards with hover scale effect
- Location icon with city/state
- Capacity icon with people count
- Clean, minimal design
- Dark mode support

**Venue Detail Page:**
- Large hero photo
- Info grid (capacity, upcoming shows)
- Amenity icons with checkmarks
- Event cards with band chips (clickable to band pages)
- Professional, venue-focused layout

---

## 🔄 Navigation Updated

The venues link is now in:
- ✅ Header navigation
- ✅ Footer links
- ✅ Mobile menu

---

## 🎯 Next Steps

### Immediate:
1. ✅ Apply full platform schema migration
2. ✅ Generate venue slugs (SQL above)
3. ✅ Visit `/venues` to see your venue directory
4. ✅ Click any venue to see individual page

### Optional Enhancements:
- Add venue photos to `venue_photos` table
- Set `is_primary = true` on one photo per venue
- Add amenities JSON (sound_system, parking, etc.)
- Add booking_info text
- Set `featured = true` on select venues

### Phase 2 (Auth):
- Venue claiming flow ($25/month)
- Venue dashboard
- Post gig opportunities
- Manage venue info

---

## 📝 Sample Data to Add

### Add a Photo:
```sql
INSERT INTO venue_photos (venue_id, url, caption, is_primary)
VALUES (
  '[venue-id-here]',
  'https://example.com/photo.jpg',
  'Main stage view',
  true
);
```

### Add Amenities:
```sql
UPDATE venues
SET amenities = '{
  "sound_system": true,
  "parking": true,
  "bar": true,
  "stage_lighting": true,
  "green_room": true,
  "load_in_access": true
}'::jsonb
WHERE slug = 'the-depot';
```

### Add Booking Info:
```sql
UPDATE venues
SET booking_info = 'For booking inquiries, email booking@venue.com or call (555) 123-4567.
We book 3-6 months in advance.
Capacity: 500
Stage size: 20x15 feet
Load-in: 4pm
Soundcheck: 6pm
Doors: 8pm'
WHERE slug = 'the-depot';
```

---

## 🎪 Your Venue Ecosystem

You now have:
- ✅ **210+ artists** with individual pages
- ✅ **Venues** with individual pages
- ✅ **Events** linking artists to venues
- ✅ **Episodes** page
- ✅ **About** page
- ✅ Full navigation
- ✅ SEO metadata
- ✅ Mobile responsive

**Next:** Authentication, then RFP system, then vendor marketplace!

---

## 🐛 Troubleshooting

**Problem:** Venues show 404

**Solution:** Run the slug generation SQL above

**Problem:** No photos showing

**Solution:** Add photos to `venue_photos` table or set `image_url` on venue

**Problem:** Amenities not showing

**Solution:** Add amenities JSON to venue record

---

**The Rock Salt Platform is growing!** 🚀

From band directory → Full music ecosystem

Next up: Let bands and venues connect through opportunities! 🎸🎪
