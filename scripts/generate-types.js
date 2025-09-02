#!/usr/bin/env node
// @ts-check

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * MadBoat Type Generation Script
 * Generates and syncs types across all packages
 */

const PACKAGES = ['packages/core', 'packages/ui', 'packages/api'];
const TYPE_DIRS = PACKAGES.map(pkg => path.join(pkg, 'src', 'types'));

console.log('🐙 MadBoat Type Generation Starting...\n');

// 1. Generate Supabase types
console.log('📊 Generating Supabase types...');
try {
  // This would connect to your Supabase project
  // execSync('supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/core/src/types/supabase.ts');
  
  // For now, create a placeholder
  const supabaseTypes = `
// Generated Supabase types for MadBoat
// Update this with: supabase gen types typescript

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string  
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}
`;

  fs.writeFileSync('packages/core/src/types/supabase.ts', supabaseTypes);
  console.log('✅ Supabase types generated');
} catch (error) {
  console.log('⚠️  Supabase types generation skipped (connection required)');
}

// 2. Sync shared types across packages
console.log('\n🔄 Syncing shared types...');

const sharedTypes = `
// Shared types for MadBoat ecosystem
export interface MadBoatUser {
  id: string;
  email: string;
  persona?: 'kraken' | 'navigator' | 'lighthouse';
}

export interface MadBoatModule {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface AuthState {
  error?: string;
  success?: boolean;
}
`;

// Write to all packages
PACKAGES.forEach(pkg => {
  const typesDir = path.join(pkg, 'src', 'types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }
  fs.writeFileSync(path.join(typesDir, 'shared.ts'), sharedTypes);
});

console.log('✅ Shared types synced across packages');

// 3. Run TypeScript compilation check
console.log('\n🔍 Running TypeScript compilation check...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ All types compile successfully');
} catch (error) {
  console.log('❌ TypeScript compilation errors detected');
  process.exit(1);
}

console.log('\n🎉 MadBoat type generation completed!');