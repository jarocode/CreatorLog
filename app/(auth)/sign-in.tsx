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

export default function SignInScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const [email, setEmail] = useState('sam@creators.co');
  const [password, setPassword] = useState('Streak2026!');
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = useCallback(() => {
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 600);
  }, []);

  const handleMagicLink = useCallback(() => {}, []);
  const handleApple = useCallback(() => {}, []);
  const handleGoogle = useCallback(() => {}, []);
  const handleForgot = useCallback(() => {
    router.push('/(auth)/forgot-password');
  }, [router]);
  const handleSignUp = useCallback(() => {
    router.push('/(auth)/sign-up');
  }, [router]);
  const handleBack = useCallback(() => router.back(), [router]);

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
            <Text style={[styles.welcome, { color: theme.textSecondary }]}>
              Welcome back, creator
            </Text>
          </View>

          <AuthTextField
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@email.com"
          />

          <AuthTextField
            label="PASSWORD"
            value={password}
            onChangeText={setPassword}
            isPassword
            placeholder="••••••••••"
            rightAdornment={
              <TouchableOpacity
                onPress={handleForgot}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.forgot}>Forgot? ›</Text>
              </TouchableOpacity>
            }
          />

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
            icon={
              <Ionicons name="mail-outline" size={18} color={theme.text} />
            }
            onPress={handleMagicLink}
          />
          <View style={styles.socialGap} />
          <SocialButton
            label="Continue with Apple"
            variant={isDark ? 'white' : 'solid-dark'}
            icon={<AppleMark color={isDark ? '#000000' : '#FFFFFF'} />}
            onPress={handleApple}
          />
          <View style={styles.socialGap} />
          <SocialButton
            label="Continue with Google"
            variant={isDark ? 'white' : 'outlined'}
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
