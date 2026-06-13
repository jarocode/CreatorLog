import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';

interface SparkConfig {
  x: number; // horizontal offset from center
  size: number;
  delay: number;
  duration: number;
  rise: number; // how far up it floats
}

// A handful of embers drifting up around the flame, staggered.
const SPARKS: SparkConfig[] = [
  { x: -26, size: 4, delay: 0, duration: 2200, rise: 86 },
  { x: 22, size: 3, delay: 500, duration: 1900, rise: 96 },
  { x: -10, size: 5, delay: 900, duration: 2400, rise: 104 },
  { x: 34, size: 3, delay: 1300, duration: 2000, rise: 78 },
  { x: 6, size: 4, delay: 1700, duration: 2300, rise: 110 },
  { x: -34, size: 3, delay: 2100, duration: 2100, rise: 90 },
];

const Spark: React.FC<{ config: SparkConfig }> = ({ config }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, { duration: config.duration, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
  }, [progress, config.delay, config.duration]);

  const style = useAnimatedStyle(() => {
    // Fade in for the first 25%, hold, then fade out over the last 35%.
    const opacity =
      progress.value < 0.25
        ? progress.value / 0.25
        : progress.value > 0.65
          ? Math.max(0, 1 - (progress.value - 0.65) / 0.35)
          : 1;
    return {
      opacity,
      transform: [
        { translateY: -config.rise * progress.value },
        { translateX: config.x + Math.sin(progress.value * Math.PI * 2) * 4 },
        { scale: 0.6 + (1 - progress.value) * 0.6 },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.spark,
        { width: config.size, height: config.size, borderRadius: config.size / 2 },
        style,
      ]}
    />
  );
};

export const RisingSparks: React.FC = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      {SPARKS.map((config, i) => (
        <Spark key={i} config={config} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spark: {
    position: 'absolute',
    backgroundColor: AppColors.streakActive,
  },
});
