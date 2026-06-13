import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface LoadingShimmerProps {
  isDark: boolean;
}

const TRACK_WIDTH = 132;
const TRACK_HEIGHT = 3;
const BAND_WIDTH = 64;

/**
 * Thin loading track with a highlight band sweeping left→right on a loop.
 */
export const LoadingShimmer: React.FC<LoadingShimmerProps> = ({ isDark }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [progress]);

  const bandStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -BAND_WIDTH + progress.value * (TRACK_WIDTH + BAND_WIDTH) },
    ],
  }));

  const trackColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)';
  const highlight = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.30)';

  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      <Animated.View style={[styles.band, bandStyle]}>
        <LinearGradient
          colors={['transparent', highlight, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: BAND_WIDTH,
  },
});
