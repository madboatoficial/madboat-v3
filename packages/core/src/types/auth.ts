// ⚓ Poseidon's Authentication Types
// Simplified auth types that work with existing MadBoat database schema
// Created: 2025-01-13

import type { Database } from './database'

// Extract profile type from existing database schema
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Auth-specific types for better semantics
export type User = Profile // In our schema, profile IS the user

export interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at?: number
}

// User status types
export type UserStatus = 'active' | 'inactive' | 'suspended'

// Subscription tiers
export type SubscriptionTier = 'free' | 'pro' | 'premium'

// Authentication provider types
export type AuthProvider = 'email' | 'google' | 'github' | 'apple'

// MadBoat journey phases
export type AlmaPhase = 'autenticidade' | 'personalidade' | 'purpose' | 'mastery'

// Language options
export type Language = 'pt-BR' | 'en-US' | 'es-ES'

// Theme options
export type Theme = 'light' | 'dark' | 'system'

// User authentication context
export interface AuthUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  status: UserStatus
  subscription_tier: SubscriptionTier
  current_level: number
  total_xp: number
  onboarding_completed: boolean
  current_persona_id?: string
  current_world_id?: string
  language: Language
  timezone: string
  theme: Theme
}

// Simplified auth state for components
export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

// Auth actions
export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  updateProfile: (updates: Partial<ProfileUpdate>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

// Complete auth context
export interface AuthContext extends AuthState, AuthActions {}

// Authentication hooks return type
export interface UseAuthReturn extends AuthContext {}

// For onboarding flow
export interface OnboardingStep {
  step: number
  title: string
  description: string
  completed: boolean
  required: boolean
}

// Privacy settings
export interface PrivacySettings {
  analytics: boolean
  marketing: boolean
  personalization: boolean
}

// The depths of authentication are secured with types! ⚓