import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Obtener conversaciones por browser_id
export async function GET(request: NextRequest) {
  try {
    const browserId = request.headers.get('x-browser-id')

    if (!browserId) {
      return NextResponse.json({
        conversations: [],
        message: 'No browser ID provided'
      })
    }

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('browser_id', browserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      conversations: conversations || [],
      count: conversations?.length || 0
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva conversación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { browserId, agentId, title, messages } = body

    if (!browserId || !agentId) {
      return NextResponse.json(
        { error: 'Missing required fields: browserId, agentId' },
        { status: 400 }
      )
    }

    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        browser_id: browserId,
        agent_id: agentId,
        title: title || 'Nueva conversación',
        messages: messages || []
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      conversation,
      message: 'Conversation created successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}