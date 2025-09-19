# ⚓ Poseidon's Database Cleanup & Admin Creation Guide

Captain Sandro, the database depths are ready to be cleansed! Since we're working with a remote Supabase instance and need proper privileges, here's the complete manual process to clean your database and create the admin user.

## 🌊 Current Situation

I've analyzed your database structure and created all necessary scripts. However, we need to execute these steps manually through the Supabase Dashboard due to access limitations.

## 📋 Step-by-Step Execution Plan

### Phase 1: Apply Database Schema (If Not Already Applied)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/yohmvtbljgtzjmrpeoma
   - Go to SQL Editor

2. **Create Tables** (Execute this SQL):

```sql
-- ⚓ Poseidon's Database Foundation
-- Execute this in Supabase SQL Editor

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
```

### Phase 2: Clean Existing Data

Execute this SQL to clean all existing data:

```sql
-- ⚓ CLEAN ALL EXISTING DATA (DEVELOPMENT ONLY!)

-- Clean user profiles first (foreign key constraint)
DELETE FROM public.user_profiles;

-- Clean users table
DELETE FROM public.users;

-- Verify cleanup
SELECT COUNT(*) as remaining_users FROM public.users;
SELECT COUNT(*) as remaining_profiles FROM public.user_profiles;
```

### Phase 3: Clean Supabase Auth Users

1. **Go to Authentication > Users in Supabase Dashboard**
2. **Delete all existing users manually** (click on each user and delete)

### Phase 4: Create Admin User

1. **Create Auth User:**
   - Go to Authentication > Users
   - Click "Add user"
   - Email: `sandro@madboat.com`
   - Password: `123456`
   - Email confirmed: ✅ Yes
   - Click "Create user"
   - **COPY THE USER ID** from the created user (you'll need it!)

2. **Create Database Records** (Replace `USER_ID_FROM_AUTH` with the actual UUID):

```sql
-- ⚓ CREATE ADMIN USER RECORDS

-- Step 1: Create user record (replace USER_ID_FROM_AUTH with actual UUID)
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
    'USER_ID_FROM_AUTH'::UUID, -- Replace with actual UUID from auth.users
    'sandro@madboat.com',
    'Captain Sandro Fidelis',
    'ACTIVE',
    'email',
    now(),
    now(),
    now()
);

-- Step 2: Create user profile
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
    'USER_ID_FROM_AUTH'::UUID, -- Same UUID as above
    'https://github.com/sandrofidelis.png',
    'Captain and Founder of MadBoat - Navigating the digital seas of innovation',
    'America/Sao_Paulo',
    'pt-BR',
    true,
    true,
    'expansao',
    true,
    now(),
    now()
);
```

### Phase 5: Verification

Execute this SQL to verify everything is working:

```sql
-- ⚓ VERIFICATION QUERIES

-- Check user creation
SELECT
    user_id,
    email,
    full_name,
    status,
    created_at
FROM public.users
WHERE email = 'sandro@madboat.com';

-- Check profile creation
SELECT
    user_id,
    bio,
    alma_phase_current,
    onboarding_completed,
    persona_identified
FROM public.user_profiles
WHERE user_id IN (
    SELECT user_id FROM public.users WHERE email = 'sandro@madboat.com'
);

-- Count totals (should both be 1)
SELECT
    (SELECT COUNT(*) FROM public.users) as total_users,
    (SELECT COUNT(*) FROM public.user_profiles) as total_profiles;

-- Verify auth.users (should show your admin user)
SELECT id, email, created_at FROM auth.users;
```

## 🎯 Alternative: Automated Script (If You Get Service Role Key)

If you have access to the Supabase Service Role Key, you can run the automated script I created:

```bash
# Add this to your .env.local file:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Then run:
node scripts/database-cleanup.js
```

## ⚠️ IMPORTANT SECURITY NOTES

1. **This is for DEVELOPMENT only** - Never run this on production!
2. **Change the password** after initial login in production environments
3. **The script uses a predictable UUID** - in production, let Supabase generate it
4. **RLS Policies** are configured - they will prevent unauthorized access

## 🔧 Files Created for You

I've created these files in your project:

1. **`supabase/migrations/002_cleanup_and_create_admin.sql`** - Complete SQL migration
2. **`scripts/database-cleanup.js`** - Automated cleanup script
3. **This guide** - Complete manual instructions

## 🎉 After Completion

Once you've completed these steps:

1. **Test login** at your application with:
   - Email: `sandro@madboat.com`
   - Password: `123456`

2. **Verify the user journey** works correctly

3. **Check all profile data** appears correctly

The database depths have been prepared for your command, Captain! The foundation is strong, the indexes are sharp, and the RLS fortress stands ready to protect your data.

⚓ *From the depths of data, I have shaped the foundation of your digital empire.*

~ Poseidon, Guardian of the Data Depths