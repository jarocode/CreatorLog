import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PLATFORM_COLORS, PLATFORM_LABELS, type Platform } from '@/constants/platforms';
import { PostCalendar } from '@/components/calendar/PostCalendar';
import { MonthlyStats } from '@/components/calendar/MonthlyStats';
import { MOCK_CALENDAR_MONTH, type CalendarMonth } from '@/lib/mock-data';

const MONTH_UPPER = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

const PLATFORMS: Platform[] = ['linkedin', 'tiktok', 'youtube'];

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  const [data, setData] = useState<CalendarMonth>(MOCK_CALENDAR_MONTH);

  const handlePrevMonth = useCallback(() => {
    setData((prev) => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      const isOriginalMonth = newMonth === MOCK_CALENDAR_MONTH.month && newYear === MOCK_CALENDAR_MONTH.year;
      return isOriginalMonth
        ? MOCK_CALENDAR_MONTH
        : { ...prev, year: newYear, month: newMonth, todayDay: null, totalPosts: 0, postsByDay: {} };
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setData((prev) => {
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
      const isOriginalMonth = newMonth === MOCK_CALENDAR_MONTH.month && newYear === MOCK_CALENDAR_MONTH.year;
      return isOriginalMonth
        ? MOCK_CALENDAR_MONTH
        : { ...prev, year: newYear, month: newMonth, todayDay: null, totalPosts: 0, postsByDay: {} };
    });
  }, []);

  const monthLabel = useMemo(() => `${MONTH_UPPER[data.month]} SO FAR`, [data.month]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Calendar</Text>
        <Text style={[styles.headerYear, { color: theme.textMuted }]}>{data.year}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PostCalendar
          data={data}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <MonthlyStats
          monthLabel={monthLabel}
          totalPosts={data.totalPosts}
          comparisonText={data.comparisonText}
          comparisonPositive={data.comparisonPositive}
        />

        <View style={styles.legend}>
          {PLATFORMS.map((p) => (
            <View key={p} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: PLATFORM_COLORS[p] }]} />
              <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>
                {PLATFORM_LABELS[p]}
              </Text>
            </View>
          ))}
          <View style={styles.legendItem}>
            <Ionicons name="snow" size={10} color={AppColors.info} />
            <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>
              Freeze used
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
  },
  headerYear: {
    fontSize: typography.sm,
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
});
