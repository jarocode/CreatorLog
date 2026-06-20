import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
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
