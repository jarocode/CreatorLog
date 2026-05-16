import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PLATFORM_COLORS } from '@/constants/platforms';
import type { CalendarMonth } from '@/lib/mock-data';

interface PostCalendarProps {
  data: CalendarMonth;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DOW_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// JS getDay returns 0=Sun..6=Sat. Convert to 0=Mon..6=Sun.
function mondayFirstIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

function buildGridCells(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayJs = new Date(year, month, 1).getDay();
  const leadingEmpty = mondayFirstIndex(firstDayJs);
  const totalCells = Math.ceil((leadingEmpty + daysInMonth) / 7) * 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < leadingEmpty; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < totalCells) cells.push(null);
  return cells;
}

export const PostCalendar: React.FC<PostCalendarProps> = ({ data, onPrevMonth, onNextMonth }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  const cells = useMemo(() => buildGridCells(data.year, data.month), [data.year, data.month]);

  return (
    <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
      {/* Month nav */}
      <View style={styles.monthNav}>
        <TouchableOpacity
          onPress={onPrevMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.navBtn}
        >
          <Ionicons name="chevron-back" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { color: theme.text }]}>
          {MONTH_NAMES[data.month]}
        </Text>
        <TouchableOpacity
          onPress={onNextMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.navBtn}
        >
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Day-of-week labels */}
      <View style={styles.dowRow}>
        {DOW_LABELS.map((label) => (
          <Text key={label} style={[styles.dowLabel, { color: theme.textMuted }]}>
            {label}
          </Text>
        ))}
      </View>

      {/* Day cells */}
      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (day === null) {
            return <View key={`e-${i}`} style={styles.cell} />;
          }
          const dayData = data.postsByDay[day];
          const isToday = data.todayDay === day;
          const hasActivity = !!dayData && (dayData.posts.length > 0 || dayData.freeze);

          return (
            <View key={day} style={styles.cell}>
              <View
                style={[
                  styles.cellInner,
                  isToday && { borderColor: AppColors.primary, borderWidth: 1.5 },
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    { color: hasActivity ? theme.text : theme.textMuted },
                  ]}
                >
                  {day}
                </Text>
                {hasActivity && (
                  <View style={styles.dotsRow}>
                    {dayData.posts.slice(0, 3).map((p, idx) => (
                      <View
                        key={`${p}-${idx}`}
                        style={[styles.dot, { backgroundColor: PLATFORM_COLORS[p] }]}
                      />
                    ))}
                    {dayData.freeze && (
                      <Ionicons name="snow" size={8} color={AppColors.info} />
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  navBtn: {
    padding: 4,
  },
  monthLabel: {
    fontSize: typography.lg,
    fontWeight: '700',
  },
  dowRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dowLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  cellInner: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dayNumber: {
    fontSize: typography.sm,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
