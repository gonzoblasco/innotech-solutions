// app/api/conversations/migrate/route.ts
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { browserId, userId } = await request.json()

    if (!browserId || !userId) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Migrar conversaciones del browser_id al user_id
    const { error } = await supabase
      .from('conversations')
      .update({
        user_id: userId,
        browser_id: null
      })
      .eq('browser_id', browserId)
      .is('user_id', null)

    if (error) {
      console.error('Migration error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Migration error:', error)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}