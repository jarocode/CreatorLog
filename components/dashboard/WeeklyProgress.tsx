import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '@/constants/platforms';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { DashboardData } from '@/lib/mock-data';

interface WeeklyProgressProps {
  weeklyProgress: DashboardData['weeklyProgress'];
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ weeklyProgress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>THIS WEEK</Text>
        <Text style={[styles.goalsLabel, { color: theme.textMuted }]}>Goals</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
        {weeklyProgress.map(({ platform, postsThisWeek, weeklyGoal }, index) => {
          const progress = weeklyGoal > 0 ? postsThisWeek / weeklyGoal : 0;
          const isComplete = postsThisWeek >= weeklyGoal;
          const barColor = isComplete ? AppColors.success : PLATFORM_COLORS[platform];

          return (
            <View
              key={platform}
              style={[
                styles.row,
                index < weeklyProgress.length - 1 && styles.rowBorder,
                index < weeklyProgress.length - 1 && { borderBottomColor: theme.border },
              ]}
            >
              <View style={styles.platformInfo}>
                <View style={[styles.dot, { backgroundColor: PLATFORM_COLORS[platform] }]} />
                <Text style={[styles.platformName, { color: theme.text }]}>
                  {PLATFORM_LABELS[platform]}
                </Text>
              </View>

              <View style={styles.progressSection}>
                <ProgressBar progress={progress} color={barColor} height={5} />
              </View>

              <Text style={[styles.count, { color: theme.textSecondary }]}>
                {postsThisWeek}/{weeklyGoal}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  goalsLabel: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
  card: {
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 10,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 84,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  platformName: {
    fontSize: typography.sm,
    fontWeight: '500',
  },
  progressSection: {
    flex: 1,
  },
  count: {
    fontSize: typography.sm,
    width: 36,
    textAlign: 'right',
  },
});
