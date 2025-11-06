# Tour Spider Rider - Database Schema Documentation

## 🕸️ Overview

The Tour Spider Rider system flips traditional music booking:
- **Old way:** Bands cold-email 100 venues, hear back from 5
- **Spider Rider way:** Bands post terms once, qualified venues can instantly book

## 📊 Database Tables

### 1. `tour_spider_riders`
**The band's touring contract posted publicly**

A band fills this out ONCE and it becomes their public touring terms.

```sql
Key Fields:
- guarantee_min/max: Financial range ($500-$2000 = 50000-200000 cents)
- percentage_split: Door split preference {"band_percent": 80, "venue_percent": 20}
- lodging_requirements: {"hotel": true, "rooms_needed": 2}
- min_venue_capacity/max_venue_capacity: 200-500
- routing_preferences: {"regions": ["west_coast"], "weekdays_only": false}
- status: active/paused/inactive
```

**Business Logic:**
- One active rider per band
- Public by default (venues can see it)
- Can be paused during off-season

---

### 2. `venue_qualifications`
**Pre-calculated match scores (cached)**

Every night, run a job that calculates which venues qualify for which bands.

```sql
Key Fields:
- qualified: true/false (can this venue book this band?)
- match_score: 0-100 (how good is the fit?)
- capacity_match: Does venue capacity fit band's range?
- financial_match: Can venue afford the guarantee?
- genre_match: Do genres align?
- disqualification_reasons: ["capacity_too_small", "budget_too_low"]
```

**Matching Algorithm:**
```javascript
// Example scoring logic
let score = 0;

// Capacity match (30 points)
if (venue.capacity >= rider.min_capacity && venue.capacity <= rider.max_capacity) {
  score += 30;
}

// Financial match (40 points)
if (venue.typical_budget_max >= rider.guarantee_min) {
  score += 40;
}

// Genre match (20 points)
const genreOverlap = intersection(venue.preferred_genres, band.genres);
score += (genreOverlap.length / band.genres.length) * 20;

// Location match (10 points)
if (rider.routing_preferences.regions.includes(venue.region)) {
  score += 10;
}

// Qualified if score >= 50
qualified = score >= 50;
```

---

### 3. `booking_requests`
**The actual booking conversation**

When a venue sees they qualify, they click "Request Booking" and this record is created.

```sql
Key Fields:
- requested_date: Show date
- initiated_by: 'venue' or 'band'
- venue_offer: {"guarantee": 100000, "percentage": 80, "lodging": "hotel"}
- band_counter: If band counters the offer
- status: pending → accepted/rejected/countered → confirmed
- contract_generated: true when PDF is created
- messages: [{from: 'venue', message: 'Can we move to 8pm?'}]
```

**Status Flow:**
```
pending → accepted → confirmed (both signed)
        → countered → accepted → confirmed
        → rejected
        → cancelled
```

---

### 4. `tour_routes`
**Multi-city tour planning**

Bands can build routes with multiple shows. AI suggests optimal routing.

```sql
Key Fields:
- route_name: "West Coast Spring 2025"
- start_date/end_date: Tour window
- estimated_revenue: Total projected income
- estimated_expenses: Gas, hotels, food
- profitability_score: 0-100
- routing_data: {suggested_venues: [...], optimal_path: [...]}
```

**AI Routing Logic:**
```javascript
// Example route optimization
const route = {
  shows: [
    {city: 'Salt Lake City', date: '2025-03-15', revenue: 1500},
    {city: 'Denver', date: '2025-03-17', revenue: 2000},
    {city: 'Portland', date: '2025-03-20', revenue: 1800}
  ]
};

// AI suggests filling gaps:
// "You have 2 days between Denver and Portland.
//  Book Boise on 3/18 (3hr drive) for $1200?"
```

---

### 5. `tour_route_dates`
**Individual shows in a route**

Each show in the tour gets a record.

```sql
Key Fields:
- route_id: Parent tour
- venue_id: Where they're playing
- booking_request_id: Links to the booking
- show_date: Date of show
- sequence_order: 1st show, 2nd show, etc.
- drive_time_from_previous: 180 (3 hours)
- is_confirmed: true when booking is locked in
- is_day_off: true for travel/rest days
```

---

### 6. `venues` (extended)
**New columns for Spider Rider**

```sql
New Fields:
- typical_budget_min/max: What venues usually pay ($500-$1500)
- booking_lead_time: How far in advance they book (30 days)
- preferred_genres: ['rock', 'indie', 'punk']
- booking_contact_email: Direct email for bookings
- available_weekdays: ['thursday','friday','saturday']
```

---

## 🔄 Data Flow

### Scenario 1: Band Creates Spider Rider

```
1. Band fills out Spider Rider form
   ↓
2. tour_spider_riders record created (status: active)
   ↓
3. Background job runs matching algorithm
   ↓
4. venue_qualifications records created for all venues
   ↓
5. Qualified venues get notification: "New band available!"
```

### Scenario 2: Venue Requests Booking

```
1. Venue views "Qualified Bands" dashboard
   ↓
2. Sees band + match score (85/100)
   ↓
3. Clicks "Request Booking" for March 15th
   ↓
4. booking_requests record created (status: pending)
   ↓
5. Band gets notification with venue's offer
   ↓
6. Band accepts → status: accepted
   ↓
7. Contract PDF auto-generated → contract_pdf_url set
   ↓
8. Both parties sign → status: confirmed
   ↓
9. Event auto-created in events table
```

### Scenario 3: Band Builds Tour Route

```
1. Band creates tour_routes: "Spring Tour 2025"
   ↓
2. Adds cities they want to hit
   ↓
3. AI suggests optimal path + venues in each city
   ↓
4. Band selects venues → booking_requests created
   ↓
5. As bookings confirm, tour_route_dates records created
   ↓
6. Route dashboard shows:
   - 5 shows confirmed
   - 2 pending
   - Estimated profit: $8,400
   - Drive time: 18 hours total
```

---

## 🎯 Key Queries

### Get qualified venues for a band
```sql
SELECT
  v.name,
  v.city,
  v.capacity,
  vq.match_score,
  vq.match_details
FROM venue_qualifications vq
JOIN venues v ON v.id = vq.venue_id
JOIN tour_spider_riders tsr ON tsr.id = vq.rider_id
WHERE tsr.band_id = 'band-uuid'
  AND vq.qualified = true
ORDER BY vq.match_score DESC;
```

### Get qualified bands for a venue
```sql
SELECT
  b.name,
  b.genres,
  tsr.guarantee_min,
  tsr.guarantee_max,
  vq.match_score
FROM venue_qualifications vq
JOIN tour_spider_riders tsr ON tsr.id = vq.rider_id
JOIN bands b ON b.id = tsr.band_id
WHERE vq.venue_id = 'venue-uuid'
  AND vq.qualified = true
  AND tsr.status = 'active'
ORDER BY vq.match_score DESC;
```

### Get pending booking requests for a band
```sql
SELECT
  br.*,
  v.name as venue_name,
  v.city
FROM booking_requests br
JOIN venues v ON v.id = br.venue_id
WHERE br.band_id = 'band-uuid'
  AND br.status = 'pending'
ORDER BY br.requested_date;
```

---

## 🚀 Implementation Phases

### Phase 1: MVP (2 weeks)
- ✅ Database schema created
- [ ] Band Spider Rider form
- [ ] Simple matching algorithm (manual approval)
- [ ] Venue dashboard: "Bands You Qualify For"
- [ ] Booking request flow (no contract PDF yet)

### Phase 2: Smart Matching (4 weeks)
- [ ] Automated matching algorithm
- [ ] Match score calculation
- [ ] Email notifications
- [ ] Contract PDF generation
- [ ] Digital signature flow

### Phase 3: Tour Routing AI (6 weeks)
- [ ] Route builder UI
- [ ] AI route optimization
- [ ] Gap-filling suggestions
- [ ] Profitability calculator
- [ ] Drive time/distance calculations

---

## 💡 Revenue Model

### For Bands (Free → Featured → HOF)
- **Free:** Can view qualified venues (limit 10)
- **Featured ($25/mo):** Unlimited qualified venues + booking CRM
- **HOF ($100/mo):** + Tour routing AI + contract automation

### For Venues (New revenue stream!)
- **Venue Pro ($50/mo):**
  - See ALL qualified bands (not just local)
  - Get notified when new bands match
  - Advanced filtering (genre, budget, date)
  - Priority in band's "suggested venues"

---

## 🔮 Future Features

- **Deposit escrow system** - Venues pay 50% deposit, held in escrow
- **Review system** - Bands review venues, venues review bands
- **Insurance integration** - Auto-generate COI for venues
- **Route marketplace** - Bands can sell opening slots on tours
- **Venue coalitions** - Multi-venue booking (book 3 CA shows at once)

---

## 📝 Notes

This schema is designed for **scale**:
- Matching is pre-calculated (not real-time) for performance
- JSONB fields allow flexibility as requirements evolve
- RLS policies ready for multi-tenancy
- Indexes on all foreign keys and query patterns

**Next Step:** Build the band Spider Rider form UI!
