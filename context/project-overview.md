# 🔥 CREATORLOG — Technical Project Overview

> A mobile-first content consistency tracker for creators on LinkedIn, TikTok, and YouTube.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Target Users](#2-target-users)
3. [Feature Specification](#3-feature-specification)
4. [System Architecture](#4-system-architecture)
5. [Tech Stack](#5-tech-stack)
6. [Database Design (Supabase)](#6-database-design-supabase)
7. [Core Algorithms & Business Logic](#7-core-algorithms--business-logic)
8. [Notification System](#8-notification-system)
9. [Offline-First Sync Strategy](#9-offline-first-sync-strategy)
10. [Project Structure](#10-project-structure)
11. [UI/UX Technical Spec](#11-uiux-technical-spec)
12. [Key Reference Documentation](#12-key-reference-documentation)

---

## 1. Problem Statement

Content creators know that consistency is the single biggest driver of algorithmic growth, yet most have no system to track, measure, or maintain posting consistency across platforms. They rely on memory, scattered notes, or willpower — and they burn out.

**Why this is a technical opportunity:**

| Platform | Algorithm Behavior                                                                 |
| -------- | ---------------------------------------------------------------------------------- |
| TikTok   | Requires ~3 videos/week minimum for growth. Penalizes long gaps between posts.     |
| LinkedIn | Tracks your baseline engagement rate. Extended inactivity suppresses future posts. |
| YouTube  | Rewards regular upload schedules with improved recommendation placement.           |

No platform provides a unified cross-platform consistency view. Each has siloed analytics. CreatorLog fills that gap with a mobile-first habit tracker that uses streak mechanics, push notifications, and lightweight analytics to keep creators accountable.

---

## 2. Target Users

### Primary: The Aspiring Full-Time Creator

| Attribute          | Detail                                                         |
| ------------------ | -------------------------------------------------------------- |
| Age                | 22–35                                                          |
| Active platforms   | 2–3 (typically TikTok + YouTube, or LinkedIn + TikTok)         |
| Posting target     | 3–5x/week per platform; currently achieves 1–2x inconsistently |
| Content income     | $0–$2,000/month (growing toward full-time)                     |
| Device             | Primarily mobile for consuming and posting content             |
| Willingness to pay | $4–8/month                                                     |

### Secondary: The Side-Hustle Creator

| Attribute          | Detail                                                          |
| ------------------ | --------------------------------------------------------------- |
| Age                | 25–40                                                           |
| Active platforms   | Primarily LinkedIn, occasionally TikTok or YouTube              |
| Posting target     | 3–5x/week on LinkedIn                                           |
| Content income     | $0 direct; content drives consulting leads or job opportunities |
| Device             | Phone for quick logging, desktop for writing                    |
| Willingness to pay | $3–5/month                                                      |

### Anti-Personas (Excluded)

- Agencies/social media managers (need scheduling tools, not habit trackers)
- Established creators with 500K+ followers (have teams and existing systems)
- Casual posters with no growth goals

---

## 3. Feature Specification

### 3.1 MVP Feature Map

```
┌──────────────────────────────────────────────────────────────────┐
│                        CREATORLOG MVP                            │
├────────────────┬────────────────┬────────────────┬───────────────┤
│   ONBOARDING   │   LOG A POST   │    STREAKS     │   DASHBOARD   │
│                │                │                │               │
│ • Platform     │ • Platform     │ • Per-platform │ • Today view  │
│   selection    │   picker       │   streaks      │ • Weekly      │
│ • Weekly goals │ • Content type │ • Overall      │   progress    │
│ • Reminder     │   (dynamic)    │   streak       │ • Quick stats │
│   preferences  │ • Title/topic  │ • Weekly goal  │ • FAB to log  │
│                │ • Post URL     │   tracking     │               │
│                │ • Date/time    │ • Streak       │               │
│                │ • Metrics      │   freezes      │               │
├────────────────┼────────────────┼────────────────┼───────────────┤
│   CALENDAR     │     STATS      │ NOTIFICATIONS  │   SETTINGS    │
│                │                │                │               │
│ • Monthly grid │ • Posts/week   │ • Daily        │ • Edit goals  │
│ • Color-coded  │   bar chart    │   reminders    │ • Notif prefs │
│   per platform │ • Best day     │ • Streak at    │ • Account     │
│ • Tap for day  │ • Streak       │   risk alerts  │ • CSV export  │
│   detail       │   history      │ • Weekly       │ • Theme       │
│ • Heatmap      │ • Monthly      │   summaries    │   toggle      │
│   intensity    │   trends       │ • Milestones   │               │
└────────────────┴────────────────┴────────────────┴───────────────┘
```

### 3.2 Content Type Configuration

Platform-specific content types rendered dynamically in the log form:

```typescript
const PLATFORM_CONTENT_TYPES: Record<Platform, ContentType[]> = {
  linkedin: [
    { id: "text", label: "Text Post", icon: "FileText" },
    { id: "carousel", label: "Carousel", icon: "LayoutGrid" },
    { id: "video", label: "Video", icon: "Video" },
    { id: "article", label: "Article", icon: "BookOpen" },
    { id: "poll", label: "Poll", icon: "BarChart3" },
  ],
  tiktok: [
    { id: "video", label: "Video", icon: "Video" },
    { id: "live", label: "LIVE", icon: "Radio" },
    { id: "story", label: "Story", icon: "Circle" },
  ],
  youtube: [
    { id: "longform", label: "Long-form", icon: "Film" },
    { id: "short", label: "Short", icon: "Smartphone" },
    { id: "community", label: "Community", icon: "MessageSquare" },
    { id: "live", label: "LIVE", icon: "Radio" },
  ],
};
```

> Icons sourced from `lucide-react-native`. Install via `npm install lucide-react-native`.

### 3.3 Features Excluded from MVP (v2.0+)

| Feature                     | Reason for Deferral                                     |
| --------------------------- | ------------------------------------------------------- |
| AI-powered insights         | Requires sufficient data accumulation (~3 months)       |
| Content idea suggestions    | Scope creep; not core to the consistency problem        |
| Platform API integrations   | OAuth complexity, rate limits, maintenance burden       |
| Social/community features   | Leaderboards, accountability partners — needs user base |
| Hashtag or trend tracking   | Separate product concern (TrendScout)                   |
| Team/collaboration features | B2B pivot, out of scope for solo creator MVP            |
| Desktop/web version         | Mobile-first; web companion is a v2 consideration       |

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                              │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                   React Native + Expo (SDK 52+)                 │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐ │   │
│  │  │ Expo Router│  │  Zustand   │  │    MMKV    │  │ RevenueCat│ │   │
│  │  │ Navigation │  │   Stores   │  │Local Cache │  │  Payments │ │   │
│  │  └────────────┘  └─────┬──────┘  └──────┬─────┘  └───────────┘ │   │
│  │                        │                │                       │   │
│  │                        └────────┬───────┘                       │   │
│  │                                 │                               │   │
│  │                    ┌────────────▼────────────┐                  │   │
│  │                    │     Sync Service        │                  │   │
│  │                    │ (Offline-First Queue)    │                  │   │
│  │                    └────────────┬────────────┘                  │   │
│  └─────────────────────────────────┼───────────────────────────────┘   │
│                                    │                                   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ HTTPS
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            BACKEND LAYER                               │
│                            (Supabase)                                  │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Supabase    │  │   Postgres   │  │    Edge      │  │  pg_cron  │  │
│  │    Auth      │  │   Database   │  │  Functions   │  │  (Cron)   │  │
│  │              │  │   + RLS      │  │              │  │           │  │
│  │ • Email/Pass │  │ • users      │  │ • streak-    │  │ • Nightly │  │
│  │ • Magic Link │  │ • platforms  │  │   check      │  │   streak  │  │
│  │ • Apple SSO  │  │ • post_logs  │  │ • send-      │  │   calc    │  │
│  │ • Google SSO │  │ • streaks    │  │   notif      │  │ • Weekly  │  │
│  │              │  │ • notif_prefs│  │ • weekly-     │  │   summary │  │
│  │              │  │              │  │   summary     │  │           │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘  │
│                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                              │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Expo Push   │  │   RevenueCat │  │    Sentry    │  │  PostHog  │  │
│  │  Service     │  │   (Payments) │  │  (Errors)    │  │(Analytics)│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘  │
│                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Launch   │────▶│  Auth Check  │────▶│  Onboarding  │────▶│  Home    │
│  Screen   │     │  (Supabase)  │     │  (if new)    │     │Dashboard │
└──────────┘     └──────────────┘     └──────────────┘     └──────────┘
                        │                                        ▲
                        │ (existing session)                     │
                        └────────────────────────────────────────┘
```

**Supported auth providers:**

| Provider       | Required? | Notes                                           |
| -------------- | --------- | ----------------------------------------------- |
| Email/Password | Yes       | Primary auth method                             |
| Magic Link     | Yes       | Passwordless alternative via email              |
| Apple Sign In  | Yes       | **Required by App Store** if any SSO is offered |
| Google Sign In | Yes       | Recommended for Play Store, covers most users   |

**Implementation:** Use `@supabase/supabase-js` with `@react-native-google-signin/google-signin` and `expo-apple-authentication`.

### 4.3 Screen Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP NAVIGATION                           │
│                                                                 │
│  (Auth Stack — unauthenticated)                                 │
│  ├── /sign-in                                                   │
│  ├── /sign-up                                                   │
│  └── /forgot-password                                           │
│                                                                 │
│  (Onboarding Stack — authenticated, first launch)               │
│  ├── /onboarding/platforms                                      │
│  ├── /onboarding/goals                                          │
│  └── /onboarding/reminders                                      │
│                                                                 │
│  (Main Tab Navigator — authenticated)                           │
│  ├── 🏠 /(tabs)/home              ← Dashboard                  │
│  │       └── /log-post             ← Modal (FAB)               │
│  │       └── /log-post/[id]        ← Edit existing log         │
│  ├── 📅 /(tabs)/calendar           ← Calendar view             │
│  │       └── /calendar/[date]      ← Day detail sheet          │
│  ├── 📊 /(tabs)/stats              ← Analytics                 │
│  └── ⚙️ /(tabs)/settings           ← Preferences               │
│          ├── /settings/goals        ← Edit platform goals       │
│          ├── /settings/notifs       ← Notification preferences  │
│          ├── /settings/account      ← Email, password, delete   │
│          └── /settings/export       ← CSV export                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Router config:** File-based routing with Expo Router v4. Each path maps to a file inside `app/`.

---

## 5. Tech Stack

### 5.1 Frontend

| Layer            | Package                      | Version | Purpose                                          |
| ---------------- | ---------------------------- | ------- | ------------------------------------------------ |
| Framework        | `react-native` + `expo`      | SDK 52+ | Cross-platform mobile runtime                    |
| Navigation       | `expo-router`                | v4+     | File-based routing, deep linking                 |
| State Management | `zustand`                    | ^5.0    | Lightweight global state, no boilerplate         |
| Local Storage    | `react-native-mmkv`          | ^3.0    | 30x faster than AsyncStorage, offline caching    |
| Charts           | `react-native-gifted-charts` | ^1.4    | Bar charts, line charts for stats screen         |
| Calendar         | `react-native-calendars`     | ^1.1306 | Monthly calendar grid with custom day markers    |
| Notifications    | `expo-notifications`         | ^0.28   | Local + push notifications                       |
| Animations       | `react-native-reanimated`    | ^3.16   | Streak flames, confetti, progress bar animations |
| Haptics          | `expo-haptics`               | ^13.0   | Success vibration on post log                    |
| Icons            | `lucide-react-native`        | ^0.460  | Consistent icon set across all screens           |
| Subscriptions    | `react-native-purchases`     | ^8.0    | RevenueCat SDK for in-app subscriptions          |
| Date handling    | `date-fns`                   | ^4.1    | Timezone-aware date math for streak calculations |
| Forms            | `react-hook-form`            | ^7.54   | Performant form handling for log-post screen     |

### 5.2 Backend (Supabase)

| Layer            | Service                        | Purpose                                                |
| ---------------- | ------------------------------ | ------------------------------------------------------ |
| Auth             | Supabase Auth                  | Email/password, magic link, Apple SSO, Google SSO      |
| Database         | Supabase Postgres              | Relational data with Row Level Security (RLS)          |
| Serverless Logic | Supabase Edge Functions (Deno) | Streak checks, notification dispatch, weekly summaries |
| Scheduled Jobs   | `pg_cron` extension            | Nightly streak recalculation, weekly digest trigger    |
| Realtime         | Not needed at MVP              | No collaborative or live features                      |
| Storage          | Not needed at MVP              | No file/image uploads                                  |

### 5.3 Infrastructure & DevOps

| Layer             | Tool                       | Purpose                                              |
| ----------------- | -------------------------- | ---------------------------------------------------- |
| Builds            | EAS Build                  | Cloud builds for iOS (.ipa) and Android (.aab)       |
| OTA Updates       | EAS Update                 | Push JS bundle updates without app store review      |
| Error Tracking    | Sentry (`sentry-expo`)     | Crash reports, breadcrumbs, performance monitoring   |
| Product Analytics | PostHog (React Native SDK) | Feature usage, onboarding funnels, retention cohorts |
| CI/CD             | GitHub Actions → EAS Build | Auto-build on merge to `main`                        |
| Source Control    | GitHub                     | Monorepo with conventional commits                   |

### 5.4 Cost Breakdown (MVP Scale)

| Service                 | Free Tier Limit   | Monthly Cost | Notes                         |
| ----------------------- | ----------------- | ------------ | ----------------------------- |
| Supabase                | 50K MAU, 500MB DB | $0           | Sufficient for first 1K users |
| RevenueCat              | < $2.5K MRR       | $0           | 1% rev share after threshold  |
| Expo / EAS              | 30 builds/month   | $0           | Free tier covers MVP          |
| Sentry                  | 5K events/month   | $0           | Upgrade at ~5K DAU            |
| PostHog                 | 1M events/month   | $0           | Generous free tier            |
| Apple Developer Account | —                 | $99/year     | Required for App Store        |
| Google Play Developer   | —                 | $25 one-time | Required for Play Store       |
| **Total Year 1**        |                   | **~$124**    |                               |

---

## 6. Database Design (Supabase)

### 6.1 Entity Relationship Diagram

```
┌─────────────────────┐
│       profiles       │
│─────────────────────│
│ id (PK, FK→auth)    │        ┌──────────────────────┐
│ display_name         │        │  platform_configs     │
│ avatar_url           │        │──────────────────────│
│ timezone             │◄───────│ id (PK)              │
│ subscription_tier    │  1:N   │ user_id (FK)         │
│ subscription_exp     │        │ platform             │
│ onboarding_done      │        │ weekly_goal          │
│ created_at           │        │ is_active            │
│ updated_at           │        │ reminder_enabled     │
└──────────┬──────────┘        │ reminder_time        │
           │                    │ created_at           │
           │                    └──────────────────────┘
           │
           │ 1:N        ┌──────────────────────┐
           ├────────────│     post_logs         │
           │            │──────────────────────│
           │            │ id (PK)              │
           │            │ user_id (FK)         │
           │            │ platform             │
           │            │ content_type         │
           │            │ title                │
           │            │ post_url             │
           │            │ posted_at            │
           │            │ logged_at            │
           │            │ views                │
           │            │ likes                │
           │            │ comments_count       │
           │            │ shares               │
           │            │ synced               │
           │            └──────────────────────┘
           │
           │ 1:N        ┌──────────────────────┐
           ├────────────│      streaks          │
           │            │──────────────────────│
           │            │ id (PK)              │
           │            │ user_id (FK)         │
           │            │ platform             │
           │            │ current_streak       │
           │            │ longest_streak       │
           │            │ streak_start_date    │
           │            │ last_post_date       │
           │            │ freeze_used_this_week│
           │            │ freeze_date          │
           │            │ updated_at           │
           │            └──────────────────────┘
           │
           │ 1:1        ┌──────────────────────┐
           └────────────│ notification_prefs    │
                        │──────────────────────│
                        │ user_id (PK, FK)     │
                        │ daily_reminder       │
                        │ daily_reminder_time  │
                        │ streak_at_risk       │
                        │ weekly_summary       │
                        │ weekly_summary_day   │
                        │ milestones           │
                        │ push_token           │
                        │ updated_at           │
                        └──────────────────────┘
```

### 6.2 SQL Schema

```sql
-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with app-specific fields.
-- Automatically created via a trigger on auth.users insert.
-- ============================================================
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  timezone      TEXT NOT NULL DEFAULT 'UTC',
  subscription_tier  TEXT NOT NULL DEFAULT 'free'
                     CHECK (subscription_tier IN ('free', 'pro')),
  subscription_expires_at  TIMESTAMPTZ,
  onboarding_completed     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- PLATFORM CONFIGS
-- Per-platform goals and reminder settings for each user.
-- ============================================================
CREATE TABLE public.platform_configs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform         TEXT NOT NULL CHECK (platform IN ('linkedin', 'tiktok', 'youtube')),
  weekly_goal      INTEGER NOT NULL DEFAULT 3 CHECK (weekly_goal BETWEEN 1 AND 14),
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_time    TIME NOT NULL DEFAULT '09:00',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, platform)
);

CREATE INDEX idx_platform_configs_user ON public.platform_configs(user_id);


-- ============================================================
-- POST LOGS
-- Every content post a creator logs. Core data table.
-- ============================================================
CREATE TABLE public.post_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL CHECK (platform IN ('linkedin', 'tiktok', 'youtube')),
  content_type    TEXT NOT NULL,
  title           TEXT,
  post_url        TEXT,
  posted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metrics (nullable — optional user input)
  views           INTEGER CHECK (views >= 0),
  likes           INTEGER CHECK (likes >= 0),
  comments_count  INTEGER CHECK (comments_count >= 0),
  shares          INTEGER CHECK (shares >= 0),

  -- Sync flag for offline-first
  synced          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_post_logs_user_date ON public.post_logs(user_id, posted_at DESC);
CREATE INDEX idx_post_logs_user_platform ON public.post_logs(user_id, platform);


-- ============================================================
-- STREAKS
-- Tracks current and best streaks per platform + overall.
-- ============================================================
CREATE TABLE public.streaks (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform              TEXT NOT NULL
                        CHECK (platform IN ('linkedin', 'tiktok', 'youtube', 'overall')),
  current_streak        INTEGER NOT NULL DEFAULT 0,
  longest_streak        INTEGER NOT NULL DEFAULT 0,
  streak_start_date     DATE,
  last_post_date        DATE,
  freeze_used_this_week BOOLEAN NOT NULL DEFAULT FALSE,
  freeze_date           DATE,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, platform)
);

CREATE INDEX idx_streaks_user ON public.streaks(user_id);


-- ============================================================
-- NOTIFICATION PREFERENCES
-- One row per user. Controls all push notification behavior.
-- ============================================================
CREATE TABLE public.notification_prefs (
  user_id              UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  daily_reminder       BOOLEAN NOT NULL DEFAULT TRUE,
  daily_reminder_time  TIME NOT NULL DEFAULT '09:00',
  streak_at_risk       BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_summary       BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_summary_day   TEXT NOT NULL DEFAULT 'sunday'
                       CHECK (weekly_summary_day IN (
                         'monday','tuesday','wednesday','thursday',
                         'friday','saturday','sunday'
                       )),
  milestones           BOOLEAN NOT NULL DEFAULT TRUE,
  push_token           TEXT,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- updated_at TRIGGER (reusable)
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_notification_prefs_updated_at
  BEFORE UPDATE ON public.notification_prefs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

### 6.3 Row Level Security (RLS) Policies

Every table has RLS enabled. Users can only access their own data.

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;

-- ─── PROFILES ────────────────────────────────────────────────
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── PLATFORM CONFIGS ────────────────────────────────────────
CREATE POLICY "Users can CRUD own platform configs"
  ON public.platform_configs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── POST LOGS ───────────────────────────────────────────────
CREATE POLICY "Users can CRUD own post logs"
  ON public.post_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── STREAKS ─────────────────────────────────────────────────
CREATE POLICY "Users can read own streaks"
  ON public.streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON public.streaks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert/delete managed by edge functions (service role)

-- ─── NOTIFICATION PREFS ──────────────────────────────────────
CREATE POLICY "Users can CRUD own notification prefs"
  ON public.notification_prefs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 6.4 Supabase Edge Functions

| Function Name       | Trigger                       | Description                                                                                                                                                  |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `calculate-streaks` | `pg_cron` (daily, 00:05 UTC)  | Iterates all users, recalculates streaks based on `post_logs`. Resets streaks where no post exists for previous day (user timezone). Applies streak freezes. |
| `send-notification` | Called by other functions     | Accepts `user_id`, `title`, `body`, reads `push_token` from `notification_prefs`, sends via Expo Push API.                                                   |
| `streak-at-risk`    | `pg_cron` (hourly, :30)       | Finds users whose streak will expire in < 3 hours and who have `streak_at_risk = true`. Calls `send-notification`.                                           |
| `weekly-summary`    | `pg_cron` (Sundays 18:00 UTC) | Aggregates weekly post counts per platform per user. Sends summary notification to users with `weekly_summary = true`.                                       |
| `reset-freeze`      | `pg_cron` (Mondays 00:00 UTC) | Resets `freeze_used_this_week` to `false` on all streak records.                                                                                             |

---

## 7. Core Algorithms & Business Logic

### 7.1 Streak Calculation

```typescript
// utils/streakCalculator.ts

import {
  startOfDay,
  subDays,
  isEqual,
  differenceInCalendarDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface StreakInput {
  postDates: Date[]; // All posted_at dates for a user+platform
  timezone: string; // e.g., 'Africa/Lagos'
  freezeDate: Date | null; // Date when freeze was used this week
}

interface StreakResult {
  currentStreak: number;
  streakStartDate: Date | null;
  lastPostDate: Date | null;
}

export function calculateStreak(input: StreakInput): StreakResult {
  const { postDates, timezone, freezeDate } = input;

  if (postDates.length === 0) {
    return { currentStreak: 0, streakStartDate: null, lastPostDate: null };
  }

  // Normalize all dates to user's local timezone, then to start-of-day
  const localDays = postDates
    .map((d) => startOfDay(toZonedTime(d, timezone)))
    .sort((a, b) => b.getTime() - a.getTime()); // Most recent first

  // Deduplicate (multiple posts on same day = 1 streak day)
  const uniqueDays: Date[] = [];
  for (const day of localDays) {
    if (
      uniqueDays.length === 0 ||
      !isEqual(day, uniqueDays[uniqueDays.length - 1])
    ) {
      uniqueDays.push(day);
    }
  }

  const today = startOfDay(toZonedTime(new Date(), timezone));
  const mostRecentPost = uniqueDays[0];

  // If most recent post is older than yesterday (and no freeze), streak = 0
  const daysSinceLastPost = differenceInCalendarDays(today, mostRecentPost);

  if (daysSinceLastPost > 1) {
    // Check if freeze covers the gap
    if (freezeDate && daysSinceLastPost === 2) {
      const freezeLocal = startOfDay(toZonedTime(freezeDate, timezone));
      const missedDay = subDays(today, 1);
      if (isEqual(freezeLocal, missedDay)) {
        // Freeze covers yesterday — streak continues
        // Fall through to counting
      } else {
        return {
          currentStreak: 0,
          streakStartDate: null,
          lastPostDate: mostRecentPost,
        };
      }
    } else {
      return {
        currentStreak: 0,
        streakStartDate: null,
        lastPostDate: mostRecentPost,
      };
    }
  }

  // Count consecutive days backwards from most recent
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const expected = subDays(uniqueDays[i - 1], 1);
    if (isEqual(uniqueDays[i], expected)) {
      streak++;
    } else {
      break;
    }
  }

  const streakStartDate =
    uniqueDays[Math.min(streak - 1, uniqueDays.length - 1)];

  return {
    currentStreak: streak,
    streakStartDate,
    lastPostDate: mostRecentPost,
  };
}
```

### 7.2 Weekly Goal Progress

```typescript
// utils/goalProgress.ts

import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface GoalProgress {
  platform: string;
  postsThisWeek: number;
  weeklyGoal: number;
  percentage: number; // 0–100, capped at 100
  isComplete: boolean;
}

export function calculateWeeklyProgress(
  postLogs: { platform: string; posted_at: Date }[],
  platformConfigs: { platform: string; weekly_goal: number }[],
  timezone: string,
): GoalProgress[] {
  const now = toZonedTime(new Date(), timezone);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  return platformConfigs.map((config) => {
    const postsThisWeek = postLogs.filter(
      (log) =>
        log.platform === config.platform &&
        isWithinInterval(toZonedTime(log.posted_at, timezone), {
          start: weekStart,
          end: weekEnd,
        }),
    ).length;

    const percentage = Math.min(
      Math.round((postsThisWeek / config.weekly_goal) * 100),
      100,
    );

    return {
      platform: config.platform,
      postsThisWeek,
      weeklyGoal: config.weekly_goal,
      percentage,
      isComplete: postsThisWeek >= config.weekly_goal,
    };
  });
}
```

### 7.3 Milestone Thresholds

```typescript
// constants/milestones.ts

export const STREAK_MILESTONES = [7, 14, 21, 30, 60, 90, 180, 365] as const;

export type MilestoneType = (typeof STREAK_MILESTONES)[number];

export const MILESTONE_MESSAGES: Record<MilestoneType, string> = {
  7: "1 week strong! You're building a real habit.",
  14: "2 weeks! Most creators quit by now. Not you.",
  21: "21 days — they say it takes this long to form a habit.",
  30: "30-DAY STREAK! You're in the top 10% of creators.",
  60: "60 days of consistency. This is who you are now.",
  90: "A full quarter of daily posting. Legendary.",
  180: "Half a year. Your audience notices. The algorithm notices.",
  365: "365 DAYS. One full year. You are unstoppable.",
};

export function checkMilestone(streak: number): MilestoneType | null {
  return STREAK_MILESTONES.includes(streak as MilestoneType)
    ? (streak as MilestoneType)
    : null;
}
```

---

## 8. Notification System

### 8.1 Notification Types & Triggers

```
┌──────────────────────────────────────────────────────────────────────┐
│                      NOTIFICATION PIPELINE                          │
│                                                                     │
│  ┌─────────────────┐    ┌────────────────┐    ┌──────────────────┐  │
│  │   pg_cron        │───▶│ Edge Function  │───▶│ Expo Push API   │  │
│  │   (Scheduler)    │    │ (Logic)        │    │ (Delivery)      │  │
│  └─────────────────┘    └────────────────┘    └──────────────────┘  │
│                                                                     │
│  Schedules:                                                         │
│  • Every hour :30  → streak-at-risk check                          │
│  • Daily 00:05 UTC → streak recalculation                          │
│  • Monday 00:00    → reset weekly freeze flags                     │
│  • Sunday 18:00    → weekly summary generation                     │
│                                                                     │
│  Client-side (local notifications):                                │
│  • Daily reminder at user-configured time                          │
│  • Milestone celebration (triggered on post log)                   │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

### 8.2 Notification Content Templates

| Type           | Title                    | Body                                                                      | Trigger                                  |
| -------------- | ------------------------ | ------------------------------------------------------------------------- | ---------------------------------------- |
| Daily Reminder | `📝 Time to create`      | `You haven't logged a post today. Your {platform} streak is at {n} days!` | Local notification at user's chosen time |
| Streak at Risk | `⚠️ Streak ending soon`  | `Your {platform} streak of {n} days expires in 3 hours. Post now!`        | Edge function, hourly check              |
| Streak Lost    | `💔 Streak reset`        | `Your {platform} streak was reset. Start a new one today!`                | Edge function, daily recalc              |
| Weekly Summary | `📊 Your week in review` | `This week: {li}x LinkedIn, {tt}x TikTok, {yt}x YouTube. {status}`        | Edge function, Sunday evening            |
| Milestone      | `🎉 {n}-day streak!`     | `{milestone_message}`                                                     | Client-side, on post log                 |

### 8.3 Expo Push API Integration

```typescript
// services/pushNotification.ts (Edge Function)

interface ExpoPushMessage {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound: "default";
  badge?: number;
}

async function sendPushNotification(message: ExpoPushMessage): Promise<void> {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Expo Push API error:", error);
    throw new Error(`Push failed: ${response.status}`);
  }
}
```

---

## 9. Offline-First Sync Strategy

### 9.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     OFFLINE-FIRST FLOW                          │
│                                                                 │
│  User taps "LOG IT"                                             │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │  Save to MMKV │ ◄─── Immediate, always succeeds             │
│  │  (local cache)│                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐     ┌──────────────────┐                      │
│  │  Online?      │──Y─▶│  Sync to Supabase │                    │
│  └──────┬───────┘     │  (upsert)         │                    │
│         │ N           └────────┬─────────┘                      │
│         ▼                      │                                │
│  ┌──────────────┐              ▼                                │
│  │  Add to sync  │     ┌──────────────────┐                     │
│  │  queue (MMKV) │     │  Mark synced=true │                    │
│  └──────┬───────┘     └──────────────────┘                      │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │  NetInfo      │ ◄─── Listener fires when connectivity       │
│  │  listener     │      is restored                             │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │  Flush queue  │ ─── Process all unsynced items               │
│  │  to Supabase  │                                               │
│  └──────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Sync Queue Implementation

```typescript
// services/syncQueue.ts

import { MMKV } from "react-native-mmkv";
import NetInfo from "@react-native-community/netinfo";
import { supabase } from "./supabase";

const storage = new MMKV({ id: "sync-queue" });
const QUEUE_KEY = "pending_post_logs";

interface QueuedPost {
  localId: string;
  payload: PostLogInsert;
  createdAt: number;
}

export function enqueue(post: PostLogInsert): void {
  const queue = getQueue();
  queue.push({
    localId: crypto.randomUUID(),
    payload: post,
    createdAt: Date.now(),
  });
  storage.set(QUEUE_KEY, JSON.stringify(queue));
}

export function getQueue(): QueuedPost[] {
  const raw = storage.getString(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function flushQueue(): Promise<void> {
  const queue = getQueue();
  if (queue.length === 0) return;

  const { isConnected } = await NetInfo.fetch();
  if (!isConnected) return;

  const remaining: QueuedPost[] = [];

  for (const item of queue) {
    const { error } = await supabase.from("post_logs").insert(item.payload);

    if (error) {
      console.error("Sync failed for", item.localId, error);
      remaining.push(item); // Retry later
    }
  }

  storage.set(QUEUE_KEY, JSON.stringify(remaining));
}

// Initialize listener on app start
export function initSyncListener(): void {
  NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      flushQueue();
    }
  });
}
```

---

## 10. Project Structure

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

### Environment Variables

```bash
# .env.example

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# RevenueCat
REVENUECAT_APPLE_API_KEY=appl_xxxxx
REVENUECAT_GOOGLE_API_KEY=goog_xxxxx

# Sentry
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# PostHog
POSTHOG_API_KEY=phc_xxxxx
POSTHOG_HOST=https://app.posthog.com
```

---

## 11. UI/UX Technical Spec

### 11.1 Design Tokens

```typescript
// constants/colors.ts

export const colors = {
  // ─── Backgrounds ───────────────────────────────────────
  dark: {
    bg: "#0D0D0D", // Primary background
    bgElevated: "#1A1A1A", // Cards, sheets
    bgSubtle: "#262626", // Input fields, secondary surfaces
  },
  light: {
    bg: "#FAFAFA",
    bgElevated: "#FFFFFF",
    bgSubtle: "#F0F0F0",
  },

  // ─── Brand & Accent ────────────────────────────────────
  primary: "#7C3AED", // Electric violet — buttons, links
  primaryDark: "#6D28D9", // Pressed state
  primaryLight: "#A78BFA", // Disabled / subtle

  // ─── Semantic ──────────────────────────────────────────
  streakActive: "#F59E0B", // Amber — fire / energy
  success: "#10B981", // Emerald — logged / complete
  warning: "#EF4444", // Coral — streak at risk
  info: "#3B82F6", // Blue — informational

  // ─── Platform Colors ──────────────────────────────────
  linkedin: "#0A66C2",
  tiktok: "#FE2C55", // Pink-red accent (on dark bg)
  youtube: "#FF0000",

  // ─── Text ──────────────────────────────────────────────
  textPrimary: "#FFFFFF", // Dark mode
  textSecondary: "#A0A0A0",
  textMuted: "#666666",
} as const;
```

### 11.2 Typography Scale

```typescript
// constants/typography.ts

export const typography = {
  // ─── Font Families ─────────────────────────────────────
  sans: "Inter-Regular",
  sansBold: "Inter-Bold",
  mono: "DMMono-Regular",

  // ─── Size Scale ────────────────────────────────────────
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 22,
  "2xl": 28,
  "3xl": 36, // Streak counter display
  "4xl": 48, // Hero numbers

  // ─── Line Heights ──────────────────────────────────────
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;
```

### 11.3 Icon Map (Lucide)

| Context            | Icon Name       | Usage                                                   |
| ------------------ | --------------- | ------------------------------------------------------- |
| Tab: Home          | `Home`          | Bottom tab navigation                                   |
| Tab: Calendar      | `Calendar`      | Bottom tab navigation                                   |
| Tab: Stats         | `BarChart3`     | Bottom tab navigation                                   |
| Tab: Settings      | `Settings`      | Bottom tab navigation                                   |
| FAB: Log Post      | `Plus`          | Floating action button                                  |
| Platform: LinkedIn | `Linkedin`      | Platform picker, dashboard                              |
| Platform: YouTube  | `Youtube`       | Platform picker, dashboard                              |
| Platform: TikTok   | `Music`         | (Lucide has no TikTok icon — use custom SVG or `Music`) |
| Streak Active      | `Flame`         | Streak counter                                          |
| Streak Frozen      | `Snowflake`     | Freeze indicator                                        |
| Post Logged        | `CheckCircle2`  | Today's status                                          |
| Post Pending       | `Circle`        | Today's status (empty)                                  |
| Metrics: Views     | `Eye`           | Log post form                                           |
| Metrics: Likes     | `Heart`         | Log post form                                           |
| Metrics: Comments  | `MessageCircle` | Log post form                                           |
| Metrics: Shares    | `Share2`        | Log post form                                           |
| Export             | `Download`      | Settings — CSV export                                   |
| Back               | `ArrowLeft`     | Screen headers                                          |
| Expand             | `ChevronDown`   | Collapsible sections                                    |

### 11.4 Screen Wireframes

#### Home Dashboard

```
┌─────────────────────────────────────┐
│  🔥 CreatorLog                  ⚙️  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │      🔥  21                 │    │
│  │      day streak             │    │
│  │      (overall)              │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  TODAY                              │
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │  ✅ ✓   │ │  ⬜     │ │ ⬜    │ │
│  │LinkedIn │ │ TikTok  │ │YouTube│ │
│  └─────────┘ └─────────┘ └───────┘ │
│                                     │
│  THIS WEEK                          │
│  ┌─────────────────────────────┐    │
│  │ 🔵 LinkedIn  ████████░░ 4/5 │    │
│  │ 🔴 TikTok    ████░░░░░░ 2/5 │    │
│  │ 🔴 YouTube   ██░░░░░░░░ 1/3 │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌──────────────┬──────────────┐    │
│  │ 📝 7 posts   │ 📅 31 posts  │    │
│  │  this week   │  this month  │    │
│  └──────────────┴──────────────┘    │
│                                     │
│                          ┌────────┐ │
│                          │ ＋ LOG │ │  ← FAB
│                          └────────┘ │
│                                     │
│  🏠        📅        📊        ⚙️   │
│  Home    Calendar   Stats   Settings│
└─────────────────────────────────────┘
```

#### Log a Post

```
┌─────────────────────────────────────┐
│  ←  Log a Post                      │
│                                     │
│  PLATFORM                           │
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │ 🔵 LI   │ │   TT    │ │  YT   │ │
│  │(selected)│ │         │ │       │ │
│  └─────────┘ └─────────┘ └───────┘ │
│                                     │
│  CONTENT TYPE                       │
│  ┌──────────┐ ┌──────────┐         │
│  │ 📄 Text  │ │ 🖼 Crsll │         │
│  │ (selected)│ │          │         │
│  └──────────┘ └──────────┘         │
│  ┌──────────┐ ┌──────────┐         │
│  │ 🎬 Video │ │ 📊 Poll  │         │
│  └──────────┘ └──────────┘         │
│                                     │
│  TOPIC                              │
│  ┌─────────────────────────────┐    │
│  │  e.g. "5 React tips"       │    │
│  └─────────────────────────────┘    │
│                                     │
│  LINK (optional)                    │
│  ┌─────────────────────────────┐    │
│  │  Paste URL...               │    │
│  └─────────────────────────────┘    │
│                                     │
│  ▼ Add metrics                      │
│  ┌──────────────┬──────────────┐    │
│  │ 👁 Views     │ ❤️ Likes     │    │
│  │ [        ]   │ [        ]   │    │
│  ├──────────────┼──────────────┤    │
│  │ 💬 Comments  │ 🔄 Shares    │    │
│  │ [        ]   │ [        ]   │    │
│  └──────────────┴──────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       🔥  LOG IT             │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### Calendar View

```
┌─────────────────────────────────────┐
│  ←  Calendar                   2026 │
│                                     │
│           ◀  April  ▶              │
│                                     │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│  ┌────┬────┬────┬────┬────┬────┬──┐ │
│  │    │  1 │  2 │  3 │  4 │  5 │ 6│ │
│  │    │ 🔵 │ 🔵 │    │ 🔵 │    │  │ │
│  │    │ 🔴 │    │    │    │    │  │ │
│  ├────┼────┼────┼────┼────┼────┼──┤ │
│  │  7 │  8 │  9 │ 10 │ 11 │ 12 │13│ │
│  │ 🔵 │ 🔴 │ 🔵 │ 🔵 │    │ 🔴 │🔴│ │
│  │    │    │ 🔴 │    │    │    │  │ │
│  ├────┼────┼────┼────┼────┼────┼──┤ │
│  │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │20│ │
│  │ 🔵 │    │ 🔴 │ 🔵 │ ❄️ │    │  │ │
│  │ 🔴 │    │    │ 🟥 │    │    │  │ │
│  ├────┼────┼────┼────┼────┼────┼──┤ │
│  │ 21 │ 22 │ 23 │ 24 │ 25 │ 26 │27│ │
│  │    │    │    │    │    │    │  │ │
│  └────┴────┴────┴────┴────┴────┴──┘ │
│                                     │
│  LEGEND                             │
│  🔵 LinkedIn   🔴 TikTok           │
│  🟥 YouTube    ❄️ Freeze used       │
│                                     │
│  🏠        📅        📊        ⚙️   │
└─────────────────────────────────────┘
```

#### Stats

```
┌─────────────────────────────────────┐
│  ←  Stats                           │
│                                     │
│  POSTS PER PLATFORM (4 weeks)       │
│  ┌─────────────────────────────┐    │
│  │  16 ┤                       │    │
│  │  12 ┤  ██                   │    │
│  │   8 ┤  ██  ██               │    │
│  │   4 ┤  ██  ██  ██           │    │
│  │   0 ┤──██──██──██──         │    │
│  │      LinkedIn TT  YT        │    │
│  └─────────────────────────────┘    │
│                                     │
│  STREAKS                            │
│  ┌─────────────────────────────┐    │
│  │ 🔵 LinkedIn   🔥 12 days    │    │
│  │               Best: 28 days │    │
│  ├─────────────────────────────┤    │
│  │ 🔴 TikTok     🔥  5 days    │    │
│  │               Best: 14 days │    │
│  ├─────────────────────────────┤    │
│  │ 🟥 YouTube    🔥  2 days    │    │
│  │               Best:  9 days │    │
│  └─────────────────────────────┘    │
│                                     │
│  INSIGHTS                           │
│  ┌──────────────┬──────────────┐    │
│  │ 📅 Best day  │ 📈 Trend     │    │
│  │   Tuesday    │   ↑ 52%      │    │
│  │              │  vs last mo  │    │
│  └──────────────┴──────────────┘    │
│                                     │
│  🏠        📅        📊        ⚙️   │
└─────────────────────────────────────┘
```

### Screenshots

Refer to the screenshots below as a base for the Home Dashboard Screen design with its different ui states. Important: Your design should be exactly as it appears in the screenshot based on the different ui states:

#### 1. Dasboard core states (darkmode, light mode, e.t.c)

@context/screenshots/dashboard-core-states.png

#### 2. Dashboard streak narrative

@context/screenshots/dashboard-streak-narrative.png

#### 2. Dashboard interactions

@context/screenshots/dashboard-interactions.png

### 11.5 Animation Specifications

| Animation         | Library                   | Trigger           | Duration | Details                                 |
| ----------------- | ------------------------- | ----------------- | -------- | --------------------------------------- |
| Streak flame      | `lottie-react-native`     | Streak > 0, loops | 2s loop  | Subtle orange/amber flame behind number |
| Progress bar fill | `react-native-reanimated` | On data load      | 600ms    | Ease-out spring animation               |
| Confetti burst    | `lottie-react-native`     | Milestone hit     | 3s       | Full-screen confetti overlay            |
| Log success check | `react-native-reanimated` | Post logged       | 400ms    | Scale-up + fade-in checkmark            |
| Haptic feedback   | `expo-haptics`            | Post logged       | —        | `Haptics.notificationAsync(Success)`    |
| Card press        | `react-native-reanimated` | Touch start/end   | 150ms    | Scale to 0.97, opacity to 0.8           |

---

## 12. Key Reference Documentation

| Resource                   | URL                                                                   | Used For                    |
| -------------------------- | --------------------------------------------------------------------- | --------------------------- |
| Expo Docs                  | https://docs.expo.dev                                                 | Core framework reference    |
| Expo Router                | https://docs.expo.dev/router/introduction                             | File-based navigation       |
| Expo Notifications         | https://docs.expo.dev/push-notifications/overview                     | Push notification setup     |
| Expo Haptics               | https://docs.expo.dev/versions/latest/sdk/haptics                     | Vibration feedback          |
| Supabase JS Client         | https://supabase.com/docs/reference/javascript                        | Database CRUD, auth         |
| Supabase Auth (RN)         | https://supabase.com/docs/guides/auth/quickstarts/react-native        | Authentication setup        |
| Supabase Edge Functions    | https://supabase.com/docs/guides/functions                            | Serverless streak logic     |
| Supabase RLS               | https://supabase.com/docs/guides/database/postgres/row-level-security | Security policies           |
| RevenueCat React Native    | https://www.revenuecat.com/docs/reactnative                           | Subscription management     |
| Zustand                    | https://docs.pmnd.rs/zustand                                          | State management            |
| react-native-mmkv          | https://github.com/mrousavy/react-native-mmkv                         | Fast local storage          |
| react-native-calendars     | https://github.com/wix/react-native-calendars                         | Calendar component          |
| react-native-gifted-charts | https://github.com/nicekiwi/react-native-gifted-charts                | Charts & data visualization |
| react-native-reanimated    | https://docs.swmansion.com/react-native-reanimated                    | Animations                  |
| lucide-react-native        | https://lucide.dev/guide/packages/lucide-react-native                 | Icon library                |
| date-fns                   | https://date-fns.org/docs                                             | Date manipulation           |
| date-fns-tz                | https://github.com/marnusw/date-fns-tz                                | Timezone conversions        |
| Expo Push API              | https://docs.expo.dev/push-notifications/sending-notifications        | Server-side push            |
| EAS Build                  | https://docs.expo.dev/build/introduction                              | Cloud builds                |
| EAS Update                 | https://docs.expo.dev/eas-update/introduction                         | OTA updates                 |
| Lottie React Native        | https://github.com/lottie-react-native/lottie-react-native            | JSON animations             |
| PostHog React Native       | https://posthog.com/docs/libraries/react-native                       | Product analytics           |
| Sentry Expo                | https://docs.sentry.io/platforms/react-native/manual-setup/expo       | Error tracking              |
| react-hook-form            | https://react-hook-form.com/get-started                               | Form management             |

---

_Document version: 1.0_
_Last updated: April 2026_
