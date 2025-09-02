# 🔧 MadBoat Signup Fix Guide

**Agent:** Poseidon  
**Issue:** "Database error saving new user" during signup  
**Root Cause:** Missing RLS policies and trigger function not working properly  

## 🔍 Problem Analysis

✅ **Tables exist** - Migration structure was applied  
❌ **No seed data** - Worlds table is empty  
❌ **Trigger failing** - `handle_new_user()` function blocked by RLS policies  
❌ **RLS policies incomplete** - Missing INSERT policies for profile creation  

## 🚀 IMMEDIATE FIX (Choose Option A or B)

### Option A: Quick Fix via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com/project/yohmvtbljgtzjmrpeoma
   - Navigate to: SQL Editor

2. **Apply Missing RLS Policy**
   ```sql
   -- Allow profile creation during signup
   CREATE POLICY "profiles_signup_insert" ON public.profiles
     FOR INSERT TO authenticated
     WITH CHECK (auth.uid() = id);
   ```

3. **Fix XP Events RLS Policy**
   ```sql
   -- Allow XP events creation during signup
   DROP POLICY IF EXISTS "xp_events_system_insert" ON public.xp_events;
   CREATE POLICY "xp_events_signup_insert" ON public.xp_events
     FOR INSERT TO authenticated
     WITH CHECK (auth.uid() = user_id);
   ```

4. **Re-create Trigger Function** (if needed)
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, email, full_name, data_processing_consent)
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
       true
     );
     
     INSERT INTO public.xp_events (user_id, event_type, event_category, xp_awarded, base_xp, description)
     VALUES (
       NEW.id,
       'user_registration',
       'onboarding',
       50,
       50,
       'Welcome to MadBoat! Registration completed.'
     );
     
     RETURN NEW;
   EXCEPTION
     WHEN OTHERS THEN
       RAISE LOG 'Error in handle_new_user: %', SQLERRM;
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

5. **Apply Seed Data**
   ```sql
   -- Execute the contents of 002_seed_data.sql
   -- This will populate the worlds, personas, and achievements tables
   ```

### Option B: Application-Level Fix (Alternative)

If the trigger approach continues to fail, implement profile creation in the application:

1. **Modify signup handler in page.tsx**
2. **Create profile manually after successful auth signup**
3. **Award initial XP through application logic**

## 📋 VERIFICATION STEPS

After applying the fix:

1. **Run the test script:**
   ```bash
   cd db && node simple-check.js
   ```

2. **Test signup in the app:**
   - Go to http://localhost:3001
   - Try creating a new account
   - Should succeed without "Database error saving new user"

3. **Check profile creation:**
   - User should be logged in successfully
   - Profile should exist in profiles table
   - Initial XP event should be recorded

## 🔧 ADDITIONAL FIXES NEEDED

### 1. Fix TypeScript Types
Current types in `packages/core/src/lib/supabase.ts` don't match the database schema:

**Issues:**
- Uses `user_id` field instead of `id` 
- Uses `xp_total` instead of `total_xp`
- Uses `level` instead of `current_level`
- Missing many schema fields

**Solution:** Update the Database interface to match the actual schema.

### 2. Add Seed Data
The worlds table is empty, which will break persona selection:

**Solution:** Apply migration `002_seed_data.sql` to populate:
- 3 worlds (A.L.M.A, Vórtice, Odisseia)
- 9 personas (3 per world)
- Achievement definitions

## 🎯 EXPECTED RESULTS

After applying all fixes:
- ✅ Signup works without database errors
- ✅ User profiles are created automatically  
- ✅ Initial XP is awarded (50 points)
- ✅ Worlds and personas data is available
- ✅ TypeScript types match database schema

## 📞 NEXT STEPS

1. **CRITICAL:** Apply Option A fixes in Supabase Dashboard
2. **IMPORTANT:** Apply seed data migration  
3. **RECOMMENDED:** Fix TypeScript types
4. **TEST:** Verify complete signup flow works

---

**Status:** Ready for implementation  
**Priority:** CRITICAL - Blocking user registration  
**ETA:** 15-30 minutes to fix

🌊 *"From chaos to order, the depths reveal their secrets!"* - Poseidon ⚓