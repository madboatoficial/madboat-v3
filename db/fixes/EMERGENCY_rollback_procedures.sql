-- =============================================================================
-- 🚨 EMERGENCY ROLLBACK PROCEDURES - Complete System Recovery
-- =============================================================================
-- Agent: Poseidon
-- Purpose: Safe rollback procedures for any signup system changes
-- Usage: Run specific sections based on which approach was attempted
-- CRITICAL: Always backup before running rollback procedures
-- =============================================================================

-- =============================================================================
-- ROLLBACK APPROACH 1: Enhanced Database Trigger
-- =============================================================================

-- Section 1A: Remove Enhanced Trigger
DO $$
BEGIN
  RAISE NOTICE 'Rolling back enhanced database trigger...';
  
  -- Drop trigger
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  
  -- Drop enhanced function
  DROP FUNCTION IF EXISTS public.handle_new_user();
  
  -- Restore original simple function (if exists)
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- Recreate simple trigger
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  
  RAISE NOTICE '✅ Enhanced trigger rolled back to simple version';
END $$;

-- Section 1B: Remove Enhanced RLS Policies
DO $$
DECLARE
  policy_name TEXT;
BEGIN
  RAISE NOTICE 'Rolling back enhanced RLS policies...';
  
  -- Drop enhanced policies
  FOR policy_name IN 
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'profiles' 
      AND policyname LIKE '%system%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_name);
    RAISE LOG 'Dropped policy: %', policy_name;
  END LOOP;
  
  -- Restore basic policies
  CREATE POLICY "profiles_own_read" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);
    
  CREATE POLICY "profiles_own_update" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);
  
  RAISE NOTICE '✅ RLS policies restored to basic version';
END $$;

-- =============================================================================
-- ROLLBACK APPROACH 2: Edge Function Webhook
-- =============================================================================

-- Section 2A: Remove Webhook Trigger
DO $$
BEGIN
  RAISE NOTICE 'Rolling back Edge Function webhook...';
  
  -- Drop webhook trigger
  DROP TRIGGER IF EXISTS on_auth_user_signup_webhook ON auth.users;
  
  -- Drop webhook function
  DROP FUNCTION IF EXISTS public.notify_user_signup();
  
  -- Drop Edge Function helper functions
  DROP FUNCTION IF EXISTS public.create_user_profile(UUID, TEXT, JSONB, TIMESTAMPTZ);
  
  RAISE NOTICE '✅ Edge Function webhook removed';
END $$;

-- Section 2B: Remove Webhook Infrastructure
DO $$
BEGIN
  RAISE NOTICE 'Removing webhook infrastructure...';
  
  -- Drop webhook logs table
  DROP TABLE IF EXISTS public.webhook_logs CASCADE;
  
  -- Remove system settings
  DELETE FROM public.system_settings 
  WHERE key LIKE '%webhook%' OR key LIKE '%edge_function%';
  
  DROP TABLE IF EXISTS public.system_settings CASCADE;
  
  RAISE NOTICE '✅ Webhook infrastructure removed';
END $$;

-- =============================================================================
-- ROLLBACK APPROACH 3: Hybrid Solution
-- =============================================================================

-- Section 3A: Remove Hybrid Functions
DO $$
BEGIN
  RAISE NOTICE 'Rolling back hybrid solution...';
  
  -- Drop hybrid trigger
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  
  -- Drop hybrid functions
  DROP FUNCTION IF EXISTS public.handle_new_user_with_logging();
  DROP FUNCTION IF EXISTS public.ensure_user_profile(UUID, TEXT, JSONB);
  DROP FUNCTION IF EXISTS public.admin_fix_failed_signup(UUID);
  DROP FUNCTION IF EXISTS public.signup_system_health();
  
  RAISE NOTICE '✅ Hybrid functions removed';
END $$;

-- Section 3B: Remove Hybrid Infrastructure
DO $$
BEGIN
  RAISE NOTICE 'Removing hybrid infrastructure...';
  
  -- Drop logging table
  DROP TABLE IF EXISTS public.signup_operations_log CASCADE;
  
  RAISE NOTICE '✅ Hybrid infrastructure removed';
END $$;

-- =============================================================================
-- COMPLETE SYSTEM RESET - NUCLEAR OPTION
-- =============================================================================

-- Section 4: Complete Reset (USE WITH EXTREME CAUTION)
DO $$
BEGIN
  RAISE NOTICE '⚠️ NUCLEAR OPTION: Complete signup system reset';
  RAISE NOTICE 'This will remove ALL signup automation and return to manual profile creation';
  
  -- Remove ALL triggers on auth.users
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  DROP TRIGGER IF EXISTS on_auth_user_signup_webhook ON auth.users;
  
  -- Remove ALL signup-related functions
  DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
  DROP FUNCTION IF EXISTS public.handle_new_user_with_logging() CASCADE;
  DROP FUNCTION IF EXISTS public.notify_user_signup() CASCADE;
  DROP FUNCTION IF EXISTS public.create_user_profile(UUID, TEXT, JSONB, TIMESTAMPTZ) CASCADE;
  DROP FUNCTION IF EXISTS public.ensure_user_profile(UUID, TEXT, JSONB) CASCADE;
  DROP FUNCTION IF EXISTS public.admin_fix_failed_signup(UUID) CASCADE;
  DROP FUNCTION IF EXISTS public.signup_system_health() CASCADE;
  
  -- Remove infrastructure tables
  DROP TABLE IF EXISTS public.webhook_logs CASCADE;
  DROP TABLE IF EXISTS public.signup_operations_log CASCADE;
  DROP TABLE IF EXISTS public.system_settings CASCADE;
  
  -- Reset RLS policies to absolute minimum
  DROP POLICY IF EXISTS "profiles_own_read" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_own_update" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_signup_insert" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_system_insert" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_user_insert" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_authenticated_read" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_authenticated_update" ON public.profiles;
  
  -- Create minimal working policies
  CREATE POLICY "profiles_basic_read" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);
    
  CREATE POLICY "profiles_basic_update" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);
    
  CREATE POLICY "profiles_basic_insert" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);
  
  RAISE NOTICE '💥 COMPLETE RESET PERFORMED';
  RAISE NOTICE '⚠️ All automation removed - profiles must be created manually';
  RAISE NOTICE '🎯 Recommendation: Use client-side profile creation only';
END $$;

-- =============================================================================
-- RECOVERY VERIFICATION
-- =============================================================================

-- Section 5: Verify System State After Rollback
DO $$
DECLARE
  trigger_count INTEGER;
  function_count INTEGER;
  policy_count INTEGER;
  table_count INTEGER;
BEGIN
  RAISE NOTICE 'Verifying system state after rollback...';
  
  -- Count remaining triggers
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers 
  WHERE event_object_schema = 'auth' 
    AND event_object_table = 'users';
  
  -- Count remaining functions
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines 
  WHERE routine_schema = 'public' 
    AND routine_name LIKE '%user%';
  
  -- Count RLS policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'profiles';
  
  -- Count infrastructure tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public'
    AND table_name IN ('webhook_logs', 'signup_operations_log', 'system_settings');
  
  RAISE NOTICE '📊 SYSTEM STATE SUMMARY:';
  RAISE NOTICE '   • Auth triggers: %', trigger_count;
  RAISE NOTICE '   • User functions: %', function_count;
  RAISE NOTICE '   • RLS policies: %', policy_count;
  RAISE NOTICE '   • Infrastructure tables: %', table_count;
  
  IF trigger_count = 0 AND function_count = 0 THEN
    RAISE NOTICE '✅ Complete rollback successful - no automation remains';
  ELSIF trigger_count <= 1 AND function_count <= 2 THEN
    RAISE NOTICE '✅ Partial rollback successful - basic functions remain';
  ELSE
    RAISE NOTICE '⚠️ Rollback may be incomplete - manual verification needed';
  END IF;
END $$;

-- =============================================================================
-- EMERGENCY CONTACTS & RECOVERY PROCEDURES
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '📞 EMERGENCY RECOVERY PROCEDURES:';
  RAISE NOTICE '';
  RAISE NOTICE '1. If users cannot sign up:';
  RAISE NOTICE '   • Run client-side profile creation manually';
  RAISE NOTICE '   • Check Supabase Dashboard > Database > Logs';
  RAISE NOTICE '   • Verify RLS policies allow INSERT for authenticated users';
  RAISE NOTICE '';
  RAISE NOTICE '2. If database corruption suspected:';
  RAISE NOTICE '   • Contact Supabase support immediately';
  RAISE NOTICE '   • Restore from most recent backup';
  RAISE NOTICE '   • Run VACUUM ANALYZE on affected tables';
  RAISE NOTICE '';
  RAISE NOTICE '3. If complete system failure:';
  RAISE NOTICE '   • Switch to manual user management';
  RAISE NOTICE '   • Use service role key for admin operations';
  RAISE NOTICE '   • Implement client-side only profile creation';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Contact: Database Administrator';
  RAISE NOTICE '🔧 Escalation: Supabase Support';
  RAISE NOTICE '📋 Documentation: Check shared context for details';
END $$;