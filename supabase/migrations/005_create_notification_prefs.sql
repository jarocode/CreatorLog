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

CREATE TRIGGER set_notification_prefs_updated_at
  BEFORE UPDATE ON public.notification_prefs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
