export const Colors = {
  light: {
    text: '#11181C',
    background: '#FAFAFA',
    tint: '#7C3AED',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#7C3AED',
    tabBar: '#FFFFFF',
    border: '#E5E5E5',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0D0D0D',
    tint: '#7C3AED',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
    tabBar: '#0D0D0D',
    border: '#2A2A2A',
  },
};

export const AppColors = {
  dark: {
    bg: '#0D0D0D',
    bgElevated: '#1A1A1A',
    bgSubtle: '#262626',
    border: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textMuted: '#555555',
  },
  light: {
    bg: '#FAFAFA',
    bgElevated: '#FFFFFF',
    bgSubtle: '#F0F0F0',
    border: '#E5E5E5',
    text: '#11181C',
    textSecondary: '#687076',
    textMuted: '#9BA1A6',
  },
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: '#A78BFA',
  streakActive: '#F59E0B',
  success: '#10B981',
  warning: '#EF4444',
  info: '#3B82F6',
  linkedin: '#0A66C2',
  tiktok: '#FE2C55',
  youtube: '#FF0000',
} as const;

export type ThemeColors = typeof AppColors.dark | typeof AppColors.light;
