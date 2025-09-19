-- ⚓ Poseidon's Persona Classification System
-- Agent: Poseidon
-- Task: Create comprehensive persona system tables
-- Created: 2025-01-15
-- Purpose: Complete persona identification and classification system for MadBoat

-- =============================================================================
-- PERSONA TYPES TABLE - Master list of all persona types
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.persona_types (
    -- Primary key
    persona_type_id TEXT PRIMARY KEY,

    -- Display information
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Classification metadata
    category TEXT NOT NULL DEFAULT 'primary',
    population_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    rarity_level TEXT NOT NULL DEFAULT 'common',

    -- Business insights
    business_impact TEXT,
    transformation_potential TEXT,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT persona_types_category_check CHECK (category IN ('primary', 'combination', 'complex')),
    CONSTRAINT persona_types_rarity_check CHECK (rarity_level IN ('very_common', 'common', 'rare', 'very_rare', 'extremely_rare')),
    CONSTRAINT persona_types_percentage_check CHECK (population_percentage >= 0.0 AND population_percentage <= 100.0)
);

-- Enable RLS
ALTER TABLE public.persona_types ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PERSONA QUESTIONS TABLE - Questions for persona identification
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.persona_questions (
    -- Primary key
    question_id SERIAL PRIMARY KEY,

    -- Question content
    question TEXT NOT NULL,
    intro_text TEXT,
    alert_text TEXT,
    sub_text TEXT,
    placeholder TEXT,

    -- Question type and metadata
    is_open_ended BOOLEAN NOT NULL DEFAULT false,
    weight INTEGER NOT NULL DEFAULT 1,
    question_order INTEGER NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',

    -- Status and visibility
    is_active BOOLEAN NOT NULL DEFAULT true,
    version INTEGER NOT NULL DEFAULT 1,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT persona_questions_weight_check CHECK (weight >= 1 AND weight <= 5),
    CONSTRAINT persona_questions_order_check CHECK (question_order > 0)
);

-- Enable RLS
ALTER TABLE public.persona_questions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PERSONA QUESTION OPTIONS TABLE - Multiple choice options
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.persona_question_options (
    -- Primary key
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign key to question
    question_id INTEGER NOT NULL REFERENCES public.persona_questions(question_id) ON DELETE CASCADE,

    -- Option content
    letter TEXT NOT NULL,
    option_text TEXT NOT NULL,
    persona_type_id TEXT REFERENCES public.persona_types(persona_type_id),

    -- Scoring
    score_weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    option_order INTEGER NOT NULL,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT persona_question_options_letter_check CHECK (letter IN ('A', 'B', 'C', 'D', 'E')),
    CONSTRAINT persona_question_options_unique_letter_per_question UNIQUE (question_id, letter),
    CONSTRAINT persona_question_options_score_check CHECK (score_weight >= 0.0 AND score_weight <= 5.0)
);

-- Enable RLS
ALTER TABLE public.persona_question_options ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USER PERSONA SESSIONS TABLE - Track persona identification sessions
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_persona_sessions (
    -- Primary key
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign key to user
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,

    -- Session metadata
    session_type TEXT NOT NULL DEFAULT 'full_assessment',
    status TEXT NOT NULL DEFAULT 'in_progress',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,

    -- Results (populated when completed)
    primary_persona TEXT REFERENCES public.persona_types(persona_type_id),
    confidence_score DECIMAL(5,2),
    persona_composition TEXT,

    -- Additional data
    session_data JSONB,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT user_persona_sessions_status_check CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    CONSTRAINT user_persona_sessions_type_check CHECK (session_type IN ('full_assessment', 'quick_test', 'retake')),
    CONSTRAINT user_persona_sessions_confidence_check CHECK (confidence_score IS NULL OR (confidence_score >= 0.0 AND confidence_score <= 100.0))
);

-- Enable RLS
ALTER TABLE public.user_persona_sessions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USER QUESTION RESPONSES TABLE - Individual question responses
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_question_responses (
    -- Primary key
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign keys
    session_id UUID NOT NULL REFERENCES public.user_persona_sessions(session_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES public.persona_questions(question_id),

    -- Response data
    answer_text TEXT NOT NULL,
    selected_option_id UUID REFERENCES public.persona_question_options(option_id),

    -- Behavioral metrics
    typing_metrics JSONB,
    semantic_analysis JSONB,
    response_time_ms INTEGER,

    -- Scoring
    calculated_score DECIMAL(5,2),
    contributing_personas JSONB,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT user_question_responses_unique_per_session UNIQUE (session_id, question_id),
    CONSTRAINT user_question_responses_score_check CHECK (calculated_score IS NULL OR (calculated_score >= 0.0 AND calculated_score <= 100.0))
);

-- Enable RLS
ALTER TABLE public.user_question_responses ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USER PERSONA RESULTS TABLE - Final persona classification results
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_persona_results (
    -- Primary key
    result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign keys
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.user_persona_sessions(session_id) ON DELETE CASCADE,

    -- Core results
    primary_persona TEXT NOT NULL REFERENCES public.persona_types(persona_type_id),
    persona_display_name TEXT NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,
    description TEXT NOT NULL,

    -- Classification details
    weighted_scores JSONB NOT NULL,
    dominant_personas TEXT[] NOT NULL,
    persona_composition TEXT NOT NULL,

    -- Protocol information
    protocol_type TEXT NOT NULL,
    video_url TEXT,

    -- Additional insights
    population_percentage DECIMAL(5,2) NOT NULL,
    rarity_level TEXT NOT NULL,
    business_impact TEXT,
    transformation_potential TEXT,

    -- Generated recommendations
    strengths TEXT[] NOT NULL DEFAULT '{}',
    challenges TEXT[] NOT NULL DEFAULT '{}',
    recommendations TEXT[] NOT NULL DEFAULT '{}',

    -- Metadata
    is_current BOOLEAN NOT NULL DEFAULT true,
    version INTEGER NOT NULL DEFAULT 1,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT user_persona_results_confidence_check CHECK (confidence >= 0.0 AND confidence <= 100.0),
    CONSTRAINT user_persona_results_percentage_check CHECK (population_percentage >= 0.0 AND population_percentage <= 100.0),
    CONSTRAINT user_persona_results_rarity_check CHECK (rarity_level IN ('very_common', 'common', 'rare', 'very_rare', 'extremely_rare')),
    CONSTRAINT user_persona_results_composition_check CHECK (persona_composition IN ('pure', 'dual', 'triple', 'complex'))
);

-- Enable RLS
ALTER TABLE public.user_persona_results ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- =============================================================================

-- Persona types indexes
CREATE INDEX IF NOT EXISTS idx_persona_types_category ON public.persona_types(category);
CREATE INDEX IF NOT EXISTS idx_persona_types_rarity ON public.persona_types(rarity_level);
CREATE INDEX IF NOT EXISTS idx_persona_types_population ON public.persona_types(population_percentage);

-- Persona questions indexes
CREATE INDEX IF NOT EXISTS idx_persona_questions_active ON public.persona_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_persona_questions_order ON public.persona_questions(question_order);
CREATE INDEX IF NOT EXISTS idx_persona_questions_category ON public.persona_questions(category);

-- Question options indexes
CREATE INDEX IF NOT EXISTS idx_persona_question_options_question ON public.persona_question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_persona_question_options_persona ON public.persona_question_options(persona_type_id);

-- User persona sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_persona_sessions_user ON public.user_persona_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_persona_sessions_status ON public.user_persona_sessions(status);
CREATE INDEX IF NOT EXISTS idx_user_persona_sessions_started ON public.user_persona_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_user_persona_sessions_completed ON public.user_persona_sessions(completed_at);

-- User question responses indexes
CREATE INDEX IF NOT EXISTS idx_user_question_responses_session ON public.user_question_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_question_responses_user ON public.user_question_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_question_responses_question ON public.user_question_responses(question_id);

-- User persona results indexes
CREATE INDEX IF NOT EXISTS idx_user_persona_results_user ON public.user_persona_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_persona_results_session ON public.user_persona_results(session_id);
CREATE INDEX IF NOT EXISTS idx_user_persona_results_persona ON public.user_persona_results(primary_persona);
CREATE INDEX IF NOT EXISTS idx_user_persona_results_current ON public.user_persona_results(is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_user_persona_results_created ON public.user_persona_results(created_at);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Persona types - public read access
CREATE POLICY "persona_types_select_all" ON public.persona_types
    FOR SELECT TO authenticated USING (true);

-- Persona questions - public read access for active questions
CREATE POLICY "persona_questions_select_active" ON public.persona_questions
    FOR SELECT TO authenticated USING (is_active = true);

-- Question options - public read access
CREATE POLICY "persona_question_options_select_all" ON public.persona_question_options
    FOR SELECT TO authenticated USING (true);

-- User persona sessions - users can only access their own
CREATE POLICY "user_persona_sessions_own" ON public.user_persona_sessions
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- User question responses - users can only access their own
CREATE POLICY "user_question_responses_own" ON public.user_question_responses
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- User persona results - users can only access their own
CREATE POLICY "user_persona_results_own" ON public.user_persona_results
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- =============================================================================
-- UPDATE TIMESTAMP TRIGGERS
-- =============================================================================

-- Apply update triggers to all tables
CREATE TRIGGER update_persona_types_updated_at
    BEFORE UPDATE ON public.persona_types
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_persona_questions_updated_at
    BEFORE UPDATE ON public.persona_questions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_persona_question_options_updated_at
    BEFORE UPDATE ON public.persona_question_options
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_persona_sessions_updated_at
    BEFORE UPDATE ON public.user_persona_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_question_responses_updated_at
    BEFORE UPDATE ON public.user_question_responses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_persona_results_updated_at
    BEFORE UPDATE ON public.user_persona_results
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- HELPFUL DATABASE FUNCTIONS
-- =============================================================================

-- Function to start a new persona session
CREATE OR REPLACE FUNCTION public.create_persona_session(
    p_user_id UUID,
    p_session_type TEXT DEFAULT 'full_assessment'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session_id UUID;
BEGIN
    -- Mark any existing sessions as abandoned if not completed
    UPDATE public.user_persona_sessions
    SET status = 'abandoned', updated_at = now()
    WHERE user_id = p_user_id AND status = 'in_progress';

    -- Create new session
    INSERT INTO public.user_persona_sessions (user_id, session_type, status)
    VALUES (p_user_id, p_session_type, 'in_progress')
    RETURNING session_id INTO v_session_id;

    RETURN v_session_id;
END;
$$;

-- Function to get user's current persona result
CREATE OR REPLACE FUNCTION public.get_user_current_persona(p_user_id UUID)
RETURNS TABLE (
    primary_persona TEXT,
    persona_display_name TEXT,
    confidence DECIMAL,
    description TEXT,
    population_percentage DECIMAL,
    rarity_level TEXT,
    strengths TEXT[],
    challenges TEXT[],
    recommendations TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        upr.primary_persona,
        upr.persona_display_name,
        upr.confidence,
        upr.description,
        upr.population_percentage,
        upr.rarity_level,
        upr.strengths,
        upr.challenges,
        upr.recommendations
    FROM public.user_persona_results upr
    WHERE upr.user_id = p_user_id
      AND upr.is_current = true
    ORDER BY upr.created_at DESC
    LIMIT 1;
END;
$$;

-- =============================================================================
-- TABLE COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.persona_types IS 'Master list of all persona types with metadata and business insights';
COMMENT ON TABLE public.persona_questions IS 'Questions used for persona identification assessment';
COMMENT ON TABLE public.persona_question_options IS 'Multiple choice options for persona questions';
COMMENT ON TABLE public.user_persona_sessions IS 'User persona identification sessions';
COMMENT ON TABLE public.user_question_responses IS 'Individual question responses within sessions';
COMMENT ON TABLE public.user_persona_results IS 'Final persona classification results for users';

-- Victory! The persona system foundation is complete and optimized! ⚓