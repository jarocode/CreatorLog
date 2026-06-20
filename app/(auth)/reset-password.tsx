import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform as RNPlatform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { AuthTextField } from '@/components/auth/AuthTextField';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { updatePassword } from '@/services/auth';
import { fieldErrors, resetPasswordSchema } from '@/types/validation';
import { useAuthStore } from '@/stores/authStore';

export default function ResetPasswordScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleUpdate = useCallback(async () => {
    setFormError(null);
    const parsed = resetPasswordSchema.safeParse({ password, confirm });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = await updatePassword(parsed.data.password);
    setSubmitting(false);
    if (!result.success) {
      setFormError(result.error ?? 'Could not update your password.');
      return;
    }
    // Recovery complete — clear the flag so the guard routes into the app.
    useAuthStore.getState().setPasswordRecovery(false);
    router.replace('/(tabs)');
  }, [password, confirm, router]);

  const handleBackToSignIn = useCallback(async () => {
    useAuthStore.getState().setPasswordRecovery(false);
    await useAuthStore.getState().signOut();
    router.replace('/(auth)/sign-in');
  }, [router]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={RNPlatform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroBlock}>
            <View
              style={[
                styles.tile,
                { backgroundColor: AppColors.primary + '22' },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={28} color={AppColors.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              Set a new password
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Choose a new password for your account. Make it strong and easy for
              you to remember.
            </Text>
          </View>

          <AuthTextField
            label="NEW PASSWORD"
            value={password}
            onChangeText={setPassword}
            isPassword
            placeholder="••••••••••"
            autoComplete="password-new"
            errorText={errors.password}
          />

          <AuthTextField
            label="CONFIRM PASSWORD"
            value={confirm}
            onChangeText={setConfirm}
            isPassword
            placeholder="••••••••••"
            autoComplete="password-new"
            errorText={errors.confirm}
          />

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <View style={styles.spacer8} />
          <PrimaryButton
            label="Update password"
            onPress={handleUpdate}
            loading={submitting}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleBackToSignIn}>
              <Text style={styles.footerLink}>Back to sign in ›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tile: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.xl,
    fontWeight: '700',
    marginTop: 14,
  },
  subtitle: {
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  formError: {
    color: AppColors.warning,
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: 4,
  },
  spacer8: {
    height: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  footerLink: {
    fontSize: typography.sm,
    color: AppColors.primary,
    fontWeight: '700',
  },
});
