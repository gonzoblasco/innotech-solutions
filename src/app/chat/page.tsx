'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ChatInterface from '@/components/chat/ChatInterface'

function ChatContent() {
  const searchParams = useSearchParams()
  const agentId = searchParams.get('agent') || 'consultor-de-negocio'

  return <ChatInterface agentId={agentId} />
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ChatContent />
    </Suspense>
  )
}