-- =============================================================================
-- MadBoat v2.0 - Authentication Foundation Schema
-- =============================================================================
-- Agent: Poseidon 
-- Task: Complete authentication system with persona-driven architecture
-- Created: 2025-08-31
-- Purpose: Comprehensive auth schema supporting 3 worlds + gamification + LGPD
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CORE SYSTEM TABLES
-- =============================================================================

-- Worlds: The three core realms of MadBoat
CREATE TABLE IF NOT EXISTS public.worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE, -- alma, vortice, odisseia
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  color_primary VARCHAR(7) NOT NULL, -- Hex color
  color_secondary VARCHAR(7) NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Personas: Personality archetypes within each world
CREATE TABLE IF NOT EXISTS public.personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  code VARCHAR(30) NOT NULL UNIQUE, -- networker, achiever, creator, etc.
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  characteristics JSONB NOT NULL DEFAULT '[]', -- Array of key traits
  gamification_style VARCHAR(20) NOT NULL, -- zen, competitive, narrative
  xp_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00, -- XP bonus for this persona
  unlock_level INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT personas_xp_multiplier_check CHECK (xp_multiplier >= 0.5 AND xp_multiplier <= 2.0),
  CONSTRAINT personas_unlock_level_check CHECK (unlock_level >= 1 AND unlock_level <= 100)
);

-- =============================================================================
-- USER PROFILES (extends Supabase auth.users)
-- =============================================================================

-- Main profile table - extends Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  birth_date DATE,
  timezone VARCHAR(50) NOT NULL DEFAULT 'America/Sao_Paulo',
  language VARCHAR(5) NOT NULL DEFAULT 'pt-BR',
  
  -- Onboarding & Status
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  onboarding_step INTEGER NOT NULL DEFAULT 0 CHECK (onboarding_step >= 0 AND onboarding_step <= 10),
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  
  -- Current Persona Selection
  current_world_id UUID REFERENCES public.worlds(id),
  current_persona_id UUID REFERENCES public.personas(id),
  persona_selected_at TIMESTAMPTZ,
  persona_changes_count INTEGER NOT NULL DEFAULT 0,
  last_persona_change_at TIMESTAMPTZ,
  
  -- Gamification
  total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 100),
  level_progress DECIMAL(5,2) NOT NULL DEFAULT 0.0 CHECK (level_progress >= 0.0 AND level_progress < 100.0),
  
  -- Preferences
  theme VARCHAR(10) NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  marketing_emails BOOLEAN NOT NULL DEFAULT false,
  
  -- Privacy (LGPD Compliance)
  privacy_analytics BOOLEAN NOT NULL DEFAULT true,
  privacy_marketing BOOLEAN NOT NULL DEFAULT false,
  privacy_personalization BOOLEAN NOT NULL DEFAULT true,
  data_processing_consent BOOLEAN NOT NULL DEFAULT false,
  data_processing_consent_at TIMESTAMPTZ,
  
  -- Subscription
  subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_expires_at TIMESTAMPTZ,
  trial_used BOOLEAN NOT NULL DEFAULT false,
  trial_expires_at TIMESTAMPTZ,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure persona consistency
  CONSTRAINT profiles_persona_consistency CHECK (
    (current_world_id IS NULL AND current_persona_id IS NULL) OR
    (current_world_id IS NOT NULL AND current_persona_id IS NOT NULL)
  )
);

-- Track user's exploration of different personas
CREATE TABLE IF NOT EXISTS public.user_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  persona_id UUID NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
  
  -- Usage tracking
  selected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_usage_hours INTEGER NOT NULL DEFAULT 0,
  times_selected INTEGER NOT NULL DEFAULT 1,
  
  -- Experience with this persona
  persona_xp INTEGER NOT NULL DEFAULT 0 CHECK (persona_xp >= 0),
  persona_level INTEGER NOT NULL DEFAULT 1 CHECK (persona_level >= 1 AND persona_level <= 100),
  
  -- Performance metrics per persona
  achievements_unlocked INTEGER NOT NULL DEFAULT 0,
  goals_completed INTEGER NOT NULL DEFAULT 0,
  streaks_maintained INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, persona_id)
);

-- =============================================================================
-- GAMIFICATION SYSTEM
-- =============================================================================

-- XP Events for tracking all point-generating actions
CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
  
  -- Event details
  event_type VARCHAR(50) NOT NULL, -- login_daily, complete_profile, etc.
  event_category VARCHAR(30) NOT NULL, -- engagement, achievement, social, etc.
  xp_awarded INTEGER NOT NULL CHECK (xp_awarded >= 0),
  multiplier_applied DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  base_xp INTEGER NOT NULL CHECK (base_xp >= 0),
  
  -- Context
  event_data JSONB NOT NULL DEFAULT '{}',
  source_id UUID, -- ID of the specific action/achievement/etc
  description TEXT,
  
  -- Timing
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT xp_events_multiplier_check CHECK (multiplier_applied >= 0.5 AND multiplier_applied <= 3.0)
);

-- Achievements system
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  
  -- Requirements
  category VARCHAR(30) NOT NULL, -- onboarding, engagement, social, etc.
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'epic')),
  required_level INTEGER NOT NULL DEFAULT 1,
  required_persona_id UUID REFERENCES public.personas(id),
  required_world_id UUID REFERENCES public.worlds(id),
  
  -- Rewards
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  unlocks_feature VARCHAR(100), -- Feature flag to unlock
  badge_color VARCHAR(7), -- Hex color for badge
  
  -- Conditions (JSON-based rules engine)
  unlock_conditions JSONB NOT NULL DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_hidden BOOLEAN NOT NULL DEFAULT false, -- Hidden until conditions met
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User achievements tracking
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL, -- Persona active when unlocked
  
  -- Progress tracking
  progress_current INTEGER NOT NULL DEFAULT 0,
  progress_required INTEGER NOT NULL DEFAULT 1,
  progress_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  
  -- Achievement status
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  notified_at TIMESTAMPTZ,
  
  -- Context when achieved
  completion_context JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id),
  
  CONSTRAINT user_achievements_progress_check CHECK (progress_current >= 0 AND progress_current <= progress_required),
  CONSTRAINT user_achievements_percentage_check CHECK (progress_percentage >= 0.0 AND progress_percentage <= 100.0)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_current_persona ON public.profiles(current_persona_id);
CREATE INDEX IF NOT EXISTS idx_profiles_current_world ON public.profiles(current_world_id);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(onboarding_completed, onboarding_step);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(current_level);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles(subscription_tier, subscription_expires_at);

-- User personas indexes
CREATE INDEX IF NOT EXISTS idx_user_personas_user_id ON public.user_personas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_personas_persona_id ON public.user_personas(persona_id);
CREATE INDEX IF NOT EXISTS idx_user_personas_last_used ON public.user_personas(last_used_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_personas_level ON public.user_personas(persona_level);

-- XP Events indexes (high-volume table)
CREATE INDEX IF NOT EXISTS idx_xp_events_user_id ON public.xp_events(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_persona_id ON public.xp_events(persona_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_type ON public.xp_events(event_type);
CREATE INDEX IF NOT EXISTS idx_xp_events_occurred_at ON public.xp_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_events_user_occurred ON public.xp_events(user_id, occurred_at DESC);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_difficulty ON public.achievements(difficulty);
CREATE INDEX IF NOT EXISTS idx_achievements_required_level ON public.achievements(required_level);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON public.achievements(is_active, is_hidden);

-- User achievements indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_status ON public.user_achievements(status);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON public.user_achievements(completed_at DESC) WHERE status = 'completed';

-- Personas indexes
CREATE INDEX IF NOT EXISTS idx_personas_world_id ON public.personas(world_id);
CREATE INDEX IF NOT EXISTS idx_personas_active ON public.personas(is_active);
CREATE INDEX IF NOT EXISTS idx_personas_unlock_level ON public.personas(unlock_level);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Worlds: Public read access
CREATE POLICY "worlds_public_read" ON public.worlds
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Personas: Public read access for active personas
CREATE POLICY "personas_public_read" ON public.personas
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Profiles: Users can only see their own profile
CREATE POLICY "profiles_own_read" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_own_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User personas: Users can only access their own persona records
CREATE POLICY "user_personas_own_access" ON public.user_personas
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- XP Events: Users can read their own events, system can insert
CREATE POLICY "xp_events_own_read" ON public.xp_events
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "xp_events_system_insert" ON public.xp_events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Achievements: Public read for active achievements
CREATE POLICY "achievements_public_read" ON public.achievements
  FOR SELECT TO authenticated
  USING (is_active = true);

-- User achievements: Users can access their own achievement records
CREATE POLICY "user_achievements_own_access" ON public.user_achievements
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_user_personas_updated_at
  BEFORE UPDATE ON public.user_personas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_worlds_updated_at
  BEFORE UPDATE ON public.worlds
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_personas_updated_at
  BEFORE UPDATE ON public.personas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_user_achievements_updated_at
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Award initial XP for registration
  INSERT INTO public.xp_events (user_id, event_type, event_category, xp_awarded, base_xp, description)
  VALUES (
    NEW.id,
    'user_registration',
    'onboarding',
    50,
    50,
    'Welcome to MadBoat! Registration completed.'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate XP required for next level
CREATE OR REPLACE FUNCTION public.calculate_xp_for_level(level_num INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Levels 1-10: Linear progression (100 XP per level)
  IF level_num <= 10 THEN
    RETURN level_num * 100;
  END IF;
  
  -- Levels 11+: Exponential progression
  RETURN ROUND(level_num * 100 * POWER(1.5, (level_num - 10) / 10.0));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user level based on total XP
CREATE OR REPLACE FUNCTION public.update_user_level(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  current_xp INTEGER;
  new_level INTEGER := 1;
  required_xp INTEGER;
  progress DECIMAL(5,2);
BEGIN
  -- Get current total XP
  SELECT total_xp INTO current_xp FROM public.profiles WHERE id = user_uuid;
  
  -- Calculate new level
  WHILE new_level < 100 LOOP
    required_xp := public.calculate_xp_for_level(new_level + 1);
    EXIT WHEN current_xp < required_xp;
    new_level := new_level + 1;
  END LOOP;
  
  -- Calculate progress to next level
  IF new_level < 100 THEN
    required_xp := public.calculate_xp_for_level(new_level + 1);
    progress := ((current_xp - public.calculate_xp_for_level(new_level)) * 100.0) / 
                 (required_xp - public.calculate_xp_for_level(new_level));
  ELSE
    progress := 100.0;
  END IF;
  
  -- Update profile
  UPDATE public.profiles 
  SET current_level = new_level, level_progress = progress
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-update level when XP changes
CREATE OR REPLACE FUNCTION public.handle_xp_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total XP in profile
  UPDATE public.profiles 
  SET total_xp = total_xp + NEW.xp_awarded
  WHERE id = NEW.user_id;
  
  -- Update user level
  PERFORM public.update_user_level(NEW.user_id);
  
  -- Mark XP event as processed
  NEW.processed_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for XP processing
CREATE TRIGGER trigger_xp_events_process
  BEFORE INSERT ON public.xp_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_xp_change();

-- Function to award XP (convenience function)
CREATE OR REPLACE FUNCTION public.award_xp(
  user_uuid UUID,
  event_type_param VARCHAR(50),
  base_xp_param INTEGER,
  description_param TEXT DEFAULT NULL,
  event_data_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  persona_multiplier DECIMAL(3,2) := 1.0;
  final_xp INTEGER;
  event_id UUID;
  current_persona_id UUID;
BEGIN
  -- Get current persona and its multiplier
  SELECT current_persona_id, p.xp_multiplier INTO current_persona_id, persona_multiplier
  FROM public.profiles pr
  LEFT JOIN public.personas p ON p.id = pr.current_persona_id
  WHERE pr.id = user_uuid;
  
  -- Calculate final XP with persona multiplier
  final_xp := ROUND(base_xp_param * COALESCE(persona_multiplier, 1.0));
  
  -- Insert XP event
  INSERT INTO public.xp_events (
    user_id, persona_id, event_type, event_category, xp_awarded, 
    multiplier_applied, base_xp, description, event_data
  ) VALUES (
    user_uuid, current_persona_id, event_type_param, 
    SPLIT_PART(event_type_param, '_', 1), final_xp,
    COALESCE(persona_multiplier, 1.0), base_xp_param, 
    description_param, event_data_param
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.worlds IS 'The three core realms of MadBoat: A.L.M.A, Vórtice, Odisseia';
COMMENT ON TABLE public.personas IS 'Personality archetypes that determine user experience and gamification style';
COMMENT ON TABLE public.profiles IS 'Extended user profiles that integrate with Supabase auth.users';
COMMENT ON TABLE public.user_personas IS 'Tracks user exploration and mastery of different personas';
COMMENT ON TABLE public.xp_events IS 'High-volume table tracking all XP-generating actions';
COMMENT ON TABLE public.achievements IS 'Gamification achievements that unlock features and rewards';
COMMENT ON TABLE public.user_achievements IS 'Progress tracking for user achievements';

COMMENT ON COLUMN public.profiles.persona_changes_count IS 'Limited to 1 per month for free users (business rule USER-003)';
COMMENT ON COLUMN public.profiles.data_processing_consent IS 'LGPD compliance - explicit consent required (PRIVACY-001)';
COMMENT ON COLUMN public.personas.xp_multiplier IS 'Persona-specific XP bonus (0.5x to 2.0x)';
COMMENT ON FUNCTION public.calculate_xp_for_level(INTEGER) IS 'XP formula: levels 1-10 linear, 11+ exponential (GAME-002)';