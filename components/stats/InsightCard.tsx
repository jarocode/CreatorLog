import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface InsightCardProps {
  icon: string;
  label: string;
  primary: string;
  primaryIcon?: string;
  primaryColor?: string;
  secondary: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  icon,
  label,
  primary,
  primaryIcon,
  primaryColor,
  secondary,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  return (
    <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
      <View style={styles.headerRow}>
        <Ionicons name={icon as never} size={12} color={theme.textMuted} />
        <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      </View>
      <View style={styles.primaryRow}>
        {primaryIcon ? (
          <Ionicons
            name={primaryIcon as never}
            size={18}
            color={primaryColor ?? theme.text}
          />
        ) : null}
        <Text style={[styles.primary, { color: primaryColor ?? theme.text }]}>
          {primary}
        </Text>
      </View>
      <Text style={[styles.secondary, { color: theme.textMuted }]}>{secondary}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  primary: {
    fontSize: typography.xl,
    fontWeight: '700',
  },
  secondary: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
});
