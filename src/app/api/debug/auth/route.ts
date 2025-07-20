import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const authHeader = request.headers.get('authorization')
    const browserId = request.headers.get('x-browser-id')

    console.log('🔍 Debug Auth Request:')
    console.log('- Authorization header:', authHeader ? `Bearer ${authHeader.slice(7, 20)}...` : 'NONE')
    console.log('- Browser ID header:', browserId)

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

        console.log('🔍 Auth verification result:', result.authResult)
      } catch (error) {
        result.authResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          userEmail: null,
          userId: null
        }
        console.log('❌ Auth verification failed:', error)
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Debug API Error:', error)
    return NextResponse.json(
      { error: 'Debug API failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}