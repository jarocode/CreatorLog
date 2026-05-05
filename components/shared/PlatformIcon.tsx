import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform, PLATFORM_COLORS } from '@/constants/platforms';

interface PlatformIconProps {
  platform: Platform;
  size?: number;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 24 }) => {
  const color = PLATFORM_COLORS[platform];

  const iconName = platform === 'linkedin'
    ? 'logo-linkedin'
    : platform === 'youtube'
    ? 'logo-youtube'
    : 'musical-notes';

  return (
    <View style={[styles.container, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 4 }]}>
      <Ionicons name={iconName as never} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
