
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
