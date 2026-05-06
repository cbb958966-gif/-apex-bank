'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Shield, Loader2, Eye, EyeOff, CheckCircle2, Check, X, Lock } from 'lucide-react'
import { getPasswordStrength } from '@/lib/utils'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordStrength.score < 60) { setError('Password is too weak'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setIsSubmitting(true)
    const users = JSON.parse(localStorage.getItem('apex_users') || '[]')
    const idx = users.findIndex((u: any) => u.email === email)
    if (idx !== -1) { users[idx].password = password; localStorage.setItem('apex_users', JSON.stringify(users)) }
    setSuccess(true)
    setIsSubmitting(false)
  }

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center">
            <Shield className="h-5 w-5 text-white dark:text-slate-900" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Apex Bank</span>
        </div>
        <div className="mx-auto h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Password reset complete</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Your password has been successfully updated.</p>
        <Button onClick={() => router.push('/login')} className="w-full h-12">Sign in</Button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center">
          <Shield className="h-5 w-5 text-white dark:text-slate-900" />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Apex Bank</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>New password</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Create a strong, unique password</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>New password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} className="pl-11 pr-11" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Strength</span>
                <span className={'text-xs font-medium ' + (passwordStrength.score >= 80 ? 'text-emerald-500' : passwordStrength.score >= 60 ? 'text-yellow-500' : 'text-red-500')}>{passwordStrength.label}</span>
              </div>
              <Progress value={passwordStrength.score} className="h-1.5" />
              <div className="space-y-1.5 mt-2">
                {passwordStrength.requirements.map(req => (
                  <div key={req.label} className="flex items-center gap-2">
                    {req.met ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-slate-300" />}
                    <span className={'text-xs ' + (req.met ? 'text-emerald-600' : 'text-slate-400')}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Confirm password</Label>
          <Input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset password'}
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" /></div>}><ResetPasswordForm /></Suspense>
}
