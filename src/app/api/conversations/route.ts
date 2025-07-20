// app/api/conversations/route.ts
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const agentId = searchParams.get('agentId')

    // Obtener autorización del header
    const authorization = request.headers.get('authorization')
    let user = null

    if (authorization?.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1]
      const { data: { user: authUser } } = await supabase.auth.getUser(token)
      user = authUser
    }

    let query = supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })

    if (user) {
      // Usuario autenticado
      query = query.eq('user_id', user.id)
    } else {
      // Usuario anónimo
      const browserId = request.headers.get('x-browser-id')
      if (!browserId) {
        return Response.json({ conversations: [] })
      }
      query = query.eq('browser_id', browserId).is('user_id', null)
    }

    if (agentId) {
      query = query.eq('agent_id', agentId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ conversations: data || [] })

  } catch (error) {
    console.error('API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_id, title, messages } = body

    // Obtener autorización del header
    const authorization = request.headers.get('authorization')
    let user = null

    if (authorization?.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1]
      const { data: { user: authUser } } = await supabase.auth.getUser(token)
      user = authUser
    }

    const conversationData: any = {
      agent_id,
      title,
      messages: messages || []
    }

    if (user) {
      conversationData.user_id = user.id
    } else {
      const browserId = request.headers.get('x-browser-id')
      if (!browserId) {
        return Response.json({ error: 'Browser ID required' }, { status: 400 })
      }
      conversationData.browser_id = browserId
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data)

  } catch (error) {
    console.error('API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}