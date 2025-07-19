import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Obtener conversación específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // ← Agregar await aquí
    const browserId = request.headers.get('x-browser-id')

    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('browser_id', browserId)
      .single()

    if (error || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ conversation })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar conversación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // ← Agregar await aquí
    const body = await request.json()
    const { messages, title } = body
    const browserId = request.headers.get('x-browser-id')

    const updateData: any = {}
    if (messages) updateData.messages = messages
    if (title) updateData.title = title

    const { data: conversation, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', id)
      .eq('browser_id', browserId)
      .select()
      .single()

    if (error || !conversation) {
      return NextResponse.json(
        { error: 'Failed to update conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      conversation,
      message: 'Conversation updated successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar conversación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // ← Agregar await aquí
    const browserId = request.headers.get('x-browser-id')

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('browser_id', browserId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Conversation deleted successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}