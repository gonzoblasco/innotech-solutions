import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

// GET - Obtener conversación específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const browserId = request.headers.get('x-browser-id')

    console.log(`🔍 GET conversation ${id} with browser ${browserId}`)

    if (!browserId) {
      return NextResponse.json({ error: 'Browser ID required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Buscar conversación por ID y browser_id O user_id
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .or(`browser_id.eq.${browserId},user_id.is.not.null`)
      .single()

    if (error || !conversation) {
      console.error('❌ Conversation not found:', error)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Validar que los mensajes son válidos
    if (!Array.isArray(conversation.messages)) {
      console.error('❌ Invalid conversation messages')
      return NextResponse.json({ error: 'Invalid conversation data' }, { status: 400 })
    }

    const validMessages = conversation.messages.filter(msg =>
      msg &&
      typeof msg === 'object' &&
      typeof msg.role === 'string' &&
      typeof msg.content === 'string'
    )

    const validConversation = {
      ...conversation,
      messages: validMessages
    }

    console.log(`✅ Conversation ${id} loaded with ${validMessages.length} messages`)

    return NextResponse.json({ conversation: validConversation })

  } catch (error) {
    console.error('💥 GET API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Actualizar conversación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { messages, title } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const updateData: any = {
      messages,
      updated_at: new Date().toISOString()
    }

    if (title) {
      updateData.title = title
    }

    const { data: conversation, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Eliminar conversación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}