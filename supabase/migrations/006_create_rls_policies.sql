-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only read/write rows owned by them (auth.uid()).
-- Edge functions use service_role for admin writes.
-- ============================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_configs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_prefs  ENABLE ROW LEVEL SECURITY;

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
-- Inserts/deletes are managed by edge functions (service_role).
CREATE POLICY "Users can read own streaks"
  ON public.streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON public.streaks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── NOTIFICATION PREFS ──────────────────────────────────────
CREATE POLICY "Users can CRUD own notification prefs"
  ON public.notification_prefs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
