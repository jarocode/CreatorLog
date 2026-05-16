import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PLATFORM_COLORS } from '@/constants/platforms';
import type { PlatformPostCount } from '@/lib/mock-data';

interface PostsBarChartProps {
  data: PlatformPostCount[];
}

const CHART_HEIGHT = 150;
const TOP_PAD = 18;
const Y_AXIS_WIDTH = 28;
const Y_LABELS = [16, 12, 8, 4];
const MAX_VALUE = 16;

export const PostsBarChart: React.FC<PostsBarChartProps> = ({ data }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  return (
    <View style={[styles.container, { paddingTop: TOP_PAD }]}>
      {/* Y-axis labels */}
      <View style={[styles.yAxis, { height: CHART_HEIGHT }]}>
        {Y_LABELS.map((val) => (
          <Text
            key={val}
            style={[
              styles.yLabel,
              {
                color: theme.textMuted,
                top: (1 - val / MAX_VALUE) * CHART_HEIGHT - 6,
              },
            ]}
          >
            {val}
          </Text>
        ))}
      </View>

      {/* Chart area with gridlines and bars */}
      <View style={[styles.chartArea, { height: CHART_HEIGHT }]}>
        {Y_LABELS.map((val) => (
          <View
            key={`grid-${val}`}
            style={[
              styles.gridLine,
              {
                backgroundColor: theme.border,
                top: (1 - val / MAX_VALUE) * CHART_HEIGHT,
              },
            ]}
          />
        ))}

        <View style={styles.barsRow}>
          {data.map(({ platform, count }) => {
            const barH = (count / MAX_VALUE) * CHART_HEIGHT;
            return (
              <View key={platform} style={[styles.barColumn, { height: CHART_HEIGHT }]}>
                <Text style={[styles.barValue, { color: theme.text }]}>{count}</Text>
                <View
                  style={[
                    styles.bar,
                    { height: barH, backgroundColor: PLATFORM_COLORS[platform] },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  yAxis: {
    width: Y_AXIS_WIDTH,
    position: 'relative',
  },
  yLabel: {
    position: 'absolute',
    right: 6,
    fontSize: 10,
    fontWeight: '500',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  barsRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
  },
  barColumn: {
    width: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barValue: {
    fontSize: typography.xs,
    fontWeight: '700',
    marginBottom: 4,
  },
  bar: {
    width: 36,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
