-- ⚓ Poseidon's Timeline Events Architecture
-- Agent: Poseidon
-- Task: Create comprehensive timeline events tracking system
-- Created: 2025-01-15
-- Purpose: Track all user journey events including persona identification, onboarding steps, and milestones

-- =============================================================================
-- EVENT TYPES TABLE - Standardized event categorization
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.event_types (
    -- Primary key with meaningful string identifier
    event_type_id TEXT PRIMARY KEY,

    -- Human-readable information
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,

    -- Visual representation
    icon_name TEXT,
    color_hex TEXT NOT NULL DEFAULT '#3B82F6',

    -- Event configuration
    is_milestone BOOLEAN NOT NULL DEFAULT false,
    is_system_generated BOOLEAN NOT NULL DEFAULT true,
    requires_user_action BOOLEAN NOT NULL DEFAULT false,

    -- Order for display purposes
    display_order INTEGER NOT NULL DEFAULT 0,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT event_types_category_check CHECK (category IN ('onboarding', 'persona', 'journey', 'achievement', 'system', 'custom')),
    CONSTRAINT event_types_color_format CHECK (color_hex ~* '^#[0-9A-F]{6}$')
);

-- Enable RLS
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- TIMELINE EVENTS TABLE - Core event tracking
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.timeline_events (
    -- Primary key
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign keys
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    event_type_id TEXT NOT NULL REFERENCES public.event_types(event_type_id) ON DELETE RESTRICT,

    -- Event data
    title TEXT NOT NULL,
    description TEXT,
    event_data JSONB,

    -- Timing
    event_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    estimated_date TIMESTAMPTZ, -- For future/planned events

    -- Status and visibility
    status TEXT NOT NULL DEFAULT 'completed',
    is_visible BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,

    -- Metadata
    source TEXT NOT NULL DEFAULT 'system',
    external_id TEXT, -- For linking to other systems
    tags TEXT[] DEFAULT '{}',

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),

    -- Constraints
    CONSTRAINT timeline_events_status_check CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'archived')),
    CONSTRAINT timeline_events_source_check CHECK (source IN ('system', 'user', 'admin', 'api', 'import')),
    CONSTRAINT timeline_events_date_logic CHECK (
        (status = 'planned' AND estimated_date IS NOT NULL) OR
        (status != 'planned' AND event_date IS NOT NULL)
    )
);

-- Enable RLS
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SEED DATA - Standard event types for MadBoat journey
-- =============================================================================

INSERT INTO public.event_types (
    event_type_id, display_name, description, category, icon_name, color_hex,
    is_milestone, is_system_generated, requires_user_action, display_order
) VALUES
    -- Onboarding Events
    ('account_created', 'Conta Criada', 'Usuário criou sua conta no MadBoat', 'onboarding', 'user-plus', '#10B981', true, true, false, 1),
    ('profile_completed', 'Perfil Completado', 'Usuário preencheu informações do perfil', 'onboarding', 'user-check', '#3B82F6', true, false, true, 2),
    ('onboarding_started', 'Onboarding Iniciado', 'Usuário iniciou processo de onboarding', 'onboarding', 'play-circle', '#8B5CF6', false, true, false, 3),
    ('onboarding_completed', 'Onboarding Concluído', 'Usuário finalizou o processo de onboarding', 'onboarding', 'check-circle', '#10B981', true, true, false, 4),

    -- Persona Events
    ('persona_assessment_started', 'Avaliação de Persona Iniciada', 'Usuário começou a identificação de persona', 'persona', 'clipboard-list', '#F59E0B', false, true, false, 10),
    ('persona_identified', 'Persona Identificada', 'Usuário completou a identificação de sua persona', 'persona', 'user-circle', '#EF4444', true, true, false, 11),
    ('persona_changed', 'Persona Alterada', 'Usuário mudou sua persona identificada', 'persona', 'refresh', '#6B7280', false, false, true, 12),

    -- Journey Events
    ('phase_autenticidade_entered', 'Fase Autenticidade', 'Usuário entrou na fase de Autenticidade', 'journey', 'heart', '#EC4899', true, true, false, 20),
    ('phase_liberdade_entered', 'Fase Liberdade', 'Usuário entrou na fase de Liberdade', 'journey', 'paper-airplane', '#06B6D4', true, true, false, 21),
    ('phase_expansao_entered', 'Fase Expansão', 'Usuário entrou na fase de Expansão', 'journey', 'trending-up', '#8B5CF6', true, true, false, 22),
    ('phase_transcendencia_entered', 'Fase Transcendência', 'Usuário entrou na fase de Transcendência', 'journey', 'star', '#F59E0B', true, true, false, 23),

    -- Achievement Events
    ('first_login', 'Primeiro Login', 'Usuário fez seu primeiro login no sistema', 'achievement', 'login', '#10B981', false, true, false, 30),
    ('milestone_reached', 'Marco Alcançado', 'Usuário atingiu um marco importante', 'achievement', 'trophy', '#F59E0B', true, false, false, 31),

    -- System Events
    ('system_notification', 'Notificação do Sistema', 'Sistema enviou notificação ao usuário', 'system', 'bell', '#6B7280', false, true, false, 40),
    ('data_export', 'Exportação de Dados', 'Usuário exportou seus dados', 'system', 'download', '#6B7280', false, false, true, 41),

    -- Custom Events
    ('custom_event', 'Evento Personalizado', 'Evento personalizado criado pelo usuário ou admin', 'custom', 'star', '#8B5CF6', false, false, false, 50)

ON CONFLICT (event_type_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    icon_name = EXCLUDED.icon_name,
    color_hex = EXCLUDED.color_hex,
    is_milestone = EXCLUDED.is_milestone,
    is_system_generated = EXCLUDED.is_system_generated,
    requires_user_action = EXCLUDED.requires_user_action,
    display_order = EXCLUDED.display_order,
    updated_at = now();

-- =============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =============================================================================

-- Event types indexes
CREATE INDEX IF NOT EXISTS idx_event_types_category ON public.event_types(category);
CREATE INDEX IF NOT EXISTS idx_event_types_display_order ON public.event_types(display_order);
CREATE INDEX IF NOT EXISTS idx_event_types_milestone ON public.event_types(is_milestone) WHERE is_milestone = true;

-- Timeline events indexes
CREATE INDEX IF NOT EXISTS idx_timeline_events_user_id ON public.timeline_events(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_event_type ON public.timeline_events(event_type_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_event_date ON public.timeline_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_events_status ON public.timeline_events(status);
CREATE INDEX IF NOT EXISTS idx_timeline_events_user_date ON public.timeline_events(user_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_events_milestones ON public.timeline_events(user_id, event_date DESC)
    WHERE EXISTS (SELECT 1 FROM public.event_types et WHERE et.event_type_id = timeline_events.event_type_id AND et.is_milestone = true);
CREATE INDEX IF NOT EXISTS idx_timeline_events_visible ON public.timeline_events(user_id, is_visible, event_date DESC) WHERE is_visible = true;
CREATE INDEX IF NOT EXISTS idx_timeline_events_featured ON public.timeline_events(user_id, is_featured, event_date DESC) WHERE is_featured = true;

-- JSON indexes for event_data queries
CREATE INDEX IF NOT EXISTS idx_timeline_events_data_gin ON public.timeline_events USING GIN (event_data);

-- Partial indexes for performance
CREATE INDEX IF NOT EXISTS idx_timeline_events_recent ON public.timeline_events(user_id, event_date DESC)
    WHERE event_date >= (now() - INTERVAL '1 year');

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Event types policies (read-only for users)
CREATE POLICY "event_types_select_all" ON public.event_types
    FOR SELECT USING (true);

-- Timeline events policies (users can only see their own events)
CREATE POLICY "timeline_events_select_own" ON public.timeline_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "timeline_events_insert_own" ON public.timeline_events
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "timeline_events_update_own" ON public.timeline_events
    FOR UPDATE USING (user_id = auth.uid() AND source != 'system')
    WITH CHECK (user_id = auth.uid());

-- System can insert/update any events (for admin functions)
CREATE POLICY "timeline_events_system_full_access" ON public.timeline_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.user_id = auth.uid()
            AND u.email IN ('sandro@madboat.com', 'admin@madboat.com')
        )
    );

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =============================================================================

CREATE TRIGGER update_event_types_updated_at
    BEFORE UPDATE ON public.event_types
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timeline_events_updated_at
    BEFORE UPDATE ON public.timeline_events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- DATABASE FUNCTIONS FOR TIMELINE MANAGEMENT
-- =============================================================================

-- Function to create timeline event
CREATE OR REPLACE FUNCTION public.create_timeline_event(
    p_user_id UUID,
    p_event_type_id TEXT,
    p_title TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_event_data JSONB DEFAULT NULL,
    p_event_date TIMESTAMPTZ DEFAULT now(),
    p_source TEXT DEFAULT 'system'
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
    v_event_type_record public.event_types%ROWTYPE;
BEGIN
    -- Get event type details
    SELECT * INTO v_event_type_record
    FROM public.event_types
    WHERE event_type_id = p_event_type_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Event type % not found', p_event_type_id;
    END IF;

    -- Use event type display name as title if not provided
    IF p_title IS NULL THEN
        p_title := v_event_type_record.display_name;
    END IF;

    -- Insert the event
    INSERT INTO public.timeline_events (
        user_id, event_type_id, title, description, event_data,
        event_date, source, is_featured
    ) VALUES (
        p_user_id, p_event_type_id, p_title, p_description, p_event_data,
        p_event_date, p_source, v_event_type_record.is_milestone
    ) RETURNING event_id INTO v_event_id;

    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user timeline with filtering
CREATE OR REPLACE FUNCTION public.get_user_timeline(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_category TEXT DEFAULT NULL,
    p_milestones_only BOOLEAN DEFAULT false
)
RETURNS TABLE (
    event_id UUID,
    event_type_id TEXT,
    title TEXT,
    description TEXT,
    event_data JSONB,
    event_date TIMESTAMPTZ,
    status TEXT,
    is_milestone BOOLEAN,
    is_featured BOOLEAN,
    category TEXT,
    icon_name TEXT,
    color_hex TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        te.event_id,
        te.event_type_id,
        te.title,
        te.description,
        te.event_data,
        te.event_date,
        te.status,
        et.is_milestone,
        te.is_featured,
        et.category,
        et.icon_name,
        et.color_hex,
        te.created_at
    FROM public.timeline_events te
    JOIN public.event_types et ON te.event_type_id = et.event_type_id
    WHERE te.user_id = p_user_id
        AND te.is_visible = true
        AND (p_category IS NULL OR et.category = p_category)
        AND (NOT p_milestones_only OR et.is_milestone = true)
    ORDER BY te.event_date DESC, te.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- AUTOMATIC EVENT CREATION TRIGGERS
-- =============================================================================

-- Function to create automatic timeline events
CREATE OR REPLACE FUNCTION public.trigger_create_timeline_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Account created event
    IF TG_TABLE_NAME = 'users' AND TG_OP = 'INSERT' THEN
        PERFORM public.create_timeline_event(
            NEW.user_id,
            'account_created',
            'Bem-vindo ao MadBoat!',
            'Sua jornada de transformação começou hoje.',
            jsonb_build_object(
                'email', NEW.email,
                'auth_provider', NEW.auth_provider
            ),
            NEW.created_at
        );
        RETURN NEW;
    END IF;

    -- Profile completion and persona identification events
    IF TG_TABLE_NAME = 'user_profiles' THEN
        -- Onboarding completed
        IF TG_OP = 'UPDATE' AND OLD.onboarding_completed = false AND NEW.onboarding_completed = true THEN
            PERFORM public.create_timeline_event(
                NEW.user_id,
                'onboarding_completed',
                'Onboarding Concluído',
                'Você completou com sucesso o processo de onboarding do MadBoat.',
                jsonb_build_object(
                    'alma_phase', NEW.alma_phase_current,
                    'language', NEW.language,
                    'timezone', NEW.timezone
                ),
                now()
            );
        END IF;

        -- Persona identified
        IF TG_OP = 'UPDATE' AND OLD.persona_identified = false AND NEW.persona_identified = true THEN
            PERFORM public.create_timeline_event(
                NEW.user_id,
                'persona_identified',
                'Sua Persona Foi Identificada',
                'Descobrimos qual persona melhor representa você na jornada MadBoat.',
                jsonb_build_object(
                    'alma_phase', NEW.alma_phase_current,
                    'previous_phase', OLD.alma_phase_current
                ),
                now()
            );
        END IF;

        -- Phase change
        IF TG_OP = 'UPDATE' AND OLD.alma_phase_current != NEW.alma_phase_current THEN
            PERFORM public.create_timeline_event(
                NEW.user_id,
                'phase_' || NEW.alma_phase_current || '_entered',
                'Nova Fase: ' || INITCAP(NEW.alma_phase_current),
                'Você evoluiu para uma nova fase da jornada MadBoat.',
                jsonb_build_object(
                    'previous_phase', OLD.alma_phase_current,
                    'new_phase', NEW.alma_phase_current,
                    'transition_date', now()
                ),
                now()
            );
        END IF;

        RETURN NEW;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic event creation
CREATE TRIGGER trigger_users_timeline_events
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.trigger_create_timeline_event();

CREATE TRIGGER trigger_user_profiles_timeline_events
    AFTER UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.trigger_create_timeline_event();

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.event_types IS 'Standardized event types for timeline tracking';
COMMENT ON TABLE public.timeline_events IS 'User timeline events tracking all journey milestones';
COMMENT ON FUNCTION public.create_timeline_event IS 'Creates a new timeline event for a user';
COMMENT ON FUNCTION public.get_user_timeline IS 'Retrieves user timeline with filtering options';
COMMENT ON COLUMN public.timeline_events.event_data IS 'JSON data containing event-specific information';
COMMENT ON COLUMN public.timeline_events.is_featured IS 'Whether this event should be prominently displayed';

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check event types
SELECT event_type_id, display_name, category, is_milestone, display_order
FROM public.event_types
ORDER BY display_order;

-- Check indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename IN ('event_types', 'timeline_events')
AND schemaname = 'public'
ORDER BY tablename, indexname;

-- Victory! The timeline architecture rises from the depths like a digital Atlantis! ⚓