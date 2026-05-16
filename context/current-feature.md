# Current Feature

<!-- Feature name and short description -->

## Status

<!-- Not Started | In Progress | Completed -->

## Goals

<!-- Goals and Requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated, earliest to latest -->

- 2026-05-05: Homescreen Dashboard UI Phase 1 — Home screen dashboard UI layout (phase 1 of 3). Implemented default, light mode, new user, and all goals complete states. Set up project structure (constants, component folders), built StreakCounter, TodayStatus, WeeklyProgress, QuickStats components, and 4-tab navigation.
- 2026-05-05: Homescreen Dashboard UI Phase 2 — Dark/light mode toggle via global Zustand settingsStore. Updated useColorScheme hooks to read from store. Added radial glow rings (amber for active/atRisk, blue for frozen, none for new/lapsed) to StreakCounter for all states. Implemented MilestoneCelebration full-screen overlay popup with confetti dots (tap any TODAY platform card to toggle). Settings icon on homescreen navigates to Settings tab. Settings screen built with theme toggle switch and placeholder rows for Goals, Notifications, Account, Export.
- 2026-05-16: Log Post Screen Phase 1 — Built Log Post screen UI (light + dark) at app/log-post.tsx. Added PlatformPicker, ContentTypePicker, MetricsInput components in components/log/, plus PLATFORM_CONTENT_TYPES constants per platform. Sticky bottom "Log it" button with flame icon. Homescreen FAB wired to router.push('/log-post'); screen registered in root Stack.
- 2026-05-16: Calendar Screen — Built Calendar screen UI (light + dark) at app/(tabs)/calendar.tsx. Added PostCalendar (Monday-first grid with platform dots + today purple border + freeze snowflake) and MonthlyStats (posts total + trending badge) components in components/calendar/. Added MOCK_CALENDAR_MONTH for April 2026. Legend row at bottom (LinkedIn/TikTok/YouTube/Freeze used). Month chevrons cycle months.
- 2026-05-16: Stats Screen — Built Stats screen UI (light + dark) at app/(tabs)/stats.tsx. Added PostsBarChart (manual bar chart with y-axis labels and gridlines), StreakHistory (per-platform rows with current/best), and generic InsightCard components in components/stats/. Added MOCK_STATS data (26 posts across LinkedIn/TikTok/YouTube, streaks, BEST DAY Tuesday, +52% TREND). Header has "4 weeks" filter pill.
