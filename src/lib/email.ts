import emailjs from '@emailjs/browser'

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

emailjs.init(PUBLIC_KEY)

export interface TransferReceiptParams {
  to_email: string
  toName: string
  fromName: string
  amount: string
  currency: string
  reference: string
  date: string
  description: string
  type: string
  fee: string
}

export function generateMailtoLink(params: TransferReceiptParams): string {
  const subject = encodeURIComponent(`Transfer Receipt - ${params.reference}`)
  const body = encodeURIComponent(generateReceiptText(params))
  return `mailto:${params.to_email}?subject=${subject}&body=${body}`
}

export function generateReceiptText(params: TransferReceiptParams): string {
  return [
    'APEX BANK - Transaction Receipt',
    '',
    `Hello ${params.toName},`,
    'Your transaction was successful. Here are your receipt details:',
    '',
    `Amount: ${params.amount} ${params.currency}`,
    `Reference: ${params.reference}`,
    `Date: ${params.date}`,
    `From: ${params.fromName}`,
    `To: ${params.toName}`,
    `Type: ${params.type}`,
    `Fee: ${params.fee}`,
    `Status: SUCCESSFUL`,
    '',
    params.description ? `Description: ${params.description}` : '',
    '',
    'If you did not authorize this transaction, please contact our support team immediately.',
    'Support: https://apexbank.com/support',
    '',
    '© APEX BANK. All rights reserved.',
  ].filter(Boolean).join('\r\n')
}

export function generateReceiptHtml(params: TransferReceiptParams): string {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APEX BANK Receipt</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
  <table align="center" width="600" style="background:#fff;border-radius:6px;">
    <tr><td style="background:#002147;padding:24px;text-align:center;color:#fff;font-size:22px;font-weight:bold;">APEX BANK</td></tr>
    <tr><td style="padding:30px;">
      <p>Hello ${params.toName},</p>
      <p>Your transaction was successful.</p>
      <table style="border:1px solid #e0e0e0;border-radius:6px;padding:20px;width:100%;">
        <tr><td style="font-size:24px;font-weight:bold;color:#002147;text-align:center;padding-bottom:18px;">${params.amount} ${params.currency}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Reference:</strong> ${params.reference}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Date:</strong> ${params.date}</td></tr>
        <tr><td style="padding:4px 0;"><strong>From:</strong> ${params.fromName}</td></tr>
        <tr><td style="padding:4px 0;"><strong>To:</strong> ${params.toName}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Fee:</strong> ${params.fee}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Status:</strong> Completed</td></tr>
        ${params.description ? `<tr><td style="padding:4px 0;"><strong>Description:</strong> ${params.description}</td></tr>` : ''}
      </table>
      <p>If you did not authorize this transaction, please contact our support team.</p>
    </td></tr>
    <tr><td style="background:#f4f6f8;padding:16px;text-align:center;font-size:11px;color:#999;">&copy; ${year} APEX BANK</td></tr>
  </table>
</body>
</html>`
}

export async function sendTransferReceipt(params: TransferReceiptParams): Promise<boolean> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured.')
    console.log('Receipt would be sent to:', params.to_email, params)
    return false
  }

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params as unknown as Record<string, unknown>)
    console.log('Email sent:', response.status, response.text)
    return true
  } catch (error: unknown) {
    const err = error as Record<string, unknown>
    const status = err?.status ?? err?.http_status
    const text = err?.text ?? err?.message
    console.error('EmailJS error [%s]:', status, text)
    console.error('Full error:', JSON.stringify(err, null, 2))
    console.error('Params:', JSON.stringify(params, null, 2))
    return false
  }
}
