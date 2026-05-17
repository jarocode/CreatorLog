import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, type ThemeColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface TimePickerFieldProps {
  value: string;
  theme: ThemeColors;
  onChange: (next: string) => void;
}

function buildOptions(): string[] {
  const out: string[] = [];
  for (let h = 6; h <= 23; h += 1) {
    for (const m of [0, 30]) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      out.push(`${hh}:${mm}`);
    }
  }
  return out;
}

const OPTIONS = buildOptions();

function formatDisplay(value: string): string {
  const [hStr, mStr] = value.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({
  value,
  theme,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const display = useMemo(() => formatDisplay(value), [value]);

  const handleSelect = useCallback(
    (next: string) => {
      onChange(next);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          { backgroundColor: theme.bgSubtle, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.fieldText, { color: theme.text }]}>{display}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: theme.bgElevated,
                borderColor: theme.border,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.sheetTitle, { color: theme.text }]}>
              Reminder time
            </Text>
            <FlatList
              data={OPTIONS}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              style={styles.list}
              renderItem={({ item }) => {
                const isActive = item === value;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.option,
                      isActive && { backgroundColor: theme.bgSubtle },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isActive ? AppColors.primary : theme.text,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                    >
                      {formatDisplay(item)}
                    </Text>
                    {isActive ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={AppColors.primary}
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldText: {
    fontSize: typography.base,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    maxHeight: '60%',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  sheetTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  list: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  optionText: {
    fontSize: typography.base,
  },
});
