// ============================================================
// reset-freeze
//
// Scheduled Mondays 00:00 UTC via pg_cron.
// Resets freeze_used_this_week = false on all streak rows so users
// get a fresh freeze for the new week.
// ============================================================

import { createClient } from '@supabase/supabase-js';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error, count } = await supabase
    .from('streaks')
    .update(
      { freeze_used_this_week: false, freeze_date: null },
      { count: 'exact' },
    )
    .eq('freeze_used_this_week', true);

  if (error) {
    console.error('Failed to reset freezes', error);
    return new Response(JSON.stringify({ error: 'reset failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, reset: count ?? 0 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
