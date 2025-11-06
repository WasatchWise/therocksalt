# Two-Sided Marketplace: Spider Rider + RFP System

## 🎯 The Big Idea

**Traditional model is BROKEN:**
- Bands: "Will you book us? Please? Anyone?"
- Venues/Organizers: "I need a band but have no idea who's available"
- Result: Wasted time, missed opportunities, **"exposure" scams**

**Rock Salt solves BOTH sides:**

### Side 1: Tour Spider Rider (Bands → Organizers)
**"Here's what I charge, who wants to book me?"**

Bands post their terms publicly:
- Guarantee range: $500-$2000
- Event types: Venue shows, corporate, weddings
- Technical needs: Sound, lighting, backline
- Routing: West Coast, weekdays OK, 30 days notice

Qualified organizers can instantly see they match and request a booking.

### Side 2: RFP System (Organizers → Bands)
**"I need a band for this event, who's available?"**

Organizers post what they need:
- Event type: Wedding, corporate party, venue show
- Date: March 15, 2025
- Budget: $1500-$2500
- Genre: Jazz, acoustic, cover band
- Requirements: 3-hour set, MC duties, formal attire

Qualified bands submit proposals with their fee and pitch.

---

## 🚫 NO EXPOSURE BULLSHIT

**Hard rule: Minimum budget = $100**

```sql
-- Enforced at database level
CONSTRAINT minimum_budget_check CHECK (budget_min >= 10000) -- $100 minimum
CONSTRAINT minimum_guarantee_check CHECK (guarantee_min >= 10000)
```

**Why:**
- Professional musicians need to eat
- "Exposure" doesn't pay rent
- Legitimizes the platform (no scam events)
- Wedding planners pay DJs $1500+, bands deserve the same

**If an organizer can't pay $100 minimum, they shouldn't be booking live music.**

---

## 💰 Subscription Model

### For Bands (Existing tiers)
- **Free:** Post 1 Spider Rider, see RFPs in your city
- **Featured ($25/mo):** Unlimited Spider Riders, see RFPs nationwide, booking CRM
- **HOF ($100/mo):** + Tour routing AI, contract automation, priority in RFP matches

### For Event Organizers (NEW revenue!)
- **Free:** Post 1 RFP/month, receive proposals
- **Pro ($49/mo):** 5 RFPs/month, browse all bands, priority listing, contract templates
- **Enterprise ($199/mo):** Unlimited RFPs, escrow service, dedicated support

**Why organizers will pay:**
- **Wedding planners** book 20+ weddings/year → Pro tier pays for itself in one gig
- **Corporate event managers** need vetted bands fast → worth $199/mo
- **Venue bookers** need to fill 50+ nights/year → Enterprise tier is a no-brainer

---

## 📊 Data Flow: Spider Rider + RFP

### Scenario A: Venue Books Band via Spider Rider

```
1. Red Pete creates Spider Rider
   - Guarantee: $800-$1500
   - Types: venue_show
   - Capacity: 200-500

2. Kilby Court has:
   - Capacity: 350 ✓
   - Budget: $1200 ✓
   - Genre: Rock ✓

3. Kilby sees in dashboard:
   "Red Pete is a 92% match"

4. Kilby clicks "Request Booking"
   - Offers: $1200, March 15
   - Status: pending

5. Red Pete reviews offer
   - Accepts
   - Status: accepted

6. Contract auto-generated
   - Both sign digitally
   - Status: confirmed

7. Event appears on public calendar
```

### Scenario B: Wedding Books Band via RFP

```
1. Wedding planner creates RFP
   - Event: Wedding reception
   - Date: June 10, 2025
   - Budget: $2000-$3000
   - Genre: Jazz, acoustic
   - Requirements: 4-hour set, dinner music + dancing

2. System matches bands:
   - The Jazz Cats (98% match)
   - Smooth Sounds (94% match)
   - Red Pete (42% - wrong genre)

3. Matched bands get notification:
   "New RFP: Wedding in Park City, $2000-$3000"

4. The Jazz Cats submit proposal:
   - Fee: $2500
   - Set list: 40 jazz standards + 20 contemporary
   - Why us: "We've played 75 weddings, excellent"
   - Includes: Sound system, MC services

5. Wedding planner reviews 5 proposals
   - Shortlists 2 bands
   - Selects The Jazz Cats

6. Contract generated, both sign

7. Wedding happens, both sides leave reviews
```

### Scenario C: Corporate Books Band via RFP + Spider Rider Match

```
1. Tech company posts RFP:
   - Event: Annual holiday party
   - Date: Dec 15, 2025
   - Budget: $5000-$8000
   - Requirements: 3-hour set, high energy, family-friendly

2. System auto-matches:
   - Checks all Spider Riders
   - Finds 12 bands in budget range
   - Filters by corporate experience
   - Sends notifications to top 8 matches

3. Red Pete (HOF tier) gets priority notification:
   "🔥 Premium RFP: $5K-$8K corporate gig"

4. Red Pete submits proposal same day
   - Fee: $6500
   - Previous: "Google, Salesforce, Adobe"
   - Includes: Full production, MC, custom song list

5. Company shortlists 3 bands
   - Reviews videos, references
   - Selects Red Pete

6. Escrow service (Enterprise tier):
   - Company pays 50% deposit ($3250) → held in escrow
   - Red Pete sees "Payment secured"
   - After event, remaining 50% auto-released

7. Company leaves 5-star review
   - Red Pete's match score increases for future corporate RFPs
```

---

## 🎯 The Matching Algorithm

### For Spider Rider → Organizer Matching

```javascript
function calculateMatch(rider, organizer) {
  let score = 0;

  // Budget match (40 points)
  if (organizer.typical_budget_max >= rider.guarantee_min) {
    const budgetFit = Math.min(
      organizer.typical_budget_max / rider.guarantee_min,
      1.5
    );
    score += 40 * (budgetFit / 1.5);
  }

  // Capacity match (20 points) - for venue shows
  if (organizer.organization_type === 'venue') {
    if (organizer.capacity >= rider.min_venue_capacity &&
        organizer.capacity <= rider.max_venue_capacity) {
      score += 20;
    }
  }

  // Genre match (20 points)
  const genreOverlap = intersection(
    organizer.preferred_genres,
    band.genres
  );
  score += (genreOverlap.length / band.genres.length) * 20;

  // Location match (10 points)
  if (sameRegion(rider.routing_preferences, organizer.region)) {
    score += 10;
  }

  // Lead time match (10 points)
  if (rider.min_days_notice <= organizer.booking_lead_time) {
    score += 10;
  }

  return score;
}
```

### For RFP → Band Matching

```javascript
function calculateRFPMatch(rfp, band, rider) {
  let score = 0;

  // Budget match (40 points)
  if (rfp.budget_max >= rider.guarantee_min &&
      rfp.budget_min <= rider.guarantee_max) {
    score += 40;
  }

  // Genre match (25 points)
  const genreOverlap = intersection(rfp.genre_preferences, band.genres);
  score += (genreOverlap.length / rfp.genre_preferences.length) * 25;

  // Experience match (20 points)
  if (rfp.event_type === 'corporate_event' && rider.corporate_events_experience > 0) {
    score += Math.min(rider.corporate_events_experience * 2, 20);
  }
  if (rfp.event_type === 'wedding' && rider.wedding_experience > 0) {
    score += Math.min(rider.wedding_experience * 2, 20);
  }

  // Location match (10 points)
  const distance = calculateDistance(band.city, rfp.city);
  if (distance < 50) score += 10;
  else if (distance < 200) score += 5;

  // Availability match (5 points)
  if (!band.isBookedOn(rfp.event_date)) {
    score += 5;
  }

  return score;
}
```

---

## 🏆 Why This Wins

### Network Effects
The more bands + organizers, the better the matches:
- 100 bands + 10 organizers = OK matches
- 1000 bands + 500 organizers = GREAT matches
- 10,000 bands + 5,000 organizers = **Unstoppable**

### Two Revenue Streams
1. **Band subscriptions:** $25-$100/month (existing)
2. **Organizer subscriptions:** $49-$199/month (NEW!)

**Example with 1,000 users:**
- 700 bands × $25/mo (Featured avg) = $17,500/mo
- 300 organizers × $75/mo (avg) = $22,500/mo
- **Total: $40,000/month = $480K/year**

### Solves Real Pain
- **Bands:** "I waste 20 hours/week cold-emailing venues"
- **Organizers:** "I need a band for Saturday and have no idea who to call"
- **Both:** "Contracts are a nightmare"

Rock Salt fixes all three.

---

## 🚀 Go-To-Market Strategy

### Phase 1: Seed both sides in Salt Lake City
1. **Get 50 bands on Spider Riders** (free for first 3 months)
2. **Get 20 venues/organizers** (free Pro tier for 3 months)
3. **Facilitate 10 bookings** manually if needed
4. **Collect testimonials**

### Phase 2: Wedding planner gold rush
Wedding planners book 20-100 weddings/year. They're desperate for reliable bands.
1. **Target wedding planner Facebook groups**
2. **Offer:** "Find vetted bands in 5 minutes, not 5 hours"
3. **Pricing:** $49/mo = 1 hour of their time saved per month
4. **Result:** Planners become power users, refer bands

### Phase 3: Corporate events
Corporate event managers have HUGE budgets ($5K-$20K/event).
1. **LinkedIn ads** targeting "Event Manager" at tech companies
2. **Pitch:** "Vetted bands, instant proposals, escrow service"
3. **Enterprise tier:** They need reliability + legal coverage
4. **Result:** High-value recurring customers

### Phase 4: Expand regions
Once SLC is saturated:
1. **Denver** (mountain region)
2. **Portland** (PNW)
3. **Phoenix** (Southwest)
4. Each region increases network effects

---

## 💡 Future Features

### Escrow Service (Enterprise tier)
- Organizer pays 50% deposit → held by Rock Salt
- Band sees "Payment secured"
- After event, auto-release remaining 50%
- **Rock Salt takes 3% fee** (additional revenue!)

### Band Insurance Marketplace
- "Get COI for this event: $47"
- Instant PDF, meets venue requirements
- **Affiliate commission from insurance partners**

### Review System
- Bands review organizers (payment speed, professionalism)
- Organizers review bands (punctuality, quality)
- **Bad actors get filtered out**

### Automated Contract Generation
- Pull data from RFP + proposal
- Generate industry-standard contract
- E-signature via DocuSign API
- **Charge $25/contract or include in subscription**

---

## 📝 Next Steps

1. ✅ Database schema complete
2. [ ] Build Spider Rider form (bands)
3. [ ] Build RFP posting form (organizers)
4. [ ] Build proposal submission form (bands → RFPs)
5. [ ] Build matching algorithm
6. [ ] Build organizer dashboard ("Qualified Bands")
7. [ ] Build band dashboard ("RFPs You Match")
8. [ ] Email notifications
9. [ ] Contract generation
10. [ ] Payment processing (Stripe)

**Start with Step 2: Spider Rider form. Let's build it!**
