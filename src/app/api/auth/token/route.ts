import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()

    // Obtener sesión actual del cliente
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('❌ Error getting session:', error)
      return NextResponse.json(
        { error: 'Failed to get session' },
        { status: 401 }
      )
    }

    if (!session) {
      console.log('⚠️ No active session found')
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      )
    }

    console.log('🔑 Returning token for user:', session.user.email)

    return NextResponse.json({
      access_token: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email
      }
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Token API Error:', errorMessage)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}