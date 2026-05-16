// ============================================================
// streak-at-risk
//
// Scheduled hourly at :30 via pg_cron.
// Finds users whose streak will expire in < 3 hours (in their local
// timezone) and who have streak_at_risk = true. Calls send-notification.
// ============================================================

import { createClient } from '@supabase/supabase-js';

interface UserAtRisk {
  user_id: string;
  platform: string;
  current_streak: number;
  last_post_date: string;
  timezone: string;
  display_name: string;
}

// Hours until midnight in the given IANA timezone
function hoursUntilLocalMidnight(timezone: string): number {
  const now = new Date();
  const local = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const tomorrow = new Date(local);
  tomorrow.setHours(24, 0, 0, 0);
  return (tomorrow.getTime() - local.getTime()) / (1000 * 60 * 60);
}

function todayInTimezone(timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function subDays(yyyymmdd: string, days: number): string {
  const d = new Date(`${yyyymmdd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Pull active streaks joined with profile timezone and notification prefs
  const { data: rows, error } = await supabase
    .from('streaks')
    .select(`
      user_id,
      platform,
      current_streak,
      last_post_date,
      profiles!inner ( timezone, display_name ),
      notification_prefs!inner ( streak_at_risk )
    `)
    .gt('current_streak', 0)
    .neq('platform', 'overall');

  if (error || !rows) {
    console.error('Failed to load streaks', error);
    return new Response(JSON.stringify({ error: 'load failed' }), { status: 500 });
  }

  let notified = 0;
  for (const row of rows as unknown as Array<{
    user_id: string;
    platform: string;
    current_streak: number;
    last_post_date: string | null;
    profiles: { timezone: string; display_name: string };
    notification_prefs: { streak_at_risk: boolean };
  }>) {
    if (!row.notification_prefs.streak_at_risk) continue;
    if (!row.last_post_date) continue;

    const tz = row.profiles.timezone;
    const today = todayInTimezone(tz);
    const yesterday = subDays(today, 1);

    // Already posted today → not at risk
    if (row.last_post_date === today) continue;
    // Last post older than yesterday → already broken
    if (row.last_post_date !== yesterday) continue;

    const hoursLeft = hoursUntilLocalMidnight(tz);
    if (hoursLeft > 3) continue;

    await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`,
        },
        body: JSON.stringify({
          user_id: row.user_id,
          title: '⚠️ Streak ending soon',
          body: `Your ${row.platform} streak of ${row.current_streak} days expires in ${Math.max(1, Math.floor(hoursLeft))} hours. Post now!`,
          data: { type: 'streak_at_risk', platform: row.platform },
        }),
      },
    );

    notified++;
  }

  return new Response(JSON.stringify({ success: true, notified }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
