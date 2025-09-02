-- =============================================================================
-- MadBoat v2.0 - Rollback Authentication Schema
-- =============================================================================
-- Agent: Poseidon 
-- Task: Complete rollback procedures for authentication system
-- Created: 2025-08-31
-- Purpose: Safe rollback of all authentication-related changes
-- =============================================================================

-- WARNING: This will permanently delete all user data and cannot be undone!
-- Only run this in development environments or with full data backup

-- =============================================================================
-- ROLLBACK VERIFICATION
-- =============================================================================

DO $$
BEGIN
  -- Verify we're not in production
  IF current_setting('server_version_num')::integer >= 140000 THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_database 
      WHERE datname = current_database() 
      AND datname LIKE '%dev%' OR datname LIKE '%test%' OR datname LIKE '%local%'
    ) THEN
      RAISE EXCEPTION 'ROLLBACK BLOCKED: This appears to be a production database. Rollback is only allowed in development/test environments.';
    END IF;
  END IF;
  
  RAISE NOTICE '🚨 ROLLBACK INITIATED: All authentication data will be permanently deleted!';
END $$;

-- =============================================================================
-- DROP FUNCTIONS AND TRIGGERS (in reverse dependency order)
-- =============================================================================

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_xp_events_process ON public.xp_events;
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS trigger_user_personas_updated_at ON public.user_personas;
DROP TRIGGER IF EXISTS trigger_worlds_updated_at ON public.worlds;
DROP TRIGGER IF EXISTS trigger_personas_updated_at ON public.personas;
DROP TRIGGER IF EXISTS trigger_achievements_updated_at ON public.achievements;
DROP TRIGGER IF EXISTS trigger_user_achievements_updated_at ON public.user_achievements;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.handle_xp_change();
DROP FUNCTION IF EXISTS public.update_user_level(UUID);
DROP FUNCTION IF EXISTS public.calculate_xp_for_level(INTEGER);
DROP FUNCTION IF EXISTS public.award_xp(UUID, VARCHAR(50), INTEGER, TEXT, JSONB);

-- =============================================================================
-- DROP TABLES (in reverse dependency order to avoid FK constraint errors)
-- =============================================================================

-- Drop dependent tables first
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.xp_events CASCADE;  
DROP TABLE IF EXISTS public.user_personas CASCADE;

-- Drop main tables
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop reference tables
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.personas CASCADE;
DROP TABLE IF EXISTS public.worlds CASCADE;

-- =============================================================================
-- CLEANUP INDEXES (if any remain)
-- =============================================================================

-- Most indexes should be automatically dropped with tables, but just in case
DROP INDEX IF EXISTS idx_profiles_email;
DROP INDEX IF EXISTS idx_profiles_status;
DROP INDEX IF EXISTS idx_profiles_current_persona;
DROP INDEX IF EXISTS idx_profiles_current_world;
DROP INDEX IF EXISTS idx_profiles_onboarding;
DROP INDEX IF EXISTS idx_profiles_level;
DROP INDEX IF EXISTS idx_profiles_subscription;

DROP INDEX IF EXISTS idx_user_personas_user_id;
DROP INDEX IF EXISTS idx_user_personas_persona_id;
DROP INDEX IF EXISTS idx_user_personas_last_used;
DROP INDEX IF EXISTS idx_user_personas_level;

DROP INDEX IF EXISTS idx_xp_events_user_id;
DROP INDEX IF EXISTS idx_xp_events_persona_id;
DROP INDEX IF EXISTS idx_xp_events_type;
DROP INDEX IF EXISTS idx_xp_events_occurred_at;
DROP INDEX IF EXISTS idx_xp_events_user_occurred;

DROP INDEX IF EXISTS idx_achievements_category;
DROP INDEX IF EXISTS idx_achievements_difficulty;
DROP INDEX IF EXISTS idx_achievements_required_level;
DROP INDEX IF EXISTS idx_achievements_active;

DROP INDEX IF EXISTS idx_user_achievements_user_id;
DROP INDEX IF EXISTS idx_user_achievements_achievement_id;
DROP INDEX IF EXISTS idx_user_achievements_status;
DROP INDEX IF EXISTS idx_user_achievements_completed;

DROP INDEX IF EXISTS idx_personas_world_id;
DROP INDEX IF EXISTS idx_personas_active;
DROP INDEX IF EXISTS idx_personas_unlock_level;

-- =============================================================================
-- CLEANUP RLS POLICIES (automatic with table drops)
-- =============================================================================

-- RLS policies are automatically dropped when tables are dropped
-- No explicit cleanup needed

-- =============================================================================
-- RESET AUTH.USERS METADATA (if needed)
-- =============================================================================

-- Note: We don't delete auth.users records as they're managed by Supabase Auth
-- But we can clean up any custom metadata we might have added

-- UPDATE auth.users 
-- SET raw_user_meta_data = '{}'::jsonb 
-- WHERE raw_user_meta_data ? 'madboat_profile_created';

-- =============================================================================
-- VERIFY CLEANUP
-- =============================================================================

DO $$
DECLARE
  table_count INTEGER;
  function_count INTEGER;
  trigger_count INTEGER;
BEGIN
  -- Count remaining MadBoat tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'worlds', 'personas', 'user_personas', 'xp_events', 'achievements', 'user_achievements');
  
  -- Count remaining MadBoat functions  
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines
  WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'handle_updated_at', 'handle_xp_change', 'update_user_level', 'calculate_xp_for_level', 'award_xp');
  
  -- Count remaining MadBoat triggers
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE trigger_schema = 'public'
  AND trigger_name LIKE 'trigger_%' OR trigger_name = 'on_auth_user_created';
  
  -- Report results
  RAISE NOTICE '🔍 ROLLBACK VERIFICATION:';
  RAISE NOTICE '   Tables remaining: %', table_count;
  RAISE NOTICE '   Functions remaining: %', function_count;  
  RAISE NOTICE '   Triggers remaining: %', trigger_count;
  
  IF table_count = 0 AND function_count = 0 AND trigger_count = 0 THEN
    RAISE NOTICE '✅ ROLLBACK SUCCESSFUL: All MadBoat authentication components removed!';
  ELSE
    RAISE WARNING '⚠️  ROLLBACK INCOMPLETE: Some components may still exist. Manual cleanup required.';
  END IF;
END $$;

-- =============================================================================
-- POST-ROLLBACK INSTRUCTIONS
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '📋 POST-ROLLBACK CHECKLIST:';
  RAISE NOTICE '   1. Verify auth.users table is intact (should contain only Supabase auth data)';
  RAISE NOTICE '   2. Check for any remaining custom indexes or constraints';
  RAISE NOTICE '   3. Clear application cache if using query caching';
  RAISE NOTICE '   4. Update application code to handle missing tables gracefully';
  RAISE NOTICE '   5. Run any application-specific cleanup procedures';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 TO REDEPLOY: Run migrations 001_auth_foundation.sql and 002_seed_data.sql';
  RAISE NOTICE '';
END $$;

-- =============================================================================
-- ROLLBACK COMPLETE
-- =============================================================================