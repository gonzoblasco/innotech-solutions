// src/app/api/user/migrate/route.ts - CREAR NUEVO ARCHIVO
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Obtener user ID del header Authorization
    const authHeader = request.headers.get('Authorization')
    const userId = authHeader?.replace('Bearer ', '')

    if (!userId) {
      return NextResponse.json({ error: 'No user ID provided' }, { status: 401 })
    }

    const supabase = createServerClient()

    // Obtener browser ID del request body o cookies
    const body = await request.json().catch(() => ({}))
    let browserId = body.browser_id

    // Si no viene en el body, intentar obtenerlo de diferentes fuentes
    if (!browserId) {
      // Buscar en headers personalizado
      browserId = request.headers.get('x-browser-id')
    }

    // Si aún no tenemos browser ID, buscar conversaciones huérfanas
    if (!browserId) {
      console.log('🔍 No browser ID provided, checking for orphaned conversations')

      // Verificar si el usuario ya tiene conversaciones
      const { data: existingConversations } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (existingConversations && existingConversations.length > 0) {
        return NextResponse.json({
          migrated: 0,
          message: 'Usuario ya tiene conversaciones asociadas',
          already_migrated: true
        })
      }

      return NextResponse.json({
        migrated: 0,
        message: 'No hay conversaciones para migrar',
        no_browser_id: true
      })
    }

    console.log('🔄 Starting migration for user:', userId, 'browser:', browserId)

    // Verificar si ya se migró previamente
    const { data: existingMigrated } = await supabase
      .from('conversations')
      .select('id')
      .eq('migrated_from_browser_id', browserId)
      .eq('user_id', userId)
      .limit(1)

    if (existingMigrated && existingMigrated.length > 0) {
      return NextResponse.json({
        migrated: 0,
        message: 'Conversaciones ya fueron migradas previamente',
        already_migrated: true
      })
    }

    // Buscar conversaciones del browser que no estén asociadas a ningún usuario
    const { data: conversationsToMigrate, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('browser_id', browserId)
      .is('user_id', null)

    if (fetchError) {
      console.error('Error fetching conversations to migrate:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
    }

    if (!conversationsToMigrate || conversationsToMigrate.length === 0) {
      return NextResponse.json({
        migrated: 0,
        message: 'No hay conversaciones para migrar',
        no_conversations: true
      })
    }

    console.log(`📦 Found ${conversationsToMigrate.length} conversations to migrate`)

    // Migrar conversaciones: actualizar user_id y marcar migración
    const { data: migratedConversations, error: migrateError } = await supabase
      .from('conversations')
      .update({
        user_id: userId,
        migrated_from_browser_id: browserId,
        updated_at: new Date().toISOString()
      })
      .eq('browser_id', browserId)
      .is('user_id', null)
      .select('id')

    if (migrateError) {
      console.error('Error migrating conversations:', migrateError)
      return NextResponse.json({ error: 'Failed to migrate conversations' }, { status: 500 })
    }

    const migratedCount = migratedConversations?.length || 0

    console.log(`✅ Successfully migrated ${migratedCount} conversations`)

    return NextResponse.json({
      migrated: migratedCount,
      message: migratedCount > 0
        ? `${migratedCount} conversaciones migradas exitosamente a tu cuenta`
        : 'No había conversaciones para migrar',
      success: true
    })

  } catch (error) {
    console.error('Migration API Error:', error)
    return NextResponse.json({
      error: 'Error interno durante la migración',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}