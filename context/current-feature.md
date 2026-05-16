# Current Feature

Supabase Database Setup — Stand up the Supabase project (Postgres + Auth + Edge Functions) that backs CreatorLog: schema, RLS, indexes, edge functions, and typed client bindings.

## Status

In Progress

## Goals

- Use Supabase managed Postgres; client uses `@supabase/supabase-js` directly (no ORM)
- Create initial schema for the MVP tables: `profiles`, `platform_configs`, `post_logs`, `streaks`, `notification_prefs` (per `context/project-overview.md` §6)
- Wire Supabase Auth (email/password, magic link, Apple SSO, Google SSO); `auth.users` is source of identity; `public.profiles` extends it via `handle_new_user` trigger
- Enable Row Level Security on every table — users can only read/write their own rows
- Add indexes per §6.2 and `ON DELETE CASCADE` on all `user_id` foreign keys
- Implement Edge Functions in `supabase/functions/` scheduled via `pg_cron`:
  - `calculate-streaks` (daily 00:05 UTC)
  - `streak-at-risk` (hourly :30)
  - `weekly-summary` (Sundays 18:00 UTC)
  - `reset-freeze` (Mondays 00:00 UTC)
  - `send-notification` (invoked by the others; wraps Expo Push API)
- Generate typed bindings with `supabase gen types typescript` into `types/database.ts`

## Notes

- Reference spec: `context/features/database-spec.md`; schema/RLS/edge function table: `context/project-overview.md` §6; standards: `context/coding-standards.md` (Database section)
- Work against a development Supabase project linked via `supabase link`; production is a separate project
- ALWAYS create migrations with `supabase migration new <name>` and apply via `supabase db push` — never edit tables directly in the dashboard unless specified
- Migration files numbered sequentially in `supabase/migrations/` (see §10)
- Env vars (`.env`):
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `service_role` key only used inside edge functions — never expose to the client
- Edge functions use `service_role` for admin writes (streak inserts/deletes); mobile client only ever uses `anon` key under RLS

## History

<!-- Keep this updated, earliest to latest -->

- 2026-05-05: Homescreen Dashboard UI Phase 1 — Home screen dashboard UI layout (phase 1 of 3). Implemented default, light mode, new user, and all goals complete states. Set up project structure (constants, component folders), built StreakCounter, TodayStatus, WeeklyProgress, QuickStats components, and 4-tab navigation.
- 2026-05-05: Homescreen Dashboard UI Phase 2 — Dark/light mode toggle via global Zustand settingsStore. Updated useColorScheme hooks to read from store. Added radial glow rings (amber for active/atRisk, blue for frozen, none for new/lapsed) to StreakCounter for all states. Implemented MilestoneCelebration full-screen overlay popup with confetti dots (tap any TODAY platform card to toggle). Settings icon on homescreen navigates to Settings tab. Settings screen built with theme toggle switch and placeholder rows for Goals, Notifications, Account, Export.
- 2026-05-16: Log Post Screen Phase 1 — Built Log Post screen UI (light + dark) at app/log-post.tsx. Added PlatformPicker, ContentTypePicker, MetricsInput components in components/log/, plus PLATFORM_CONTENT_TYPES constants per platform. Sticky bottom "Log it" button with flame icon. Homescreen FAB wired to router.push('/log-post'); screen registered in root Stack.
- 2026-05-16: Calendar Screen — Built Calendar screen UI (light + dark) at app/(tabs)/calendar.tsx. Added PostCalendar (Monday-first grid with platform dots + today purple border + freeze snowflake) and MonthlyStats (posts total + trending badge) components in components/calendar/. Added MOCK_CALENDAR_MONTH for April 2026. Legend row at bottom (LinkedIn/TikTok/YouTube/Freeze used). Month chevrons cycle months.
- 2026-05-16: Stats Screen — Built Stats screen UI (light + dark) at app/(tabs)/stats.tsx. Added PostsBarChart (manual bar chart with y-axis labels and gridlines), StreakHistory (per-platform rows with current/best), and generic InsightCard components in components/stats/. Added MOCK_STATS data (26 posts across LinkedIn/TikTok/YouTube, streaks, BEST DAY Tuesday, +52% TREND). Header has "4 weeks" filter pill.
