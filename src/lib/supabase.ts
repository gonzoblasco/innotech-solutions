import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para TypeScript
export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          browser_id: string
          agent_id: string
          title: string | null
          messages: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          browser_id: string
          agent_id: string
          title?: string | null
          messages?: any[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          browser_id?: string
          agent_id?: string
          title?: string | null
          messages?: any[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}