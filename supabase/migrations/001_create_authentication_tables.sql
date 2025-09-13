-- ⚓ Poseidon's Database Foundation
-- Agent: Poseidon
-- Task: Create complete authentication system
-- Created: 2025-01-13
-- Purpose: Foundation tables for MadBoat v3 authentication and user profiles

-- =============================================================================
-- USERS TABLE - Core user data and authentication info
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    -- Primary key with UUID for scalability
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Authentication fields
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    auth_provider TEXT NOT NULL DEFAULT 'email',

    -- Timestamp fields for login tracking
    last_login_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,

    -- Audit fields (Poseidon's standard)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints for data integrity
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable Row Level Security (NON-NEGOTIABLE)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USER PROFILES TABLE - Extended user information and preferences
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    -- Foreign key to users table (cascade delete for data integrity)
    user_id UUID PRIMARY KEY REFERENCES public.users(user_id) ON DELETE CASCADE,

    -- Profile data
    avatar_url TEXT,
    bio TEXT,
    birth_date DATE,
    timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    language TEXT NOT NULL DEFAULT 'pt-BR',

    -- MadBoat-specific fields for user journey
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    persona_identified BOOLEAN NOT NULL DEFAULT false,
    alma_phase_current TEXT NOT NULL DEFAULT 'autenticidade',

    -- Privacy settings
    privacy_analytics BOOLEAN NOT NULL DEFAULT true,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Data validation constraints
    CONSTRAINT user_profiles_timezone_check CHECK (timezone IS NOT NULL),
    CONSTRAINT user_profiles_language_check CHECK (language IN ('pt-BR', 'en-US', 'es-ES'))
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- INDEXES FOR QUERY PERFORMANCE (The foundation of speed!)
-- =============================================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON public.users(auth_provider);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON public.users(last_login_at);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_alma_phase ON public.user_profiles(alma_phase_current);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_persona ON public.user_profiles(persona_identified);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES (The fortress of data protection!)
-- =============================================================================

-- Users table policies
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- User profiles policies
CREATE POLICY "user_profiles_select_own" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_profiles_insert_own" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_profiles_update_own" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- UPDATE TIMESTAMP TRIGGERS (Automatic audit trail)
-- =============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.users IS 'Core user authentication and profile data';
COMMENT ON TABLE public.user_profiles IS 'Extended user profile information and MadBoat journey tracking';
COMMENT ON COLUMN public.users.user_id IS 'Primary key UUID for user identification';
COMMENT ON COLUMN public.users.status IS 'User account status: ACTIVE, INACTIVE, or SUSPENDED';
COMMENT ON COLUMN public.user_profiles.alma_phase_current IS 'Current phase in MadBoat user journey';
COMMENT ON COLUMN public.user_profiles.onboarding_completed IS 'Whether user has completed initial onboarding';

-- Victory! The foundation is laid with precision and power! ⚓