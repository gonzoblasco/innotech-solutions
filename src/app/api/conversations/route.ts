// app/api/conversations/route.ts - VERSIÓN CORREGIDA
import { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getBrowserId } from '@/lib/browser-id'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const agentId = searchParams.get('agentId')

    // 🔧 FIX: Usar cliente que respeta RLS en lugar del service key
    const supabase = createRouteHandlerClient({ cookies })

    // 🔧 FIX: Obtener usuario del token JWT
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('❌ Session error:', sessionError)
      return Response.json({ conversations: [] })
    }

    let query = supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })

    if (session?.user) {
      // Usuario autenticado: RLS filtra automáticamente por user_id
      // NO necesitamos filtro manual porque RLS se encarga
    } else {
      // Usuario anónimo: filtrar por browser_id
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
      console.error('❌ Database error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ conversations: data || [] })

  } catch (error) {
    console.error('❌ API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_id, title, messages } = body

    // 🔧 FIX: Usar cliente que respeta RLS
    const supabase = createRouteHandlerClient({ cookies })

    // 🔧 FIX: Obtener usuario del token JWT
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('❌ Session error in POST:', sessionError)
      return Response.json({ error: 'Authentication error' }, { status: 401 })
    }

    const conversationData: any = {
      agent_id,
      title,
      messages: messages || []
    }

    if (session?.user) {
      conversationData.user_id = session.user.id
      // browser_id queda null
    } else {
      const browserId = request.headers.get('x-browser-id')
      if (!browserId) {
        return Response.json({ error: 'Browser ID required for anonymous users' }, { status: 400 })
      }
      conversationData.browser_id = browserId
      // user_id queda null
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationData)
      .select()
      .single()

    if (error) {
      console.error('❌ Database error creating conversation:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data)

  } catch (error) {
    console.error('❌ API error in POST:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}