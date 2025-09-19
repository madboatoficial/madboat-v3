#!/usr/bin/env node

/**
 * ⚓ Poseidon's Database Cleanup Script
 *
 * This script performs a complete database cleanup and creates
 * the admin user for Captain Sandro.
 *
 * IMPORTANT: This should only be run on development databases!
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin user configuration
const ADMIN_CONFIG = {
  userId: '00000000-0000-0000-0000-000000000001',
  email: 'sandro@madboat.com',
  fullName: 'Captain Sandro Fidelis',
  password: '123456'
};

async function cleanDatabase() {
  console.log('🧹 Starting database cleanup...');

  try {
    // Clean user_profiles first (foreign key constraint)
    const { error: profilesError } = await supabase
      .from('user_profiles')
      .delete()
      .neq('user_id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (profilesError) {
      console.error('❌ Error cleaning user_profiles:', profilesError.message);
    } else {
      console.log('✅ Cleaned user_profiles table');
    }

    // Clean users table
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .neq('user_id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (usersError) {
      console.error('❌ Error cleaning users:', usersError.message);
    } else {
      console.log('✅ Cleaned users table');
    }

    console.log('✅ Database cleanup completed');

  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    throw error;
  }
}

async function createAdminUser() {
  console.log('👑 Creating admin user...');

  try {
    // Create user record in custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        user_id: ADMIN_CONFIG.userId,
        email: ADMIN_CONFIG.email,
        full_name: ADMIN_CONFIG.fullName,
        status: 'ACTIVE',
        auth_provider: 'email',
        email_verified_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creating user:', userError.message);
      throw userError;
    }

    console.log('✅ Created user record:', userData.email);

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: ADMIN_CONFIG.userId,
        avatar_url: 'https://github.com/sandrofidelis.png',
        bio: 'Captain and Founder of MadBoat - Navigating the digital seas of innovation',
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        onboarding_completed: true,
        persona_identified: true,
        alma_phase_current: 'expansao',
        privacy_analytics: true
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message);
      throw profileError;
    }

    console.log('✅ Created user profile');

    return { userData, profileData };

  } catch (error) {
    console.error('❌ Admin user creation failed:', error.message);
    throw error;
  }
}

async function verifyCreation() {
  console.log('🔍 Verifying user creation...');

  try {
    // Check user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ADMIN_CONFIG.email)
      .single();

    if (userError) {
      console.error('❌ Error verifying user:', userError.message);
      return false;
    }

    // Check profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', ADMIN_CONFIG.userId)
      .single();

    if (profileError) {
      console.error('❌ Error verifying profile:', profileError.message);
      return false;
    }

    // Count totals
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: profileCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Verification Results:');
    console.log(`   👤 User: ${user.email} (${user.full_name})`);
    console.log(`   🏷️  Status: ${user.status}`);
    console.log(`   📍 Profile: ${profile.alma_phase_current} phase`);
    console.log(`   📈 Total users: ${userCount}`);
    console.log(`   📈 Total profiles: ${profileCount}`);

    return true;

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('⚓ Poseidon\'s Database Cleanup & Admin Creation');
  console.log('=============================================');
  console.log('');

  console.log('⚠️  WARNING: This will clean ALL user data!');
  console.log('   Make sure you\'re running this on a development database.');
  console.log('');

  try {
    // Phase 1: Clean database
    await cleanDatabase();
    console.log('');

    // Phase 2: Create admin user
    await createAdminUser();
    console.log('');

    // Phase 3: Verify creation
    const verified = await verifyCreation();
    console.log('');

    if (verified) {
      console.log('🎉 SUCCESS! Database cleanup and admin creation completed!');
      console.log('');
      console.log('⚠️  IMPORTANT NEXT STEPS:');
      console.log('   1. Go to Supabase Dashboard > Authentication > Users');
      console.log('   2. Delete any existing auth users manually');
      console.log('   3. Create new auth user:');
      console.log(`      - Email: ${ADMIN_CONFIG.email}`);
      console.log(`      - Password: ${ADMIN_CONFIG.password}`);
      console.log(`      - Set UUID: ${ADMIN_CONFIG.userId} (if possible)`);
      console.log('   4. Confirm the email address');
      console.log('');
      console.log('⚓ The database depths have been cleansed and prepared!');
    } else {
      console.log('❌ FAILED! Database cleanup completed but verification failed.');
    }

  } catch (error) {
    console.error('💥 CRITICAL ERROR:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = {
  cleanDatabase,
  createAdminUser,
  verifyCreation
};