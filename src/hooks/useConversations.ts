'use client'

import { useState, useEffect } from 'react'
import { getBrowserId } from '@/lib/browser-id'
import { useAuth } from '@/contexts/AuthContext'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  browser_id: string | null
  user_id: string | null
  agent_id: string
  title: string | null
  messages: Message[]
  created_at: string
  updated_at: string
  migrated_from_browser_id?: string | null
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Usar el AuthContext que funciona
  const { user, loading: authLoading, getAuthHeaders } = useAuth()

  // Función para obtener headers correctos
  const getRequestHeaders = async () => {
    if (user) {
      // Usuario autenticado - usar headers de auth
      const authHeaders = await getAuthHeaders()
      console.log('🔑 Using auth headers for user:', user.email)
      return authHeaders
    } else {
      // Usuario no autenticado - usar browser ID
      const browserId = getBrowserId()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'x-browser-id': browserId
      }
      console.log('🆔 Using browser ID:', browserId)
      return headers
    }
  }

  // Cargar conversaciones
  const loadConversations = async () => {
    if (authLoading) {
      console.log('⏳ Auth still loading, skipping conversation load')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const headers = await getRequestHeaders()
      const endpoint = user ? '/api/user/conversations' : '/api/conversations'

      console.log('📡 Loading conversations from:', endpoint)
      console.log('📡 Request headers:', Object.keys(headers))

      const response = await fetch(endpoint, { headers })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response error:', response.status, errorText)
        throw new Error(`Failed to load conversations: ${response.status}`)
      }

      const data = await response.json()
      const conversationsList = data.conversations || []

      // Asegurar que es un array
      setConversations(Array.isArray(conversationsList) ? conversationsList : [])
      console.log('📊 Conversations loaded:', conversationsList.length || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('❌ Error loading conversations:', err)
      setConversations([]) // Fallback a array vacío
    } finally {
      setLoading(false)
    }
  }

  // Crear nueva conversación
  const createConversation = async (agentId: string, title?: string) => {
    try {
      const headers = await getRequestHeaders()
      const endpoint = user ? '/api/user/conversations' : '/api/conversations'

      const bodyData = user
        ? { agentId, title: title || 'Nueva conversación', messages: [] }
        : {
          browserId: getBrowserId(),
          agentId,
          title: title || 'Nueva conversación',
          messages: []
        }

      console.log('📝 Creating conversation:', bodyData)
      console.log('📝 Request headers:', Object.keys(headers))

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyData)
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Create error response:', response.status, errorData)
        throw new Error(`Failed to create conversation: ${response.status}`)
      }

      const data = await response.json()
      const newConversation = data.conversation

      // Agregar a la lista local
      setConversations(prev => [newConversation, ...prev])

      console.log('✅ Conversation created:', newConversation.id)
      return newConversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation')
      console.error('❌ Error creating conversation:', err)
      throw err
    }
  }

  // Actualizar conversación
  const updateConversation = async (conversationId: string, messages: Message[], title?: string) => {
    try {
      const headers = await getRequestHeaders()

      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ messages, title })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Update error response:', response.status, errorData)
        throw new Error(`Failed to update conversation: ${response.status}`)
      }

      const data = await response.json()
      const updatedConversation = data.conversation

      // Actualizar en lista local
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        )
      )

      console.log('🔄 Conversation updated:', conversationId)
      return updatedConversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation')
      console.error('❌ Error updating conversation:', err)
      throw err
    }
  }

  // Eliminar conversación
  const deleteConversation = async (conversationId: string) => {
    try {
      const headers = await getRequestHeaders()

      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Delete error response:', response.status, errorData)
        throw new Error(`Failed to delete conversation: ${response.status}`)
      }

      // Remover de lista local
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      console.log('🗑️ Conversation deleted:', conversationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation')
      console.error('❌ Error deleting conversation:', err)
      throw err
    }
  }

  // Cargar conversación específica por ID
  const loadSpecificConversation = async (conversationId: string): Promise<Conversation | null> => {
    try {
      const headers = await getRequestHeaders()

      console.log('🔍 Loading specific conversation:', conversationId)

      const response = await fetch(`/api/conversations/${conversationId}`, { headers })

      if (!response.ok) {
        console.log('❌ Failed to load specific conversation:', response.status)
        return null
      }

      const data = await response.json()
      console.log('✅ Specific conversation loaded:', data.conversation.title)
      return data.conversation
    } catch (err) {
      console.error('❌ Error loading specific conversation:', err)
      return null
    }
  }

  // Cargar conversaciones cuando el auth state cambie
  useEffect(() => {
    if (!authLoading) {
      console.log('🔄 Auth loaded, triggering conversation load. User:', user?.email || 'none')
      loadConversations()
    }
  }, [user, authLoading])

  return {
    conversations,
    loading,
    error,
    user,
    loadConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    loadSpecificConversation
  }
}