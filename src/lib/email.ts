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
