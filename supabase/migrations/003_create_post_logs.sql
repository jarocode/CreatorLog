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

  -- Optional metrics
  views           INTEGER CHECK (views >= 0),
  likes           INTEGER CHECK (likes >= 0),
  comments_count  INTEGER CHECK (comments_count >= 0),
  shares          INTEGER CHECK (shares >= 0),

  -- Sync flag for offline-first
  synced          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_post_logs_user_date ON public.post_logs(user_id, posted_at DESC);
CREATE INDEX idx_post_logs_user_platform ON public.post_logs(user_id, platform);
