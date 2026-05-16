import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors, type ThemeColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface PasswordStrengthMeterProps {
  password: string;
}

interface Strength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

function computeStrength(password: string): Strength {
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const checks = [hasLength, hasNumber, hasUpper, hasSymbol].filter(Boolean).length;

  if (password.length === 0) {
    return { score: 0, label: '', color: AppColors.dark.border };
  }
  if (checks <= 1) return { score: 1, label: 'Weak', color: AppColors.warning };
  if (checks === 2) return { score: 2, label: 'Fair', color: '#F59E0B' };
  if (checks === 3) return { score: 3, label: 'Good', color: '#84CC16' };
  return { score: 4, label: 'Strong', color: AppColors.success };
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const strength = computeStrength(password);
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);

  return (
    <View style={styles.wrapper}>
      <View style={styles.barRow}>
        {[0, 1, 2, 3].map((i) => {
          const filled = i < strength.score;
          return (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  backgroundColor: filled ? strength.color : theme.bgSubtle,
                },
              ]}
            />
          );
        })}
        <Text style={[styles.strengthLabel, { color: strength.color }]}>
          {strength.label}
        </Text>
      </View>
      <View style={styles.checks}>
        <Check ok={hasLength} label="8+ characters" theme={theme} />
        <Check ok={hasNumber} label="1 number" theme={theme} />
      </View>
    </View>
  );
};

interface CheckProps {
  ok: boolean;
  label: string;
  theme: ThemeColors;
}

const Check: React.FC<CheckProps> = ({ ok, label, theme }) => (
  <View style={styles.checkRow}>
    <Ionicons
      name={ok ? 'checkmark-circle' : 'ellipse-outline'}
      size={14}
      color={ok ? AppColors.success : theme.textMuted}
    />
    <Text style={[styles.checkLabel, { color: theme.textSecondary }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: -6,
    marginBottom: 14,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    marginLeft: 6,
    minWidth: 48,
    textAlign: 'right',
  },
  checks: {
    flexDirection: 'row',
    gap: 14,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkLabel: {
    fontSize: typography.xs,
  },
});
