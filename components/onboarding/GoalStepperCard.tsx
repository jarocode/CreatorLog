import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type ThemeColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface GoalStepperCardProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  iconName: keyof typeof Ionicons.glyphMap;
  tileColor: string;
  accentColor: string;
  theme: ThemeColors;
  onChange: (next: number) => void;
}

export const GoalStepperCard: React.FC<GoalStepperCardProps> = ({
  label,
  value,
  min = 1,
  max = 14,
  iconName,
  tileColor,
  accentColor,
  theme,
  onChange,
}) => {
  const dec = () => {
    if (value > min) onChange(value - 1);
  };
  const inc = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.bgElevated,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      <View style={styles.headerRow}>
        <View style={[styles.tile, { backgroundColor: tileColor }]}>
          <Ionicons name={iconName} size={16} color="#FFFFFF" />
        </View>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      </View>

      <View style={styles.controls}>
        <StepperButton
          symbol="−"
          disabled={value <= min}
          theme={theme}
          onPress={dec}
        />
        <View style={styles.valueWrap}>
          <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
          <Text style={[styles.unit, { color: theme.textMuted }]}>
            POSTS / WEEK
          </Text>
        </View>
        <StepperButton
          symbol="+"
          disabled={value >= max}
          theme={theme}
          onPress={inc}
        />
      </View>
    </View>
  );
};

interface StepperButtonProps {
  symbol: '−' | '+';
  disabled: boolean;
  theme: ThemeColors;
  onPress: () => void;
}

const StepperButton: React.FC<StepperButtonProps> = ({
  symbol,
  disabled,
  theme,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
    style={[
      styles.stepBtn,
      {
        backgroundColor: theme.bgSubtle,
        borderColor: theme.border,
        opacity: disabled ? 0.45 : 1,
      },
    ]}
  >
    <Text style={[styles.stepBtnText, { color: theme.text }]}>{symbol}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  tile: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.base,
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: typography.xl,
    fontWeight: '600',
    marginTop: -2,
  },
  valueWrap: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: typography['3xl'],
    fontWeight: '700',
    lineHeight: 40,
  },
  unit: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 2,
  },
});
