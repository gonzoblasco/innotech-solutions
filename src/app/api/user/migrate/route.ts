import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()
    const { browser_id, user_id } = body


    if (!browser_id || !user_id) {
      return NextResponse.json(
        { error: 'Missing browser_id or user_id' },
        { status: 400 }
      )
    }

    // 1. Verificar si ya hay conversaciones migradas
    const { data: existingUserConversations, error: checkError } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user_id)
      .limit(1)

    if (checkError) {
      console.error('❌ Error checking existing conversations:', checkError)
      return NextResponse.json(
        { error: 'Database error during check' },
        { status: 500 }
      )
    }

    if (existingUserConversations && existingUserConversations.length > 0) {
      return NextResponse.json({
        migrated: 0,
        message: 'Conversaciones ya fueron migradas previamente',
        already_migrated: true
      })
    }

    // 2. Buscar conversaciones del browser_id que no han sido migradas
    const { data: browserConversations, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('browser_id', browser_id)
      .is('user_id', null) // Solo conversaciones no migradas

    if (fetchError) {
      console.error('❌ Error fetching browser conversations:', fetchError)
      return NextResponse.json(
        { error: 'Database error during fetch' },
        { status: 500 }
      )
    }

    if (!browserConversations || browserConversations.length === 0) {
      return NextResponse.json({
        migrated: 0,
        message: 'No hay conversaciones del navegador para migrar'
      })
    }


    // 3. Migrar conversaciones: actualizar user_id y mantener browser_id para referencia
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        user_id: user_id,
        migrated_from_browser_id: browser_id,
        updated_at: new Date().toISOString()
      })
      .eq('browser_id', browser_id)
      .is('user_id', null)

    if (updateError) {
      console.error('❌ Error during migration:', updateError)
      return NextResponse.json(
        { error: 'Database error during migration' },
        { status: 500 }
      )
    }


    return NextResponse.json({
      migrated: browserConversations.length,
      message: `${browserConversations.length} conversaciones migradas exitosamente`
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Migration API Error:', errorMessage)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}