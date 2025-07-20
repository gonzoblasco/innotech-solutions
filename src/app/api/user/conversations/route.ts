import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET - Obtener conversaciones del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()

    // Obtener usuario autenticado
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      console.error('❌ No authorization header')
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    let user
    try {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

      if (authError) {
        console.error('❌ Auth error:', authError)
        return NextResponse.json(
          { error: 'Invalid authentication' },
          { status: 401 }
        )
      }

      if (!authUser) {
        console.error('❌ No user found')
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      }

      user = authUser
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Token verification failed:', errorMessage)
      return NextResponse.json(
        { error: 'Token verification failed' },
        { status: 401 }
      )
    }

    console.log('👤 Loading conversations for user:', user.email)

    // Obtener conversaciones del usuario
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }

    console.log('📊 Loaded', conversations?.length || 0, 'user conversations')

    return NextResponse.json({
      conversations: conversations || [],
      count: conversations?.length || 0,
      user_id: user.id
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

// POST - Crear nueva conversación para usuario autenticado
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()
    const { agentId, title, messages } = body

    // Obtener usuario autenticado
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      console.error('❌ No authorization header')
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    let user
    try {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

      if (authError || !authUser) {
        console.error('❌ Auth failed:', authError)
        return NextResponse.json(
          { error: 'Invalid authentication' },
          { status: 401 }
        )
      }

      user = authUser
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Token verification failed:', errorMessage)
      return NextResponse.json(
        { error: 'Token verification failed' },
        { status: 401 }
      )
    }

    if (!agentId) {
      return NextResponse.json(
        { error: 'Missing required field: agentId' },
        { status: 400 }
      )
    }

    console.log('📝 Creating conversation for user:', user.email, 'agent:', agentId)

    // Crear conversación para usuario autenticado
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        agent_id: agentId,
        title: title || 'Nueva conversación',
        messages: messages || [],
        browser_id: null // No browser_id para usuarios autenticados
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Database error creating conversation:', error)
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }

    console.log('✅ Conversation created:', conversation.id)

    return NextResponse.json({
      conversation,
      message: 'Conversation created successfully'
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