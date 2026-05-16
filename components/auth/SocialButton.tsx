import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export type SocialVariant = 'outlined' | 'solid-dark' | 'white';

interface SocialButtonProps {
  label: string;
  variant?: SocialVariant;
  icon?: React.ReactNode;
  onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  label,
  variant = 'outlined',
  icon,
  onPress,
}) => {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  let containerStyle;
  let labelColor: string;
  if (variant === 'solid-dark') {
    containerStyle = styles.solid;
    labelColor = '#FFFFFF';
  } else if (variant === 'white') {
    containerStyle = styles.white;
    labelColor = '#11181C';
  } else {
    containerStyle = [
      styles.outlined,
      { backgroundColor: theme.bgElevated, borderColor: theme.border },
    ];
    labelColor = theme.text;
  }

  return (
    <TouchableOpacity
      style={[styles.button, containerStyle]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

interface AppleMarkProps {
  color: string;
}

export const AppleMark: React.FC<AppleMarkProps> = ({ color }) => (
  <Ionicons name="logo-apple" size={18} color={color} />
);

const GOOGLE_BLUE = '#4285F4';
const GOOGLE_RED = '#EA4335';
const GOOGLE_YELLOW = '#FBBC05';
const GOOGLE_GREEN = '#34A853';

export const GoogleMark: React.FC = () => (
  <View style={googleMark.wrap}>
    <View
      style={[
        googleMark.ring,
        {
          borderTopColor: GOOGLE_RED,
          borderRightColor: GOOGLE_YELLOW,
          borderBottomColor: GOOGLE_GREEN,
          borderLeftColor: GOOGLE_BLUE,
        },
      ]}
    />
    <Text style={googleMark.letter}>G</Text>
  </View>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 10,
  },
  outlined: {
    borderWidth: 1,
  },
  solid: {
    backgroundColor: '#000000',
  },
  white: {
    backgroundColor: '#FFFFFF',
  },
  iconWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.base,
    fontWeight: '600',
  },
});

const googleMark = StyleSheet.create({
  wrap: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
  },
  letter: {
    fontSize: 10,
    fontWeight: '900',
    color: GOOGLE_BLUE,
    lineHeight: 12,
    includeFontPadding: false,
  },
});
