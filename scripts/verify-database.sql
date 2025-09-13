-- ⚓ Poseidon's Database Verification Script
-- Purpose: Verify current database state and create test user
-- Created: 2025-01-13

-- =============================================================================
-- VERIFY CURRENT DATABASE STATE
-- =============================================================================

-- Check existing tables
SELECT
    schemaname,
    tablename,
    tableowner,
    rowsecurity as "RLS_Enabled"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check auth tables
SELECT
    tablename,
    rowsecurity as "RLS_Enabled"
FROM pg_tables
WHERE schemaname = 'auth'
ORDER BY tablename;

-- Check existing profiles
SELECT
    count(*) as total_profiles,
    count(*) FILTER (WHERE onboarding_completed = true) as completed_onboarding,
    count(*) FILTER (WHERE status = 'active') as active_users
FROM public.profiles;

-- Check for test user
SELECT
    id,
    email,
    full_name,
    status,
    onboarding_completed,
    created_at
FROM public.profiles
WHERE email = 'sandro@madboat.com';

-- Check auth users for test account
SELECT
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users
WHERE email = 'sandro@madboat.com';

-- =============================================================================
-- CREATE TEST USER IF NOT EXISTS
-- =============================================================================

-- Insert into auth.users if not exists
DO $$
DECLARE
    test_user_id UUID;
    existing_auth_user UUID;
    existing_profile_user UUID;
BEGIN
    -- Check if auth user exists
    SELECT id INTO existing_auth_user
    FROM auth.users
    WHERE email = 'sandro@madboat.com';

    -- Check if profile exists
    SELECT id INTO existing_profile_user
    FROM public.profiles
    WHERE email = 'sandro@madboat.com';

    -- Create auth user if not exists
    IF existing_auth_user IS NULL THEN
        test_user_id := gen_random_uuid();

        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_user_meta_data,
            aud,
            role,
            email_confirm_token
        ) VALUES (
            test_user_id,
            '00000000-0000-0000-0000-000000000000',
            'sandro@madboat.com',
            crypt('Vindarnaviskar1685!', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"full_name": "Captain Sandro"}',
            'authenticated',
            'authenticated',
            ''
        );

        RAISE NOTICE 'Created auth user with ID: %', test_user_id;
    ELSE
        test_user_id := existing_auth_user;
        RAISE NOTICE 'Auth user already exists with ID: %', test_user_id;
    END IF;

    -- Create profile if not exists
    IF existing_profile_user IS NULL THEN
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            status,
            onboarding_completed,
            language,
            timezone,
            privacy_analytics,
            created_at,
            updated_at
        ) VALUES (
            test_user_id,
            'sandro@madboat.com',
            'Captain Sandro',
            'active',
            false,
            'pt-BR',
            'America/Sao_Paulo',
            true,
            now(),
            now()
        );

        RAISE NOTICE 'Created profile for user: %', test_user_id;
    ELSE
        RAISE NOTICE 'Profile already exists for user: %', existing_profile_user;
    END IF;

END $$;

-- =============================================================================
-- VERIFY TEST USER CREATION
-- =============================================================================

-- Final verification
SELECT
    'Auth User' as type,
    id,
    email,
    email_confirmed_at IS NOT NULL as email_confirmed,
    created_at
FROM auth.users
WHERE email = 'sandro@madboat.com'

UNION ALL

SELECT
    'Profile' as type,
    id::text,
    email,
    onboarding_completed::text::boolean,
    created_at
FROM public.profiles
WHERE email = 'sandro@madboat.com';

-- Show RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname IN ('public', 'auth')
ORDER BY tablename, policyname;

RAISE NOTICE '⚓ Database verification complete! Test user ready for Captain!';