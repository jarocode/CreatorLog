import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0–1
  color: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color, height = 6 }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const trackColor = isDark ? AppColors.dark.bgSubtle : AppColors.light.bgSubtle;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${clampedProgress * 100}%`,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {},
});
