// Smoke-test the linked Supabase project.
// Run: node --env-file=.env scripts/test-db.ts

import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

const TABLES = [
  'profiles',
  'platform_configs',
  'post_logs',
  'streaks',
  'notification_prefs',
] as const;

async function main() {
  console.log(`\n→ Connecting to ${url}\n`);

  let allOk = true;

  for (const table of TABLES) {
    const { error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`✗ ${table.padEnd(20)} ${error.message}`);
      allOk = false;
    } else {
      console.log(`✓ ${table.padEnd(20)} reachable (${count ?? 0} visible rows)`);
    }
  }

  // RLS smoke check: unauthenticated client should see 0 rows on user-scoped tables.
  // If a SELECT returns rows here, RLS is misconfigured.
  const { data, error } = await supabase.from('post_logs').select('id').limit(1);
  if (error) {
    console.log(`\n⚠ post_logs SELECT errored under anon: ${error.message}`);
  } else if (data && data.length > 0) {
    console.log(`\n⚠ RLS LEAK: anon client read ${data.length} row(s) from post_logs`);
    allOk = false;
  } else {
    console.log(`\n✓ RLS enforced — anon client sees 0 rows in post_logs`);
  }

  console.log(allOk ? '\n✓ All checks passed\n' : '\n✗ Some checks failed\n');
  process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
  console.error('\n✗ Unexpected error:', err);
  process.exit(1);
});
