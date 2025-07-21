import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json()

    if (!messages || messages.length < 2) {
      return NextResponse.json({
        title: 'Nueva conversación'
      })
    }

    // Tomar los primeros 4-6 mensajes para contexto
    const contextMessages = messages.slice(0, 6)


    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Genera un título conciso (máximo 50 caracteres) que resuma el tema principal de esta conversación de consultoría empresarial. 

Debe ser:
- Específico y descriptivo
- Enfocado en el problema/tema central
- Profesional y claro
- Sin comillas ni puntos finales

Ejemplos buenos: "Estrategia de pricing para PyME", "Optimización de flujo de caja", "Plan de marketing digital", "Estructura SRL vs SA"`
        },
        {
          role: 'user',
          content: `Conversación a titular:\n\n${contextMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
        }
      ],
      temperature: 0.3,
      max_tokens: 30
    })

    const title = completion.choices[0]?.message?.content?.trim() || 'Nueva conversación'


    return NextResponse.json({ title })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error generating title:', errorMessage)
    return NextResponse.json(
      { title: 'Nueva conversación' },
      { status: 200 } // No fallar, usar título por defecto
    )
  }
}