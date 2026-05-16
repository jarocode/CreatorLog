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
import { AppColors, type ThemeColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { AuthTextField } from '@/components/auth/AuthTextField';
import { PrimaryButton } from '@/components/auth/PrimaryButton';

type ScreenState = 'request' | 'sent';

export default function ForgotPasswordScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const [state, setState] = useState<ScreenState>('request');
  const [email, setEmail] = useState('sam@creators.co');
  const [submitting, setSubmitting] = useState(false);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleSend = useCallback(() => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setState('sent');
    }, 600);
  }, []);

  const handleResend = useCallback(() => {
    setState('request');
  }, []);

  const handleBackToSignIn = useCallback(() => {
    router.replace('/(auth)/sign-in');
  }, [router]);

  const handleSignInLink = useCallback(() => {
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
          {state === 'request' ? (
            <RequestState
              email={email}
              onEmailChange={setEmail}
              onSend={handleSend}
              onSignIn={handleSignInLink}
              submitting={submitting}
              theme={theme}
            />
          ) : (
            <SentState
              email={email}
              onResend={handleResend}
              onBackToSignIn={handleBackToSignIn}
              theme={theme}
              isDark={isDark}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface RequestStateProps {
  email: string;
  onEmailChange: (v: string) => void;
  onSend: () => void;
  onSignIn: () => void;
  submitting: boolean;
  theme: ThemeColors;
}

const RequestState: React.FC<RequestStateProps> = ({
  email,
  onEmailChange,
  onSend,
  onSignIn,
  submitting,
  theme,
}) => (
  <View>
    <View style={styles.heroBlock}>
      <IconTile color={AppColors.primary} icon="key-outline" />
      <Text style={[styles.title, { color: theme.text }]}>
        Reset your password
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Enter the email tied to your account and we&apos;ll send a link to
        reset your password.
      </Text>
    </View>

    <AuthTextField
      label="EMAIL"
      value={email}
      onChangeText={onEmailChange}
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      placeholder="you@email.com"
    />

    <View style={styles.spacer8} />
    <PrimaryButton
      label="Send reset link"
      onPress={onSend}
      loading={submitting}
    />

    <View style={styles.footer}>
      <Text style={[styles.footerText, { color: theme.textSecondary }]}>
        Remembered it?{' '}
      </Text>
      <TouchableOpacity onPress={onSignIn}>
        <Text style={styles.footerLink}>Sign in ›</Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface SentStateProps {
  email: string;
  onResend: () => void;
  onBackToSignIn: () => void;
  theme: ThemeColors;
  isDark: boolean;
}

const SentState: React.FC<SentStateProps> = ({
  email,
  onResend,
  onBackToSignIn,
  theme,
  isDark,
}) => (
  <View>
    <View style={styles.heroBlock}>
      <IconTile color={AppColors.success} icon="mail-outline" showBadge />
      <Text style={[styles.title, { color: theme.text }]}>Check your inbox</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        We sent a reset link to{' '}
        <Text style={[styles.emailHighlight, { color: theme.text }]}>
          {email}
        </Text>
        . The link expires in 60 minutes.
      </Text>
    </View>

    <View
      style={[
        styles.linkCard,
        {
          backgroundColor: theme.bgElevated,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.linkCardIcon}>
        <Ionicons name="flame" size={16} color={AppColors.streakActive} />
      </View>
      <View style={styles.linkCardText}>
        <Text style={[styles.linkCardTitle, { color: theme.text }]}>
          CreatorLog
        </Text>
        <Text style={[styles.linkCardSubtitle, { color: theme.textSecondary }]}>
          Reset your password
        </Text>
      </View>
      <Text style={[styles.linkCardBadge, { color: theme.textMuted }]}>NOW</Text>
    </View>

    <View style={styles.resendRow}>
      <Text style={[styles.resendText, { color: theme.textSecondary }]}>
        Didn&apos;t get it?{' '}
      </Text>
      <TouchableOpacity onPress={onResend}>
        <Text style={styles.resendLink}>Resend ›</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={[
        styles.backButton,
        {
          backgroundColor: isDark ? '#000000' : theme.bgElevated,
          borderColor: theme.border,
          borderWidth: isDark ? 0 : 1,
        },
      ]}
      onPress={onBackToSignIn}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.backButtonLabel,
          { color: isDark ? '#FFFFFF' : theme.text },
        ]}
      >
        Back to sign in
      </Text>
    </TouchableOpacity>
  </View>
);

interface IconTileProps {
  color: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  showBadge?: boolean;
}

const IconTile: React.FC<IconTileProps> = ({ color, icon, showBadge }) => (
  <View
    style={[
      tileStyles.tile,
      { backgroundColor: color + '22' },
    ]}
  >
    <Ionicons name={icon} size={28} color={color} />
    {showBadge ? (
      <View style={tileStyles.badge}>
        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
      </View>
    ) : null}
  </View>
);

const tileStyles = StyleSheet.create({
  tile: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: AppColors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
});

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
    paddingTop: 24,
    paddingBottom: 24,
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: 24,
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
  emailHighlight: {
    fontWeight: '700',
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
  footerText: {
    fontSize: typography.sm,
  },
  footerLink: {
    fontSize: typography.sm,
    color: AppColors.primary,
    fontWeight: '700',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  linkCardIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: AppColors.streakActive + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkCardText: {
    flex: 1,
  },
  linkCardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
  },
  linkCardSubtitle: {
    fontSize: typography.xs,
    marginTop: 2,
  },
  linkCardBadge: {
    fontSize: typography.xs,
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  resendText: {
    fontSize: typography.sm,
  },
  resendLink: {
    fontSize: typography.sm,
    color: AppColors.primary,
    fontWeight: '700',
  },
  backButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonLabel: {
    fontSize: typography.base,
    fontWeight: '700',
  },
});
