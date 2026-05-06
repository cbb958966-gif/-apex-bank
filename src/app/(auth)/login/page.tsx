'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Loader2, Shield, Lock, Mail, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading, isLocked, lockEndTime, attemptCount } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [lockRemaining, setLockRemaining] = useState('')

  useEffect(() => {
    if (isAuthenticated) router.push('/overview')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isLocked && lockEndTime) {
      const interval = setInterval(() => {
        const remaining = lockEndTime - Date.now()
        if (remaining <= 0) {
          setLockRemaining('')
          clearInterval(interval)
        } else {
          const mins = Math.floor(remaining / 60000)
          const secs = Math.floor((remaining % 60000) / 1000)
          setLockRemaining(`${mins}:${secs.toString().padStart(2, '0')}`)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isLocked, lockEndTime])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || isLocked) return

    setIsSubmitting(true)
    setError('')

    const result = await login(email, password)

    if (result.success) {
      router.push('/overview')
    } else {
      setError(result.error || 'Login failed')
    }
    setIsSubmitting(false)
  }

  if (isLoading) return null

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center">
          <Shield className="h-5 w-5 text-white dark:text-slate-900" />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Apex Bank</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Welcome back</h1>
        <p className="text-slate-500 dark:text-slate-400">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {isLocked && lockRemaining && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Account locked</p>
            <p className="text-xs text-amber-500 dark:text-amber-500 mt-1">Try again in {lockRemaining}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11"
              error={errors.email}
              disabled={isSubmitting || isLocked}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11"
              error={errors.password}
              disabled={isSubmitting || isLocked}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Checkbox id="remember" label="Remember me" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
          <Link href="/forgot-password" className="text-sm font-medium text-slate-900 dark:text-white hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full h-12" disabled={isSubmitting || isLocked}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
        </Button>
      </form>

      {attemptCount > 0 && !isLocked && (
        <p className="mt-4 text-xs text-center text-slate-400">
          {5 - attemptCount} attempts remaining before account lockout
        </p>
      )}

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-slate-900 dark:text-white hover:underline">
          Create account
        </Link>
      </p>

      <div className="mt-8 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          <span className="font-medium">Demo credentials:</span><br />
          alex.mitchell@email.com / password123
        </p>
      </div>
    </div>
  )
}
