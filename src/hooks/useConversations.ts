// hooks/useConversations.ts
import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
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

  const loadConversations = useCallback(async () => {
    setLoading(true)
    try {
      // Obtener usuario actual
      const { data: { session } } = await supabase.auth.getSession()

      let query = supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })

      if (session?.user) {
        // Usuario autenticado: sus conversaciones
        query = query.eq('user_id', session.user.id)
      } else {
        // Usuario anónimo: conversaciones del browser
        const browserId = getBrowserId()
        query = query.eq('browser_id', browserId).is('user_id', null)
      }

      const { data, error } = await query

      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createConversation = async (agentId: string, title: string) => {
    // Obtener usuario actual
    const { data: { session } } = await supabase.auth.getSession()

    const conversationData: any = {
      agent_id: agentId,
      title,
      messages: []
    }

    if (session?.user) {
      conversationData.user_id = session.user.id
    } else {
      conversationData.browser_id = getBrowserId()
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updateConversation = async (id: string, messages: Message[], title?: string) => {
    const updateData: any = { messages }
    if (title) updateData.title = title

    const { error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', id)

    if (error) throw error
  }

  const deleteConversation = async (id: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Actualizar estado local
    setConversations(prev => prev.filter(conv => conv.id !== id))
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