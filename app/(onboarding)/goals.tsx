import React, { useCallback, useMemo } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useOnboardingStore } from '@/stores/onboardingStore';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  type Platform,
} from '@/constants/platforms';

import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingCTA } from '@/components/onboarding/OnboardingCTA';
import { GoalStepperCard } from '@/components/onboarding/GoalStepperCard';

const PLATFORM_ICONS: Record<Platform, keyof typeof Ionicons.glyphMap> = {
  linkedin: 'logo-linkedin',
  tiktok: 'musical-notes',
  youtube: 'logo-youtube',
};

const PLATFORM_ORDER: ReadonlyArray<Platform> = ['linkedin', 'tiktok', 'youtube'];

export default function GoalsScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const selectedPlatforms = useOnboardingStore((s) => s.selectedPlatforms);
  const weeklyGoals = useOnboardingStore((s) => s.weeklyGoals);
  const setWeeklyGoal = useOnboardingStore((s) => s.setWeeklyGoal);

  const orderedSelection = useMemo(
    () => PLATFORM_ORDER.filter((p) => selectedPlatforms.includes(p)),
    [selectedPlatforms],
  );

  const handleBack = useCallback(() => router.back(), [router]);
  const handleContinue = useCallback(() => {
    router.push('/(onboarding)/reminders');
  }, [router]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <OnboardingHeader step={2} theme={theme} onBack={handleBack} />

      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.text }]}>
          Set your weekly goals
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          How many times will you post per platform each week?
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {orderedSelection.map((platform) => (
          <GoalStepperCard
            key={platform}
            label={PLATFORM_LABELS[platform]}
            value={weeklyGoals[platform]}
            iconName={PLATFORM_ICONS[platform]}
            tileColor={PLATFORM_COLORS[platform]}
            accentColor={PLATFORM_COLORS[platform]}
            theme={theme}
            onChange={(next) => setWeeklyGoal(platform, next)}
          />
        ))}

        <View
          style={[
            styles.tip,
            {
              backgroundColor: theme.bgElevated,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="bulb-outline"
            size={16}
            color={AppColors.streakActive}
          />
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            <Text style={[styles.tipBold, { color: theme.text }]}>
              Start lower than you think.
            </Text>{' '}
            Consistency beats volume.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <OnboardingCTA label="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  titleBlock: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sm,
    marginTop: 4,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: typography.xs,
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
  },
});
