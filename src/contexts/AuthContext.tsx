// src/contexts/AuthContext.tsx - REEMPLAZAR COMPLETAMENTE
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const supabase = createClient()

  // ✅ FIXED: Inicialización con timeout
  useEffect(() => {
    if (initialized) return

    const initializeAuth = async () => {
      try {
        console.log('🔄 AuthProvider: Inicializando...')

        // Promise con timeout de 5 segundos
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        )

        const result = await Promise.race([sessionPromise, timeoutPromise]) as any

        const session = result?.data?.session || null
        console.log('✅ AuthProvider: Session obtenida:', session?.user?.email || 'No session')

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          fetchProfile(session.user.id).catch(console.error)
        }

      } catch (error) {
        console.log('⚠️ AuthProvider: Timeout/error, usando fallback sin auth')
        setSession(null)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
        setInitialized(true)
        console.log('✅ AuthProvider: Inicialización completada')
      }
    }

    initializeAuth()
  }, [])

  // ✅ FIXED: Auth listener solo después de inicializar
  useEffect(() => {
    if (!initialized) return

    console.log('👂 AuthProvider: Setting up listener...')

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 AuthProvider: Auth change:', event)

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user && event !== 'SIGNED_OUT') {
        fetchProfile(session.user.id).catch(console.error)
      } else {
        setProfile(null)
      }
    })

    return () => {
      console.log('🛑 AuthProvider: Cleanup listener')
      subscription.unsubscribe()
    }
  }, [initialized])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Create profile if doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert([{
            id: userId,
            preferences: {}
          }])
          .select()
          .single()

        if (!insertError) {
          setProfile(newProfile)
        }
      } else if (!error) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('📝 AuthProvider: Signing up:', email)

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        console.error('❌ SignUp error:', error)
      } else {
        console.log('✅ SignUp successful')
      }

      return { error }
    } catch (error) {
      console.error('💥 SignUp catch:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 AuthProvider: Signing in:', email)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ SignIn error:', error)
      } else {
        console.log('✅ SignIn successful')
      }

      return { error }
    } catch (error) {
      console.error('💥 SignIn catch:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      console.log('👋 AuthProvider: Signing out')

      const { error } = await supabase.auth.signOut()

      if (!error) {
        setUser(null)
        setProfile(null)
        setSession(null)
        console.log('✅ SignOut successful')
      }

      return { error }
    } catch (error) {
      console.error('💥 SignOut catch:', error)
      return { error }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (!error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null)
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}