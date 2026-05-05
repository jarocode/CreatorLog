type Platform = "linkedin" | "tiktok" | "youtube";
type StreakState = "active" | "atRisk" | "frozen" | "lapsed" | "new";

interface PlatformTodayStatus {
  platform: Platform;
  loggedToday: boolean;
}

interface WeeklyPlatformProgress {
  platform: Platform;
  postsThisWeek: number;
  weeklyGoal: number;
}

interface StreakData {
  currentStreak: number;
  state: StreakState;
  isMilestoneDay: boolean;
  previousBest?: number;
  atRiskMinutesRemaining?: number;
  frozenMessage?: string;
  milestoneMessage?: string;
}

export interface DashboardData {
  userName: string;
  streak: StreakData;
  todayStatus: PlatformTodayStatus[];
  weeklyProgress: WeeklyPlatformProgress[];
  postsThisWeek: number;
  postsThisMonth: number;
  allGoalsCompleteToday: boolean;
  isSyncing: boolean;
}

// 01 - Default (dark mode base state)
export const MOCK_DEFAULT: DashboardData = {
  userName: "Alex",
  streak: {
    currentStreak: 21,
    state: "active",
    isMilestoneDay: true,
  },
  todayStatus: [
    { platform: "linkedin", loggedToday: true },
    { platform: "tiktok", loggedToday: false },
    { platform: "youtube", loggedToday: false },
  ],
  weeklyProgress: [
    { platform: "linkedin", postsThisWeek: 4, weeklyGoal: 5 },
    { platform: "tiktok", postsThisWeek: 2, weeklyGoal: 5 },
    { platform: "youtube", postsThisWeek: 1, weeklyGoal: 3 },
  ],
  postsThisWeek: 7,
  postsThisMonth: 31,
  allGoalsCompleteToday: false,
  isSyncing: false,
};

// 03 - New User (no posts yet)
export const MOCK_NEW_USER: DashboardData = {
  userName: "Alex",
  streak: {
    currentStreak: 0,
    state: "new",
    isMilestoneDay: false,
  },
  todayStatus: [
    { platform: "linkedin", loggedToday: false },
    { platform: "tiktok", loggedToday: false },
    { platform: "youtube", loggedToday: false },
  ],
  weeklyProgress: [
    { platform: "linkedin", postsThisWeek: 0, weeklyGoal: 5 },
    { platform: "tiktok", postsThisWeek: 0, weeklyGoal: 5 },
    { platform: "youtube", postsThisWeek: 0, weeklyGoal: 3 },
  ],
  postsThisWeek: 0,
  postsThisMonth: 0,
  allGoalsCompleteToday: false,
  isSyncing: false,
};

// 04 - All Goals Complete
export const MOCK_ALL_GOALS_COMPLETE: DashboardData = {
  userName: "Alex",
  streak: {
    currentStreak: 30,
    state: "active",
    isMilestoneDay: true,
  },
  todayStatus: [
    { platform: "linkedin", loggedToday: true },
    { platform: "tiktok", loggedToday: true },
    { platform: "youtube", loggedToday: true },
  ],
  weeklyProgress: [
    { platform: "linkedin", postsThisWeek: 5, weeklyGoal: 5 },
    { platform: "tiktok", postsThisWeek: 5, weeklyGoal: 5 },
    { platform: "youtube", postsThisWeek: 3, weeklyGoal: 3 },
  ],
  postsThisWeek: 13,
  postsThisMonth: 47,
  allGoalsCompleteToday: true,
  isSyncing: false,
};

// 05 - Streak at Risk
export const MOCK_STREAK_AT_RISK: DashboardData = {
  userName: "Alex",
  streak: {
    currentStreak: 21,
    state: "atRisk",
    isMilestoneDay: false,
    atRiskMinutesRemaining: 148,
  },
  todayStatus: [
    { platform: "linkedin", loggedToday: true },
    { platform: "tiktok", loggedToday: false },
    { platform: "youtube", loggedToday: false },
  ],
  weeklyProgress: [
    { platform: "linkedin", postsThisWeek: 4, weeklyGoal: 5 },
    { platform: "tiktok", postsThisWeek: 2, weeklyGoal: 5 },
    { platform: "youtube", postsThisWeek: 1, weeklyGoal: 3 },
  ],
  postsThisWeek: 7,
  postsThisMonth: 31,
  allGoalsCompleteToday: false,
  isSyncing: false,
};

// 06 - Streak Frozen
export const MOCK_STREAK_FROZEN: DashboardData = {
  userName: "Alex",
  streak: {
    currentStreak: 21,
    state: "frozen",
    isMilestoneDay: false,
    frozenMessage: "Streak freeze used yesterday. Next freeze available Monday.",
  },
  todayStatus: [
    { platform: "linkedin", loggedToday: true },
    { platform: "tiktok", loggedToday: false },
    { platform: "youtube", loggedToday: false },
  ],
  weeklyProgress: [
    { platform: "linkedin", postsThisWeek: 4, weeklyGoal: 5 },
    { platform: "tiktok", postsThisWeek: 2, weeklyGoal: 5 },
    { platform: "youtube", postsThisWeek: 1, weeklyGoal: 3 },
  ],
  postsThisWeek: 7,
  postsThisMonth: 31,
  allGoalsCompleteToday: false,
  isSyncing: false,
};

// 07 - Streak Lapsed
export const MOCK_STREAK_LAPSED: DashboardData = {
  userName: "Alex",
  streak: {
    currentStreak: 0,
    state: "lapsed",
    isMilestoneDay: false,
    previousBest: 31,
  },
  todayStatus: [
    { platform: "linkedin", loggedToday: false },
    { platform: "tiktok", loggedToday: false },
    { platform: "youtube", loggedToday: false },
  ],
  weeklyProgress: [
    { platform: "linkedin", postsThisWeek: 0, weeklyGoal: 5 },
    { platform: "tiktok", postsThisWeek: 0, weeklyGoal: 5 },
    { platform: "youtube", postsThisWeek: 0, weeklyGoal: 3 },
  ],
  postsThisWeek: 0,
  postsThisMonth: 0,
  allGoalsCompleteToday: false,
  isSyncing: false,
};

// 08 - Milestone Celebration
export const MOCK_MILESTONE: DashboardData = {
  userName: "Alex",
  streak: {
    currentStreak: 30,
    state: "active",
    isMilestoneDay: true,
    milestoneMessage: "You're in the top 50% of creators. Keep it going.",
  },
  todayStatus: [
    { platform: "linkedin", loggedToday: true },
    { platform: "tiktok", loggedToday: true },
    { platform: "youtube", loggedToday: true },
  ],
  weeklyProgress: [
    { platform: "linkedin", postsThisWeek: 4, weeklyGoal: 5 },
    { platform: "tiktok", postsThisWeek: 2, weeklyGoal: 5 },
    { platform: "youtube", postsThisWeek: 1, weeklyGoal: 3 },
  ],
  postsThisWeek: 7,
  postsThisMonth: 31,
  allGoalsCompleteToday: false,
  isSyncing: false,
};

// 10 - Pull to Refresh (syncing state)
export const MOCK_SYNCING: DashboardData = {
  ...MOCK_DEFAULT,
  isSyncing: true,
};

export const MOCK_DASHBOARD = MOCK_DEFAULT;
