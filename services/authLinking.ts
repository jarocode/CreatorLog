import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase } from './supabase';
import { useAuthStore } from '@/stores/authStore';

interface ParsedAuthLink {
  target: string; // hostname/path, e.g. 'reset-password' | 'auth-callback'
  code?: string; // PKCE flow
  accessToken?: string; // implicit flow
  refreshToken?: string;
  type?: string; // 'recovery' | 'magiclink' | 'signup' | ...
}

/**
 * Parses a deep link into the bits we need to establish a session. Supabase
 * returns either a `?code=` (PKCE) or `#access_token=&refresh_token=&type=`
 * (implicit) — expo-linking doesn't parse the URL fragment, so we read it
 * manually with URLSearchParams (polyfilled via react-native-url-polyfill).
 */
function parseAuthLink(url: string): ParsedAuthLink {
  const [base, fragment] = url.split('#');
  const { hostname, path, queryParams } = Linking.parse(base);
  const frag = fragment ? new URLSearchParams(fragment) : null;

  const asString = (v: string | string[] | undefined): string | undefined =>
    Array.isArray(v) ? v[0] : v ?? undefined;

  return {
    target: (hostname ?? path ?? '').replace(/^\//, ''),
    code: asString(queryParams?.code),
    accessToken: frag?.get('access_token') ?? undefined,
    refreshToken: frag?.get('refresh_token') ?? undefined,
    type: frag?.get('type') ?? asString(queryParams?.type),
  };
}

/**
 * Handles auth deep links (magic link + password recovery) for the native app,
 * where `detectSessionInUrl` is off. Establishes the session from the link,
 * then routes: recovery → reset-password; otherwise → into the app (the guard
 * sends the user to tabs/onboarding).
 */
export function useAuthDeepLinks(): void {
  const router = useRouter();

  useEffect(() => {
    let handled = false;

    const handleUrl = async (url: string | null) => {
      if (!url) return;
      const { target, code, accessToken, refreshToken, type } = parseAuthLink(url);

      // Only act on links that actually carry auth material.
      if (!code && !accessToken) return;

      const isRecovery = target.includes('reset-password') || type === 'recovery';
      // Set the flag before the session lands so the guard never bounces the
      // user off the reset-password screen.
      if (isRecovery) useAuthStore.getState().setPasswordRecovery(true);

      let ok = false;
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        ok = !error;
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        ok = !error;
      }

      if (!ok) {
        if (isRecovery) useAuthStore.getState().setPasswordRecovery(false);
        return;
      }

      if (isRecovery) {
        router.replace('/(auth)/reset-password');
      } else {
        // Magic link / confirmation: session is set — let the guard route by
        // onboarding state.
        router.replace('/(tabs)');
      }
    };

    // Cold start (app opened via the link).
    Linking.getInitialURL().then((url) => {
      if (!handled) {
        handled = true;
        handleUrl(url);
      }
    });

    // Warm start (link tapped while app is open).
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, [router]);
}
