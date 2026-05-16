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

CREATE TRIGGER set_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
