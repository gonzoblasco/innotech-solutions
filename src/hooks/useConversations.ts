// src/hooks/useConversations.ts (o donde esté ubicado)
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface Conversation {
  id: string
  browser_id?: string
  user_id?: string
  agent_id: string
  title: string
  messages: Message[]
  created_at: string
  updated_at: string
}

// Browser ID helper
function getBrowserId(): string {
  if (typeof window === 'undefined') return ''

  let browserId = localStorage.getItem('innotech_browser_id')
  if (!browserId) {
    browserId = crypto.randomUUID()
    localStorage.setItem('innotech_browser_id', browserId)
  }
  return browserId
}

export function useConversations(agentId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get browser ID for backward compatibility
      const browserId = getBrowserId()

      // Build query params
      const params = new URLSearchParams()
      params.append('browser_id', browserId)

      if (agentId) {
        params.append('agent_id', agentId)
      }

      const response = await fetch(`/api/conversations?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to load conversations: ${response.status}`)
      }

      const data = await response.json()
      setConversations(data)
    } catch (err) {
      console.error('Error loading conversations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async (
    agentId: string,
    messages: Message[],
    title?: string
  ): Promise<Conversation | null> => {
    try {
      const browserId = getBrowserId()

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          browser_id: browserId,
          user_id: user?.id || null,
          agent_id: agentId,
          title: title || `Chat con ${agentId}`,
          messages,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.status}`)
      }

      const newConversation = await response.json()
      setConversations(prev => [newConversation, ...prev])
      return newConversation
    } catch (err) {
      console.error('Error creating conversation:', err)
      setError(err instanceof Error ? err.message : 'Failed to create conversation')
      return null
    }
  }

  const updateConversation = async (
    conversationId: string,
    messages: Message[],
    title?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          title,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update conversation: ${response.status}`)
      }

      const updatedConversation = await response.json()
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        )
      )
      return true
    } catch (err) {
      console.error('Error updating conversation:', err)
      setError(err instanceof Error ? err.message : 'Failed to update conversation')
      return false
    }
  }

  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete conversation: ${response.status}`)
      }

      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      return true
    } catch (err) {
      console.error('Error deleting conversation:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete conversation')
      return false
    }
  }

  // Load conversations on mount and when user changes
  useEffect(() => {
    fetchConversations()
  }, [agentId, user])

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    updateConversation,
    deleteConversation,
  }
}