// ============================================================
// Database types — generated from Supabase schema.
//
// To regenerate from the live project:
//   supabase gen types typescript --linked > types/database.ts
//
// This file is a hand-written stub matching migrations 001–006.
// Replace with generated output once the project is linked.
// ============================================================

export type Platform = 'linkedin' | 'tiktok' | 'youtube';
export type StreakPlatform = Platform | 'overall';
export type SubscriptionTier = 'free' | 'pro';
export type WeeklySummaryDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          timezone: string;
          subscription_tier: SubscriptionTier;
          subscription_expires_at: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string | null;
          timezone?: string;
          subscription_tier?: SubscriptionTier;
          subscription_expires_at?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      platform_configs: {
        Row: {
          id: string;
          user_id: string;
          platform: Platform;
          weekly_goal: number;
          is_active: boolean;
          reminder_enabled: boolean;
          reminder_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: Platform;
          weekly_goal?: number;
          is_active?: boolean;
          reminder_enabled?: boolean;
          reminder_time?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['platform_configs']['Insert']>;
      };
      post_logs: {
        Row: {
          id: string;
          user_id: string;
          platform: Platform;
          content_type: string;
          title: string | null;
          post_url: string | null;
          posted_at: string;
          logged_at: string;
          views: number | null;
          likes: number | null;
          comments_count: number | null;
          shares: number | null;
          synced: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: Platform;
          content_type: string;
          title?: string | null;
          post_url?: string | null;
          posted_at?: string;
          logged_at?: string;
          views?: number | null;
          likes?: number | null;
          comments_count?: number | null;
          shares?: number | null;
          synced?: boolean;
        };
        Update: Partial<Database['public']['Tables']['post_logs']['Insert']>;
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          platform: StreakPlatform;
          current_streak: number;
          longest_streak: number;
          streak_start_date: string | null;
          last_post_date: string | null;
          freeze_used_this_week: boolean;
          freeze_date: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: StreakPlatform;
          current_streak?: number;
          longest_streak?: number;
          streak_start_date?: string | null;
          last_post_date?: string | null;
          freeze_used_this_week?: boolean;
          freeze_date?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['streaks']['Insert']>;
      };
      notification_prefs: {
        Row: {
          user_id: string;
          daily_reminder: boolean;
          daily_reminder_time: string;
          streak_at_risk: boolean;
          weekly_summary: boolean;
          weekly_summary_day: WeeklySummaryDay;
          milestones: boolean;
          push_token: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          daily_reminder?: boolean;
          daily_reminder_time?: string;
          streak_at_risk?: boolean;
          weekly_summary?: boolean;
          weekly_summary_day?: WeeklySummaryDay;
          milestones?: boolean;
          push_token?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['notification_prefs']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
