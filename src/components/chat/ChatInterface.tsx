'use client'

import { useState, useRef, useEffect } from 'react'
import { agents } from '@/data/agents'
import { useConversations, type Message } from '@/hooks/useConversations'
import { getBrowserId } from '@/lib/browser-id'
import { createPortal } from 'react-dom'

interface ChatInterfaceProps {
  agentId: string
  conversationId?: string
}

export default function ChatInterface({ agentId, conversationId }: ChatInterfaceProps) {
  const agent = agents.find(a => a.id === agentId)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null)
  const [showHistory, setShowHistory] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false) // ✅ NUEVO: Estado para botón scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null) // ✅ NUEVO: Ref para el container del chat

  const { conversations, loading: conversationsLoading, loadConversations, createConversation, updateConversation, deleteConversation } = useConversations()

  // ✅ NUEVO: Función para detectar si necesita scroll
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom && messages.length > 3)
    }
  }

  // Función para generar título automático
  const generateTitle = (firstMessage: string): string => {
    const maxLength = 50
    if (firstMessage.length <= maxLength) return firstMessage
    return firstMessage.substring(0, maxLength - 3) + '...'
  }

  // Función para generar título inteligente con IA
  const generateIntelligentTitle = async (messages: Message[]): Promise<string> => {
    if (messages.length < 3) {
      const firstUserMessage = messages.find(m => m.role === 'user')
      return generateTitle(firstUserMessage?.content || 'Nueva conversación')
    }

    try {
      console.log('🤖 Generando título inteligente para', messages.length, 'mensajes')

      const response = await fetch('/api/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      })

      if (!response.ok) {
        throw new Error('Error en API de títulos')
      }

      const data = await response.json()
      const intelligentTitle = data.title || 'Nueva conversación'

      console.log('🏷️ Título inteligente generado:', intelligentTitle)
      return intelligentTitle

    } catch (error) {
      console.error('💥 Error generating intelligent title:', error)
      const firstUserMessage = messages.find(m => m.role === 'user')
      return generateTitle(firstUserMessage?.content || 'Nueva conversación')
    }
  }

  // ✅ MEJORADO: Auto-scroll suave
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowScrollButton(false)
  }

  // ✅ NUEVO: Scroll forzado (para el botón)
  const forceScrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
    setShowScrollButton(false)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ✅ NUEVO: Listener para el scroll
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [messages.length])

  // Función para nueva conversación
  const startNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setInput('')
    console.log('🆕 Nueva conversación iniciada')
  }

  // Función para cargar conversación específica
  const loadConversation = async (conversation: any) => {
    setMessages(conversation.messages || [])
    setCurrentConversationId(conversation.id)
    setShowHistory(false)
    console.log('📂 Conversación cargada:', conversation.title)
  }

  // ✅ NUEVO: Función para cargar conversación específica por ID
  const loadSpecificConversation = async (conversationId: string) => {
    try {
      console.log('🔍 Loading specific conversation:', conversationId)

      const response = await fetch(`/api/conversations/${conversationId}`, {
        headers: {
          'x-browser-id': getBrowserId()
        }
      })

      if (response.ok) {
        const data = await response.json()
        const conversation = data.conversation || data

        if (conversation && conversation.messages) {
          console.log('✅ Specific conversation loaded:', conversation.title)
          console.log('📋 Messages loaded:', conversation.messages.length)

          setMessages(conversation.messages)
          setCurrentConversationId(conversation.id)
          return true
        }
      } else {
        console.error('❌ Failed to load specific conversation:', response.status)
      }
    } catch (error) {
      console.error('Error loading specific conversation:', error)
    }
    return false
  }

  // Cargar última conversación del agente
  const loadLastConversationForAgent = async () => {
    try {
      const browserId = getBrowserId()
      const params = new URLSearchParams()
      params.append('browser_id', browserId)

      const response = await fetch(`/api/conversations?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        const allConversations = data || []

        const agentConversations = allConversations.filter(conv => conv.agent_id === agentId)
        const lastConversation = agentConversations[0]

        if (lastConversation && lastConversation.messages.length > 0) {
          console.log('📋 Mensajes recuperados:', lastConversation.messages.length)
          setMessages(lastConversation.messages)
          setCurrentConversationId(lastConversation.id)

          // ✅ NUEVO: Actualizar URL para reflejar la conversación cargada
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.set('conversation', lastConversation.id)
          window.history.replaceState({}, '', newUrl.toString())

          console.log('🔄 Última conversación recuperada:', lastConversation.title)
          return true
        }
      }
    } catch (error) {
      console.error('Error loading last conversation:', error)
    }
    return false
  }

  // Guardar conversación automáticamente con títulos inteligentes
  const saveConversation = async (newMessages: Message[]) => {
    try {
      console.log('💾 saveConversation called with', newMessages.length, 'messages')

      if (!currentConversationId && newMessages.length > 0) {
        const firstUserMessage = newMessages.find(m => m.role === 'user')
        const initialTitle = firstUserMessage ? generateTitle(firstUserMessage.content) : 'Nueva conversación'

        console.log('📝 Creando conversación con título inicial:', initialTitle)

        const conversation = await createConversation(agentId, initialTitle)
        setCurrentConversationId(conversation.id)

        await updateConversation(conversation.id, newMessages)

        if (newMessages.length >= 3) {
          console.log('🧠 Activando título inteligente con', newMessages.length, 'mensajes...')
          const intelligentTitle = await generateIntelligentTitle(newMessages)
          await updateConversation(conversation.id, newMessages, intelligentTitle)
          console.log('🏷️ Título actualizado a:', intelligentTitle)
        }

      } else if (currentConversationId) {
        console.log('🔄 Actualizando conversación existente:', currentConversationId)
        await updateConversation(currentConversationId, newMessages)

        if (newMessages.length >= 3) {
          const browserId = getBrowserId()
          const params = new URLSearchParams()
          params.append('browser_id', browserId)

          const conversationsResponse = await fetch(`/api/conversations?${params.toString()}`)
          const conversationsData = await conversationsResponse.json()

          const currentConv = conversationsData?.find((c: any) => c.id === currentConversationId)
          const firstUserMessage = newMessages.find(m => m.role === 'user')

          if (currentConv && firstUserMessage && currentConv.title === generateTitle(firstUserMessage.content)) {
            console.log('🧠 Generando título inteligente para conversación existente...')
            const intelligentTitle = await generateIntelligentTitle(newMessages)
            await updateConversation(currentConversationId, newMessages, intelligentTitle)
            console.log('🏷️ Título inteligente aplicado a conversación existente:', intelligentTitle)
          }
        }
      }
    } catch (error) {
      console.error('Error saving conversation:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          agentId: agentId
        })
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()

      if (!data.response || typeof data.response !== 'string') {
        throw new Error('Respuesta vacía del servidor')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)

      await saveConversation(finalMessages)

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, hubo un error procesando tu consulta. Por favor intenta nuevamente.',
        timestamp: new Date().toISOString()
      }

      const messagesWithError = [...newMessages, errorMessage]
      setMessages(messagesWithError)

      await saveConversation(messagesWithError)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ MEJORADO: useEffect para manejar conversation ID en URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const conversationIdFromUrl = urlParams.get('conversation')

    if (conversationIdFromUrl && conversationIdFromUrl !== currentConversationId) {
      console.log('🔗 Conversation ID in URL:', conversationIdFromUrl)
      loadSpecificConversation(conversationIdFromUrl)
    } else if (!conversationIdFromUrl && messages.length === 0 && conversations.length > 0) {
      // Solo cargar última conversación si no hay conversation ID en URL
      loadLastConversationForAgent()
    }
  }, [agentId, conversationId, conversations])

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Agente no encontrado</h1>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            ← Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  const agentConversations = conversations.filter(conv => conv.agent_id === agentId)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ MEJORADO: Header sticky */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              ← Volver
            </a>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{agent.avatar}</span>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{agent.name}</h1>
                <p className="text-sm text-gray-600">{agent.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {messages.length > 0 && (
              <button
                onClick={startNewConversation}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Iniciar nueva conversación"
              >
                <span>✨</span>
                <span>Nueva</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowHistory(true)
                loadConversations()
              }}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Ver historial de conversaciones"
            >
              <span>📚</span>
              <span>Historial</span>
            </button>

            {currentConversationId && (
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                💾 Guardado
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ MEJORADO: Chat Container con flex-1 y scroll */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative">
        {/* Chat messages area */}
        <div
          ref={chatContainerRef}
          className="flex-1 px-4 py-6 space-y-6 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{agent.avatar}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Hola! Soy {agent.name}
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                {agent.description}
              </p>

              <div className="text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Preguntas de ejemplo:</h3>
                <div className="space-y-2">
                  {agent.exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-800 text-sm border border-blue-200 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl px-4 py-3 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-gray-500 text-sm ml-2">{agent.name} está escribiendo...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ✅ NUEVO: Botón scroll to bottom */}
        {showScrollButton && (
          <button
            onClick={forceScrollToBottom}
            className="fixed bottom-24 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-30"
            title="Ir al final de la conversación"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        {/* ✅ MEJORADO: Input Form con mejor accesibilidad */}
        <div className="px-4 pb-6 bg-gray-50 sticky bottom-0">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Escribe tu consulta para ${agent.name}...`}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Historial - sin cambios */}
      {showHistory && typeof window !== 'undefined' && createPortal(
        <div
          className="modal-overlay"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b bg-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{agent.avatar}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Historial de Conversaciones</h2>
                  <p className="text-sm text-gray-600">{agent.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {conversationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando conversaciones...</p>
                </div>
              ) : agentConversations.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🗨️</span>
                  <p className="text-gray-600">No hay conversaciones anteriores con {agent.name}</p>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Comenzar primera conversación
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {agentConversations.map(conversation => (
                    <div
                      key={conversation.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        conversation.id === currentConversationId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => loadConversation(conversation)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {conversation.title || 'Conversación sin título'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {conversation.messages?.filter(msg => msg.role === 'user').length || 0} consultas realizadas
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(conversation.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('¿Estás seguro de eliminar esta conversación?')) {
                              deleteConversation(conversation.id)
                              if (conversation.id === currentConversationId) {
                                startNewConversation()
                              }
                            }
                          }}
                          className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar conversación"
                        >
                          🗑️
                        </button>
                      </div>

                      {conversation.id === currentConversationId && (
                        <div className="mt-2 text-xs text-blue-600 font-medium">
                          📍 Conversación actual
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t p-4 bg-gray-50 rounded-b-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {agentConversations.length} conversación(es) encontrada(s)
                </p>
                <button
                  onClick={() => {
                    setShowHistory(false)
                    startNewConversation()
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ✨ Nueva conversación
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}