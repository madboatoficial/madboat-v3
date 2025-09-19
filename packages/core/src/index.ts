export * from './personas'
export * from './worlds'
export * from './agents/KrakenXP'

// Supabase client (without conflicting types)
export { supabase } from './lib/supabase'

// Legacy types for backwards compatibility (renamed to avoid conflicts)
export type {
  Database as LegacyDatabase,
  Json as LegacyJson,
  Tables as LegacyTables,
  TablesInsert as LegacyTablesInsert,
  TablesUpdate as LegacyTablesUpdate
} from './types/database'

// New persona-focused types (primary exports)
export * from './types/supabase'