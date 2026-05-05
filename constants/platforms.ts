import { AppColors } from './colors';

export type Platform = 'linkedin' | 'tiktok' | 'youtube';

export const PLATFORM_COLORS: Record<Platform, string> = {
  linkedin: AppColors.linkedin,
  tiktok: AppColors.tiktok,
  youtube: AppColors.youtube,
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};
