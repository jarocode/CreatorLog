import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';

interface AuthLogoProps {
  size?: number;
}

export const AuthLogo: React.FC<AuthLogoProps> = ({ size = 56 }) => {
  const iconSize = Math.round(size * 0.55);
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: AppColors.streakActive + '22',
        },
      ]}
    >
      <Ionicons name="flame" size={iconSize} color={AppColors.streakActive} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
