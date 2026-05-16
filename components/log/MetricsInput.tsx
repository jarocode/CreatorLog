import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export interface MetricsValues {
  views: string;
  likes: string;
  comments: string;
  shares: string;
}

interface MetricsInputProps {
  values: MetricsValues;
  onChange: (key: keyof MetricsValues, value: string) => void;
  expanded: boolean;
  onToggle: () => void;
}

interface MetricFieldProps {
  icon: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  themeBg: string;
  themeBorder: string;
  themeText: string;
  themeMuted: string;
}

const MetricField: React.FC<MetricFieldProps> = ({
  icon,
  label,
  value,
  onChange,
  themeBg,
  themeBorder,
  themeText,
  themeMuted,
}) => (
  <View style={[styles.cell, { backgroundColor: themeBg, borderColor: themeBorder }]}>
    <View style={styles.cellHeader}>
      <Ionicons name={icon as never} size={13} color={themeMuted} />
      <Text style={[styles.cellLabel, { color: themeMuted }]}>{label}</Text>
    </View>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType="numeric"
      placeholder=""
      style={[styles.cellInput, { color: themeText }]}
    />
  </View>
);

export const MetricsInput: React.FC<MetricsInputProps> = ({
  values,
  onChange,
  expanded,
  onToggle,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  return (
    <View>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <View style={styles.headerLeft}>
          <Ionicons
            name={expanded ? 'chevron-down' : 'chevron-forward'}
            size={12}
            color={theme.textMuted}
          />
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>METRICS</Text>
        </View>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          add later if you like
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.grid}>
          <MetricField
            icon="eye-outline"
            label="VIEWS"
            value={values.views}
            onChange={(v) => onChange('views', v)}
            themeBg={theme.bgElevated}
            themeBorder={theme.border}
            themeText={theme.text}
            themeMuted={theme.textMuted}
          />
          <MetricField
            icon="heart-outline"
            label="LIKES"
            value={values.likes}
            onChange={(v) => onChange('likes', v)}
            themeBg={theme.bgElevated}
            themeBorder={theme.border}
            themeText={theme.text}
            themeMuted={theme.textMuted}
          />
          <MetricField
            icon="chatbubble-outline"
            label="COMMENTS"
            value={values.comments}
            onChange={(v) => onChange('comments', v)}
            themeBg={theme.bgElevated}
            themeBorder={theme.border}
            themeText={theme.text}
            themeMuted={theme.textMuted}
          />
          <MetricField
            icon="share-social-outline"
            label="SHARES"
            value={values.shares}
            onChange={(v) => onChange('shares', v)}
            themeBg={theme.bgElevated}
            themeBorder={theme.border}
            themeText={theme.text}
            themeMuted={theme.textMuted}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  hint: {
    fontSize: typography.xs,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '48%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  cellHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cellLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cellInput: {
    fontSize: typography.lg,
    fontWeight: '700',
    padding: 0,
    minHeight: 24,
  },
});
