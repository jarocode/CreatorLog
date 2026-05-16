import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PLATFORM_COLORS, PLATFORM_LABELS, type Platform } from '@/constants/platforms';

interface PlatformPickerProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
}

const PLATFORMS: Platform[] = ['linkedin', 'tiktok', 'youtube'];

const PLATFORM_ICONS: Record<Platform, string> = {
  linkedin: 'logo-linkedin',
  tiktok: 'musical-notes',
  youtube: 'logo-youtube',
};

export const PlatformPicker: React.FC<PlatformPickerProps> = ({ selected, onSelect }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  return (
    <View style={styles.row}>
      {PLATFORMS.map((platform) => {
        const isSelected = selected === platform;
        return (
          <TouchableOpacity
            key={platform}
            style={[
              styles.card,
              { backgroundColor: theme.bgElevated, borderColor: theme.border },
              isSelected && { borderColor: AppColors.primary, borderWidth: 2 },
            ]}
            onPress={() => onSelect(platform)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={PLATFORM_ICONS[platform] as never}
              size={24}
              color={PLATFORM_COLORS[platform]}
            />
            <Text style={[styles.label, { color: theme.text }]}>
              {PLATFORM_LABELS[platform]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
});
