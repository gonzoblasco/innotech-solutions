// src/app/api/user/conversations/route.ts - CREAR NUEVO ARCHIVO
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    // Obtener user ID del header Authorization
    const authHeader = request.headers.get('Authorization')
    const userId = authHeader?.replace('Bearer ', '')

    if (!userId) {
      return NextResponse.json({ error: 'No user ID provided' }, { status: 401 })
    }

    const supabase = createServerClient()

    // Obtener conversaciones del usuario
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch user conversations' }, { status: 500 })
    }

    // Filtrar conversaciones válidas
    const validConversations = conversations?.filter(conv => {
      if (!Array.isArray(conv.messages)) return false
      return conv.messages.every(msg =>
        msg &&
        typeof msg === 'object' &&
        typeof msg.role === 'string' &&
        typeof msg.content === 'string'
      )
    }) || []

    return NextResponse.json({
      conversations: validConversations,
      count: validConversations.length
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}