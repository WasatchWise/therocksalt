# Supabase Setup

The schema for The Rock Salt lives in this directory. Use the Supabase CLI to run it locally or push it to your hosted project.

## Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm i -g supabase` or `npx supabase --help`)
- Docker running if you plan to use the local stack (`supabase start` spins up Postgres + Studio)

## Configuration
`config.toml` is pre-populated with the hosted project ref (`rnqoonjhxqxcxdeeixtd`). Update it if you clone into a different project or want an alternate env.

Environment variables for the Next.js app live in `env.l`. Copy the Supabase keys from there into `.env.local` before running the app.

## Common Tasks

```bash
# Boot the local Supabase stack (Postgres + Studio)
yarn db:start

# Push the SQL in schema.sql to the target database
yarn db:push

# Seed baseline content (bands, episodes, etc.)
yarn db:seed

# Regenerate TypeScript types after a schema change
yarn db:types
```

When targeting production, authenticate the CLI (`supabase login`) and set the desired project ref (`supabase link`).

The seed file contains a handful of fixtures that mirror the static HTML prototypes (New Transit Direction, Kilby Court, etc.). Modify or extend it as content grows.

## Next Steps
- Gate `music_submissions` with auth or moderated roles before exposing the API publicly.
- Build admin dashboards or data entry flows for bands, events, and editorial content.
- Split large content blocks (articles, facts) into CMS-friendly structures if you plan to import content from Notion or Airtable later.

> ℹ️ The RLS policies now expect an `is_staff` claim on authenticated JWTs for reviewing music submissions. Use
> `supabase.functions.invoke('set-claims')` or your auth hook to inject `{ "is_staff": "true" }` for moderators.
