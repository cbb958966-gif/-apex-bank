'use client'

import { useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft, Loader2, ArrowRight } from 'lucide-react'

function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyOtp } = useAuth()
  const email = searchParams.get('email') || ''
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    pasted.split('').forEach((char, i) => { newCode[i] = char })
    setCode(newCode)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length !== 6) { setError('Enter the full 6-digit code'); return }
    setIsSubmitting(true)
    const result = await verifyOtp(fullCode)
    if (result.success) router.push('/reset-password?email=' + encodeURIComponent(email))
    else setError(result.error || 'Invalid code')
    setIsSubmitting(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center">
          <Shield className="h-5 w-5 text-white dark:text-slate-900" />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Apex Bank</span>
      </div>
      <Link href="/forgot-password" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Shield className="h-8 w-8 text-slate-900 dark:text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Verification code</h1>
        <p className="text-slate-500 dark:text-slate-400">Enter the 6-digit code sent to <strong>{email}</strong></p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input key={i} ref={el => { inputRefs.current[i] = el }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} className="w-[44px] sm:w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 outline-none transition-all dark:border-slate-700 dark:bg-slate-800 dark:focus:border-white dark:focus:ring-white" />
          ))}
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify code <ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">The verification code was shown on the previous screen for demo purposes.</p>
    </div>
  )
}

export default function VerifyOtpPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" /></div>}><VerifyOtpForm /></Suspense>
}
