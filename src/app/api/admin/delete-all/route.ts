// app/api/admin/delete-all/route.ts
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .neq('id', '')

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}