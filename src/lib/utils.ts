import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function maskCardNumber(number: string): string {
  const parts = number.split(' ')
  return parts.map((part, i) => {
    if (i < parts.length - 1) return '****'
    return part
  }).join(' ')
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  const masked = name.charAt(0) + '***' + name.charAt(name.length - 1)
  return masked + '@' + domain
}

export function maskPhone(phone: string): string {
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
}

export function getDaysUntil(date: string): number {
  const now = new Date()
  const target = new Date(date)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getRelativeTime(date: string): string {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)

  if (months > 0) return months === 1 ? '1 month ago' : months + ' months ago'
  if (days > 0) return days === 1 ? 'Yesterday' : days + ' days ago'
  if (hours > 0) return hours === 1 ? '1 hour ago' : hours + ' hours ago'
  if (minutes > 0) return minutes === 1 ? '1 minute ago' : minutes + ' minutes ago'
  return 'Just now'
}

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  requirements: { label: string; met: boolean }[]
} {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ]

  const met = requirements.filter(r => r.met).length
  const score = Math.round((met / requirements.length) * 100)

  let label = 'Very Weak'
  let color = 'bg-red-500'

  if (score >= 80) { label = 'Strong'; color = 'bg-emerald-500' }
  else if (score >= 60) { label = 'Good'; color = 'bg-yellow-500' }
  else if (score >= 40) { label = 'Fair'; color = 'bg-orange-500' }

  return { score, label, color, requirements }
}

export function generateId(prefix = ''): string {
  const id = Math.random().toString(36).substring(2, 10)
  return prefix ? prefix + '_' + id : id
}

export function generateCardNumber(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(1000 + Math.random() * 9000).toString()
  ).join(' ')
}

export function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString()
}

export function generateExpiry(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear() + 3
  return String(month).padStart(2, '0') + '/' + String(year).slice(-2)
}

export function getProgress(current: number, target: number): number {
  return Math.min((current / target) * 100, 100)
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function hashPassword(password: string): Promise<string> {
  const salt = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('')
  const hashed = await sha256(salt + password)
  return salt + ':' + hashed
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashed = await sha256(salt + password)
  return hashed === hash
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}
