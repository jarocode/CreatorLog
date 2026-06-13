import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

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
