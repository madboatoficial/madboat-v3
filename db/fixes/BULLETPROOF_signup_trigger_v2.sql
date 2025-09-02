-- =============================================================================
-- 🛡️ BULLETPROOF SIGNUP TRIGGER V2 - Fixed Duplicate Policy Issue
-- =============================================================================
-- Agent: Poseidon
-- Purpose: Comprehensive fix with proper duplicate handling
-- Addresses: Policy already exists errors + original signup issues
-- =============================================================================

BEGIN;

-- =============================================================================
-- STEP 1: Complete RLS Policy Cleanup and Rebuild with Duplicate Protection
-- =============================================================================

-- Drop ALL existing policies safely
DO $$
BEGIN
  -- Profiles table
  DROP POLICY IF EXISTS "profiles_own_read" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_authenticated_read" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_own_update" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_authenticated_update" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_signup_insert" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_system_insert" ON public.profiles;
  DROP POLICY IF EXISTS "profiles_user_insert" ON public.profiles;
  
  -- XP Events table
  DROP POLICY IF EXISTS "xp_events_own_read" ON public.xp_events;
  DROP POLICY IF EXISTS "xp_events_user_read" ON public.xp_events;
  DROP POLICY IF EXISTS "xp_events_system_insert" ON public.xp_events;
  DROP POLICY IF EXISTS "xp_events_authenticated_insert" ON public.xp_events;
  DROP POLICY IF EXISTS "xp_events_user_insert" ON public.xp_events;
  
  RAISE LOG 'All existing policies dropped for clean rebuild';
END $$;

-- Create bulletproof RLS policies with proper permissions
CREATE POLICY "profiles_authenticated_read" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_authenticated_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- CRITICAL: System-level INSERT policy for triggers
CREATE POLICY "profiles_system_insert" ON public.profiles
  FOR INSERT TO public
  WITH CHECK (true);

-- User-level INSERT policy for direct client operations
CREATE POLICY "profiles_user_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- XP Events policies
CREATE POLICY "xp_events_user_read" ON public.xp_events
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "xp_events_system_insert" ON public.xp_events
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "xp_events_user_insert" ON public.xp_events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- STEP 2: Grant Explicit Permissions (Community-Researched Fix)
-- =============================================================================

-- Critical permissions for auth admin role
GRANT ALL PRIVILEGES ON TABLE public.profiles TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON TABLE public.xp_events TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON TABLE public.user_personas TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON TABLE public.user_achievements TO supabase_auth_admin;

-- Grant sequence permissions for UUID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin;

-- =============================================================================
-- STEP 3: Bulletproof Trigger Function with ALL Community Fixes
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = '' -- CRITICAL: Empty search path for security
AS $$
DECLARE
  profile_exists BOOLEAN := FALSE;
  profile_id UUID;
  xp_event_id UUID;
  error_context TEXT := '';
BEGIN
  -- Set context for debugging
  error_context := 'Starting handle_new_user for user: ' || NEW.id;
  
  -- STEP 1: Check if profile already exists (avoid duplicates)
  BEGIN
    SELECT EXISTS(
      SELECT 1 FROM public.profiles WHERE id = NEW.id
    ) INTO profile_exists;
    
    IF profile_exists THEN
      RAISE LOG 'Profile already exists for user %, skipping creation', NEW.id;
      RETURN NEW;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Error checking profile existence: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
      -- Continue anyway - better to attempt creation than fail silently
  END;
  
  -- STEP 2: Create profile with comprehensive error handling
  BEGIN
    error_context := 'Creating profile for user: ' || NEW.id;
    
    INSERT INTO public.profiles (
      id, 
      email, 
      full_name,
      display_name,
      data_processing_consent,
      email_verified_at,
      status,
      onboarding_completed,
      timezone,
      language
    ) VALUES (
      NEW.id,
      NEW.email,
      -- Handle various metadata formats from different auth providers
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'display_name',
        SPLIT_PART(NEW.email, '@', 1) -- Fallback to email prefix
      ),
      COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name'
      ),
      true, -- Required for LGPD compliance
      CASE 
        WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at 
        ELSE NULL 
      END,
      'ACTIVE',
      false, -- Onboarding not completed yet
      COALESCE(NEW.raw_user_meta_data->>'timezone', 'America/Sao_Paulo'),
      COALESCE(NEW.raw_user_meta_data->>'language', 'pt-BR')
    ) RETURNING id INTO profile_id;
    
    RAISE LOG 'Profile created successfully for user %', NEW.id;
    
  EXCEPTION
    WHEN unique_violation THEN
      -- Another process created the profile - that's OK
      RAISE LOG 'Profile already exists (concurrent creation) for user %', NEW.id;
      RETURN NEW;
    WHEN OTHERS THEN
      RAISE LOG 'CRITICAL: Profile creation failed for user %: % (SQLSTATE: %) Context: %', 
        NEW.id, SQLERRM, SQLSTATE, error_context;
      -- Re-raise to prevent silent failures
      RAISE;
  END;
  
  -- STEP 3: Award initial XP with comprehensive error handling
  BEGIN
    error_context := 'Creating XP event for user: ' || NEW.id;
    
    INSERT INTO public.xp_events (
      user_id, 
      event_type, 
      event_category, 
      xp_awarded, 
      base_xp, 
      description,
      event_data
    ) VALUES (
      NEW.id,
      'user_registration',
      'onboarding',
      50,
      50,
      'Welcome to MadBoat! Registration completed.',
      jsonb_build_object(
        'signup_method', COALESCE(NEW.raw_user_meta_data->>'provider', 'email'),
        'email_confirmed', (NEW.email_confirmed_at IS NOT NULL)
      )
    ) RETURNING id INTO xp_event_id;
    
    RAISE LOG 'Initial XP awarded successfully for user %', NEW.id;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- XP failure shouldn't block user creation
      RAISE LOG 'WARNING: XP award failed for user %: % (SQLSTATE: %) Context: %', 
        NEW.id, SQLERRM, SQLSTATE, error_context;
      -- Don't re-raise - profile creation succeeded
  END;
  
  -- STEP 4: Success logging
  RAISE LOG 'handle_new_user completed successfully for user %', NEW.id;
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Final error handling - log everything
    RAISE LOG 'FATAL: handle_new_user failed completely for user %: % (SQLSTATE: %) Context: %', 
      NEW.id, SQLERRM, SQLSTATE, error_context;
    -- Re-raise to prevent silent failures
    RAISE;
END;
$$;

-- =============================================================================
-- STEP 4: Recreate Trigger with Proper Configuration
-- =============================================================================

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

COMMIT;

-- =============================================================================
-- SUCCESS CONFIRMATION
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '🔧 BULLETPROOF SIGNUP TRIGGER V2 APPLIED!';
  RAISE NOTICE '✅ Fixed: Policy duplicate errors resolved';
  RAISE NOTICE '✅ Added: Comprehensive RLS policies with proper DROP IF EXISTS';
  RAISE NOTICE '✅ Fixed: Trigger function with bulletproof error handling';
  RAISE NOTICE '✅ Added: Explicit permission grants for auth admin';
  RAISE NOTICE '🚀 SYSTEM STATUS: Registration should work flawlessly now!';
  RAISE NOTICE '🎯 Next: Test signup flow immediately';
END $$;