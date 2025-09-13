-- ⚓ MadBoat V3 Database Foundation Script
-- Purpose: Create authentication tables and test user
-- Created: 2025-01-13

-- =============================================================================
-- CREATE PROFILES TABLE
-- =============================================================================

-- Create the profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),

  -- Onboarding fields
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,

  -- Preferences
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),

  -- Privacy settings
  privacy_analytics BOOLEAN DEFAULT TRUE,
  privacy_marketing BOOLEAN DEFAULT FALSE,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON public.profiles(status);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================================================
-- CREATE FUNCTION TO HANDLE USER CREATION
-- =============================================================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- CREATE TEST USER
-- =============================================================================

-- Create test user in auth.users
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  existing_user UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user
  FROM auth.users
  WHERE email = 'sandro@madboat.com';

  IF existing_user IS NULL THEN
    -- Insert into auth.users
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
      role
    ) VALUES (
      test_user_id,
      '00000000-0000-0000-0000-000000000000',
      'sandro@madboat.com',
      crypt('Vindarnaviskar1685!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"full_name": "Captain Sandro"}',
      'authenticated',
      'authenticated'
    );

    -- The trigger will automatically create the profile
    RAISE NOTICE '⚓ Created test user with ID: %', test_user_id;

  ELSE
    RAISE NOTICE '⚓ Test user already exists with ID: %', existing_user;
  END IF;
END $$;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Show created tables
SELECT
  schemaname,
  tablename,
  tableowner,
  rowsecurity as "RLS_Enabled"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Show test user
SELECT
  'Auth User' as type,
  u.id::text,
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmed,
  u.created_at
FROM auth.users u
WHERE u.email = 'sandro@madboat.com'

UNION ALL

SELECT
  'Profile' as type,
  p.id::text,
  p.email,
  p.onboarding_completed as confirmed,
  p.created_at
FROM public.profiles p
WHERE p.email = 'sandro@madboat.com';

-- Show RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Success message
SELECT '⚓ MadBoat Database Foundation Complete! Ready for Captain login!' as status;