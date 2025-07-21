import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')


    const result: any = {
      hasAuthHeader: !!authHeader,
      timestamp: new Date().toISOString()
    }

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')

      // Analizar estructura del JWT
      const segments = token.split('.')

      result.tokenAnalysis = {
        originalLength: authHeader.length,
        tokenLength: token.length,
        segments: segments.length,
        segmentLengths: segments.map(s => s.length),
        firstSegment: segments[0]?.substring(0, 20) + '...',
        isValidJWTStructure: segments.length === 3
      }


      // Si tiene 3 segmentos, intentar decodificar header
      if (segments.length === 3) {
        try {
          const header = JSON.parse(atob(segments[0]))
          result.jwtHeader = header
        } catch (error: unknown) {
          result.jwtHeaderError = 'Failed to decode header'
        }
      }
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown'
    console.error('❌ JWT Debug API Error:', errorMessage)
    return NextResponse.json(
      { error: 'Debug failed', details: errorMessage },
      { status: 500 }
    )
  }
}