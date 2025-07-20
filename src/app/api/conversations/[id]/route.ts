import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// GET - Obtener conversación específica (compatible con auth)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient()

    // Intentar obtener usuario autenticado
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (!error && user) {
          userId = user.id
        }
      } catch (error) {
        console.error('❌ Error verificando token:', error)
      }
    }

    let conversation
    let error

    if (userId) {
      // Usuario autenticado - buscar por user_id
      console.log('🔍 GET conversation', id, 'with user', userId)
      const result = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      conversation = result.data
      error = result.error
    } else {
      // Usuario no autenticado - buscar por browser_id (fallback)
      const browserId = request.headers.get('x-browser-id')
      console.log('🔍 GET conversation', id, 'with browser', browserId)

      if (!browserId) {
        return NextResponse.json(
          { error: 'No authentication or browser ID' },
          { status: 401 }
        )
      }

      const result = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .eq('browser_id', browserId)
        .is('user_id', null) // Solo conversaciones no migradas
        .single()

      conversation = result.data
      error = result.error
    }

    if (error || !conversation) {
      console.log('❌ Conversation not found:', error)
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

// PUT - Actualizar conversación (compatible con auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { messages, title } = body
    const supabase = createClient()

    // Intentar obtener usuario autenticado
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (!error && user) {
          userId = user.id
        }
      } catch (error) {
        console.error('❌ Error verificando token:', error)
      }
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (messages) updateData.messages = messages
    if (title) updateData.title = title

    let conversation
    let error

    if (userId) {
      // Usuario autenticado
      console.log('🔄 Updating conversation', id, 'for user', userId)
      const result = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      conversation = result.data
      error = result.error
    } else {
      // Usuario no autenticado - fallback browser_id
      const browserId = request.headers.get('x-browser-id')

      if (!browserId) {
        return NextResponse.json(
          { error: 'No authentication or browser ID' },
          { status: 401 }
        )
      }

      console.log('🔄 Updating conversation', id, 'for browser', browserId)
      const result = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', id)
        .eq('browser_id', browserId)
        .is('user_id', null)
        .select()
        .single()

      conversation = result.data
      error = result.error
    }

    if (error || !conversation) {
      console.log('❌ Failed to update conversation:', error)
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

// DELETE - Eliminar conversación (compatible con auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient()

    // Intentar obtener usuario autenticado
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (!error && user) {
          userId = user.id
        }
      } catch (error) {
        console.error('❌ Error verificando token:', error)
      }
    }

    let error

    if (userId) {
      // Usuario autenticado
      console.log('🗑️ Deleting conversation', id, 'for user', userId)
      const result = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      error = result.error
    } else {
      // Usuario no autenticado - fallback browser_id
      const browserId = request.headers.get('x-browser-id')

      if (!browserId) {
        return NextResponse.json(
          { error: 'No authentication or browser ID' },
          { status: 401 }
        )
      }

      console.log('🗑️ Deleting conversation', id, 'for browser', browserId)
      const result = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('browser_id', browserId)
        .is('user_id', null)

      error = result.error
    }

    if (error) {
      console.log('❌ Failed to delete conversation:', error)
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