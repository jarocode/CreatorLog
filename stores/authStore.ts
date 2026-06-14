import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { signOut as authSignOut } from '@/services/auth';
import { cacheOnboardingCompleted } from '@/services/storage';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** True until the initial session restore + profile fetch completes. */
  initializing: boolean;
  isAuthenticated: boolean;

  initialize: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  if (data) cacheOnboardingCompleted(data.id, data.onboarding_completed);
  return data;
}

// Memoized so initialize() is safe to call from multiple places (splash
// router + layout guard) without re-running the session restore.
let initPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  initializing: true,
  isAuthenticated: false,

  initialize: () => {
    // Memoized so this runs (and subscribes to onAuthStateChange) exactly once.
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        const profile = session ? await fetchProfile(session.user.id) : null;
        set({
          session,
          user: session?.user ?? null,
          profile,
          isAuthenticated: !!session,
          initializing: false,
        });

        // Keep store in sync with sign-in/out/token refresh.
        supabase.auth.onAuthStateChange(async (_event, nextSession) => {
          const nextProfile = nextSession
            ? await fetchProfile(nextSession.user.id)
            : null;
          set({
            session: nextSession,
            user: nextSession?.user ?? null,
            profile: nextProfile,
            isAuthenticated: !!nextSession,
          });
        });
      } catch {
        // Restore failed (e.g. SecureStore read error). Treat as signed-out so
        // the app routes to auth instead of hanging on the splash, and clear
        // the memo so a later initialize() can retry.
        initPromise = null;
        set({
          session: null,
          user: null,
          profile: null,
          isAuthenticated: false,
          initializing: false,
        });
      }
    })();

    return initPromise;
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const profile = await fetchProfile(user.id);
    set({ profile });
  },

  signOut: async () => {
    await authSignOut();
    // onAuthStateChange will clear the session; clear eagerly for snappy UI.
    set({ session: null, user: null, profile: null, isAuthenticated: false });
  },
}));
