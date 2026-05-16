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
