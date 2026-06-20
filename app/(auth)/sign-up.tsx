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
import { AuthLogo } from '@/components/auth/AuthLogo';
import { AuthTextField } from '@/components/auth/AuthTextField';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import {
  AppleMark,
  GoogleMark,
  SocialButton,
} from '@/components/auth/SocialButton';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { signInWithApple, signInWithGoogle, signUpWithEmail } from '@/services/auth';
import { fieldErrors, signUpSchema } from '@/types/validation';

const isIOS = RNPlatform.OS === 'ios';

export default function SignUpScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [appleSubmitting, setAppleSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleBack = useCallback(() => router.back(), [router]);
  const handleCreateAccount = useCallback(async () => {
    setFormError(null);
    setNotice(null);
    const parsed = signUpSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = await signUpWithEmail(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
    );
    setSubmitting(false);
    if (!result.success) {
      setFormError(result.error ?? 'Could not create your account.');
      return;
    }
    if (result.data?.needsConfirmation) {
      // Email confirmation is off on the remote project, but handle it defensively.
      setNotice('Check your email to confirm your account, then sign in.');
      return;
    }
    // Session lands via onAuthStateChange; the route guard sends new users to onboarding.
  }, [name, email, password]);
  const handleApple = useCallback(async () => {
    setFormError(null);
    setAppleSubmitting(true);
    const result = await signInWithApple();
    setAppleSubmitting(false);
    if (!result.success && !result.cancelled) {
      setFormError(result.error ?? 'Could not sign in with Apple.');
    }
    // Session lands via onAuthStateChange; the guard sends new users to onboarding.
  }, []);

  const handleGoogle = useCallback(async () => {
    setFormError(null);
    setGoogleSubmitting(true);
    const result = await signInWithGoogle();
    setGoogleSubmitting(false);
    if (!result.success && !result.cancelled) {
      setFormError(result.error ?? 'Could not sign in with Google.');
    }
    // Session lands via onAuthStateChange; the guard sends new users to onboarding.
  }, []);

  const handleSignIn = useCallback(() => {
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
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={RNPlatform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AuthLogo />
            <Text style={[styles.brand, { color: theme.text }]}>CreatorLog</Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Start your streak today
            </Text>
          </View>

          <AuthTextField
            label="NAME"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            placeholder='e.g. "Sam Adeyemi"'
            errorText={errors.name}
          />

          <AuthTextField
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@email.com"
            errorText={errors.email}
          />

          <AuthTextField
            label="PASSWORD"
            value={password}
            onChangeText={setPassword}
            isPassword
            placeholder="••••••••••"
            errorText={errors.password}
          />
          <PasswordStrengthMeter password={password} />

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          {notice ? (
            <Text style={[styles.notice, { color: theme.textSecondary }]}>{notice}</Text>
          ) : null}

          <PrimaryButton
            label="Create account"
            onPress={handleCreateAccount}
            loading={submitting}
          />

          <AuthDivider />

          {isIOS ? (
            <>
              <SocialButton
                label="Continue with Apple"
                variant={isDark ? 'white' : 'solid-dark'}
                loading={appleSubmitting}
                icon={<AppleMark color={isDark ? '#000000' : '#FFFFFF'} />}
                onPress={handleApple}
              />
              <View style={styles.socialGap} />
            </>
          ) : null}
          <SocialButton
            label="Continue with Google"
            variant={isDark ? 'white' : 'outlined'}
            loading={googleSubmitting}
            icon={<GoogleMark />}
            onPress={handleGoogle}
          />

          <Text style={[styles.terms, { color: theme.textSecondary }]}>
            By signing up you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Already a user?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.footerLink}>Sign in ›</Text>
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
  topBar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backBtn: {
    padding: 4,
    width: 32,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  brand: {
    fontSize: typography.xl,
    fontWeight: '700',
    marginTop: 10,
  },
  tagline: {
    fontSize: typography.sm,
    marginTop: 4,
  },
  formError: {
    color: AppColors.warning,
    fontSize: typography.sm,
    textAlign: 'center',
    marginBottom: 4,
  },
  notice: {
    fontSize: typography.sm,
    textAlign: 'center',
    marginBottom: 4,
  },
  socialGap: {
    height: 10,
  },
  terms: {
    fontSize: typography.xs,
    textAlign: 'center',
    marginTop: 22,
    lineHeight: 18,
  },
  termsLink: {
    color: AppColors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  footerText: {
    fontSize: typography.sm,
  },
  footerLink: {
    fontSize: typography.sm,
    color: AppColors.primary,
    fontWeight: '700',
  },
});
