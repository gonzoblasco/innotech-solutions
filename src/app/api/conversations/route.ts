// src/app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

// GET - Obtener conversaciones por browser_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const browserId = searchParams.get('browser_id')

    if (!browserId) {
      return NextResponse.json({ error: 'Browser ID is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('browser_id', browserId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
    }

    if (!conversations) {
      return NextResponse.json([])
    }

    // Filter out conversations with invalid messages
    const validConversations = conversations.filter(conv => {
      if (!Array.isArray(conv.messages)) return false
      return conv.messages.every(msg =>
        msg &&
        typeof msg === 'object' &&
        typeof msg.role === 'string' &&
        typeof msg.content === 'string'
      )
    })

    return NextResponse.json(validConversations)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Crear nueva conversación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { browser_id, agent_id, title, messages } = body

    if (!browser_id || !agent_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert([{
        browser_id,
        agent_id,
        title: title || 'Nueva conversación',
        messages: messages || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}