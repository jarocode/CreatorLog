import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform as RNPlatform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PLATFORM_CONTENT_TYPES } from '@/constants/contentTypes';
import type { Platform } from '@/constants/platforms';
import { PlatformPicker } from '@/components/log/PlatformPicker';
import { ContentTypePicker } from '@/components/log/ContentTypePicker';
import { MetricsInput, type MetricsValues } from '@/components/log/MetricsInput';

export default function LogPostScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const [platform, setPlatform] = useState<Platform>('linkedin');
  const contentTypes = useMemo(() => PLATFORM_CONTENT_TYPES[platform], [platform]);
  const [contentTypeId, setContentTypeId] = useState<string>(contentTypes[0].id);
  const [topic, setTopic] = useState('5 React tips for clean components');
  const [link, setLink] = useState('linkedin.com/posts/...');
  const [metricsExpanded, setMetricsExpanded] = useState(true);
  const [metrics, setMetrics] = useState<MetricsValues>({
    views: '1,240',
    likes: '86',
    comments: '',
    shares: '',
  });

  const handlePlatformSelect = useCallback((p: Platform) => {
    setPlatform(p);
    setContentTypeId(PLATFORM_CONTENT_TYPES[p][0].id);
  }, []);

  const handleMetricChange = useCallback((key: keyof MetricsValues, value: string) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleToggleMetrics = useCallback(() => {
    setMetricsExpanded((prev) => !prev);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleLogIt = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Log a post</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={RNPlatform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>PLATFORM</Text>
          <PlatformPicker selected={platform} onSelect={handlePlatformSelect} />

          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>CONTENT TYPE</Text>
          <ContentTypePicker
            options={contentTypes}
            selected={contentTypeId}
            onSelect={setContentTypeId}
          />

          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>TOPIC</Text>
          <TextInput
            value={topic}
            onChangeText={setTopic}
            placeholder='e.g. "5 React tips"'
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              {
                backgroundColor: theme.bgElevated,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
          />

          <View style={styles.linkLabelRow}>
            <Text style={[styles.sectionLabel, styles.linkLabel, { color: theme.textMuted }]}>
              LINK
            </Text>
            <Text style={[styles.optionalLabel, { color: theme.textMuted }]}>
              · optional
            </Text>
          </View>
          <TextInput
            value={link}
            onChangeText={setLink}
            placeholder="Paste URL..."
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            keyboardType="url"
            style={[
              styles.input,
              {
                backgroundColor: theme.bgElevated,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
          />

          <View style={styles.metricsWrapper}>
            <MetricsInput
              values={metrics}
              onChange={handleMetricChange}
              expanded={metricsExpanded}
              onToggle={handleToggleMetrics}
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.bg }]}>
          <TouchableOpacity
            style={styles.logButton}
            onPress={handleLogIt}
            activeOpacity={0.85}
          >
            <Ionicons name="flame" size={18} color="#FFFFFF" />
            <Text style={styles.logButtonText}>Log it</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 10,
  },
  linkLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 18,
    marginBottom: 10,
    gap: 4,
  },
  linkLabel: {
    marginTop: 0,
    marginBottom: 0,
  },
  optionalLabel: {
    fontSize: typography.xs,
    fontStyle: 'italic',
  },
  input: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: typography.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  metricsWrapper: {
    marginTop: 18,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  logButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logButtonText: {
    color: '#FFFFFF',
    fontSize: typography.base,
    fontWeight: '700',
  },
});
