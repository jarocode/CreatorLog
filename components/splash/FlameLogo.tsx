import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';

interface FlameLogoProps {
  size?: number;
  isDark: boolean;
}

// Shared with the native splash (app.json → expo-splash-screen) so the flame is
// pixel-identical across the native and animated layers.
const FLAME = require('@/assets/images/splash-flame.png');

// The artwork is centered within its square with transparent padding; this is
// the fraction of the image the flame actually occupies. Used to size the image
// box so the *visible* flame matches the requested `size`.
const FLAME_FILL = 0.62;

/**
 * Gradient flame sitting on a soft radial "ember bloom" glow.
 * - Ignition: flame scales/fades up on mount (spring).
 * - Ember bloom: glow gently breathes on a loop behind the flame.
 */
export const FlameLogo: React.FC<FlameLogoProps> = ({ size = 96, isDark }) => {
  const ignite = useSharedValue(0);
  const bloom = useSharedValue(0);

  useEffect(() => {
    ignite.value = withDelay(
      80,
      withSpring(1, { damping: 11, stiffness: 120, mass: 0.7 }),
    );
    bloom.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [ignite, bloom]);

  const flameStyle = useAnimatedStyle(() => ({
    opacity: ignite.value,
    transform: [
      { scale: 0.6 + ignite.value * 0.4 },
      { translateY: (1 - ignite.value) * 8 },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: (isDark ? 0.28 : 0.14) + bloom.value * (isDark ? 0.12 : 0.06),
    transform: [{ scale: 1 + bloom.value * 0.1 }],
  }));

  const glowBase = size * 2.4;

  return (
    <View style={[styles.container, { width: glowBase, height: glowBase }]}>
      {/* Ember bloom — stacked amber circles, opacity decaying outward */}
      <Animated.View style={[styles.glowWrap, glowStyle]} pointerEvents="none">
        <View
          style={[
            styles.glowCircle,
            { width: glowBase, height: glowBase, borderRadius: glowBase / 2, opacity: 0.18 },
          ]}
        />
        <View
          style={[
            styles.glowCircle,
            { width: glowBase * 0.62, height: glowBase * 0.62, borderRadius: glowBase, opacity: 0.35 },
          ]}
        />
        <View
          style={[
            styles.glowCircle,
            { width: glowBase * 0.34, height: glowBase * 0.34, borderRadius: glowBase, opacity: 0.6 },
          ]}
        />
      </Animated.View>

      {/* Flame — same asset as the native splash */}
      <Animated.View style={flameStyle}>
        <Image
          source={FLAME}
          style={{ width: size / FLAME_FILL, height: size / FLAME_FILL }}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    backgroundColor: AppColors.streakActive,
  },
});
