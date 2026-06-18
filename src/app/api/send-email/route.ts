import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const params = await request.json()

    const { BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, BREVO_SMTP_PASS, BREVO_FROM_EMAIL } = process.env

    if (!BREVO_SMTP_USER || !BREVO_SMTP_PASS) {
      console.warn('Brevo SMTP not configured')
      return NextResponse.json({ success: false, error: 'Brevo SMTP not configured' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(BREVO_SMTP_PORT || '587', 10),
      secure: false,
      auth: { user: BREVO_SMTP_USER, pass: BREVO_SMTP_PASS },
    })

    await transporter.sendMail({
      from: { name: 'Apex Bank', address: BREVO_FROM_EMAIL || 'noreply@apexbank.com' },
      to: `"${params.toName}" <${params.to_email}>`,
      subject: `Transfer Receipt - ${params.reference}`,
      text: params.textContent,
      html: params.htmlContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
