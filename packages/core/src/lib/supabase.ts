import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Import the complete database types
export type { Database } from '../types/database'

export type LegacyDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string  // References auth.users(id), not separate user_id
          email: string
          full_name: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          timezone: string
          language: string
          status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          onboarding_completed: boolean
          onboarding_step: number
          email_verified_at: string | null
          last_login_at: string | null
          current_world_id: string | null
          current_persona_id: string | null
          persona_selected_at: string | null
          persona_changes_count: number
          last_persona_change_at: string | null
          total_xp: number  // Correct field name from schema
          current_level: number  // Correct field name from schema
          level_progress: number
          theme: 'light' | 'dark' | 'system'
          notifications_enabled: boolean
          marketing_emails: boolean
          privacy_analytics: boolean
          privacy_marketing: boolean
          privacy_personalization: boolean
          data_processing_consent: boolean
          data_processing_consent_at: string | null
          subscription_tier: 'free' | 'pro' | 'enterprise'
          subscription_expires_at: string | null
          trial_used: boolean
          trial_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string  // Required - references auth.users(id)
          email: string
          full_name: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          timezone?: string
          language?: string
          status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          onboarding_completed?: boolean
          onboarding_step?: number
          email_verified_at?: string | null
          last_login_at?: string | null
          current_world_id?: string | null
          current_persona_id?: string | null
          persona_selected_at?: string | null
          persona_changes_count?: number
          last_persona_change_at?: string | null
          total_xp?: number
          current_level?: number
          level_progress?: number
          theme?: 'light' | 'dark' | 'system'
          notifications_enabled?: boolean
          marketing_emails?: boolean
          privacy_analytics?: boolean
          privacy_marketing?: boolean
          privacy_personalization?: boolean
          data_processing_consent?: boolean
          data_processing_consent_at?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          subscription_expires_at?: string | null
          trial_used?: boolean
          trial_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          timezone?: string
          language?: string
          status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          onboarding_completed?: boolean
          onboarding_step?: number
          email_verified_at?: string | null
          last_login_at?: string | null
          current_world_id?: string | null
          current_persona_id?: string | null
          persona_selected_at?: string | null
          persona_changes_count?: number
          last_persona_change_at?: string | null
          total_xp?: number
          current_level?: number
          level_progress?: number
          theme?: 'light' | 'dark' | 'system'
          notifications_enabled?: boolean
          marketing_emails?: boolean
          privacy_analytics?: boolean
          privacy_marketing?: boolean
          privacy_personalization?: boolean
          data_processing_consent?: boolean
          data_processing_consent_at?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          subscription_expires_at?: string | null
          trial_used?: boolean
          trial_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      worlds: {
        Row: {
          id: string
          code: string
          name: string
          description: string
          color_primary: string
          color_secondary: string
          icon_name: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description: string
          color_primary: string
          color_secondary: string
          icon_name: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string
          color_primary?: string
          color_secondary?: string
          icon_name?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      personas: {
        Row: {
          id: string
          world_id: string
          code: string
          name: string
          description: string
          characteristics: any[] // JSON array
          gamification_style: string
          xp_multiplier: number
          unlock_level: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          world_id: string
          code: string
          name: string
          description: string
          characteristics?: any[]
          gamification_style: string
          xp_multiplier?: number
          unlock_level?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          world_id?: string
          code?: string
          name?: string
          description?: string
          characteristics?: any[]
          gamification_style?: string
          xp_multiplier?: number
          unlock_level?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_personas: {
        Row: {
          id: string
          user_id: string
          persona_id: string
          selected_at: string
          last_used_at: string
          total_usage_hours: number
          times_selected: number
          persona_xp: number
          persona_level: number
          achievements_unlocked: number
          goals_completed: number
          streaks_maintained: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          persona_id: string
          selected_at?: string
          last_used_at?: string
          total_usage_hours?: number
          times_selected?: number
          persona_xp?: number
          persona_level?: number
          achievements_unlocked?: number
          goals_completed?: number
          streaks_maintained?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          persona_id?: string
          selected_at?: string
          last_used_at?: string
          total_usage_hours?: number
          times_selected?: number
          persona_xp?: number
          persona_level?: number
          achievements_unlocked?: number
          goals_completed?: number
          streaks_maintained?: number
          created_at?: string
          updated_at?: string
        }
      }
      xp_events: {
        Row: {
          id: string
          user_id: string
          persona_id: string | null
          event_type: string
          event_category: string
          xp_awarded: number
          multiplier_applied: number
          base_xp: number
          event_data: any // JSON object
          source_id: string | null
          description: string | null
          occurred_at: string
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          persona_id?: string | null
          event_type: string
          event_category: string
          xp_awarded: number
          multiplier_applied?: number
          base_xp: number
          event_data?: any
          source_id?: string | null
          description?: string | null
          occurred_at?: string
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          persona_id?: string | null
          event_type?: string
          event_category?: string
          xp_awarded?: number
          multiplier_applied?: number
          base_xp?: number
          event_data?: any
          source_id?: string | null
          description?: string | null
          occurred_at?: string
          processed_at?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          code: string
          name: string
          description: string
          icon_name: string
          category: string
          difficulty: 'easy' | 'medium' | 'hard' | 'epic'
          required_level: number
          required_persona_id: string | null
          required_world_id: string | null
          xp_reward: number
          unlocks_feature: string | null
          badge_color: string | null
          unlock_conditions: any // JSON object
          is_active: boolean
          is_hidden: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          persona_id: string | null
          progress_current: number
          progress_required: number
          progress_percentage: number
          status: 'not_started' | 'in_progress' | 'completed'
          completed_at: string | null
          notified_at: string | null
          completion_context: any // JSON object
          created_at: string
          updated_at: string
        }
      }
    }
  }
}