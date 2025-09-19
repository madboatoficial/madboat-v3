
// ⚓ Poseidon's Complete Supabase Types for MadBoat v3
// Generated and enhanced by Poseidon - Database Specialist
// Last updated: 2025-01-15 with Timeline Events Architecture

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string
          email: string
          full_name: string
          status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          auth_provider: string
          last_login_at: string | null
          email_verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id?: string
          email: string
          full_name: string
          status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          auth_provider?: string
          last_login_at?: string | null
          email_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          full_name?: string
          status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          auth_provider?: string
          last_login_at?: string | null
          email_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      persona_types: {
        Row: {
          persona_type_id: string
          display_name: string
          description: string
          category: 'primary' | 'combination' | 'complex'
          population_percentage: number
          rarity_level: 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare'
          business_impact: string | null
          transformation_potential: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          persona_type_id: string
          display_name: string
          description: string
          category?: 'primary' | 'combination' | 'complex'
          population_percentage?: number
          rarity_level?: 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare'
          business_impact?: string | null
          transformation_potential?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          persona_type_id?: string
          display_name?: string
          description?: string
          category?: 'primary' | 'combination' | 'complex'
          population_percentage?: number
          rarity_level?: 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare'
          business_impact?: string | null
          transformation_potential?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      persona_questions: {
        Row: {
          question_id: number
          question: string
          intro_text: string | null
          alert_text: string | null
          sub_text: string | null
          placeholder: string | null
          is_open_ended: boolean
          weight: number
          question_order: number
          category: string
          is_active: boolean
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          question_id?: number
          question: string
          intro_text?: string | null
          alert_text?: string | null
          sub_text?: string | null
          placeholder?: string | null
          is_open_ended?: boolean
          weight?: number
          question_order: number
          category?: string
          is_active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          question_id?: number
          question?: string
          intro_text?: string | null
          alert_text?: string | null
          sub_text?: string | null
          placeholder?: string | null
          is_open_ended?: boolean
          weight?: number
          question_order?: number
          category?: string
          is_active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      persona_question_options: {
        Row: {
          option_id: string
          question_id: number
          letter: string
          option_text: string
          persona_type_id: string | null
          score_weight: number
          option_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          option_id?: string
          question_id: number
          letter: string
          option_text: string
          persona_type_id?: string | null
          score_weight?: number
          option_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          option_id?: string
          question_id?: number
          letter?: string
          option_text?: string
          persona_type_id?: string | null
          score_weight?: number
          option_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "persona_question_options_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "persona_questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "persona_question_options_persona_type_id_fkey"
            columns: ["persona_type_id"]
            referencedRelation: "persona_types"
            referencedColumns: ["persona_type_id"]
          }
        ]
      }
      user_persona_sessions: {
        Row: {
          session_id: string
          user_id: string
          session_type: string
          status: 'in_progress' | 'completed' | 'abandoned'
          started_at: string
          completed_at: string | null
          primary_persona: string | null
          confidence_score: number | null
          persona_composition: string | null
          session_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          session_id?: string
          user_id: string
          session_type?: string
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          primary_persona?: string | null
          confidence_score?: number | null
          persona_composition?: string | null
          session_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          session_id?: string
          user_id?: string
          session_type?: string
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          primary_persona?: string | null
          confidence_score?: number | null
          persona_composition?: string | null
          session_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_persona_sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_persona_sessions_primary_persona_fkey"
            columns: ["primary_persona"]
            referencedRelation: "persona_types"
            referencedColumns: ["persona_type_id"]
          }
        ]
      }
      user_question_responses: {
        Row: {
          response_id: string
          session_id: string
          user_id: string
          question_id: number
          answer_text: string
          selected_option_id: string | null
          typing_metrics: Json | null
          semantic_analysis: Json | null
          response_time_ms: number | null
          calculated_score: number | null
          contributing_personas: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          response_id?: string
          session_id: string
          user_id: string
          question_id: number
          answer_text: string
          selected_option_id?: string | null
          typing_metrics?: Json | null
          semantic_analysis?: Json | null
          response_time_ms?: number | null
          calculated_score?: number | null
          contributing_personas?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          response_id?: string
          session_id?: string
          user_id?: string
          question_id?: number
          answer_text?: string
          selected_option_id?: string | null
          typing_metrics?: Json | null
          semantic_analysis?: Json | null
          response_time_ms?: number | null
          calculated_score?: number | null
          contributing_personas?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_question_responses_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "user_persona_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "user_question_responses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_question_responses_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "persona_questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "user_question_responses_selected_option_id_fkey"
            columns: ["selected_option_id"]
            referencedRelation: "persona_question_options"
            referencedColumns: ["option_id"]
          }
        ]
      }
      user_persona_results: {
        Row: {
          result_id: string
          user_id: string
          session_id: string
          primary_persona: string
          persona_display_name: string
          confidence: number
          description: string
          weighted_scores: Json
          dominant_personas: string[]
          persona_composition: string
          protocol_type: string
          video_url: string | null
          population_percentage: number
          rarity_level: string
          business_impact: string | null
          transformation_potential: string | null
          strengths: string[]
          challenges: string[]
          recommendations: string[]
          is_current: boolean
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          result_id?: string
          user_id: string
          session_id: string
          primary_persona: string
          persona_display_name: string
          confidence: number
          description: string
          weighted_scores: Json
          dominant_personas: string[]
          persona_composition: string
          protocol_type: string
          video_url?: string | null
          population_percentage: number
          rarity_level: string
          business_impact?: string | null
          transformation_potential?: string | null
          strengths?: string[]
          challenges?: string[]
          recommendations?: string[]
          is_current?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          result_id?: string
          user_id?: string
          session_id?: string
          primary_persona?: string
          persona_display_name?: string
          confidence?: number
          description?: string
          weighted_scores?: Json
          dominant_personas?: string[]
          persona_composition?: string
          protocol_type?: string
          video_url?: string | null
          population_percentage?: number
          rarity_level?: string
          business_impact?: string | null
          transformation_potential?: string | null
          strengths?: string[]
          challenges?: string[]
          recommendations?: string[]
          is_current?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_persona_results_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_persona_results_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "user_persona_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "user_persona_results_primary_persona_fkey"
            columns: ["primary_persona"]
            referencedRelation: "persona_types"
            referencedColumns: ["persona_type_id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          user_id: string
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          timezone: string
          language: 'pt-BR' | 'en-US' | 'es-ES'
          onboarding_completed: boolean
          persona_identified: boolean
          alma_phase_current: string
          privacy_analytics: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          timezone?: string
          language?: 'pt-BR' | 'en-US' | 'es-ES'
          onboarding_completed?: boolean
          persona_identified?: boolean
          alma_phase_current?: string
          privacy_analytics?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          timezone?: string
          language?: 'pt-BR' | 'en-US' | 'es-ES'
          onboarding_completed?: boolean
          persona_identified?: boolean
          alma_phase_current?: string
          privacy_analytics?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      event_types: {
        Row: {
          event_type_id: string
          display_name: string
          description: string
          category: 'onboarding' | 'persona' | 'journey' | 'achievement' | 'system' | 'custom'
          icon_name: string | null
          color_hex: string
          is_milestone: boolean
          is_system_generated: boolean
          requires_user_action: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          event_type_id: string
          display_name: string
          description: string
          category: 'onboarding' | 'persona' | 'journey' | 'achievement' | 'system' | 'custom'
          icon_name?: string | null
          color_hex?: string
          is_milestone?: boolean
          is_system_generated?: boolean
          requires_user_action?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          event_type_id?: string
          display_name?: string
          description?: string
          category?: 'onboarding' | 'persona' | 'journey' | 'achievement' | 'system' | 'custom'
          icon_name?: string | null
          color_hex?: string
          is_milestone?: boolean
          is_system_generated?: boolean
          requires_user_action?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          event_id: string
          user_id: string
          event_type_id: string
          title: string
          description: string | null
          event_data: Json | null
          event_date: string
          estimated_date: string | null
          status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived'
          is_visible: boolean
          is_featured: boolean
          source: 'system' | 'user' | 'admin' | 'api' | 'import'
          external_id: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          event_id?: string
          user_id: string
          event_type_id: string
          title: string
          description?: string | null
          event_data?: Json | null
          event_date?: string
          estimated_date?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived'
          is_visible?: boolean
          is_featured?: boolean
          source?: 'system' | 'user' | 'admin' | 'api' | 'import'
          external_id?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          event_id?: string
          user_id?: string
          event_type_id?: string
          title?: string
          description?: string | null
          event_data?: Json | null
          event_date?: string
          estimated_date?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived'
          is_visible?: boolean
          is_featured?: boolean
          source?: 'system' | 'user' | 'admin' | 'api' | 'import'
          external_id?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "timeline_events_event_type_id_fkey"
            columns: ["event_type_id"]
            referencedRelation: "event_types"
            referencedColumns: ["event_type_id"]
          },
          {
            foreignKeyName: "timeline_events_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      create_timeline_event: {
        Args: {
          p_user_id: string
          p_event_type_id: string
          p_title?: string
          p_description?: string
          p_event_data?: Json
          p_event_date?: string
          p_source?: string
        }
        Returns: string
      }
      get_user_timeline: {
        Args: {
          p_user_id: string
          p_limit?: number
          p_offset?: number
          p_category?: string
          p_milestones_only?: boolean
        }
        Returns: {
          event_id: string
          event_type_id: string
          title: string
          description: string | null
          event_data: Json | null
          event_date: string
          status: string
          is_milestone: boolean
          is_featured: boolean
          category: string
          icon_name: string | null
          color_hex: string
          created_at: string
        }[]
      }
      create_persona_session: {
        Args: {
          p_user_id: string
          p_session_type?: string
        }
        Returns: string
      }
      get_user_current_persona: {
        Args: {
          p_user_id: string
        }
        Returns: {
          primary_persona: string
          persona_display_name: string
          confidence: number
          description: string
          population_percentage: number
          rarity_level: string
          strengths: string[]
          challenges: string[]
          recommendations: string[]
        }[]
      }
    }
  }
}

// Helper types for better TypeScript experience
export type UserRow = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type UserProfileRow = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type EventTypeRow = Database['public']['Tables']['event_types']['Row']
export type EventTypeInsert = Database['public']['Tables']['event_types']['Insert']
export type EventTypeUpdate = Database['public']['Tables']['event_types']['Update']

export type TimelineEventRow = Database['public']['Tables']['timeline_events']['Row']
export type TimelineEventInsert = Database['public']['Tables']['timeline_events']['Insert']
export type TimelineEventUpdate = Database['public']['Tables']['timeline_events']['Update']

// Persona-related types
export type PersonaTypeRow = Database['public']['Tables']['persona_types']['Row']
export type PersonaTypeInsert = Database['public']['Tables']['persona_types']['Insert']
export type PersonaTypeUpdate = Database['public']['Tables']['persona_types']['Update']

export type PersonaQuestionRow = Database['public']['Tables']['persona_questions']['Row']
export type PersonaQuestionInsert = Database['public']['Tables']['persona_questions']['Insert']
export type PersonaQuestionUpdate = Database['public']['Tables']['persona_questions']['Update']

export type PersonaQuestionOptionRow = Database['public']['Tables']['persona_question_options']['Row']
export type PersonaQuestionOptionInsert = Database['public']['Tables']['persona_question_options']['Insert']
export type PersonaQuestionOptionUpdate = Database['public']['Tables']['persona_question_options']['Update']

export type UserPersonaSessionRow = Database['public']['Tables']['user_persona_sessions']['Row']
export type UserPersonaSessionInsert = Database['public']['Tables']['user_persona_sessions']['Insert']
export type UserPersonaSessionUpdate = Database['public']['Tables']['user_persona_sessions']['Update']

export type UserQuestionResponseRow = Database['public']['Tables']['user_question_responses']['Row']
export type UserQuestionResponseInsert = Database['public']['Tables']['user_question_responses']['Insert']
export type UserQuestionResponseUpdate = Database['public']['Tables']['user_question_responses']['Update']

export type UserPersonaResultRow = Database['public']['Tables']['user_persona_results']['Row']
export type UserPersonaResultInsert = Database['public']['Tables']['user_persona_results']['Insert']
export type UserPersonaResultUpdate = Database['public']['Tables']['user_persona_results']['Update']

// Enums for better type safety
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
export type UserLanguage = 'pt-BR' | 'en-US' | 'es-ES'
export type EventCategory = 'onboarding' | 'persona' | 'journey' | 'achievement' | 'system' | 'custom'
export type EventStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived'
export type EventSource = 'system' | 'user' | 'admin' | 'api' | 'import'
export type AlmaPhase = 'autenticidade' | 'liberdade' | 'expansao' | 'transcendencia'

// Persona-specific enums
export type PersonaCategory = 'primary' | 'combination' | 'complex'
export type PersonaRarityLevel = 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare'
export type PersonaSessionStatus = 'in_progress' | 'completed' | 'abandoned'
export type PersonaSessionType = 'full_assessment' | 'quick_test' | 'retake'
export type PersonaComposition = 'pure' | 'dual' | 'triple' | 'complex'
export type QuestionOptionLetter = 'A' | 'B' | 'C' | 'D' | 'E'

// Timeline event with related data
export type TimelineEventWithType = TimelineEventRow & {
  event_type: EventTypeRow
}

// User with profile data
export type UserWithProfile = UserRow & {
  profile?: UserProfileRow
}

// Function return types
export type TimelineEventDetails = Database['public']['Functions']['get_user_timeline']['Returns'][0]
export type UserCurrentPersona = Database['public']['Functions']['get_user_current_persona']['Returns'][0]

// Enhanced persona types with relationships
export type PersonaQuestionWithOptions = PersonaQuestionRow & {
  options: PersonaQuestionOptionRow[]
}

export type UserPersonaSessionWithResults = UserPersonaSessionRow & {
  results?: UserPersonaResultRow
  responses?: UserQuestionResponseRow[]
}

export type PersonaClassificationResult = {
  // Core results (updated to match existing component expectations)
  persona: string
  primaryPersona: {
    id: string
    name: string
    traits: string[]
  }
  personaDisplayName: string
  confidence: number
  description: string

  // Classification details
  weightedScores: Record<string, number>
  dominantPersonas: string[]
  personaComposition: PersonaComposition

  // Protocol information
  protocolType: string
  videoUrl?: string

  // Additional insights (NOW INCLUDED!)
  populationPercentage: number
  rarityLevel: PersonaRarityLevel
  businessImpact?: string
  transformationPotential?: string

  // Generated recommendations
  strengths: string[]
  challenges: string[]
  recommendations: string[]
}

export type PersonaQuestion = {
  id: number
  question: string // NOW INCLUDED!
  weight: number // NOW INCLUDED!
  alertText?: string
  introText?: string
  subText?: string
  isOpenEnded?: boolean
  placeholder?: string
  options: {
    letter: QuestionOptionLetter
    text: string
    persona?: string
  }[]
}

export type QuestionResponse = {
  questionId: number
  answer: string
  semanticAnalysis?: {
    type: string
    confidence: number
    indicators: string[]
    semanticScore?: number
    behavioralPatterns?: string[]
  }
  typingMetrics?: {
    startTime: number
    endTime: number
    totalTime: number
    characterCount: number
    averageTypingSpeed: number
    pauseCount: number
    backspaceCount: number
    hesitationCount: number
    corrections: number[]
  }
  timestamp: number
}
