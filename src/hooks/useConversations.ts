// hooks/useConversations.ts - VERSIÓN CORREGIDA
import { useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getBrowserId } from '@/lib/browser-id'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface Conversation {
  id: string
  browser_id: string | null
  user_id: string | null
  agent_id: string
  title: string | null
  messages: Message[]
  created_at: string
  updated_at: string
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)

  // 🔧 FIX: Usar cliente autenticado
  const supabase = createClientComponentClient()

  const loadConversations = useCallback(async () => {
    setLoading(true)
    try {
      // 🔧 FIX: Obtener sesión del cliente autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('❌ Session error:', sessionError)
        setConversations([])
        return
      }

      let query = supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })

      if (session?.user) {
        // Usuario autenticado: RLS se encarga del filtrado automáticamente
        console.log('👤 Loading conversations for authenticated user:', session.user.email)
        // NO necesitamos .eq('user_id', session.user.id) porque RLS lo hace automáticamente
      } else {
        // Usuario anónimo: buscar por browser_id
        const browserId = getBrowserId()
        console.log('🌐 Loading conversations for browser:', browserId)
        query = query.eq('browser_id', browserId).is('user_id', null)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log(`📊 Loaded ${data?.length || 0} conversations`)
      setConversations(data || [])
    } catch (error) {
      console.error('❌ Error loading conversations:', error)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createConversation = async (agentId: string, title: string) => {
    // 🔧 FIX: Obtener sesión del cliente autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('❌ Session error in createConversation:', sessionError)
      throw sessionError
    }

    const conversationData: any = {
      agent_id: agentId,
      title,
      messages: []
    }

    if (session?.user) {
      console.log('👤 Creating conversation for user:', session.user.email)
      conversationData.user_id = session.user.id
      // browser_id queda null para usuarios autenticados
    } else {
      console.log('🌐 Creating conversation for browser')
      conversationData.browser_id = getBrowserId()
      // user_id queda null para usuarios anónimos
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationData)
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating conversation:', error)
      throw error
    }

    console.log('✅ Conversation created:', data.id)
    return data
  }

  const updateConversation = async (id: string, messages: Message[], title?: string) => {
    const updateData: any = { messages, updated_at: new Date().toISOString() }
    if (title) updateData.title = title

    console.log('🔄 Updating conversation:', id)

    const { error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('❌ Error updating conversation:', error)
      throw error
    }

    console.log('✅ Conversation updated:', id)
  }

  const deleteConversation = async (id: string) => {
    console.log('🗑️ Deleting conversation:', id)

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error deleting conversation:', error)
      throw error
    }

    // Actualizar estado local
    setConversations(prev => prev.filter(conv => conv.id !== id))
    console.log('✅ Conversation deleted:', id)
  }

  return {
    conversations,
    loading,
    loadConversations,
    createConversation,
    updateConversation,
    deleteConversation
  }
}