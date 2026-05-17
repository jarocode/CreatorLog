import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, type ThemeColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface ReminderCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  sublabel?: string;
  value: boolean;
  theme: ThemeColors;
  onValueChange: (next: boolean) => void;
  children?: React.ReactNode;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  iconName,
  iconColor,
  label,
  sublabel,
  value,
  theme,
  onValueChange,
  children,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.bgElevated,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.tile, { backgroundColor: theme.bgSubtle }]}>
          <Ionicons name={iconName} size={16} color={iconColor} />
        </View>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.bgSubtle, true: AppColors.primary }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={theme.bgSubtle}
        />
      </View>

      {sublabel ? (
        <Text style={[styles.sublabel, { color: theme.textSecondary }]}>
          {sublabel}
        </Text>
      ) : null}

      {value && children ? <View style={styles.expand}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tile: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: typography.base,
    fontWeight: '700',
  },
  sublabel: {
    fontSize: typography.xs,
    marginTop: 6,
    marginLeft: 38,
  },
  expand: {
    marginTop: 12,
  },
});
