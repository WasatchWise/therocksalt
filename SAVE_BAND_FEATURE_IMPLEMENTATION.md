# Save Band Feature Implementation Plan

**Feature:** Allow music fans to save/favorite bands for later reference
**Priority:** P0 (Critical blocker for music fan discovery journey)
**Estimated Effort:** 2-3 days (Phase 1), 1-2 days (Phase 2)
**Last Updated:** 2025-10-15

---

## Problem Statement

**User Story:**
> "As a music fan, I want to save bands I discover so I can find them later, check their upcoming shows, and build a personal collection of local artists I care about."

**Current Pain Points:**
- Users discover 5+ bands in a browsing session, close browser, lose all of them
- No way to track which bands a user has already explored
- No ability to create a personal "favorites" list
- Users resort to external bookmarks or screenshots (poor UX)

**Success Metrics:**
- 30% of site visitors save at least 1 band within their first session
- Average 3.5 bands saved per active user
- 40% of saved bands lead to social media clicks or event page views

---

## Implementation Phases

### Phase 1: localStorage-Based (MVP – No Auth Required)
**Timeline:** 2-3 days
**Goal:** Ship quickly, no backend changes needed

### Phase 2: Database-Backed (Authenticated Users)
**Timeline:** 1-2 days (requires Supabase auth integration)
**Goal:** Sync saved bands across devices for logged-in users

---

## Phase 1: localStorage Implementation (MVP)

### 1.1 Data Model

Store saved bands in browser's `localStorage` as JSON array:

```typescript
// localStorage key: 'rocksalt_saved_bands'
type SavedBand = {
  id: string;           // Band UUID from database
  name: string;         // Band name for display
  slug: string;         // For URL routing
  savedAt: string;      // ISO timestamp
  genres?: string[];    // For filtering on "My Bands" page
};

// Example localStorage value:
[
  {
    "id": "abc-123-def",
    "name": "Chelsea Grin",
    "slug": "chelsea-grin",
    "savedAt": "2025-10-15T14:32:00Z",
    "genres": ["Extreme Metal", "Deathcore"]
  },
  {
    "id": "xyz-789-ghi",
    "name": "Fictionist",
    "slug": "fictionist",
    "savedAt": "2025-10-15T15:10:00Z",
    "genres": ["Indie Rock", "Alternative"]
  }
]
```

**Rationale for localStorage:**
- ✅ No backend changes required (fast to ship)
- ✅ Works without authentication (lower friction)
- ✅ Instant save/unsave (no network latency)
- ❌ Data lost if user clears cookies or switches devices

---

### 1.2 UI Components to Add

#### A. Heart Icon Button (on Band Cards & Profiles)

**Location:**
- Band cards on `/bands` page (top-right corner of card)
- Band profile header on `/bands/[slug]` page (next to social links)

**States:**
- **Unsaved:** Outline heart icon (stroke only), gray color
- **Saved:** Filled heart icon, red/pink color
- **Hover (unsaved):** Outline heart, color transition to red
- **Hover (saved):** Filled heart, scale up slightly (1.1x)

**Component:** `components/SaveBandButton.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface SaveBandButtonProps {
  bandId: string;
  bandName: string;
  bandSlug: string;
  genres?: string[];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function SaveBandButton({
  bandId,
  bandName,
  bandSlug,
  genres = [],
  size = 'md',
  showLabel = false
}: SaveBandButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if band is saved on mount
    const saved = getSavedBands();
    setIsSaved(saved.some(b => b.id === bandId));
  }, [bandId]);

  const toggleSave = () => {
    const saved = getSavedBands();

    if (isSaved) {
      // Remove from saved
      const updated = saved.filter(b => b.id !== bandId);
      localStorage.setItem('rocksalt_saved_bands', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      // Add to saved
      const newBand = {
        id: bandId,
        name: bandName,
        slug: bandSlug,
        savedAt: new Date().toISOString(),
        genres
      };
      saved.push(newBand);
      localStorage.setItem('rocksalt_saved_bands', JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <button
      onClick={toggleSave}
      className={`flex items-center gap-2 transition-all ${
        isSaved ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
      }`}
      aria-label={isSaved ? `Remove ${bandName} from favorites` : `Save ${bandName} to favorites`}
    >
      {isSaved ? (
        <HeartSolidIcon className={`${iconSize} animate-pulse-once`} />
      ) : (
        <HeartIcon className={iconSize} />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}

// Helper function to get saved bands from localStorage
function getSavedBands() {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('rocksalt_saved_bands');
  return stored ? JSON.parse(stored) : [];
}
```

**CSS Animation (add to global styles):**
```css
@keyframes pulse-once {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.animate-pulse-once {
  animation: pulse-once 0.3s ease-in-out;
}
```

---

#### B. "My Saved Bands" Page

**URL:** `/my-bands`
**File:** `src/app/my-bands/page.tsx`

**Features:**
- Display all saved bands in grid layout (same style as `/bands` page)
- Show "Saved on [date]" timestamp for each band
- Filter by genre (dropdown or tags)
- Sort by: Date saved (newest/oldest), Alphabetical
- "Clear All" button with confirmation
- Empty state: "No saved bands yet. Explore local artists and save your favorites!"

**Key Functions:**
```typescript
// Load saved bands from localStorage
const savedBands = JSON.parse(localStorage.getItem('rocksalt_saved_bands') || '[]');

// Fetch full band data from database (optional)
// Use Supabase to get latest info (bio, photo, social links)
const bandsData = await supabase
  .from('bands')
  .select('*')
  .in('id', savedBands.map(b => b.id));

// Merge localStorage data with database data
const enrichedBands = savedBands.map(saved => {
  const dbBand = bandsData.find(b => b.id === saved.id);
  return { ...saved, ...dbBand };
});
```

**Empty State Component:**
```tsx
<div className="text-center py-16">
  <HeartIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Saved Bands Yet</h2>
  <p className="text-gray-600 mb-6">
    Discover local artists and save your favorites to keep track of them!
  </p>
  <Link
    href="/bands"
    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
  >
    Explore Bands
  </Link>
</div>
```

---

#### C. Navigation Link

**Add to main navigation:**
- Desktop: "My Bands" link in header (next to "Artists" or "Events")
- Mobile: "My Bands" in hamburger menu
- Badge showing count: "My Bands (3)" if user has saved bands

**Component:** `components/Header.tsx` (or wherever nav lives)

```tsx
const savedCount = getSavedBandsCount(); // Read from localStorage

<Link
  href="/my-bands"
  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
>
  <HeartIcon className="w-5 h-5" />
  My Bands
  {savedCount > 0 && (
    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
      {savedCount}
    </span>
  )}
</Link>
```

---

### 1.3 User Flows

#### Flow 1: Save a Band from Discovery Page

1. User lands on `/bands` (Explore Artists page)
2. Sees grid of band cards, each with heart icon (outline, gray)
3. Hovers over heart → color changes to red (preview)
4. Clicks heart → Icon fills with red, brief pulse animation
5. Toast notification appears: "Chelsea Grin saved to My Bands"
6. Nav badge updates: "My Bands (1)"

#### Flow 2: View Saved Bands

1. User clicks "My Bands" in navigation
2. Lands on `/my-bands` page showing all saved bands
3. Each card displays:
   - Band photo (if available)
   - Band name
   - Genre tags
   - "Saved on Oct 15, 2025"
   - Heart icon (filled, red) to unsave
   - "View Profile" button
4. User clicks genre filter → List narrows to matching bands
5. User clicks heart on a band → Confirmation: "Remove Fictionist from My Bands?"
6. Confirm → Band disappears from list

#### Flow 3: Unsave from Band Profile

1. User on `/bands/chelsea-grin` profile page
2. Sees filled red heart next to band name (because previously saved)
3. Clicks heart → Confirmation: "Remove from My Bands?"
4. Confirm → Heart becomes outline gray, toast: "Removed from My Bands"

---

### 1.4 Implementation Checklist

**Day 1: Core Functionality**
- [ ] Create `lib/savedBands.ts` with localStorage utilities:
  - `getSavedBands()`
  - `saveBand(band)`
  - `unsaveBand(bandId)`
  - `isBandSaved(bandId)`
  - `getSavedBandsCount()`
- [ ] Create `components/SaveBandButton.tsx` (as shown above)
- [ ] Add heart icons to band cards on `/bands` page
- [ ] Add heart icon to band profile header on `/bands/[slug]` page
- [ ] Test save/unsave functionality in browser
- [ ] Test persistence (refresh page, saved bands remain)

**Day 2: My Bands Page**
- [ ] Create `/my-bands/page.tsx` with empty state
- [ ] Fetch saved bands from localStorage on page load
- [ ] Optionally enrich with Supabase data (latest photos, bios)
- [ ] Display bands in grid layout (reuse BandCard component)
- [ ] Add "Saved on [date]" timestamp to cards
- [ ] Add "Clear All" button with confirmation modal
- [ ] Add empty state for first-time users

**Day 3: Navigation & Polish**
- [ ] Add "My Bands" link to header navigation
- [ ] Add badge showing saved count (update on save/unsave)
- [ ] Add toast notifications for save/unsave actions
- [ ] Add genre filter dropdown on My Bands page
- [ ] Add sort dropdown (newest/oldest/alphabetical)
- [ ] Add CSS animation for heart icon (pulse on save)
- [ ] Mobile testing (ensure heart icon is tappable, responsive layout)
- [ ] Accessibility: keyboard navigation, ARIA labels, screen reader testing

---

### 1.5 Edge Cases to Handle

| Scenario | Behavior |
|----------|----------|
| User clears browser data | Saved bands lost → Show empty state on `/my-bands` |
| User switches devices | Saved bands don't sync → Phase 2 (auth) solves this |
| Band is deleted from database | Show band in My Bands but gray out with "No longer available" message |
| localStorage quota exceeded (rare, 5MB+ data) | Show error: "Unable to save band. Try removing old favorites." |
| User saves same band twice | Prevent duplicate saves (check `isBandSaved()` before adding) |
| Rapid clicking heart icon | Debounce clicks (prevent multiple saves) |

---

## Phase 2: Database-Backed (Authenticated Users)

**Prerequisites:**
- Supabase authentication enabled (user login/signup)
- User profiles table exists

### 2.1 Database Schema

**New Table:** `user_saved_bands`

```sql
CREATE TABLE user_saved_bands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  band_id UUID NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT, -- Optional: User can add personal notes about the band
  UNIQUE(user_id, band_id) -- Prevent duplicate saves
);

-- Index for fast lookups
CREATE INDEX idx_user_saved_bands_user ON user_saved_bands(user_id);
CREATE INDEX idx_user_saved_bands_band ON user_saved_bands(band_id);

-- RLS Policy: Users can only see/manage their own saved bands
ALTER TABLE user_saved_bands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved bands"
  ON user_saved_bands FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save bands"
  ON user_saved_bands FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave bands"
  ON user_saved_bands FOR DELETE
  USING (auth.uid() = user_id);
```

---

### 2.2 Hybrid Approach (Best UX)

**When user is NOT logged in:**
- Use localStorage (Phase 1 behavior)
- Show banner on `/my-bands`: "Sign in to sync your favorites across devices"

**When user logs in:**
1. Migrate localStorage data to database:
   ```typescript
   const localBands = getSavedBands(); // From localStorage
   await supabase.from('user_saved_bands').upsert(
     localBands.map(b => ({
       user_id: user.id,
       band_id: b.id,
       saved_at: b.savedAt
     }))
   );
   localStorage.removeItem('rocksalt_saved_bands'); // Clear local data
   ```
2. Fetch saved bands from database instead of localStorage

**When user logs out:**
- Keep showing saved bands from localStorage (don't clear)
- On next login, merge localStorage + database data (avoid duplicates)

---

### 2.3 Updated SaveBandButton (Phase 2)

**Changes:**
- Check if user is authenticated (`useUser()` hook)
- If authenticated: Save to Supabase instead of localStorage
- If not authenticated: Fall back to localStorage (Phase 1)

```typescript
import { useUser } from '@/hooks/useUser'; // Custom hook for Supabase auth
import { createClient } from '@/lib/supabase/client';

export default function SaveBandButton({ bandId, ... }: Props) {
  const { user } = useUser();
  const supabase = createClient();

  const toggleSave = async () => {
    if (user) {
      // Database-backed save
      if (isSaved) {
        await supabase
          .from('user_saved_bands')
          .delete()
          .match({ user_id: user.id, band_id: bandId });
      } else {
        await supabase
          .from('user_saved_bands')
          .insert({ user_id: user.id, band_id: bandId });
      }
    } else {
      // localStorage fallback (Phase 1 logic)
      // ... existing localStorage code ...
    }
    setIsSaved(!isSaved);
  };

  // ... rest of component
}
```

---

### 2.4 Benefits of Phase 2

- ✅ Saved bands sync across desktop, mobile, different browsers
- ✅ Users never lose their favorites (unless they delete account)
- ✅ Admin analytics: Track which bands are most saved (popular bands)
- ✅ Future features:
  - Email notifications when saved band has new show
  - "Recommended for You" based on saved genres
  - Share "My Bands" list publicly (profile URL)

---

## Testing Plan

### Manual Testing

**Phase 1 (localStorage):**
- [ ] Save band from `/bands` page → Check localStorage in DevTools
- [ ] Refresh page → Saved band persists
- [ ] Navigate to `/my-bands` → Saved band appears
- [ ] Unsave from `/my-bands` → Band disappears, localStorage updated
- [ ] Clear browser data → Saved bands lost (expected)
- [ ] Save 50 bands → Check localStorage size doesn't cause issues

**Phase 2 (Database):**
- [ ] Save band while logged in → Check `user_saved_bands` table in Supabase
- [ ] Log out, log back in → Saved band still visible
- [ ] Switch devices → Saved band syncs
- [ ] Save band while logged out → Migrate to DB on next login

### Automated Testing

**Unit Tests (`lib/savedBands.test.ts`):**
```typescript
describe('savedBands', () => {
  it('should save a band to localStorage', () => {
    saveBand({ id: '1', name: 'Test Band', ... });
    const saved = getSavedBands();
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('Test Band');
  });

  it('should prevent duplicate saves', () => {
    saveBand({ id: '1', name: 'Test Band', ... });
    saveBand({ id: '1', name: 'Test Band', ... });
    expect(getSavedBands()).toHaveLength(1);
  });

  it('should unsave a band', () => {
    saveBand({ id: '1', name: 'Test Band', ... });
    unsaveBand('1');
    expect(getSavedBands()).toHaveLength(0);
  });
});
```

**E2E Tests (Playwright/Cypress):**
```typescript
test('user can save and unsave a band', async ({ page }) => {
  await page.goto('/bands');

  // Click heart icon on first band card
  await page.click('[data-testid="save-button-chelsea-grin"]');

  // Check toast notification appears
  await expect(page.locator('text=Chelsea Grin saved')).toBeVisible();

  // Navigate to My Bands
  await page.click('text=My Bands');

  // Verify band appears in saved list
  await expect(page.locator('text=Chelsea Grin')).toBeVisible();

  // Unsave band
  await page.click('[data-testid="save-button-chelsea-grin"]');

  // Verify band disappears
  await expect(page.locator('text=Chelsea Grin')).not.toBeVisible();
});
```

---

## Accessibility Checklist

- [ ] Heart icon has `aria-label` describing action ("Save Chelsea Grin" / "Remove Chelsea Grin from favorites")
- [ ] Heart icon is keyboard accessible (Tab to focus, Enter to toggle)
- [ ] Visual focus indicator on heart icon (outline on focus)
- [ ] Screen reader announces state change ("Chelsea Grin saved" / "Chelsea Grin removed")
- [ ] Color contrast meets WCAG AA (red heart vs. white background = 4.5:1 ratio)
- [ ] Toast notifications visible to screen readers (`role="alert"`)

---

## Analytics Tracking

**Events to Track:**

| Event Name | Trigger | Data |
|------------|---------|------|
| `band_saved` | User clicks heart to save | `band_id`, `band_name`, `is_authenticated` |
| `band_unsaved` | User clicks heart to unsave | `band_id`, `band_name` |
| `my_bands_viewed` | User visits `/my-bands` | `saved_count` |
| `my_bands_cleared` | User clicks "Clear All" | `cleared_count` |
| `saved_band_clicked` | User clicks band from My Bands | `band_id` |

**Example (Google Analytics 4):**
```typescript
gtag('event', 'band_saved', {
  band_id: bandId,
  band_name: bandName,
  is_authenticated: !!user,
  timestamp: Date.now()
});
```

---

## Rollout Plan

### Week 1: Phase 1 (localStorage)
- **Day 1-2:** Build core save/unsave logic + SaveBandButton component
- **Day 3:** Build `/my-bands` page
- **Day 4:** Add navigation links + toast notifications
- **Day 5:** QA testing, bug fixes, accessibility audit

**Deploy to Staging:** End of Week 1
**User Testing:** 5 music fans (Task: "Find 3 bands you like and save them for later")

### Week 2: Phase 2 (Database - Optional)
- **Day 1:** Create `user_saved_bands` table + RLS policies
- **Day 2:** Update SaveBandButton to use Supabase when authenticated
- **Day 3:** Build localStorage → DB migration logic
- **Day 4:** Test sync across devices
- **Day 5:** QA + deploy

**Deploy to Production:** End of Week 2

---

## Success Criteria (30 Days Post-Launch)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Adoption Rate** | 30% of visitors save ≥1 band | Analytics: % of sessions with `band_saved` event |
| **Engagement** | Users with saved bands return 2x more | Compare return visit rate: saved bands vs. no saved bands |
| **Avg Saved Bands** | 3.5 bands per active user | Database query: `AVG(band_count) per user` |
| **Saved → Action** | 40% click social/event link from saved band | Track clicks from My Bands page to external links |
| **Mobile Usage** | 50%+ saves happen on mobile | Analytics: Device type breakdown for `band_saved` |

---

## Future Enhancements (Phase 3+)

1. **Email Notifications**
   - "Your saved band [Band Name] has a show this weekend!"
   - Weekly digest: "3 of your saved bands have upcoming shows"

2. **Smart Recommendations**
   - "Based on your saved bands, you might like [Similar Band]"
   - ML model trained on saved bands + genre overlap

3. **Share My Bands**
   - Public profile: `/users/[username]/saved-bands`
   - Embed code for blogs: "Check out my favorite SLC bands"

4. **Saved Band Stats**
   - "You've saved 12 bands in the last month"
   - "You have 3 Metal bands, 5 Indie bands..."

5. **Integration with Events**
   - Filter events by "My Saved Bands Only"
   - Calendar view: All upcoming shows for saved bands

6. **Export Saved Bands**
   - Export as Spotify playlist
   - Export as CSV (name, genre, social links)

---

## FAQs

**Q: Why localStorage first instead of going straight to database?**
A: Faster to ship (no auth required), works for anonymous users (lower friction), gives us early usage data to validate the feature.

**Q: What if a user saves 100+ bands? Won't localStorage get slow?**
A: localStorage can handle ~5MB (≈10,000 bands at 500 bytes each). For power users, Phase 2 (database) is the solution.

**Q: Should we limit how many bands a user can save?**
A: No limit for now. If abuse detected (spam bots saving all bands), add rate limiting or 100-band cap.

**Q: What happens to localStorage data when we deploy Phase 2?**
A: Migration logic automatically moves localStorage → database on first login. No data lost.

**Q: Can users export their saved bands?**
A: Not in Phase 1/2. Add in Phase 3+ (export as CSV or Spotify playlist).

---

## Files to Create/Modify

### New Files
- `lib/savedBands.ts` – localStorage utilities
- `components/SaveBandButton.tsx` – Heart icon button
- `app/my-bands/page.tsx` – My Saved Bands page
- `hooks/useUser.ts` – Supabase auth hook (Phase 2)
- `supabase/migrations/[timestamp]_create_user_saved_bands.sql` – DB schema (Phase 2)

### Modified Files
- `components/Header.tsx` – Add "My Bands" nav link
- `app/bands/page.tsx` – Add SaveBandButton to each band card
- `app/bands/[slug]/page.tsx` – Add SaveBandButton to profile header
- `styles/globals.css` – Add heart icon pulse animation

---

## Questions for Stakeholders

1. **Authentication Timeline:** When will Supabase auth be ready? Affects Phase 2 launch.
2. **Design Approval:** Confirm heart icon style, color (red vs. pink), and animation.
3. **Analytics:** Do we have GA4 set up? Who tracks event metrics?
4. **Email Notifications:** Are we using SendGrid, Mailgun, or Supabase email? (For future Phase 3)
5. **Mobile App Plans:** Will there be a mobile app? If yes, save functionality should be API-first (not localStorage).

---

## Contact

For questions about this implementation plan, contact:
- **Engineering Lead:** [Name]
- **Design Lead:** [Name]
- **Product Manager:** [Name]

Last updated: 2025-10-15
