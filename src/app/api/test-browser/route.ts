import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const browserId = request.headers.get('x-browser-id')

  return NextResponse.json({
    received_browser_id: browserId,
    timestamp: new Date().toISOString(),
    message: browserId ? 'Browser ID recibido correctamente' : 'No Browser ID en headers'
  })
}