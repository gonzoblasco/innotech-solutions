// src/app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const browserId = searchParams.get('browser_id')
    const userId = searchParams.get('user_id')
    const agentId = searchParams.get('agent_id')

    // Require either browser_id or user_id
    if (!browserId && !userId) {
      return NextResponse.json({ error: 'Browser ID or User ID is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    let query = supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })

    // Filter by user or browser
    if (userId) {
      query = query.eq('user_id', userId)
    } else if (browserId) {
      query = query.eq('browser_id', browserId)
    }

    // Optional agent filter
    if (agentId) {
      query = query.eq('agent_id', agentId)
    }

    const { data: conversations, error } = await query

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { browser_id, user_id, agent_id, title, messages } = body

    // Require either browser_id or user_id
    if (!browser_id && !user_id) {
      return NextResponse.json({ error: 'Browser ID or User ID is required' }, { status: 400 })
    }

    if (!agent_id || !messages) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerClient()

    const insertData: any = {
      agent_id,
      title: title || `Chat con ${agent_id}`,
      messages,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Set appropriate ID field
    if (user_id) {
      insertData.user_id = user_id
      // If migrating from browser, track it
      if (browser_id) {
        insertData.migrated_from_browser_id = browser_id
      }
    } else {
      insertData.browser_id = browser_id
    }

    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert([insertData])
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