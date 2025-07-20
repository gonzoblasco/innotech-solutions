// app/api/admin/stats/route.ts
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })

    return Response.json({ total: count || 0 })
  } catch (error) {
    console.error('Stats error:', error)
    return Response.json({ total: 0 })
  }
}