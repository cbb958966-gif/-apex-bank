import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const params = await request.json()

    const BREVO_API_KEY = process.env.BREVO_API_KEY
    if (!BREVO_API_KEY) {
      console.warn('BREVO_API_KEY not configured')
      return NextResponse.json({ success: false, error: 'Brevo not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Apex Bank',
          email: process.env.BREVO_FROM_EMAIL || 'noreply@apexbank.com',
        },
        to: [{ email: params.to_email, name: params.toName }],
        subject: `Transfer Receipt - ${params.reference}`,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
      }),
    })

    const data = await response.text()

    if (!response.ok) {
      console.error('Brevo API error:', response.status, data)
      return NextResponse.json({ success: false, error: `Brevo API error: ${response.status} ${data}` }, { status: response.status })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
