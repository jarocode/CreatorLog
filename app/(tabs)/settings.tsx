import React from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSettingsStore } from "@/stores/settingsStore";
import { AppColors } from "@/constants/colors";
import { typography } from "@/constants/typography";

type AppTheme = typeof AppColors.dark | typeof AppColors.light;

interface SettingRowProps {
  icon: string;
  label: string;
  sublabel?: string;
  right: React.ReactNode;
  theme: AppTheme;
  isLast?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  sublabel,
  right,
  theme,
  isLast,
}) => (
  <View
    style={[
      styles.row,
      !isLast && styles.rowBorder,
      { borderBottomColor: theme.border },
    ]}
  >
    <View style={[styles.rowIcon, { backgroundColor: theme.bgSubtle }]}>
      <Ionicons name={icon as never} size={17} color={theme.textSecondary} />
    </View>
    <View style={styles.rowText}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      {sublabel ? (
        <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>
          {sublabel}
        </Text>
      ) : null}
    </View>
    <View style={styles.rowRight}>{right}</View>
  </View>
);

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? AppColors.dark : AppColors.light;
  const { toggleTheme } = useSettingsStore();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.bg}
      />

      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          APPEARANCE
        </Text>
        <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            sublabel={isDark ? "Dark" : "Light"}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: AppColors.dark.bgSubtle,
                  true: AppColors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            }
            theme={theme}
            isLast
          />
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          PREFERENCES
        </Text>
        <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
          <SettingRow
            icon="trophy-outline"
            label="Goals"
            sublabel="Posting targets per platform"
            right={
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.textMuted}
              />
            }
            theme={theme}
          />
          <SettingRow
            icon="notifications-outline"
            label="Notifications"
            sublabel="Reminders and alerts"
            right={
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.textMuted}
              />
            }
            theme={theme}
            isLast
          />
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          ACCOUNT
        </Text>
        <View style={[styles.card, { backgroundColor: theme.bgElevated }]}>
          <SettingRow
            icon="person-outline"
            label="Account"
            sublabel="Email, password"
            right={
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.textMuted}
              />
            }
            theme={theme}
          />
          <SettingRow
            icon="download-outline"
            label="Export Data"
            sublabel="Download CSV"
            right={
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.textMuted}
              />
            }
            theme={theme}
            isLast
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: typography.sm,
    fontWeight: "500",
  },
  rowSublabel: {
    fontSize: typography.xs,
  },
  rowRight: {
    alignItems: "center",
    justifyContent: "center",
  },
});
