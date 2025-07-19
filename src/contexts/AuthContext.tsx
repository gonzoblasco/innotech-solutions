// src/contexts/AuthContext.tsx - REEMPLAZAR COMPLETAMENTE
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  getAuthHeaders: () => Promise<HeadersInit>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  console.log('🔄 AuthProvider: Inicializando...')

  useEffect(() => {
    const supabase = createClient()

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('❌ AuthProvider: Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          console.log('✅ AuthProvider: Session obtenida:', session?.user?.email || 'No user')
        }
      } catch (error) {
        console.error('❌ AuthProvider: Exception getting session:', error)
      } finally {
        setLoading(false)
        console.log('✅ AuthProvider: Inicialización completada')
      }
    }

    getInitialSession()

    // Escuchar cambios de auth
    console.log('👂 AuthProvider: Setting up listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 AuthProvider: Auth change:', event)

      // Actualizar estado
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Log del token para debug
      if (session?.access_token) {
        console.log('🔑 AuthProvider: Token disponible:', session.access_token.substring(0, 20) + '...')
      } else {
        console.log('❌ AuthProvider: No token en session')
      }
    })

    return () => {
      console.log('🛑 AuthProvider: Cleanup listener')
      subscription.unsubscribe()
    }
  }, [])

  // 🔧 FUNCIÓN CLAVE: Obtener headers de autenticación
  const getAuthHeaders = async (): Promise<HeadersInit> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (session?.access_token) {
      headers['authorization'] = `Bearer ${session.access_token}`
      console.log('🔑 AuthProvider: Adding auth header for user:', user?.email)
      console.log('🔑 Token preview:', session.access_token.substring(0, 50) + '...')
    } else {
      // Intentar obtener sesión fresh
      const supabase = createClient()
      try {
        const { data: { session: freshSession }, error } = await supabase.auth.getSession()
        if (freshSession?.access_token && !error) {
          headers['authorization'] = `Bearer ${freshSession.access_token}`
          console.log('🔑 AuthProvider: Using fresh token for user:', freshSession.user?.email)

          // Actualizar estado con la sesión fresh
          setSession(freshSession)
          setUser(freshSession.user)
        } else {
          console.log('⚠️ AuthProvider: No access token available')
        }
      } catch (error) {
        console.error('❌ AuthProvider: Error getting fresh session:', error)
      }
    }

    return headers
  }

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      console.log('✅ AuthProvider: Sign in successful:', data.user?.email)
      return { data, error: null }
    } catch (error) {
      console.error('❌ AuthProvider: Sign in error:', error)
      return { data: null, error }
    }
  }

  // Sign up
  const signUp = async (email: string, password: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      console.log('✅ AuthProvider: Sign up successful:', data.user?.email)
      return { data, error: null }
    } catch (error) {
      console.error('❌ AuthProvider: Sign up error:', error)
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      console.log('✅ AuthProvider: Sign out successful')
    } catch (error) {
      console.error('❌ AuthProvider: Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    getAuthHeaders
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}