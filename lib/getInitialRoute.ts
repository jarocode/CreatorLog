import type { Href } from 'expo-router';

/**
 * Resolves where the app should land after the splash screen.
 *
 * Auth/session wiring isn't built yet, so this currently always returns the
 * sign-in route. When Supabase auth lands, this becomes the single place to
 * branch on session + onboarding state — the splash UI never changes:
 *   - no session                        → '/(auth)/sign-in'
 *   - session, onboarding incomplete    → '/(onboarding)/platforms'
 *   - session, onboarding complete      → '/(tabs)'
 */
export async function getInitialRoute(): Promise<Href> {
  return '/(auth)/sign-in';
}
