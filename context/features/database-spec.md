# Supabase Postgres Setup

## Overview

Set up the Supabase project (Postgres + Auth + Edge Functions) that backs the CreatorLog mobile app. The client uses `@supabase/supabase-js` directly — no ORM.

## Requirements

- Use Supabase managed Postgres
- Create initial schema based on data models in `@context/project-overview.md` §6 (this will evolve)
- Use Supabase Auth (email/password, magic link, Apple SSO, Google SSO) — `auth.users` is the source of identity; `public.profiles` extends it via the `handle_new_user` trigger
- Enable Row Level Security on every table; users can only read/write their own rows
- Add appropriate indexes (see §6.2) and `ON DELETE CASCADE` on all `user_id` foreign keys
- Generate typed client bindings with `supabase gen types typescript` into `types/database.ts`

## Tables (MVP)

From `@context/project-overview.md` §6:

- `profiles` — extends `auth.users`, timezone + subscription tier
- `platform_configs` — per-platform weekly goals + reminder settings
- `post_logs` — every logged post (core data table)
- `streaks` — per-platform + overall streak state, freeze flags
- `notification_prefs` — push token + per-notification toggles

## Edge Functions

Deno edge functions live in `supabase/functions/`. Scheduled via `pg_cron`:

- `calculate-streaks` (daily 00:05 UTC)
- `streak-at-risk` (hourly :30)
- `weekly-summary` (Sundays 18:00 UTC)
- `reset-freeze` (Mondays 00:00 UTC)
- `send-notification` (invoked by the others — wraps Expo Push API)

Edge functions use the `service_role` key for admin writes (streak inserts/deletes); the mobile client only ever uses the `anon` key under RLS.

## References

- Schema, RLS policies, and edge function table: `@context/project-overview.md` §6
- Database standards: `@context/coding-standards.md` (Database section)
- Supabase JS client: https://supabase.com/docs/reference/javascript
- Supabase Auth (React Native): https://supabase.com/docs/guides/auth/quickstarts/react-native
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase CLI (migrations): https://supabase.com/docs/guides/cli

## Notes

We work against a development Supabase project linked via `supabase link`, with production as a separate project. ALWAYS create migrations with `supabase migration new <name>` and apply via `supabase db push` — never edit tables directly in the dashboard unless specified.

Migration files are numbered sequentially in `supabase/migrations/` (see project structure in `@context/project-overview.md` §10).

Environment variables (`.env`):

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

The `service_role` key is only used inside edge functions — never expose it to the client.
