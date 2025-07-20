// app/api/conversations/[id]/route.ts - VERSIÓN CORREGIDA
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET - Obtener conversación específica
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // 🔧 FIX: Usar cliente que respeta RLS
    const supabase = createRouteHandlerClient({ cookies })

    console.log('🔍 Getting conversation:', id)

    // RLS se encarga del filtrado automático por user_id
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !conversation) {
      console.log('❌ Conversation not found or access denied:', error?.message)
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    console.log('✅ Conversation found:', conversation.title)
    return NextResponse.json({ conversation })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ API Error:', errorMessage)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar conversación
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { messages, title } = body

    // 🔧 FIX: Usar cliente que respeta RLS
    const supabase = createRouteHandlerClient({ cookies })

    const updateData: any = { updated_at: new Date().toISOString() }
    if (messages) updateData.messages = messages
    if (title) updateData.title = title

    console.log('🔄 Updating conversation:', id)

    // RLS se encarga de verificar que el usuario puede actualizar esta conversación
    const { data: conversation, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !conversation) {
      console.log('❌ Failed to update conversation:', error?.message)
      return NextResponse.json(
        { error: 'Failed to update conversation or access denied' },
        { status: 403 }
      )
    }

    console.log('✅ Conversation updated:', id)
    return NextResponse.json({
      conversation,
      message: 'Conversation updated successfully'
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ API Error:', errorMessage)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar conversación
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // 🔧 FIX: Usar cliente que respeta RLS
    const supabase = createRouteHandlerClient({ cookies })

    console.log('🗑️ Deleting conversation:', id)

    // RLS se encarga de verificar que el usuario puede eliminar esta conversación
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)

    if (error) {
      console.log('❌ Failed to delete conversation:', error.message)
      return NextResponse.json(
        { error: 'Failed to delete conversation or access denied' },
        { status: 403 }
      )
    }

    console.log('✅ Conversation deleted:', id)
    return NextResponse.json({
      message: 'Conversation deleted successfully'
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ API Error:', errorMessage)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}