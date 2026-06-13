import type { Href } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

/**
 * Resolves where the app should land after the splash screen, from real
 * session + onboarding state:
 *   - no session                     → '/(auth)/sign-in'
 *   - session, onboarding incomplete  → '/(onboarding)/platforms'
 *   - session, onboarding complete    → '/(tabs)'
 *
 * Ensures the auth store has restored the session (idempotent) before deciding.
 */
export async function getInitialRoute(): Promise<Href> {
  await useAuthStore.getState().initialize();
  const { session, profile } = useAuthStore.getState();

  if (!session) return '/(auth)/sign-in';
  if (!profile?.onboarding_completed) return '/(onboarding)/platforms';
  return '/(tabs)';
}
