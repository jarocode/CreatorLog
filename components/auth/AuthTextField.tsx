import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface AuthTextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  rightAdornment?: React.ReactNode;
  isPassword?: boolean;
  errorText?: string;
}

export const AuthTextField: React.FC<AuthTextFieldProps> = ({
  label,
  rightAdornment,
  isPassword = false,
  errorText,
  ...inputProps
}) => {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  const borderColor = errorText
    ? AppColors.warning
    : focused
      ? AppColors.primary
      : theme.border;

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        {rightAdornment}
      </View>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.bgElevated,
            borderColor,
          },
        ]}
      >
        <TextInput
          {...inputProps}
          secureTextEntry={isPassword && !reveal}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text }]}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setReveal((p) => !p)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={reveal ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorText ? (
        <Text style={styles.error}>{errorText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: typography.base,
  },
  error: {
    color: AppColors.warning,
    fontSize: typography.xs,
    marginTop: 4,
  },
});
