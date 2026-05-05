import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import type { DashboardData } from '@/lib/mock-data';

interface StreakCounterProps {
  streak: DashboardData['streak'];
}

function formatCountdown(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  const { state, currentStreak, isMilestoneDay, atRiskMinutesRemaining, frozenMessage, previousBest, milestoneMessage } = streak;

  const isNew = state === 'new';
  const isLapsed = state === 'lapsed';
  const isFrozen = state === 'frozen';
  const isAtRisk = state === 'atRisk';
  const isMilestone = isMilestoneDay && state === 'active' && !!milestoneMessage;

  const flameColor = isFrozen
    ? AppColors.info
    : isNew || isLapsed
    ? theme.textMuted
    : AppColors.streakActive;

  const numberColor = isFrozen
    ? AppColors.info
    : isNew || isLapsed
    ? theme.textSecondary
    : theme.text;

  if (isMilestone) {
    return (
      <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
        <View style={styles.milestoneContent}>
          <Ionicons name="flame" size={48} color={AppColors.streakActive} />
          <Text style={[styles.milestoneNumber, { color: theme.text }]}>{currentStreak}</Text>
          <Text style={[styles.milestoneLabel, { color: theme.text }]}>DAY STREAK</Text>
          {milestoneMessage ? (
            <Text style={[styles.milestoneMessage, { color: theme.textSecondary }]}>{milestoneMessage}</Text>
          ) : null}
          <TouchableOpacity style={styles.milestoneButton}>
            <Text style={styles.milestoneButtonText}>Keep going  →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
      <View style={styles.content}>
        <Ionicons
          name={isFrozen ? 'snow' : 'flame'}
          size={52}
          color={flameColor}
        />

        <Text style={[styles.number, { color: numberColor }]}>{currentStreak}</Text>

        <Text style={[styles.label, { color: isLapsed ? theme.textSecondary : theme.textSecondary }]}>
          {isLapsed ? 'streak ended' : 'day streak'}
        </Text>

        {isMilestoneDay && !isMilestone && (
          <View style={styles.milestoneBadge}>
            <Text style={styles.milestoneBadgeText}>+ MILESTONE DAY</Text>
          </View>
        )}

        {isAtRisk && atRiskMinutesRemaining !== undefined && (
          <View style={styles.atRiskBanner}>
            <Ionicons name="warning" size={13} color={AppColors.warning} />
            <Text style={styles.atRiskText}>
              {' '}{formatCountdown(atRiskMinutesRemaining)} to keep streak
            </Text>
          </View>
        )}

        {isFrozen && frozenMessage && (
          <Text style={styles.frozenText}>{frozenMessage}</Text>
        )}

        {isNew && (
          <Text style={[styles.newUserHint, { color: theme.textMuted }]}>
            Log your first post to start your streak
          </Text>
        )}

        {isLapsed && (
          <>
            {previousBest !== undefined && (
              <Text style={[styles.previousBest, { color: theme.textMuted }]}>
                Previous best: {previousBest} days
              </Text>
            )}
            <TouchableOpacity style={styles.newStreakButton}>
              <Text style={styles.newStreakButtonText}>Start a new streak  →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 6,
  },
  number: {
    fontSize: typography['4xl'],
    fontWeight: '700',
    lineHeight: typography['4xl'] * typography.tight,
    marginTop: 4,
  },
  label: {
    fontSize: typography.sm,
    letterSpacing: 0.5,
  },
  milestoneBadge: {
    marginTop: 8,
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  milestoneBadgeText: {
    color: '#FFFFFF',
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  atRiskBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  atRiskText: {
    color: AppColors.warning,
    fontSize: typography.xs,
    fontWeight: '600',
  },
  frozenText: {
    color: AppColors.info,
    fontSize: typography.xs,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  newUserHint: {
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: 6,
  },
  previousBest: {
    fontSize: typography.xs,
    marginTop: 4,
  },
  newStreakButton: {
    marginTop: 12,
    backgroundColor: AppColors.primary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  newStreakButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sm,
    fontWeight: '600',
  },
  milestoneContent: {
    alignItems: 'center',
    gap: 6,
  },
  milestoneNumber: {
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 64 * 1.1,
    marginTop: 4,
  },
  milestoneLabel: {
    fontSize: typography.xl,
    fontWeight: '700',
    letterSpacing: 2,
  },
  milestoneMessage: {
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  milestoneButton: {
    marginTop: 16,
    backgroundColor: AppColors.primary,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  milestoneButtonText: {
    color: '#FFFFFF',
    fontSize: typography.base,
    fontWeight: '600',
  },
});
