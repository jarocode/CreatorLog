import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppColors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { TodayStatus } from "@/components/dashboard/TodayStatus";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { MilestoneCelebration } from "@/components/dashboard/MilestoneCelebration";
import {
  MOCK_DEFAULT,
  MOCK_NEW_USER,
  MOCK_STREAK_FROZEN,
} from "@/lib/mock-data";

const MILESTONE_STREAK = 30;
const MILESTONE_MESSAGE = "You're in the top 50% of creators. Keep it going.";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? AppColors.dark : AppColors.light;
  const router = useRouter();

  const [showMilestone, setShowMilestone] = useState(false);

  const data = MOCK_DEFAULT;
  const isNewUser = data.streak.state === "new";

  const handlePlatformPress = useCallback(() => {
    setShowMilestone((prev) => !prev);
  }, []);

  const handleSettingsPress = useCallback(() => {
    router.navigate("/(tabs)/settings");
  }, [router]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.bg}
      />

      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="flame" size={22} color={AppColors.streakActive} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            CreatorLog
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={handleSettingsPress}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StreakCounter streak={data.streak} />

        <TodayStatus
          todayStatus={data.todayStatus}
          allGoalsCompleteToday={data.allGoalsCompleteToday}
          onPlatformPress={handlePlatformPress}
        />

        <WeeklyProgress weeklyProgress={data.weeklyProgress} />

        <QuickStats
          postsThisWeek={data.postsThisWeek}
          postsThisMonth={data.postsThisMonth}
          isNewUser={isNewUser}
        />
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <MilestoneCelebration
        visible={showMilestone}
        streakCount={MILESTONE_STREAK}
        message={MILESTONE_MESSAGE}
        onDismiss={() => setShowMilestone(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: "700",
  },
  headerRight: {
    padding: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
    gap: 20,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 88,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
