import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Constants, { ExecutionEnvironment } from 'expo-constants';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useOnboardingStore } from '@/stores/onboardingStore';

import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingCTA } from '@/components/onboarding/OnboardingCTA';
import { ReminderCard } from '@/components/onboarding/ReminderCard';
import { TimePickerField } from '@/components/onboarding/TimePickerField';

export default function RemindersScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const reminders = useOnboardingStore((s) => s.reminders);
  const setReminder = useOnboardingStore((s) => s.setReminder);

  const [submitting, setSubmitting] = useState(false);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleFinish = useCallback(async () => {
    setSubmitting(true);
    try {
      // expo-notifications' native module is unavailable in Expo Go (Android);
      // skip the call there so the UI flow still works during development.
      if (Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) {
        const Notifications =
          require('expo-notifications') as typeof import('expo-notifications');
        await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: true, allowSound: true },
        });
      }
    } catch {
      // Non-blocking — user can grant permissions later in Settings.
    } finally {
      setSubmitting(false);
      router.replace('/');
    }
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

      <OnboardingHeader step={3} theme={theme} onBack={handleBack} />

      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.text }]}>
          Never miss a posting day
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          We&apos;ll remind you so your streak stays alive
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ReminderCard
          iconName="notifications"
          iconColor={AppColors.primary}
          label="Daily reminder"
          value={reminders.dailyReminder}
          theme={theme}
          onValueChange={(v) => setReminder('dailyReminder', v)}
        >
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Remind me to post at:
          </Text>
          <TimePickerField
            value={reminders.dailyReminderTime}
            theme={theme}
            onChange={(v) => setReminder('dailyReminderTime', v)}
          />
        </ReminderCard>

        <ReminderCard
          iconName="warning"
          iconColor={AppColors.streakActive}
          label="Streak at risk alerts"
          sublabel="Alert me when a streak will expire in < 3 hours"
          value={reminders.streakAtRisk}
          theme={theme}
          onValueChange={(v) => setReminder('streakAtRisk', v)}
        />

        <ReminderCard
          iconName="bar-chart"
          iconColor={AppColors.info}
          label="Weekly summary"
          sublabel="A recap of your week, sent every Sunday"
          value={reminders.weeklySummary}
          theme={theme}
          onValueChange={(v) => setReminder('weeklySummary', v)}
        />
      </ScrollView>

      <View style={styles.footer}>
        <OnboardingCTA
          label="Let's go!"
          leadingIcon="flame"
          trailingArrow={false}
          onPress={handleFinish}
          loading={submitting}
        />
        <Text style={[styles.footerHelp, { color: theme.textMuted }]}>
          You can change these anytime in Settings
        </Text>
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
  fieldLabel: {
    fontSize: typography.xs,
    marginBottom: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
    gap: 8,
  },
  footerHelp: {
    fontSize: typography.xs,
    textAlign: 'center',
  },
});
