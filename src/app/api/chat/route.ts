import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { messages, agentId } = await request.json()

    // FILTRAR mensajes sin content antes de enviar a OpenAI
    const validMessages = messages.filter((msg: any) => {
      const hasValidContent = msg.content && typeof msg.content === 'string' && msg.content.trim().length > 0
      if (!hasValidContent) {
        console.log('🚫 Filtrando mensaje sin content:', JSON.stringify(msg, null, 2))
      }
      return hasValidContent
    })

    console.log('📤 Mensajes enviados a OpenAI:', validMessages.length, 'de', messages.length)

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: 'No hay mensajes válidos para procesar' },
        { status: 400 }
      )
    }

    // Convertir a formato OpenAI (solo role y content)
    const chatMessages = validMessages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No se recibió respuesta del modelo')
    }

    console.log('✅ Respuesta OpenAI recibida:', response.length, 'caracteres')

    return NextResponse.json({ response })

  } catch (error: any) {
    console.error('Error en chat:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}