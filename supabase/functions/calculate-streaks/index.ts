// ============================================================
// calculate-streaks
//
// Scheduled daily at 00:05 UTC via pg_cron.
// Recalculates current_streak and longest_streak for every user
// across each platform + 'overall', honoring streak freezes and
// user timezones.
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

type Platform = 'linkedin' | 'tiktok' | 'youtube';
const PLATFORMS: Platform[] = ['linkedin', 'tiktok', 'youtube'];

interface Profile {
  id: string;
  timezone: string;
}

interface PostLog {
  posted_at: string;
  platform: Platform;
}

interface StreakRow {
  current_streak: number;
  longest_streak: number;
  streak_start_date: string | null;
  last_post_date: string | null;
  freeze_used_this_week: boolean;
  freeze_date: string | null;
}

// Return YYYY-MM-DD for a timestamp in the user's local timezone
function localDate(timestamp: string, timezone: string): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function todayInTimezone(timezone: string): string {
  return localDate(new Date().toISOString(), timezone);
}

function dateOnly(yyyymmdd: string): Date {
  // Treat as UTC midnight to do safe day arithmetic
  return new Date(`${yyyymmdd}T00:00:00Z`);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (dateOnly(b).getTime() - dateOnly(a).getTime()) / (1000 * 60 * 60 * 24),
  );
}

function subDays(yyyymmdd: string, days: number): string {
  const d = dateOnly(yyyymmdd);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

interface StreakResult {
  current: number;
  startDate: string | null;
  lastPostDate: string | null;
}

function calculateStreak(
  postedAtList: string[],
  timezone: string,
  freezeDate: string | null,
): StreakResult {
  if (postedAtList.length === 0) {
    return { current: 0, startDate: null, lastPostDate: null };
  }

  const localDays = Array.from(
    new Set(postedAtList.map((t) => localDate(t, timezone))),
  ).sort((a, b) => (a < b ? 1 : -1)); // newest first

  const today = todayInTimezone(timezone);
  const mostRecent = localDays[0];
  const gap = daysBetween(mostRecent, today);

  // Most recent post is more than 1 day ago → streak broken (unless freeze covered yesterday)
  if (gap > 1) {
    const yesterday = subDays(today, 1);
    if (freezeDate && gap === 2 && freezeDate === yesterday) {
      // freeze covers it — continue counting
    } else {
      return { current: 0, startDate: null, lastPostDate: mostRecent };
    }
  }

  let streak = 1;
  for (let i = 1; i < localDays.length; i++) {
    const expected = subDays(localDays[i - 1], 1);
    if (localDays[i] === expected) {
      streak++;
    } else {
      break;
    }
  }

  const startDate = localDays[Math.min(streak - 1, localDays.length - 1)];
  return { current: streak, startDate, lastPostDate: mostRecent };
}

async function recalcUser(supabase: SupabaseClient, user: Profile) {
  const { data: posts, error } = await supabase
    .from('post_logs')
    .select('posted_at, platform')
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to load posts for', user.id, error);
    return;
  }

  const postsByPlatform: Record<string, PostLog[]> = {
    linkedin: [],
    tiktok: [],
    youtube: [],
  };
  for (const p of posts ?? []) {
    if (PLATFORMS.includes(p.platform)) {
      postsByPlatform[p.platform].push(p);
    }
  }

  const allKeys = [...PLATFORMS, 'overall'] as const;
  for (const key of allKeys) {
    const sourcePosts =
      key === 'overall' ? (posts ?? []) : postsByPlatform[key];

    const { data: existing } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, streak_start_date, last_post_date, freeze_used_this_week, freeze_date')
      .eq('user_id', user.id)
      .eq('platform', key)
      .maybeSingle<StreakRow>();

    const freezeDate =
      existing?.freeze_used_this_week && existing.freeze_date
        ? existing.freeze_date
        : null;

    const result = calculateStreak(
      sourcePosts.map((p) => p.posted_at),
      user.timezone,
      freezeDate,
    );

    const longest = Math.max(
      existing?.longest_streak ?? 0,
      result.current,
    );

    await supabase.from('streaks').upsert(
      {
        user_id: user.id,
        platform: key,
        current_streak: result.current,
        longest_streak: longest,
        streak_start_date: result.startDate,
        last_post_date: result.lastPostDate,
        freeze_used_this_week: existing?.freeze_used_this_week ?? false,
        freeze_date: existing?.freeze_date ?? null,
      },
      { onConflict: 'user_id,platform' },
    );
  }
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, timezone');

  if (error || !users) {
    console.error('Failed to load users', error);
    return new Response(JSON.stringify({ error: 'Failed to load users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  for (const user of users) {
    await recalcUser(supabase, user as Profile);
  }

  return new Response(JSON.stringify({ success: true, processed: users.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
