import { createMMKV } from 'react-native-mmkv';

/**
 * MMKV instance for fast, non-sensitive persisted app data (NOT auth tokens —
 * those live in expo-secure-store, see services/secureStorage.ts).
 *
 * Used here to cache the last-known `onboarding_completed` flag per user so the
 * launch router (lib/getInitialRoute.ts) can decide instantly on a warm start
 * without waiting on a network round-trip.
 */
export const appStorage = createMMKV({ id: 'creatorlog-app' });

const ONBOARDING_KEY = (userId: string) => `onboarding_completed:${userId}`;

export function cacheOnboardingCompleted(userId: string, completed: boolean): void {
  appStorage.set(ONBOARDING_KEY(userId), completed);
}

export function getCachedOnboardingCompleted(userId: string): boolean | undefined {
  return appStorage.getBoolean(ONBOARDING_KEY(userId));
}
