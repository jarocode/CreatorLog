# Coding Standards — CreatorLog

## TypeScript

- Strict mode enabled in `tsconfig.json`
- No `any` types — use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful
- Use `React.FC<Props>` for defining functional components with props
- Generate Supabase types with `supabase gen types typescript` and keep `types/database.ts` in sync

```typescript
// ✅ Good
interface PostLogCardProps {
  post: PostLog;
  onPress: (id: string) => void;
}

const PostLogCard: React.FC<PostLogCardProps> = ({ post, onPress }) => { ... }

// ❌ Bad
const PostLogCard = ({ post, onPress }: any) => { ... }
```

## React Native

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused — one job per component
- Extract reusable logic into custom hooks (`hooks/` directory)
- Use `React.memo()` for components with static props to prevent unnecessary re-renders
- Minimize `useEffect` and `useState` — derive state where possible
- Avoid anonymous functions in `renderItem` or event handlers to prevent re-renders

```typescript
// ✅ Good — named handler, memoized component
const handlePostPress = useCallback((id: string) => {
  router.push(`/log-post/${id}`);
}, []);

// ❌ Bad — anonymous function in prop
<PostLogCard onPress={(id) => router.push(`/log-post/${id}`)} />
```

## Expo

- Use Expo SDK 52+ with managed workflow
- Use Expo Router v4 for all navigation (file-based routing)
- Only eject to bare workflow if absolutely unavoidable
- Use `expo-notifications` for local and push notifications
- Use `expo-haptics` for tactile feedback
- Use EAS Build for cloud builds (iOS + Android)
- Use EAS Update for OTA JS bundle updates — never ship broken builds through app stores when a hot fix will do
- Prefix all public environment variables with `EXPO_PUBLIC_`

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

## File Organization

```
creatorlog/
├── app/                              # Expo Router screens
│   ├── _layout.tsx                   # Root layout (providers, theme)
│   ├── index.tsx                     # Entry redirect (auth check)
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   ├── (onboarding)/
│   │   ├── platforms.tsx
│   │   ├── goals.tsx
│   │   └── reminders.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Tab navigator config
│   │   ├── home.tsx                  # Dashboard
│   │   ├── calendar.tsx              # Calendar view
│   │   ├── stats.tsx                 # Analytics
│   │   └── settings.tsx              # Preferences
│   ├── log-post.tsx                  # Modal — log a new post
│   ├── log-post/[id].tsx            # Modal — edit existing log
│   ├── calendar/[date].tsx          # Bottom sheet — day detail
│   └── settings/
│       ├── goals.tsx
│       ├── notifs.tsx
│       ├── account.tsx
│       └── export.tsx
│
├── components/                       # Reusable UI components
│   ├── ui/                           # Primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Badge.tsx
│   │   └── BottomSheet.tsx
│   ├── dashboard/
│   │   ├── StreakCounter.tsx          # Animated flame + number
│   │   ├── TodayStatus.tsx           # Platform checkboxes
│   │   ├── WeeklyProgress.tsx        # Per-platform progress bars
│   │   └── QuickStats.tsx            # Posts this week/month
│   ├── log/
│   │   ├── PlatformPicker.tsx        # Tap-to-select platform
│   │   ├── ContentTypePicker.tsx     # Dynamic content type grid
│   │   └── MetricsInput.tsx          # Collapsible metrics fields
│   ├── calendar/
│   │   ├── PostCalendar.tsx          # Monthly grid with dots
│   │   └── DayDetail.tsx             # What was posted on a day
│   ├── stats/
│   │   ├── PostsBarChart.tsx         # Weekly bar chart
│   │   ├── StreakHistory.tsx          # Current vs best per platform
│   │   └── BestDayCard.tsx           # Best posting day insight
│   └── shared/
│       ├── PlatformIcon.tsx          # LinkedIn/TikTok/YouTube icon
│       ├── ConfettiOverlay.tsx       # Milestone celebration
│       └── EmptyState.tsx            # No data placeholder
│
├── stores/                           # Zustand state stores
│   ├── authStore.ts                  # User session, profile
│   ├── postStore.ts                  # Post logs CRUD + local cache
│   ├── streakStore.ts                # Streak state + calculations
│   ├── platformStore.ts             # Platform configs + goals
│   └── settingsStore.ts             # Theme, notification prefs
│
├── services/                         # External service integrations
│   ├── supabase.ts                   # Supabase client init
│   ├── syncQueue.ts                  # Offline sync queue (MMKV)
│   ├── notifications.ts             # Push token registration + local
│   └── analytics.ts                 # PostHog wrapper
│
├── hooks/                            # Custom React hooks
│   ├── useStreak.ts                  # Read streak for platform
│   ├── useWeeklyProgress.ts         # Calculate weekly goal progress
│   ├── usePostLogs.ts               # Fetch + filter post logs
│   └── useSubscription.ts           # RevenueCat subscription state
│
├── utils/                            # Pure utility functions
│   ├── streakCalculator.ts           # Streak math (see §7.1)
│   ├── goalProgress.ts              # Weekly progress (see §7.2)
│   ├── dateHelpers.ts               # Timezone-aware date utils
│   └── csvExport.ts                 # Generate CSV from post logs
│
├── constants/                        # Static configuration
│   ├── colors.ts                     # Theme color tokens
│   ├── platforms.ts                  # Platform metadata + content types
│   ├── milestones.ts                # Streak milestone definitions
│   └── notifications.ts            # Notification templates
│
├── types/                            # TypeScript type definitions
│   ├── database.ts                   # Supabase-generated types
│   ├── navigation.ts                # Route params
│   └── index.ts                     # Shared app types
│
├── assets/                           # Static assets
│   ├── fonts/
│   │   ├── Inter-Regular.ttf
│   │   ├── Inter-Bold.ttf
│   │   └── DMMono-Regular.ttf
│   ├── animations/
│   │   ├── confetti.json            # Lottie confetti
│   │   └── flame.json              # Lottie streak flame
│   └── images/
│       └── onboarding/
│
├── supabase/                         # Supabase project files
│   ├── migrations/
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_platform_configs.sql
│   │   ├── 003_create_post_logs.sql
│   │   ├── 004_create_streaks.sql
│   │   ├── 005_create_notification_prefs.sql
│   │   └── 006_create_rls_policies.sql
│   └── functions/
│       ├── calculate-streaks/index.ts
│       ├── streak-at-risk/index.ts
│       ├── weekly-summary/index.ts
│       ├── send-notification/index.ts
│       └── reset-freeze/index.ts
│
├── .github/
│   └── workflows/
│       └── eas-build.yml             # CI/CD pipeline
│
├── app.json                          # Expo config
├── eas.json                          # EAS Build profiles
├── tsconfig.json
├── package.json
└── .env.example                      # Required env vars
```

## Naming

- Components: PascalCase (`StreakCounter.tsx`, `PostLogCard.tsx`)
- Files: Match component name for components, camelCase for everything else
- Directories: lowercase and hyphenated (`log-post/`, `ui/`)
- Functions: camelCase (`calculateStreak`, `handlePostLog`)
- Custom hooks: camelCase with `use` prefix (`useStreak.ts`, `useWeeklyProgress.ts`)
- Zustand stores: camelCase with `Store` suffix (`postStore.ts`, `streakStore.ts`)
- Constants: SCREAMING_SNAKE_CASE (`STREAK_MILESTONES`, `PLATFORM_CONTENT_TYPES`)
- Types/Interfaces: PascalCase, no prefix (`PostLog`, `StreakRecord` — not `IPostLog`)

## State Management

- Use Zustand for global state — no Redux, no Context API for complex state
- Keep stores small and focused — one store per domain (auth, posts, streaks, settings)
- Use MMKV (`react-native-mmkv`) for persistent local storage — 30x faster than AsyncStorage
- Never use AsyncStorage directly
- Derive computed values inside hooks, not inside stores

```typescript
// ✅ Good — focused Zustand store
import { create } from "zustand";

interface StreakState {
  streaks: Record<string, StreakRecord>;
  setStreak: (platform: string, streak: StreakRecord) => void;
  resetStreak: (platform: string) => void;
}

export const useStreakStore = create<StreakState>((set) => ({
  streaks: {},
  setStreak: (platform, streak) =>
    set((state) => ({
      streaks: { ...state.streaks, [platform]: streak },
    })),
  resetStreak: (platform) =>
    set((state) => {
      const { [platform]: _, ...rest } = state.streaks;
      return { streaks: rest };
    }),
}));
```

## Navigation

- Use Expo Router v4 for all routing — no standalone React Navigation setup
- Group related screens with route groups: `(auth)`, `(tabs)`, `(onboarding)`
- Use typed routes — define route params in `types/navigation.ts`
- Modals use `presentation: 'modal'` in route layout config
- Deep links are handled automatically by Expo Router's file-based convention

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, Calendar, BarChart3, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ tabBarIcon: ({ color }) => <Home color={color} size={22} /> }} />
      <Tabs.Screen name="calendar" options={{ tabBarIcon: ({ color }) => <Calendar color={color} size={22} /> }} />
      <Tabs.Screen name="stats" options={{ tabBarIcon: ({ color }) => <BarChart3 color={color} size={22} /> }} />
      <Tabs.Screen name="settings" options={{ tabBarIcon: ({ color }) => <Settings color={color} size={22} /> }} />
    </Tabs>
  );
}
```

## Styling

- Use `StyleSheet.create()` for all styling — no inline styles
- Dark mode first, light mode as secondary option
- Use design tokens from `constants/colors.ts` and `constants/typography.ts` — never hardcode hex values
- Ensure responsive design across screen sizes using `Dimensions`, `useWindowDimensions`, or percentage-based layouts
- Use `react-native-reanimated` for all animations — no `Animated` API from core React Native

```typescript
// ✅ Good — tokens from constants, StyleSheet
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bg,
    padding: 16,
  },
  title: {
    fontFamily: typography.sansBold,
    fontSize: typography.xl,
    color: colors.textPrimary,
  },
});

// ❌ Bad — hardcoded values, inline styles
<View style={{ backgroundColor: '#0D0D0D', padding: 16 }}>
  <Text style={{ fontWeight: 'bold', fontSize: 22, color: '#fff' }}>...</Text>
</View>
```

## Database (Supabase)

- Use Supabase JS client (`@supabase/supabase-js`) for all database operations
- Never bypass Row Level Security — all client queries use the `anon` key
- Edge Functions use the `service_role` key for admin operations only (streak recalculation, notification dispatch)
- Always validate inputs before writing to the database
- Use `gen_random_uuid()` for primary keys (set in schema defaults, not client-side)
- Keep migrations sequential and numbered in `supabase/migrations/`

```typescript
// ✅ Good — typed Supabase query
import { supabase } from "@/services/supabase";
import type { Database } from "@/types/database";

type PostLog = Database["public"]["Tables"]["post_logs"]["Row"];

const { data, error } = await supabase
  .from("post_logs")
  .select("*")
  .eq("user_id", userId)
  .order("posted_at", { ascending: false })
  .limit(20);

// ❌ Bad — untyped, no error handling
const data = await supabase.from("post_logs").select("*");
```

## Data Fetching & Sync

- All data writes go through the offline-first sync queue (`services/syncQueue.ts`)
- Write to MMKV first, then sync to Supabase when online
- Listen for connectivity changes with `@react-native-community/netinfo` to flush the sync queue
- Validate all user inputs with Zod before persisting

```typescript
// ✅ Good — offline-first write
import { enqueue } from "@/services/syncQueue";
import { postLogSchema } from "@/types/validation";

async function logPost(input: unknown) {
  const parsed = postLogSchema.parse(input);
  saveToLocalCache(parsed); // MMKV — instant
  enqueue(parsed); // Queue for Supabase sync
}
```

## Error Handling

- Use try/catch in all async operations
- Return `{ success, data, error }` pattern from service functions
- Display user-friendly error messages via toast (never raw error strings)
- Log errors to Sentry with contextual breadcrumbs
- Never swallow errors silently

```typescript
// ✅ Good — structured result pattern
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchStreaks(userId: string): Promise<Result<StreakRecord[]>> {
  try {
    const { data, error } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    Sentry.captureException(err);
    return {
      success: false,
      error: "Failed to load streaks. Pull down to retry.",
    };
  }
}
```

## Performance

- Optimize FlatLists with `removeClippedSubviews`, `maxToRenderPerBatch`, and `windowSize`
- Use `getItemLayout` for FlatLists when items have a consistent height
- Use `react-native-fast-image` for any remote image loading
- Memoize expensive computations with `useMemo`
- Memoize callback handlers with `useCallback`
- Keep the JS thread free — offload heavy date math to utility functions, not inline in render

```typescript
// ✅ Good — optimized FlatList
<FlatList
  data={postLogs}
  keyExtractor={(item) => item.id}
  renderItem={renderPostLogItem}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={5}
  getItemLayout={(_, index) => ({
    length: POST_LOG_ITEM_HEIGHT,
    offset: POST_LOG_ITEM_HEIGHT * index,
    index,
  })}
/>
```

## Testing

- Unit test all pure utility functions (`utils/`) with Jest
- Test streak calculation edge cases: timezone boundaries, freeze logic, backdated posts
- Test sync queue: enqueue, flush, retry on failure, deduplication
- Use `@testing-library/react-native` for component tests on critical UI flows (onboarding, log post)
- No snapshot tests — they add noise without catching real bugs

## Code Quality

- No commented-out code unless there is a `// TODO:` with a reason
- No unused imports or variables
- Keep functions under 50 lines when possible
- One component per file
- Export types from `types/` — never define shared types inline in components
- Use absolute imports with `@/` path alias (configured in `tsconfig.json`)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Git Conventions

- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Branch naming: `feat/streak-freeze`, `fix/calendar-dot-alignment`, `chore/upgrade-expo-sdk`
- Keep PRs focused — one feature or fix per PR
- Never commit `.env` files — use `.env.example` as a template
- Run `npx expo-doctor` before committing to catch config issues
