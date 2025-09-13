-- MadBoat V3 Database Foundation Script

-- Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  privacy_analytics BOOLEAN DEFAULT TRUE,
  privacy_marketing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON public.profiles(status);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user creation
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

-- Trigger for auto profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create test user
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  existing_user UUID;
BEGIN
  SELECT id INTO existing_user
  FROM auth.users
  WHERE email = 'sandro@madboat.com';

  IF existing_user IS NULL THEN
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

    RAISE NOTICE 'Created test user with ID: %', test_user_id;
  ELSE
    RAISE NOTICE 'Test user already exists with ID: %', existing_user;
  END IF;
END $$;

-- Verification queries
SELECT 'SUCCESS: Tables created!' as status;

SELECT
  schemaname,
  tablename,
  rowsecurity as "RLS_Enabled"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

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