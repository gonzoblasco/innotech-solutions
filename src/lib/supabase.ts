// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente único para toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Función helper para crear clientes (exportada)
export { createClient }

// Types actualizados para incluir user_id
export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          browser_id: string | null  // Ahora nullable
          user_id: string | null     // Nuevo campo
          agent_id: string
          title: string | null
          messages: any[]
          created_at: string
          updated_at: string
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
        }
        Update: {
          id?: string
          browser_id?: string | null
          user_id?: string | null
          agent_id?: string
          title?: string | null
          messages?: any[]
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
          preferences: any
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          preferences?: any
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          preferences?: any
        }
      }
    }
  }
}