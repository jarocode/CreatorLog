import { supabase } from './supabase';
import { cacheOnboardingCompleted } from './storage';
import type { Result } from './auth';
import type { Platform } from '@/constants/platforms';
import type { Database } from '@/types/database';

type PlatformConfigInsert = Database['public']['Tables']['platform_configs']['Insert'];
type NotificationPrefsInsert = Database['public']['Tables']['notification_prefs']['Insert'];

interface ReminderPrefs {
  dailyReminder: boolean;
  dailyReminderTime: string;
  streakAtRisk: boolean;
  weeklySummary: boolean;
}

interface CompleteOnboardingInput {
  userId: string;
  selectedPlatforms: Platform[];
  weeklyGoals: Record<Platform, number>;
  reminders: ReminderPrefs;
}

/**
 * Persists the onboarding selections (platform_configs + notification_prefs),
 * then flips profiles.onboarding_completed so the launch router sends the user
 * to the tabs from now on. Writes go through RLS under the user's session.
 */
export async function completeOnboarding({
  userId,
  selectedPlatforms,
  weeklyGoals,
  reminders,
}: CompleteOnboardingInput): Promise<Result<null>> {
  try {
    const configs: PlatformConfigInsert[] = selectedPlatforms.map((platform) => ({
      user_id: userId,
      platform,
      weekly_goal: weeklyGoals[platform],
      reminder_enabled: reminders.dailyReminder,
      reminder_time: reminders.dailyReminderTime,
    }));

    const { error: configError } = await supabase
      .from('platform_configs')
      .upsert(configs, { onConflict: 'user_id,platform' });
    if (configError) throw configError;

    const prefs: NotificationPrefsInsert = {
      user_id: userId,
      daily_reminder: reminders.dailyReminder,
      daily_reminder_time: reminders.dailyReminderTime,
      streak_at_risk: reminders.streakAtRisk,
      weekly_summary: reminders.weeklySummary,
    };
    const { error: prefsError } = await supabase
      .from('notification_prefs')
      .upsert(prefs, { onConflict: 'user_id' });
    if (prefsError) throw prefsError;

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId);
    if (profileError) throw profileError;

    cacheOnboardingCompleted(userId, true);
    return { success: true, data: null };
  } catch {
    return {
      success: false,
      error: 'Could not save your setup. Please try again.',
    };
  }
}
