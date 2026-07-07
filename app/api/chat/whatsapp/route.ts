import { type NextRequest } from 'next/server'

const WHATSAPP_API_VERSION = 'v22.0'

async function sendWhatsAppMessage(to: string, text: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !token) {
    console.error('Missing WhatsApp credentials')
    return
  }

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('WhatsApp API error:', err)
  }
}

async function getBotReply(phone: string, message: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return 'AI is not configured.'

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.SITE_URL || 'https://portfolio-3.vercel.app',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'poolside/laguna-m.1:free',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond concisely and clearly.',
        },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('OpenRouter error:', err)
    return 'Sorry, something went wrong.'
  }

  const data = await res.json()
  return (data as any).choices?.[0]?.message?.content || 'No response.'
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    return new Response(challenge, { status: 200 })
  }

  return new Response('Verification failed', { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const entry = body?.entry?.[0]?.changes?.[0]?.value
    const messages = entry?.messages

    if (!messages?.[0]) {
      return Response.json({ status: 'ok' }, { status: 200 })
    }

    const msg = messages[0]
    const from = msg.from
    const text = msg.text?.body

    if (!from || !text) {
      return Response.json({ status: 'ok' }, { status: 200 })
    }

    const reply = await getBotReply(from, text)
    await sendWhatsAppMessage(from, reply)

    return Response.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ status: 'error', message: 'Internal server error' }, { status: 500 })
  }
}
