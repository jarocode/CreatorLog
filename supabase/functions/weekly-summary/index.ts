// ============================================================
// weekly-summary
//
// Scheduled Sundays 18:00 UTC via pg_cron.
// Aggregates the user's posts per platform over the last 7 days
// and sends a summary push to users with weekly_summary = true.
// ============================================================

import { createClient } from '@supabase/supabase-js';

interface UserWithPrefs {
  id: string;
  display_name: string;
  notification_prefs: { weekly_summary: boolean } | null;
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: users, error } = await supabase
    .from('profiles')
    .select(`
      id,
      display_name,
      notification_prefs!inner ( weekly_summary )
    `);

  if (error || !users) {
    console.error('Failed to load users', error);
    return new Response(JSON.stringify({ error: 'load failed' }), { status: 500 });
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoIso = weekAgo.toISOString();

  let sent = 0;
  for (const user of users as unknown as UserWithPrefs[]) {
    if (!user.notification_prefs?.weekly_summary) continue;

    const { data: posts } = await supabase
      .from('post_logs')
      .select('platform')
      .eq('user_id', user.id)
      .gte('posted_at', weekAgoIso);

    const counts = { linkedin: 0, tiktok: 0, youtube: 0 };
    for (const p of posts ?? []) {
      if (p.platform === 'linkedin') counts.linkedin++;
      else if (p.platform === 'tiktok') counts.tiktok++;
      else if (p.platform === 'youtube') counts.youtube++;
    }

    const total = counts.linkedin + counts.tiktok + counts.youtube;
    const status = total === 0
      ? "Let's get back on track this week."
      : total >= 7
      ? 'Great consistency!'
      : 'Keep building the habit.';

    await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          title: '📊 Your week in review',
          body: `This week: ${counts.linkedin}x LinkedIn, ${counts.tiktok}x TikTok, ${counts.youtube}x YouTube. ${status}`,
          data: { type: 'weekly_summary', counts },
        }),
      },
    );

    sent++;
  }

  return new Response(JSON.stringify({ success: true, sent }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
