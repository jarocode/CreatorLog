import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from './supabase';

// Deep-link redirect targets (resolved against the app scheme, e.g.
// creatorlog://reset-password). Must be added to the Supabase dashboard's
// redirect allow-list. Parsed back in services/authLinking.ts.
export const RESET_PASSWORD_REDIRECT = Linking.createURL('reset-password');
export const MAGIC_LINK_REDIRECT = Linking.createURL('auth-callback');

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  /** True when the user dismissed the provider sheet — handle as a silent no-op. */
  cancelled?: boolean;
}

/**
 * Maps raw Supabase auth errors to friendly, inline-displayable copy.
 * Never surface raw error strings to the user (coding-standards).
 */
function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) {
    return 'Email or password is incorrect.';
  }
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'An account with this email already exists.';
  }
  if (m.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }
  if (m.includes('network') || m.includes('failed to fetch')) {
    return 'Network error. Check your connection and try again.';
  }
  if (m.includes('rate limit') || m.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (m.includes('new password should be different')) {
    return 'Your new password must be different from the old one.';
  }
  if (m.includes('weak') || m.includes('password should be at least')) {
    return 'Please choose a stronger password.';
  }
  if (m.includes('expired') || m.includes('invalid') || m.includes('not found')) {
    return 'This link is invalid or has expired. Request a new one.';
  }
  return 'Something went wrong. Please try again.';
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<Result<Session>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: friendlyAuthError(error.message) };
    return { success: true, data: data.session ?? undefined };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

interface SignUpResult {
  session: Session | null;
  /** True when email confirmation is required (no session returned). */
  needsConfirmation: boolean;
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<Result<SignUpResult>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { success: false, error: friendlyAuthError(error.message) };
    return {
      success: true,
      data: { session: data.session, needsConfirmation: data.session === null },
    };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function signOut(): Promise<Result<null>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: friendlyAuthError(error.message) };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

/**
 * Sends a passwordless magic-link sign-in email. The link redirects back to
 * MAGIC_LINK_REDIRECT, handled in services/authLinking.ts.
 */
export async function sendMagicLink(email: string): Promise<Result<null>> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: MAGIC_LINK_REDIRECT },
    });
    if (error) return { success: false, error: friendlyAuthError(error.message) };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

/**
 * Sends a password-reset email. The link redirects to RESET_PASSWORD_REDIRECT,
 * which establishes a recovery session and opens the reset-password screen.
 */
export async function sendPasswordReset(email: string): Promise<Result<null>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: RESET_PASSWORD_REDIRECT,
    });
    if (error) return { success: false, error: friendlyAuthError(error.message) };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

/** Sets a new password for the current (recovery) session. */
export async function updatePassword(password: string): Promise<Result<null>> {
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: friendlyAuthError(error.message) };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// ─── SSO (Apple & Google) ──────────────────────────────────────────────────

/**
 * Configures the Google sign-in SDK. Call once at startup. No-op if the web
 * client ID isn't set, so the app still boots without Google credentials.
 */
export function configureGoogleSignin(): void {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  if (!webClientId) return;
  GoogleSignin.configure({ webClientId, iosClientId });
}

/**
 * Native "Sign in with Apple" (iOS only). Exchanges the Apple identity token
 * for a Supabase session via signInWithIdToken. Apple returns the user's name
 * only on the FIRST authorization, so we seed it into `full_name` metadata then
 * (the handle_new_user trigger reads it for the profile row).
 */
export async function signInWithApple(): Promise<Result<Session>> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) {
      return { success: false, error: 'Apple sign-in failed. Please try again.' };
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });
    if (error) return { success: false, error: friendlyAuthError(error.message) };

    // First-time only: Apple includes the name here and never again. Persist it
    // if we don't already have one on the account.
    const fullName = [
      credential.fullName?.givenName,
      credential.fullName?.familyName,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
    if (fullName && data.user && !data.user.user_metadata?.full_name) {
      await supabase.auth.updateUser({ data: { full_name: fullName } });
    }

    return { success: true, data: data.session ?? undefined };
  } catch (err) {
    // Apple throws a CodedError with code 'ERR_REQUEST_CANCELED' on dismissal.
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: unknown }).code === 'ERR_REQUEST_CANCELED'
    ) {
      return { success: false, cancelled: true };
    }
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

/**
 * Native Google sign-in. Exchanges the Google ID token for a Supabase session
 * via signInWithIdToken.
 */
export async function signInWithGoogle(): Promise<Result<Session>> {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      // User dismissed the Google chooser.
      return { success: false, cancelled: true };
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      return { success: false, error: 'Google sign-in failed. Please try again.' };
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    if (error) return { success: false, error: friendlyAuthError(error.message) };
    return { success: true, data: data.session ?? undefined };
  } catch (err) {
    if (isErrorWithCode(err) && err.code === statusCodes.SIGN_IN_CANCELLED) {
      return { success: false, cancelled: true };
    }
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
