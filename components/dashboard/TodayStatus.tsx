import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '@/constants/platforms';
import type { DashboardData } from '@/lib/mock-data';

interface TodayStatusProps {
  todayStatus: DashboardData['todayStatus'];
  allGoalsCompleteToday: boolean;
  onPlatformPress?: () => void;
}

const PLATFORM_ICON: Record<string, string> = {
  linkedin: 'logo-linkedin',
  tiktok: 'musical-notes',
  youtube: 'logo-youtube',
};

export const TodayStatus: React.FC<TodayStatusProps> = ({ todayStatus, allGoalsCompleteToday, onPlatformPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>TODAY</Text>
        {allGoalsCompleteToday && (
          <View style={styles.completeBadge}>
            <Ionicons name="checkmark" size={11} color={AppColors.success} />
            <Text style={styles.completeBadgeText}>Today's set complete</Text>
          </View>
        )}
      </View>

      <View style={styles.platformRow}>
        {todayStatus.map(({ platform, loggedToday }) => (
          <TouchableOpacity
            key={platform}
            style={[styles.platformCard, { backgroundColor: theme.bgElevated }]}
            onPress={onPlatformPress}
            activeOpacity={0.75}
          >
            <View style={styles.statusIndicator}>
              {loggedToday ? (
                <View style={styles.checkedCircle}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
              ) : (
                <View style={[styles.emptyCircle, { borderColor: theme.border }]} />
              )}
            </View>
            <Ionicons
              name={PLATFORM_ICON[platform] as never}
              size={22}
              color={PLATFORM_COLORS[platform]}
            />
            <Text style={[styles.platformLabel, { color: theme.textSecondary }]}>
              {PLATFORM_LABELS[platform]}
            </Text>
          </TouchableOpacity>
        ))}
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
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  completeBadgeText: {
    color: AppColors.success,
    fontSize: typography.xs,
    fontWeight: '600',
  },
  platformRow: {
    flexDirection: 'row',
    gap: 10,
  },
  platformCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  checkedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppColors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  platformLabel: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
});
