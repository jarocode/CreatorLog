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
import { Ionicons } from '@expo/vector-icons';
import {
  sendMagicLink,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
} from '@/services/auth';
import { emailSchema, fieldErrors, signInSchema } from '@/types/validation';

const isIOS = RNPlatform.OS === 'ios';

export default function SignInScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [magicSubmitting, setMagicSubmitting] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [appleSubmitting, setAppleSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleSignIn = useCallback(async () => {
    setFormError(null);
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = await signInWithEmail(parsed.data.email, parsed.data.password);
    setSubmitting(false);
    if (!result.success) {
      setFormError(result.error ?? 'Could not sign in.');
      return;
    }
    // Session lands via onAuthStateChange; the route guard navigates onward.
  }, [email, password]);

  const handleMagicLink = useCallback(async () => {
    setFormError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setErrors({ email: parsed.error.issues[0]?.message ?? 'Enter a valid email' });
      return;
    }
    setErrors({});
    setMagicSubmitting(true);
    const result = await sendMagicLink(parsed.data);
    setMagicSubmitting(false);
    if (!result.success) {
      setFormError(result.error ?? 'Could not send the magic link.');
      return;
    }
    setMagicSent(true);
  }, [email]);

  const handleUseDifferentEmail = useCallback(() => {
    setMagicSent(false);
    setFormError(null);
  }, []);
  const handleApple = useCallback(async () => {
    setFormError(null);
    setAppleSubmitting(true);
    const result = await signInWithApple();
    setAppleSubmitting(false);
    if (!result.success && !result.cancelled) {
      setFormError(result.error ?? 'Could not sign in with Apple.');
    }
    // Session lands via onAuthStateChange; the route guard navigates onward.
  }, []);

  const handleGoogle = useCallback(async () => {
    setFormError(null);
    setGoogleSubmitting(true);
    const result = await signInWithGoogle();
    setGoogleSubmitting(false);
    if (!result.success && !result.cancelled) {
      setFormError(result.error ?? 'Could not sign in with Google.');
    }
    // Session lands via onAuthStateChange; the route guard navigates onward.
  }, []);

  const handleForgot = useCallback(() => {
    router.push('/(auth)/forgot-password');
  }, [router]);
  const handleSignUp = useCallback(() => {
    router.push('/(auth)/sign-up');
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
          <View style={styles.header}>
            <AuthLogo />
            <Text style={[styles.brand, { color: theme.text }]}>CreatorLog</Text>
            <Text style={[styles.welcome, { color: theme.textSecondary }]}>
              Welcome back, creator
            </Text>
          </View>

          {magicSent ? (
            <View>
              <View style={styles.magicNotice}>
                <View
                  style={[
                    styles.magicIcon,
                    { backgroundColor: AppColors.success + '22' },
                  ]}
                >
                  <Ionicons name="mail-outline" size={28} color={AppColors.success} />
                </View>
                <Text style={[styles.magicTitle, { color: theme.text }]}>
                  Check your inbox
                </Text>
                <Text style={[styles.magicSubtitle, { color: theme.textSecondary }]}>
                  We sent a magic link to{' '}
                  <Text style={{ color: theme.text, fontWeight: '700' }}>{email}</Text>
                  . Tap it to sign in.
                </Text>
              </View>
              <View style={styles.footer}>
                <TouchableOpacity onPress={handleUseDifferentEmail}>
                  <Text style={styles.footerLink}>Use a different email ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
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
                rightAdornment={
                  <TouchableOpacity
                    onPress={handleForgot}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.forgot}>Forgot? ›</Text>
                  </TouchableOpacity>
                }
              />

              {formError ? (
                <Text style={styles.formError}>{formError}</Text>
              ) : null}

              <View style={styles.primarySpacer} />
              <PrimaryButton
                label="Sign in"
                onPress={handleSignIn}
                loading={submitting}
              />

              <AuthDivider />

              <SocialButton
                label="Email me a magic link"
                variant="outlined"
                loading={magicSubmitting}
                icon={
                  <Ionicons name="mail-outline" size={18} color={theme.text} />
                }
                onPress={handleMagicLink}
              />
              {isIOS ? (
                <>
                  <View style={styles.socialGap} />
                  <SocialButton
                    label="Continue with Apple"
                    variant={isDark ? 'white' : 'solid-dark'}
                    loading={appleSubmitting}
                    icon={<AppleMark color={isDark ? '#000000' : '#FFFFFF'} />}
                    onPress={handleApple}
                  />
                </>
              ) : null}
              <View style={styles.socialGap} />
              <SocialButton
                label="Continue with Google"
                variant={isDark ? 'white' : 'outlined'}
                loading={googleSubmitting}
                icon={<GoogleMark />}
                onPress={handleGoogle}
              />

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                  Don&apos;t have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={styles.footerLink}>Sign up ›</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    paddingTop: 4,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    fontSize: typography.xl,
    fontWeight: '700',
    marginTop: 10,
  },
  welcome: {
    fontSize: typography.sm,
    marginTop: 4,
  },
  forgot: {
    color: AppColors.primary,
    fontSize: typography.xs,
    fontWeight: '700',
  },
  formError: {
    color: AppColors.warning,
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: 4,
  },
  magicNotice: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  magicIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  magicTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    marginTop: 14,
  },
  magicSubtitle: {
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  primarySpacer: {
    height: 6,
  },
  socialGap: {
    height: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
