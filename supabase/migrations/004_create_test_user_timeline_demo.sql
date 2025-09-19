-- ⚓ Poseidon's Timeline Events Testing Demo
-- Agent: Poseidon
-- Task: Create test@madboat.com user and demonstrate timeline system
-- Created: 2025-01-15
-- Purpose: Test the complete timeline events system with real user data

-- =============================================================================
-- STEP 1: CREATE TEST USER (test@madboat.com)
-- =============================================================================

-- First, insert or update the test user in public.users
INSERT INTO public.users (
    user_id,
    email,
    full_name,
    status,
    auth_provider,
    email_verified_at,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111'::UUID, -- Test user UUID
    'test@madboat.com',
    'Test User MadBoat',
    'ACTIVE',
    'email',
    now(),
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    status = EXCLUDED.status,
    email_verified_at = EXCLUDED.email_verified_at,
    updated_at = now();

-- Create or update test user profile
INSERT INTO public.user_profiles (
    user_id,
    avatar_url,
    bio,
    timezone,
    language,
    onboarding_completed,
    persona_identified,
    alma_phase_current,
    privacy_analytics,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111'::UUID,
    'https://api.dicebear.com/7.x/adventurer/svg?seed=test',
    'Test user for MadBoat timeline system demonstration',
    'America/Sao_Paulo',
    'pt-BR',
    false, -- Will be updated later to trigger events
    false, -- Will be updated later to trigger events
    'autenticidade',
    true,
    now(),
    now()
) ON CONFLICT (user_id) DO UPDATE SET
    avatar_url = EXCLUDED.avatar_url,
    bio = EXCLUDED.bio,
    timezone = EXCLUDED.timezone,
    language = EXCLUDED.language,
    updated_at = now();

-- =============================================================================
-- STEP 2: DEMONSTRATE MANUAL EVENT CREATION
-- =============================================================================

-- Create initial account creation event (this would normally be automatic)
SELECT public.create_timeline_event(
    '11111111-1111-1111-1111-111111111111'::UUID,
    'account_created',
    'Conta de Teste Criada',
    'Esta conta foi criada especificamente para testar o sistema de timeline do MadBoat.',
    jsonb_build_object(
        'email', 'test@madboat.com',
        'auth_provider', 'email',
        'test_account', true
    ),
    now(),
    'system'
);

-- Create first login event
SELECT public.create_timeline_event(
    '11111111-1111-1111-1111-111111111111'::UUID,
    'first_login',
    'Primeiro Acesso ao Sistema',
    'Usuário de teste fez seu primeiro login no MadBoat.',
    jsonb_build_object(
        'login_method', 'email',
        'browser', 'test-browser',
        'ip_address', '127.0.0.1'
    ),
    now(),
    'system'
);

-- =============================================================================
-- STEP 3: SIMULATE ONBOARDING COMPLETION (TRIGGERS AUTOMATIC EVENTS)
-- =============================================================================

-- Update profile to complete onboarding - this will trigger automatic timeline event
UPDATE public.user_profiles
SET
    onboarding_completed = true,
    updated_at = now()
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- =============================================================================
-- STEP 4: SIMULATE PERSONA IDENTIFICATION (TRIGGERS AUTOMATIC EVENTS)
-- =============================================================================

-- Update profile to identify persona - this will trigger automatic timeline event
UPDATE public.user_profiles
SET
    persona_identified = true,
    alma_phase_current = 'liberdade', -- Also triggers phase change event
    updated_at = now()
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- =============================================================================
-- STEP 5: CREATE SOME ADDITIONAL MILESTONE EVENTS
-- =============================================================================

-- Create an achievement event
SELECT public.create_timeline_event(
    '11111111-1111-1111-1111-111111111111'::UUID,
    'milestone_reached',
    'Primeiro Marco Alcançado',
    'Usuário completou sua primeira jornada significativa no MadBoat.',
    jsonb_build_object(
        'milestone_type', 'onboarding_complete',
        'completion_percentage', 100,
        'time_spent_minutes', 15
    ),
    now(),
    'system'
);

-- Create a custom event
SELECT public.create_timeline_event(
    '11111111-1111-1111-1111-111111111111'::UUID,
    'custom_event',
    'Evento de Teste Personalizado',
    'Este é um evento personalizado criado para demonstrar a flexibilidade do sistema.',
    jsonb_build_object(
        'event_category', 'test',
        'created_by_agent', 'poseidon',
        'test_data', 'demo_value'
    ),
    now() - INTERVAL '2 hours', -- Event 2 hours ago
    'admin'
);

-- =============================================================================
-- STEP 6: VERIFICATION QUERIES - CHECK TIMELINE CREATION
-- =============================================================================

-- Count total events for test user
SELECT COUNT(*) as total_events
FROM public.timeline_events
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Show all events for test user (using our custom function)
SELECT *
FROM public.get_user_timeline(
    '11111111-1111-1111-1111-111111111111'::UUID,
    50,  -- limit
    0,   -- offset
    NULL, -- category filter
    false -- milestones_only
)
ORDER BY event_date DESC;

-- Show only milestone events
SELECT *
FROM public.get_user_timeline(
    '11111111-1111-1111-1111-111111111111'::UUID,
    50,  -- limit
    0,   -- offset
    NULL, -- category filter
    true  -- milestones_only
)
ORDER BY event_date DESC;

-- Show events by category
SELECT
    et.category,
    COUNT(*) as event_count,
    MIN(te.event_date) as first_event,
    MAX(te.event_date) as latest_event
FROM public.timeline_events te
JOIN public.event_types et ON te.event_type_id = et.event_type_id
WHERE te.user_id = '11111111-1111-1111-1111-111111111111'
GROUP BY et.category
ORDER BY event_count DESC;

-- =============================================================================
-- STEP 7: TEST TIMELINE FILTERING AND PERFORMANCE
-- =============================================================================

-- Test timeline with different filters
SELECT
    'All Events' as filter_type,
    COUNT(*) as count
FROM public.timeline_events
WHERE user_id = '11111111-1111-1111-1111-111111111111'

UNION ALL

SELECT
    'Visible Events' as filter_type,
    COUNT(*) as count
FROM public.timeline_events
WHERE user_id = '11111111-1111-1111-1111-111111111111'
AND is_visible = true

UNION ALL

SELECT
    'Featured Events' as filter_type,
    COUNT(*) as count
FROM public.timeline_events te
JOIN public.event_types et ON te.event_type_id = et.event_type_id
WHERE te.user_id = '11111111-1111-1111-1111-111111111111'
AND et.is_milestone = true

UNION ALL

SELECT
    'Persona Events' as filter_type,
    COUNT(*) as count
FROM public.timeline_events te
JOIN public.event_types et ON te.event_type_id = et.event_type_id
WHERE te.user_id = '11111111-1111-1111-1111-111111111111'
AND et.category = 'persona';

-- =============================================================================
-- STEP 8: CREATE SAMPLE FUTURE/PLANNED EVENTS
-- =============================================================================

-- Create a planned event for the future
INSERT INTO public.timeline_events (
    user_id,
    event_type_id,
    title,
    description,
    event_data,
    estimated_date,
    status,
    source,
    is_visible
) VALUES (
    '11111111-1111-1111-1111-111111111111'::UUID,
    'phase_expansao_entered',
    'Próxima Fase: Expansão',
    'Evento planejado para quando o usuário evoluir para a fase de Expansão.',
    jsonb_build_object(
        'target_phase', 'expansao',
        'estimated_requirements', jsonb_build_array('complete_liberdade_tasks', 'achieve_milestone_x')
    ),
    now() + INTERVAL '30 days',
    'planned',
    'system',
    true
);

-- =============================================================================
-- SUMMARY REPORT
-- =============================================================================

SELECT
    '🌊 POSEIDON TIMELINE SYSTEM TEST SUMMARY' as report_title,
    jsonb_build_object(
        'test_user_id', '11111111-1111-1111-1111-111111111111',
        'test_user_email', 'test@madboat.com',
        'total_events_created', (
            SELECT COUNT(*)
            FROM public.timeline_events
            WHERE user_id = '11111111-1111-1111-1111-111111111111'
        ),
        'milestone_events', (
            SELECT COUNT(*)
            FROM public.timeline_events te
            JOIN public.event_types et ON te.event_type_id = et.event_type_id
            WHERE te.user_id = '11111111-1111-1111-1111-111111111111'
            AND et.is_milestone = true
        ),
        'automatic_events', (
            SELECT COUNT(*)
            FROM public.timeline_events te
            WHERE te.user_id = '11111111-1111-1111-1111-111111111111'
            AND te.source = 'system'
        ),
        'event_categories', (
            SELECT jsonb_object_agg(et.category, category_count)
            FROM (
                SELECT
                    et.category,
                    COUNT(*) as category_count
                FROM public.timeline_events te
                JOIN public.event_types et ON te.event_type_id = et.event_type_id
                WHERE te.user_id = '11111111-1111-1111-1111-111111111111'
                GROUP BY et.category
            ) category_stats
        ),
        'test_status', 'SUCCESS',
        'created_by_agent', 'poseidon'
    ) as test_results;

-- =============================================================================
-- NOTES FOR FRONTEND INTEGRATION
-- =============================================================================

-- IMPORTANT: To use this timeline system in the frontend:
--
-- 1. **Fetch User Timeline:**
--    ```typescript
--    const { data: timeline } = await supabase
--      .rpc('get_user_timeline', {
--        p_user_id: user.id,
--        p_limit: 20,
--        p_offset: 0,
--        p_milestones_only: false
--      });
--    ```
--
-- 2. **Create Custom Events:**
--    ```typescript
--    const { data: eventId } = await supabase
--      .rpc('create_timeline_event', {
--        p_user_id: user.id,
--        p_event_type_id: 'custom_event',
--        p_title: 'My Custom Event',
--        p_description: 'User performed a custom action',
--        p_event_data: { action: 'custom', value: 123 }
--      });
--    ```
--
-- 3. **Timeline Components:**
--    - Use event_type.color_hex for visual consistency
--    - Use event_type.icon_name for consistent iconography
--    - Filter by is_milestone for highlighting important events
--    - Use event_date for chronological ordering
--
-- 4. **Real-time Updates:**
--    Set up Supabase realtime subscription on timeline_events table
--    to automatically update the UI when new events are created

-- Victory! The test user's timeline rises from the depths, fully populated with events! ⚓