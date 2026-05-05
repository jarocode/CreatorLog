import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import type { DashboardData } from '@/lib/mock-data';

interface QuickStatsProps {
  postsThisWeek: DashboardData['postsThisWeek'];
  postsThisMonth: DashboardData['postsThisMonth'];
  isNewUser: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ postsThisWeek, postsThisMonth, isNewUser }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.statCard, { backgroundColor: theme.bgElevated }]}>
          <Text style={[styles.statNumber, { color: theme.text }]}>{postsThisWeek}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>
            <Text style={[styles.statLabelBold, { color: theme.textSecondary }]}>POSTS{'\n'}</Text>
            this week
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.bgElevated }]}>
          <Text style={[styles.statNumber, { color: theme.text }]}>{postsThisMonth}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>
            <Text style={[styles.statLabelBold, { color: theme.textSecondary }]}>POSTS{'\n'}</Text>
            this month
          </Text>
        </View>
      </View>

      {isNewUser && (
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Log your first post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 4,
  },
  statNumber: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    lineHeight: typography['2xl'] * 1.1,
  },
  statLabel: {
    fontSize: typography.xs,
    lineHeight: 16,
  },
  statLabelBold: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  ctaButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: typography.base,
    fontWeight: '600',
  },
});
