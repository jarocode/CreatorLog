import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import type { ContentType } from '@/constants/contentTypes';

interface ContentTypePickerProps {
  options: ContentType[];
  selected: string;
  onSelect: (id: string) => void;
}

export const ContentTypePicker: React.FC<ContentTypePickerProps> = ({
  options,
  selected,
  onSelect,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  const selectedBg = isDark ? AppColors.primary : 'rgba(124,58,237,0.12)';
  const selectedBorder = AppColors.primary;
  const selectedText = isDark ? '#FFFFFF' : AppColors.primary;
  const selectedIcon = isDark ? '#FFFFFF' : AppColors.primary;

  return (
    <View style={styles.grid}>
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.cell,
              {
                backgroundColor: isSelected ? selectedBg : theme.bgElevated,
                borderColor: isSelected ? selectedBorder : theme.border,
                borderWidth: isSelected ? 1.5 : StyleSheet.hairlineWidth,
              },
            ]}
            onPress={() => onSelect(opt.id)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={opt.icon as never}
              size={18}
              color={isSelected ? selectedIcon : theme.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: isSelected ? selectedText : theme.text },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '600',
  },
});
