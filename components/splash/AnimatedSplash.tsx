import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useSystemColorScheme } from '@/hooks/use-system-color-scheme';
import { FlameLogo } from './FlameLogo';
import { RisingSparks } from './RisingSparks';
import { LoadingShimmer } from './LoadingShimmer';

interface AnimatedSplashProps {
  /** Called once the intro has played and the screen has faded out. */
  onFinish: () => void;
}

// How long the brand animation holds before exiting.
const HOLD_MS = 2000;
const EXIT_MS = 250;

const VERSION = `v${Constants.expoConfig?.version ?? '2.0'}`;

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const scheme = useSystemColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const insets = useSafeAreaInsets();

  const exit = useSharedValue(0);
  const textIn = useSharedValue(0);

  useEffect(() => {
    // Wordmark + tagline fade up shortly after the flame ignites.
    textIn.value = withDelay(
      320,
      withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) }),
    );

    const timer = setTimeout(() => {
      exit.value = withTiming(
        1,
        { duration: EXIT_MS, easing: Easing.in(Easing.quad) },
        (finished) => {
          if (finished) scheduleOnRN(onFinish);
        },
      );
    }, HOLD_MS);

    return () => clearTimeout(timer);
  }, [exit, textIn, onFinish]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: 1 - exit.value,
    transform: [{ scale: 1 + exit.value * 0.04 }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textIn.value,
    transform: [{ translateY: (1 - textIn.value) * 10 }],
  }));

  return (
    <Animated.View style={[styles.root, { backgroundColor: theme.bg }, containerStyle]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.center}>
        <View style={styles.flameWrap}>
          <RisingSparks />
          <FlameLogo isDark={isDark} />
        </View>

        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={[styles.wordmark, { color: theme.text }]}>CreatorLog</Text>
          <Text style={[styles.tagline, { color: isDark ? theme.textSecondary : theme.textMuted }]}>
            Show up. Every day.
          </Text>
        </Animated.View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 28 }]}>
        <LoadingShimmer isDark={isDark} />
        <Text style={[styles.version, { color: theme.textMuted }]}>{VERSION}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  flameWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  wordmark: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tagline: {
    marginTop: 8,
    fontSize: typography.sm,
    letterSpacing: 1.2,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  version: {
    marginTop: 16,
    fontSize: typography.xs,
    letterSpacing: 1,
  },
});
