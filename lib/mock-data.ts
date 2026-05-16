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

// ────────────────────────────────────────────────────────────
// Calendar mock data
// ────────────────────────────────────────────────────────────

export interface CalendarDayData {
  posts: Platform[];
  freeze?: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-indexed (0 = January)
  todayDay: number | null; // day-of-month to highlight, or null if not viewing current month
  totalPosts: number;
  comparisonText: string;
  comparisonPositive: boolean;
  postsByDay: Record<number, CalendarDayData>;
}

export const MOCK_CALENDAR_MONTH: CalendarMonth = {
  year: 2026,
  month: 3, // April
  todayDay: 23,
  totalPosts: 22,
  comparisonText: "+18% vs March",
  comparisonPositive: true,
  postsByDay: {
    2: { posts: ["linkedin", "tiktok"] },
    3: { posts: ["linkedin"] },
    4: { posts: ["tiktok"] },
    5: { posts: ["linkedin", "youtube"] },
    7: { posts: ["linkedin"] },
    8: { posts: ["tiktok", "linkedin"] },
    9: { posts: ["linkedin"] },
    10: { posts: ["linkedin"] },
    12: { posts: ["linkedin", "tiktok", "youtube"] },
    13: { posts: ["tiktok"] },
    14: { posts: ["linkedin"] },
    15: { posts: ["linkedin", "tiktok"] },
    16: { posts: ["linkedin"] },
    17: { posts: ["youtube"] },
    18: { posts: [], freeze: true },
    19: { posts: ["linkedin"] },
    20: { posts: ["tiktok"] },
    22: { posts: ["linkedin", "youtube"] },
    23: { posts: ["linkedin", "tiktok"] },
    24: { posts: ["linkedin"] },
    26: { posts: ["tiktok"] },
    28: { posts: ["linkedin", "youtube"] },
    30: { posts: ["linkedin"] },
  },
};

// ────────────────────────────────────────────────────────────
// Stats mock data
// ────────────────────────────────────────────────────────────

export interface PlatformPostCount {
  platform: Platform;
  count: number;
}

export interface PlatformStreak {
  platform: Platform;
  current: number;
  best: number;
}

export interface StatsData {
  weeksRange: string;
  postsPerPlatform: PlatformPostCount[];
  totalPosts: number;
  streaks: PlatformStreak[];
  bestDay: { day: string; avgPosts: number };
  trend: { percentChange: number; positive: boolean; period: string };
}

export const MOCK_STATS: StatsData = {
  weeksRange: "4 weeks",
  postsPerPlatform: [
    { platform: "linkedin", count: 14 },
    { platform: "tiktok", count: 8 },
    { platform: "youtube", count: 4 },
  ],
  totalPosts: 26,
  streaks: [
    { platform: "linkedin", current: 12, best: 28 },
    { platform: "tiktok", current: 5, best: 14 },
    { platform: "youtube", current: 2, best: 9 },
  ],
  bestDay: { day: "Tuesday", avgPosts: 5.2 },
  trend: { percentChange: 52, positive: true, period: "vs last month" },
};
