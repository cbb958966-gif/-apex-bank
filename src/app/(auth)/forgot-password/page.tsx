'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setError('Email is required'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return }

    setIsSubmitting(true)
    const result = await resetPassword(email)
    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || 'Failed to send reset email')
    }
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

      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>

      {success ? (
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Check your email</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            We've sent a verification code to <strong>{email}</strong>
          </p>
          <Button onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(email)}`)} className="w-full h-12">
            Enter verification code
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Reset password</h1>
            <p className="text-slate-500 dark:text-slate-400">Enter your email to receive a verification code</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-11" error={error} />
              </div>
            </div>
            <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send verification code'}
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
