import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PostsBarChart } from '@/components/stats/PostsBarChart';
import { StreakHistory } from '@/components/stats/StreakHistory';
import { InsightCard } from '@/components/stats/InsightCard';
import { MOCK_STATS } from '@/lib/mock-data';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? AppColors.dark : AppColors.light;

  const data = MOCK_STATS;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Stats</Text>
        <TouchableOpacity
          style={[styles.weeksFilter, { backgroundColor: theme.bgElevated }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.weeksFilterText, { color: theme.textSecondary }]}>
            {data.weeksRange}
          </Text>
          <Ionicons name="chevron-down" size={12} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* POSTS PER PLATFORM */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
            POSTS PER PLATFORM
          </Text>
          <Text style={[styles.sectionAside, { color: theme.textMuted }]}>
            {data.totalPosts} total
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
          <PostsBarChart data={data.postsPerPlatform} />
        </View>

        {/* STREAKS */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted, marginTop: 4 }]}>
          STREAKS
        </Text>
        <StreakHistory streaks={data.streaks} />

        {/* INSIGHTS */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted, marginTop: 4 }]}>
          INSIGHTS
        </Text>
        <View style={styles.insightsRow}>
          <InsightCard
            icon="calendar-outline"
            label="BEST DAY"
            primary={data.bestDay.day}
            secondary={`${data.bestDay.avgPosts} posts on average`}
          />
          <InsightCard
            icon="trending-up"
            label="TREND"
            primary={`${data.trend.percentChange}%`}
            primaryIcon={data.trend.positive ? 'arrow-up' : 'arrow-down'}
            primaryColor={data.trend.positive ? AppColors.success : AppColors.warning}
            secondary={data.trend.period}
          />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
  },
  weeksFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  weeksFilterText: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  sectionAside: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
  card: {
    borderRadius: 14,
    padding: 12,
  },
  insightsRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
