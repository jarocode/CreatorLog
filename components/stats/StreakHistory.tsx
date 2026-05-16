import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PLATFORM_COLORS, PLATFORM_LABELS, type Platform } from '@/constants/platforms';
import type { PlatformStreak } from '@/lib/mock-data';

interface StreakHistoryProps {
  streaks: PlatformStreak[];
}

const PLATFORM_ICONS: Record<Platform, string> = {
  linkedin: 'logo-linkedin',
  tiktok: 'musical-notes',
  youtube: 'logo-youtube',
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const StreakHistory: React.FC<StreakHistoryProps> = ({ streaks }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  return (
    <View style={styles.container}>
      {streaks.map((s) => (
        <View
          key={s.platform}
          style={[styles.row, { backgroundColor: theme.bgElevated }]}
        >
          <View
            style={[
              styles.iconTile,
              { backgroundColor: hexToRgba(PLATFORM_COLORS[s.platform], isDark ? 0.22 : 0.14) },
            ]}
          >
            <Ionicons
              name={PLATFORM_ICONS[s.platform] as never}
              size={18}
              color={PLATFORM_COLORS[s.platform]}
            />
          </View>

          <View style={styles.middleCol}>
            <Text style={[styles.platformName, { color: theme.text }]}>
              {PLATFORM_LABELS[s.platform]}
            </Text>
            <Text style={[styles.bestText, { color: theme.textMuted }]}>
              best {s.best}
            </Text>
          </View>

          <View style={styles.rightCol}>
            <Ionicons name="flame" size={16} color={AppColors.streakActive} />
            <Text style={[styles.streakNumber, { color: theme.text }]}>{s.current}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 12,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  platformName: {
    fontSize: typography.base,
    fontWeight: '600',
  },
  bestText: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  streakNumber: {
    fontSize: typography.lg,
    fontWeight: '700',
  },
});
