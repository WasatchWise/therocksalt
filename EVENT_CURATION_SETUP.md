# Event Curation System

Automated event import from Bandsintown and Songkick APIs to populate the calendar with real Utah music shows.

## Features

- ✅ Automatic event syncing from Bandsintown and Songkick
- ✅ Runs every 6 hours via Vercel Cron
- ✅ Smart venue matching and creation
- ✅ Deduplication using external IDs
- ✅ Manual sync endpoint for immediate updates

## Setup

### 1. Get API Keys

**Bandsintown:**
- Sign up at https://www.bandsintown.com/api_requests/new
- App ID is automatically set to 'therocksalt' (no key needed)

**Songkick (Optional but Recommended):**
- Sign up at https://www.songkick.com/api_key_requests/new
- Get your API key from the developer portal

### 2. Add Environment Variables

Add to `.env.local` and Vercel:

```bash
# Songkick API Key (optional)
SONGKICK_API_KEY=your_songkick_api_key

# Cron Secret (for security)
CRON_SECRET=your_random_secret_here
```

### 3. Run Database Migration

```bash
# Push the new migration to Supabase
supabase db push
```

Or run this SQL in Supabase SQL editor:
```sql
-- See: supabase/migrations/20251118_add_external_event_tracking.sql
```

### 4. Deploy to Vercel

The `vercel.json` cron configuration will automatically set up the job:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-events",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

This runs every 6 hours.

## Manual Sync

Trigger event sync manually:

```bash
# With cron secret
curl -X POST https://therocksalt.com/api/cron/sync-events \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Or from browser (if no secret set)
https://therocksalt.com/api/cron/sync-events
```

## How It Works

1. **Fetches Events**: Queries Bandsintown and Songkick for Utah events
2. **Filters Location**: Only imports events in Utah (UT)
3. **Matches Venues**: Links events to existing venues or creates new ones
4. **Deduplicates**: Uses `external_id` to prevent duplicate imports
5. **Updates Database**: Creates new events or updates existing ones

## Event Sources

- **Bandsintown**: Artist tour dates, venue-based events
- **Songkick**: Comprehensive venue calendars, artist tracking
- **Manual Submissions**: User-submitted events via `/events` form

## Curation Logic

Events are imported with:
- **Tier**: `free` (auto-imported events default to free tier)
- **Venue**: Matched by name or created automatically
- **External ID**: Prevents duplicates (e.g., `bandsintown-12345`)
- **External Source**: Tracks origin (`bandsintown`, `songkick`, `manual`)

## Monitoring

Check cron job status in Vercel Dashboard → Cron Jobs

View logs:
```bash
vercel logs --follow
```

## Local Development

Test the sync locally:

```bash
# Start dev server
npm run dev

# Call the endpoint
curl http://localhost:3000/api/cron/sync-events
```

## Troubleshooting

**No events syncing?**
- Check API keys are set in Vercel environment
- Verify Supabase connection is working
- Check logs for errors: `vercel logs`

**Duplicate events?**
- External IDs should prevent this
- Check database for duplicate venues with similar names

**Events not showing on homepage?**
- Homepage only shows upcoming events (future dates)
- Check event `start_time` is correctly formatted
- Verify venue associations exist

## Next Steps

- Add more event sources (Eventbrite, Ticketmaster)
- Implement event deduplication across sources
- Add event editing/curation interface for admins
- Track event popularity and featured status
