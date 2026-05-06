'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Eye, EyeOff, Loader2, Shield, Check, X, AlertCircle, Mail, Lock, User, Phone, MapPin, Calendar } from 'lucide-react'
import { getPasswordStrength } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) router.push('/overview')
  }, [isAuthenticated, router])

  const passwordStrength = getPasswordStrength(formData.password)

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const validateStep = (s: number) => {
    const newErrors: Record<string, string> = {}

    if (s === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    }

    if (s === 2) {
      if (!formData.street.trim()) newErrors.street = 'Street address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.state.trim()) newErrors.state = 'State is required'
      if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required'
    }

    if (s === 3) {
      if (!formData.password) newErrors.password = 'Password is required'
      else if (passwordStrength.score < 60) newErrors.password = 'Password is too weak'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must accept the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) setStep(s => s + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setIsSubmitting(true)
    setError('')

    const result = await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
      password: formData.password,
    })

    if (result.success) {
      router.push('/overview')
    } else {
      setError(result.error || 'Signup failed')
    }
    setIsSubmitting(false)
  }

  const inputClass = (field: string) => errors[field] ? 'pl-11 border-red-500' : 'pl-11'

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center">
          <Shield className="h-5 w-5 text-white dark:text-slate-900" />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Apex Bank</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Create your account</h1>
        <p className="text-slate-500 dark:text-slate-400">Join 500,000+ users managing their finances</p>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
        Step {step} of 3: {step === 1 ? 'Personal Information' : step === 2 ? 'Address Details' : 'Security'}
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="firstName" placeholder="John" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} className={inputClass('firstName')} error={errors.firstName} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} error={errors.lastName} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="email" type="email" placeholder="name@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} className={inputClass('email')} error={errors.email} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => updateField('phone', e.target.value)} className={inputClass('phone')} error={errors.phone} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} className={inputClass('dateOfBirth')} error={errors.dateOfBirth} />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="street">Street address</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="street" placeholder="123 Main Street" value={formData.street} onChange={e => updateField('street', e.target.value)} className={inputClass('street')} error={errors.street} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="New York" value={formData.city} onChange={e => updateField('city', e.target.value)} error={errors.city} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="NY" value={formData.state} onChange={e => updateField('state', e.target.value)} error={errors.state} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP code</Label>
              <Input id="zip" placeholder="10001" value={formData.zip} onChange={e => updateField('zip', e.target.value)} error={errors.zip} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password} onChange={e => updateField('password', e.target.value)} className="pl-11 pr-11" error={errors.password} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Strength</span>
                    <span className={`text-xs font-medium ${passwordStrength.score >= 80 ? 'text-emerald-500' : passwordStrength.score >= 60 ? 'text-yellow-500' : passwordStrength.score >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <Progress value={passwordStrength.score} className="h-1.5" color={passwordStrength.color.replace('bg-', 'bg-')} />
                  <div className="space-y-1.5 mt-2">
                    {passwordStrength.requirements.map(req => (
                      <div key={req.label} className="flex items-center gap-2">
                        {req.met ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-slate-300 dark:text-slate-600" />}
                        <span className={`text-xs ${req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Confirm your password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} error={errors.confirmPassword} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-xs text-slate-500 mt-1 hover:text-slate-700 dark:hover:text-slate-300">
                {showConfirm ? 'Hide password' : 'Show password'}
              </button>
            </div>

            <div>
              <Checkbox id="terms" label="I agree to the Terms of Service and Privacy Policy" checked={formData.agreeTerms} onChange={() => updateField('agreeTerms', !formData.agreeTerms)} />
              {errors.agreeTerms && <p className="mt-1.5 text-xs text-red-500">{errors.agreeTerms}</p>}
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setStep(s => s - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" className="flex-1 h-12" onClick={nextStep}>
              Continue
            </Button>
          ) : (
            <Button type="submit" className="flex-1 h-12" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
            </Button>
          )}
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-slate-900 dark:text-white hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
