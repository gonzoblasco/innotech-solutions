'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Función para manejar cambios de auth
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error.message)
          setSession(null)
          setUser(null)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Session check failed:', error)
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Obtener sesión inicial
    getSession()

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Migrar conversaciones al hacer login
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const response = await fetch('/api/conversations/migrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id })
          })

          if (response.ok) {
            console.log('Conversations migrated successfully')
          }
        } catch (error) {
          console.error('Migration failed:', error)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // La sesión se actualiza automáticamente via onAuthStateChange
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión')
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Para desarrollo, auto-confirmar
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User registered, auto-signing in...')
        await login(email, password)
      }

      return data
    } catch (error: any) {
      throw new Error(error.message || 'Error al crear cuenta')
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }

      // Limpiar estado local
      setUser(null)
      setSession(null)

      // Redirect a home
      window.location.href = '/'
    } catch (error: any) {
      console.error('Logout error:', error)
      // Forzar limpieza aunque haya error
      setUser(null)
      setSession(null)
      window.location.href = '/'
    }
  }

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}