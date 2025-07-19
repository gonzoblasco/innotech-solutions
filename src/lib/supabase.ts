// src/lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Client for client components (browser)
export const createClient = () => createClientComponentClient()

// Types for database
export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          browser_id: string | null
          user_id: string | null
          agent_id: string
          title: string | null
          messages: any[]
          created_at: string
          updated_at: string
          migrated_from_browser_id: string | null
        }
        Insert: {
          id?: string
          browser_id?: string | null
          user_id?: string | null
          agent_id: string
          title?: string | null
          messages?: any[]
          created_at?: string
          updated_at?: string
          migrated_from_browser_id?: string | null
        }
        Update: {
          id?: string
          browser_id?: string | null
          user_id?: string | null
          agent_id?: string
          title?: string | null
          messages?: any[]
          updated_at?: string
          migrated_from_browser_id?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          preferences?: any
          updated_at?: string
        }
      }
    }
  }
}