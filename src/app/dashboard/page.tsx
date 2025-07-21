'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { agents } from '@/data/agents'
import { getBrowserId } from '@/lib/browser-id'
import Link from 'next/link'

interface DashboardConversation {
  id: string
  agent_id: string
  title: string | null
  messages: any[]
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<DashboardConversation[]>([])
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [migrationStatus, setMigrationStatus] = useState<{
    completed: boolean
    migrated: number
    message: string
  } | null>(null)

  // Flags para prevenir doble ejecución
  const initializationRef = useRef(false)
  const migrationRef = useRef(false)

  // Redirect si no está logueado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // 🔧 ARREGLADO: Cargar conversaciones usando browser ID temporalmente
  const loadUserConversations = async () => {
    if (!user) return

    try {
      setLoadingConversations(true)

      // TEMPORAL: Usar browser ID hasta que arreglemos JWT
      const browserId = getBrowserId()

      const response = await fetch(`/api/conversations`, {
        headers: {
          'x-browser-id': browserId
        }
      })

      if (response.ok) {
        const data = await response.json()
        const conversationsList = data.conversations || []

        // Asegurar que es un array
        const validConversations = Array.isArray(conversationsList) ? conversationsList : []
        setConversations(validConversations)
      } else {
        console.error('Failed to load dashboard conversations:', response.status)
        setConversations([]) // Fallback a array vacío
      }
    } catch (error) {
      console.error('Error loading dashboard conversations:', error)
      setConversations([]) // Fallback a array vacío
    } finally {
      setLoadingConversations(false)
    }
  }

  // 🔧 ARREGLADO: Migración usando endpoint correcto
  const migrateConversations = async () => {
    if (!user || migrationRef.current) return

    migrationRef.current = true

    try {

      const browserId = getBrowserId()

      // TEMPORAL: Usar el endpoint que funciona
      const response = await fetch('/api/user/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // ELIMINAR: Authorization header por ahora
        },
        body: JSON.stringify({
          user_id: user.id, // Usar user.id directamente
          browser_id: browserId
        })
      })

      if (response.ok) {
        const data = await response.json()

        setMigrationStatus({
          completed: true,
          migrated: data.migrated,
          message: data.message
        })

        // Solo recargar si se migraron conversaciones
        if (data.migrated > 0) {
          await loadUserConversations()
        }
      } else {
        const errorData = await response.json()
        console.error('Migration failed:', errorData)

        setMigrationStatus({
          completed: false,
          migrated: 0,
          message: errorData.error || 'Error en la migración'
        })
      }
    } catch (error) {
      console.error('Error migrating conversations:', error)
      setMigrationStatus({
        completed: false,
        migrated: 0,
        message: 'Error de conexión durante la migración'
      })
    }
  }

  // useEffect con protección contra doble ejecución
  useEffect(() => {
    if (user && !initializationRef.current) {
      initializationRef.current = true


      // Ejecutar en secuencia para evitar conflictos
      const initializeDashboard = async () => {
        await loadUserConversations()
        await migrateConversations()
      }

      initializeDashboard()
    }
  }, [user])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // No user (redirecting)
  if (!user) {
    return null
  }

  // Group conversations by agent
  const conversationsByAgent = conversations.reduce((acc, conv) => {
    if (!acc[conv.agent_id]) {
      acc[conv.agent_id] = []
    }
    acc[conv.agent_id].push(conv)
    return acc
  }, {} as Record<string, DashboardConversation[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, <span className="font-medium">{user.email}</span>
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Inicio
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Migration Status */}
        {migrationStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            migrationStatus.completed
              ? migrationStatus.migrated > 0
                ? 'bg-green-50 border border-green-200'
                : 'bg-blue-50 border border-blue-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {migrationStatus.completed
                  ? migrationStatus.migrated > 0 ? '✅' : 'ℹ️'
                  : '❌'}
              </span>
              <div>
                <p className={`font-medium ${
                  migrationStatus.completed
                    ? migrationStatus.migrated > 0
                      ? 'text-green-800'
                      : 'text-blue-800'
                    : 'text-red-800'
                }`}>
                  {migrationStatus.message}
                </p>
                {migrationStatus.migrated > 0 && (
                  <p className="text-sm text-green-600">
                    Tus conversaciones anteriores ahora están disponibles en todos tus dispositivos
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Conversaciones</p>
                <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agentes Utilizados</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(conversationsByAgent).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Consultas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.reduce((total, conv) =>
                    total + (conv.messages?.filter(msg => msg.role === 'user').length || 0), 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Iniciar Nueva Conversación</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/chat?agent=${agent.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{agent.avatar}</span>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {agent.name}
                    </p>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 🔧 ARREGLADO: Mejor handling de estados de loading y empty */}
        <div className="space-y-8">
          {loadingConversations ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando conversaciones...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🗨️</span>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No hay conversaciones aún</h3>
              <p className="text-gray-600 mb-6">Comienza una conversación con cualquiera de nuestros agentes especializados</p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explorar Agentes →
              </Link>
            </div>
          ) : (
            Object.entries(conversationsByAgent).map(([agentId, agentConversations]) => {
              const agent = agents.find(a => a.id === agentId)
              if (!agent) return null

              return (
                <div key={agentId} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{agent.avatar}</span>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                          <p className="text-sm text-gray-600">
                            {agentConversations.length} conversación(es)
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/chat?agent=${agentId}`}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Nueva Conversación
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y">
                    {agentConversations.map((conversation) => (
                      <div key={conversation.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <Link href={`/chat?agent=${agentId}&conversation=${conversation.id}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                {conversation.title || 'Conversación sin título'}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {conversation.messages?.filter(msg => msg.role === 'user').length || 0} consultas realizadas
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(conversation.updated_at).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="text-blue-600 hover:text-blue-700">
                              →
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}