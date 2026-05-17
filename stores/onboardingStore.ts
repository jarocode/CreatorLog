import { create } from 'zustand';
import type { Platform } from '@/constants/platforms';

type ReminderTime = string;

interface ReminderPrefs {
  dailyReminder: boolean;
  dailyReminderTime: ReminderTime;
  streakAtRisk: boolean;
  weeklySummary: boolean;
}

interface OnboardingState {
  selectedPlatforms: Platform[];
  weeklyGoals: Record<Platform, number>;
  reminders: ReminderPrefs;

  togglePlatform: (platform: Platform) => void;
  setWeeklyGoal: (platform: Platform, value: number) => void;
  setReminder: <K extends keyof ReminderPrefs>(
    key: K,
    value: ReminderPrefs[K],
  ) => void;
  reset: () => void;
}

const DEFAULT_REMINDERS: ReminderPrefs = {
  dailyReminder: true,
  dailyReminderTime: '09:00',
  streakAtRisk: true,
  weeklySummary: true,
};

const DEFAULT_GOALS: Record<Platform, number> = {
  linkedin: 3,
  tiktok: 5,
  youtube: 2,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  selectedPlatforms: ['linkedin', 'tiktok'],
  weeklyGoals: { ...DEFAULT_GOALS },
  reminders: { ...DEFAULT_REMINDERS },

  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),

  setWeeklyGoal: (platform, value) =>
    set((state) => ({
      weeklyGoals: { ...state.weeklyGoals, [platform]: value },
    })),

  setReminder: (key, value) =>
    set((state) => ({
      reminders: { ...state.reminders, [key]: value },
    })),

  reset: () =>
    set({
      selectedPlatforms: ['linkedin', 'tiktok'],
      weeklyGoals: { ...DEFAULT_GOALS },
      reminders: { ...DEFAULT_REMINDERS },
    }),
}));
