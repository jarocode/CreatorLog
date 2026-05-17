import React, { useCallback } from 'react';
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
import type { Platform } from '@/constants/platforms';

import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingCTA } from '@/components/onboarding/OnboardingCTA';
import {
  PlatformSelectCard,
  type PlatformPickerId,
} from '@/components/onboarding/PlatformSelectCard';

interface PickerOption {
  id: PlatformPickerId;
  label: string;
  sublabel: string;
  iconName: keyof typeof Ionicons.glyphMap;
  tileColor: string;
  iconColor?: string;
  selectedBorderColor: string;
  comingSoon?: boolean;
}

const OPTIONS: PickerOption[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    sublabel: 'Professional content',
    iconName: 'logo-linkedin',
    tileColor: AppColors.linkedin,
    selectedBorderColor: AppColors.primary,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    sublabel: 'Short-form video',
    iconName: 'musical-notes',
    tileColor: AppColors.tiktok,
    selectedBorderColor: AppColors.tiktok,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    sublabel: 'Long & short video',
    iconName: 'logo-youtube',
    tileColor: AppColors.youtube,
    selectedBorderColor: AppColors.youtube,
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    sublabel: 'Tweets & threads',
    iconName: 'logo-twitter',
    tileColor: '#000000',
    selectedBorderColor: '#000000',
    comingSoon: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    sublabel: 'Photos, Reels, Stories',
    iconName: 'logo-instagram',
    tileColor: '#262626',
    selectedBorderColor: '#262626',
    comingSoon: true,
  },
];

const CORE_PLATFORMS: ReadonlyArray<Platform> = ['linkedin', 'tiktok', 'youtube'];

function isCorePlatform(id: PlatformPickerId): id is Platform {
  return (CORE_PLATFORMS as readonly string[]).includes(id);
}

export default function PlatformsScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const selectedPlatforms = useOnboardingStore((s) => s.selectedPlatforms);
  const togglePlatform = useOnboardingStore((s) => s.togglePlatform);

  const handleToggle = useCallback(
    (id: PlatformPickerId) => {
      if (!isCorePlatform(id)) return;
      togglePlatform(id);
    },
    [togglePlatform],
  );

  const handleContinue = useCallback(() => {
    router.push('/(onboarding)/goals');
  }, [router]);

  const canContinue = selectedPlatforms.length > 0;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <OnboardingHeader step={1} theme={theme} />

      <View style={styles.titleBlock}>
        <View style={styles.flameWrap}>
          <Ionicons name="flame" size={22} color={AppColors.streakActive} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>
          Where do you create?
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select all platforms you post on
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {OPTIONS.map((opt) => {
          const isSelected =
            isCorePlatform(opt.id) && selectedPlatforms.includes(opt.id);
          return (
            <PlatformSelectCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              sublabel={opt.sublabel}
              iconName={opt.iconName}
              tileColor={opt.tileColor}
              iconColor={opt.iconColor}
              selected={isSelected}
              disabled={opt.comingSoon}
              comingSoon={opt.comingSoon}
              selectedBorderColor={opt.selectedBorderColor}
              theme={theme}
              onPress={() => handleToggle(opt.id)}
            />
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={[styles.footerHelp, { color: theme.textMuted }]}>
          Select at least one to continue
        </Text>
        <OnboardingCTA
          label="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
        />
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
  flameWrap: {
    marginBottom: 6,
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
    gap: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
    gap: 10,
  },
  footerHelp: {
    fontSize: typography.xs,
    textAlign: 'center',
  },
});
