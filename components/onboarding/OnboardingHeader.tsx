import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, type ThemeColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface OnboardingHeaderProps {
  step: 1 | 2 | 3;
  totalSteps?: number;
  theme: ThemeColors;
  onBack?: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  step,
  totalSteps = 3,
  theme,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.backSlot}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.center}>
        <View style={styles.dots}>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isActive = i + 1 === step;
            const isDone = i + 1 < step;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      isActive || isDone ? AppColors.primary : theme.bgSubtle,
                    width: isActive ? 18 : 6,
                  },
                ]}
              />
            );
          })}
        </View>
        <Text style={[styles.stepText, { color: theme.textSecondary }]}>
          Step {step} of {totalSteps}
        </Text>
      </View>

      <View style={styles.backSlot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backSlot: {
    width: 32,
  },
  backBtn: {
    padding: 4,
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  stepText: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
});
