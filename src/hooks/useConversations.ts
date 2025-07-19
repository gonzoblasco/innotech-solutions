'use client'

import { useState, useEffect } from 'react'
import { getBrowserId } from '@/lib/browser-id'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  browser_id: string
  agent_id: string
  title: string | null
  messages: Message[]
  created_at: string
  updated_at: string
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar conversaciones del browser actual
  const loadConversations = async () => {
    setLoading(true)
    setError(null)

    try {
      const browserId = getBrowserId()

      // ✅ Usar query params en lugar de headers
      const params = new URLSearchParams()
      params.append('browser_id', browserId)

      const response = await fetch(`/api/conversations?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to load conversations')
      }

      const data = await response.json()
      setConversations(data || [])  // ✅ data directamente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error loading conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  // Crear nueva conversación
  const createConversation = async (agentId: string, title?: string) => {
    try {
      const browserId = getBrowserId()
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          browser_id: browserId,  // ✅ browser_id
          agent_id: agentId,      // ✅ agent_id
          title: title || 'Nueva conversación',
          messages: []
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create conversation')
      }

      const data = await response.json()
      const newConversation = data

      // Agregar a la lista local
      setConversations(prev => [newConversation, ...prev])

      return newConversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation')
      throw err
    }
  }

  // Actualizar conversación con nuevos mensajes
  const updateConversation = async (conversationId: string, messages: Message[], title?: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          title
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update conversation')
      }

      const data = await response.json()
      const updatedConversation = data

      // Actualizar en lista local
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        )
      )

      return updatedConversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation')
      throw err
    }
  }

  // Eliminar conversación
  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete conversation')
      }

      // Remover de lista local
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation')
      throw err
    }
  }

  // Cargar conversaciones al iniciar
  useEffect(() => {
    loadConversations()
  }, [])

  return {
    conversations,
    loading,
    error,
    loadConversations, // ✅ EXPORTAR loadConversations
    createConversation,
    updateConversation,
    deleteConversation
  }
}