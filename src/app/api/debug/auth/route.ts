import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const authHeader = request.headers.get('authorization')
    const browserId = request.headers.get('x-browser-id')


    const result: any = {
      hasAuthHeader: !!authHeader,
      hasBrowserId: !!browserId,
      timestamp: new Date().toISOString()
    }

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error } = await supabase.auth.getUser(token)

        result.authResult = {
          success: !error,
          error: error?.message,
          userEmail: user?.email,
          userId: user?.id
        }

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        result.authResult = {
          success: false,
          error: errorMessage,
          userEmail: null,
          userId: null
        }
      }
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown'
    console.error('❌ Debug API Error:', errorMessage)
    return NextResponse.json(
      { error: 'Debug API failed', details: errorMessage },
      { status: 500 }
    )
  }
}