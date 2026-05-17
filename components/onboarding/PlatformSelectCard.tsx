import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, type ThemeColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export type PlatformPickerId =
  | 'linkedin'
  | 'tiktok'
  | 'youtube'
  | 'x'
  | 'instagram';

interface PlatformSelectCardProps {
  id: PlatformPickerId;
  label: string;
  sublabel: string;
  iconName: keyof typeof Ionicons.glyphMap;
  tileColor: string;
  iconColor?: string;
  selected: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  theme: ThemeColors;
  selectedBorderColor: string;
  onPress: () => void;
}

export const PlatformSelectCard: React.FC<PlatformSelectCardProps> = ({
  label,
  sublabel,
  iconName,
  tileColor,
  iconColor = '#FFFFFF',
  selected,
  disabled = false,
  comingSoon = false,
  theme,
  selectedBorderColor,
  onPress,
}) => {
  const borderColor = selected ? selectedBorderColor : theme.border;
  const borderWidth = selected ? 1.5 : StyleSheet.hairlineWidth;

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.bgElevated,
          borderColor,
          borderWidth,
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      <View style={[styles.tile, { backgroundColor: tileColor }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>

      <View style={styles.text}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.sublabel, { color: theme.textSecondary }]}>
          {sublabel}
        </Text>
      </View>

      {comingSoon ? (
        <View
          style={[styles.comingPill, { backgroundColor: theme.bgSubtle }]}
        >
          <Text style={[styles.comingText, { color: theme.textSecondary }]}>
            Coming soon
          </Text>
        </View>
      ) : selected ? (
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  tile: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: typography.base,
    fontWeight: '700',
  },
  sublabel: {
    fontSize: typography.xs,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  comingText: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
});
