import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface MonthlyStatsProps {
  monthLabel: string; // e.g. "APRIL SO FAR"
  totalPosts: number;
  comparisonText: string; // e.g. "+18% vs March"
  comparisonPositive: boolean;
}

export const MonthlyStats: React.FC<MonthlyStatsProps> = ({
  monthLabel,
  totalPosts,
  comparisonText,
  comparisonPositive,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  const badgeColor = comparisonPositive ? AppColors.success : AppColors.warning;
  const badgeBg = comparisonPositive
    ? 'rgba(16,185,129,0.15)'
    : 'rgba(239,68,68,0.15)';

  return (
    <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: theme.textMuted }]}>{monthLabel}</Text>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Ionicons
            name={comparisonPositive ? 'trending-up' : 'trending-down'}
            size={11}
            color={badgeColor}
          />
          <Text style={[styles.badgeText, { color: badgeColor }]}>{comparisonText}</Text>
        </View>
      </View>
      <View style={styles.numberRow}>
        <Text style={[styles.number, { color: theme.text }]}>{totalPosts}</Text>
        <Text style={[styles.numberLabel, { color: theme.textSecondary }]}>posts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  number: {
    fontSize: typography['2xl'],
    fontWeight: '700',
  },
  numberLabel: {
    fontSize: typography.sm,
  },
});
