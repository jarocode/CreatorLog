import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface OnboardingCTAProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: 'flame' | null;
  trailingArrow?: boolean;
}

export const OnboardingCTA: React.FC<OnboardingCTAProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  leadingIcon = null,
  trailingArrow = true,
}) => {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View style={styles.row}>
          {leadingIcon === 'flame' ? (
            <Ionicons
              name="flame"
              size={16}
              color={AppColors.streakActive}
              style={styles.leading}
            />
          ) : null}
          <Text style={styles.label}>{label}</Text>
          {trailingArrow ? <Text style={styles.arrow}>{'  →'}</Text> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 14,
  },
  disabled: {
    opacity: 0.55,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leading: {
    marginRight: 6,
  },
  label: {
    color: '#FFFFFF',
    fontSize: typography.base,
    fontWeight: '700',
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: typography.base,
    fontWeight: '700',
  },
});
