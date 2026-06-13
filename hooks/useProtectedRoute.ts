import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

/**
 * Keeps the visible route in sync with auth state once the session has been
 * restored. Redirects on sign-out / token loss and prevents authenticated users
 * from sitting on the auth stack.
 *
 * The splash (app/index.tsx, empty segments) is left alone — it resolves the
 * initial route itself via lib/getInitialRoute.ts.
 */
export function useProtectedRoute(): void {
  const router = useRouter();
  const segments = useSegments();
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const initializing = useAuthStore((s) => s.initializing);

  useEffect(() => {
    if (initializing) return;

    const group = segments[0]; // undefined on splash, else '(auth)' | '(onboarding)' | '(tabs)'
    if (group === undefined) return;

    const inAuth = group === '(auth)';
    const inOnboarding = group === '(onboarding)';
    const onboardingDone = !!profile?.onboarding_completed;

    if (!session) {
      // Signed out / token lost — back to auth.
      if (!inAuth) router.replace('/(auth)/sign-in');
    } else if (!onboardingDone) {
      // Authenticated but not set up — send to onboarding (also off the auth stack).
      if (!inOnboarding) router.replace('/(onboarding)/platforms');
    } else if (inAuth || inOnboarding) {
      // Fully onboarded — keep out of auth/onboarding.
      router.replace('/(tabs)');
    }
  }, [session, profile, initializing, segments, router]);
}
