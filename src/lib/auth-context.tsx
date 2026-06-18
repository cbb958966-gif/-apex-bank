'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { db } from './db'
import { generateId, hashPassword, verifyPassword, generateOtp } from './utils'
import { seedAdminUser } from './seed-data'

interface AuthContextType {
  user: Record<string, unknown> | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (data: Record<string, unknown>) => void
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; otp?: string }>
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>
  attemptCount: number
  isLocked: boolean
  lockEndTime: number | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const LOCK_DURATION = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

function getInitialLockState(): { isLocked: boolean; lockEndTime: number | null } {
  try {
    const lockData = localStorage.getItem('apex_lock')
    if (lockData) {
      const { endTime } = JSON.parse(lockData)
      if (Date.now() < endTime) {
        return { isLocked: true, lockEndTime: endTime }
      }
      localStorage.removeItem('apex_lock')
    }
  } catch { /* ignore */ }
  return { isLocked: false, lockEndTime: null }
}

function getInitialAttempts(): number {
  try {
    return parseInt(localStorage.getItem('apex_attempts') || '0')
  } catch {
    return 0
  }
}

function getInitialUser(): Record<string, unknown> | null {
  try {
    const session = db.session.get()
    if (session) {
      const storedUser = db.users.findById(session.userId as string)
      if (storedUser) return storedUser
      db.session.clear()
    }
  } catch { /* ignore */ }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialLock = getInitialLockState()
  const [user, setUser] = useState<Record<string, unknown> | null>(getInitialUser)
  const [isLoading, setIsLoading] = useState(true)
  const [attemptCount, setAttemptCount] = useState(getInitialAttempts)
  const [isLocked, setIsLocked] = useState(initialLock.isLocked)
  const [lockEndTime, setLockEndTime] = useState<number | null>(initialLock.lockEndTime)
  const router = useRouter()

  useEffect(() => {
    if (isLocked && lockEndTime) {
      const remaining = lockEndTime - Date.now()
      if (remaining > 0) {
        const timer = setTimeout(() => {
          setIsLocked(false)
          setLockEndTime(null)
          setAttemptCount(0)
          localStorage.removeItem('apex_lock')
        }, remaining)
        return () => clearTimeout(timer)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const users = db.users.getAll() as Array<Record<string, unknown>>
    const hasAdmin = users.some((u) => u.role === 'admin')
    if (!hasAdmin) {
      hashPassword('admin123').then((hashed) => {
        const adminUser = { ...seedAdminUser, password: hashed }
        users.push(adminUser)
        db.users.setAll(users)
      })
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (isLocked) return { success: false, error: 'Account locked. Please try again later.' }

    const attempts = parseInt(localStorage.getItem('apex_attempts') || '0')
    if (attempts >= MAX_ATTEMPTS) {
      const endTime = Date.now() + LOCK_DURATION
      localStorage.setItem('apex_lock', JSON.stringify({ endTime }))
      setIsLocked(true)
      setLockEndTime(endTime)
      return { success: false, error: 'Too many failed attempts. Account locked for 15 minutes.' }
    }

    const foundUser = db.users.findByEmail(email)
    const passwordValid = foundUser ? await verifyPassword(password, foundUser.password as string) : false
    if (!foundUser || !passwordValid) {
      const newAttempts = attempts + 1
      setAttemptCount(newAttempts)
      localStorage.setItem('apex_attempts', newAttempts.toString())

      if (newAttempts >= MAX_ATTEMPTS) {
        const endTime = Date.now() + LOCK_DURATION
        localStorage.setItem('apex_lock', JSON.stringify({ endTime }))
        setIsLocked(true)
        setLockEndTime(endTime)
        return { success: false, error: 'Too many failed attempts. Account locked for 15 minutes.' }
      }

      const remaining = MAX_ATTEMPTS - newAttempts
      return { success: false, error: `Invalid email or password. ${remaining} attempts remaining.` }
    }

    db.session.set({ userId: foundUser.id, loginAt: new Date().toISOString() })
    db.securityEvents.add({
      id: generateId('sec'),
      type: 'login',
      date: new Date().toISOString(),
      ip: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome / Windows 11',
      status: 'success',
    } as Record<string, unknown>)

    setAttemptCount(0)
    localStorage.removeItem('apex_attempts')
    setUser(foundUser)
    return { success: true }
  }, [isLocked])

  const signup = useCallback(async (data: Record<string, unknown>) => {
    const existingUser = db.users.findByEmail(data.email as string)
    if (existingUser) return { success: false, error: 'An account with this email already exists.' }

    const hashedPassword = await hashPassword(data.password as string)

    const newUser = {
      ...data,
      password: hashedPassword,
      id: generateId('usr'),
      createdAt: new Date().toISOString(),
      isVerified: true,
      twoFactorEnabled: false,
      role: 'user',
      preferences: {
        currency: 'USD' as const,
        language: 'en' as const,
        theme: 'light' as const,
        notifications: {
          email: true,
          sms: true,
          push: true,
          transactionAlerts: true,
          securityAlerts: true,
          marketingEmails: false,
        },
      },
    }

    db.users.add(newUser)

    db.accounts.setAll([
      {
        id: generateId('acc'),
        userId: newUser.id,
        type: 'checking',
        name: 'Primary Checking',
        nickname: 'Everyday',
        balance: 5000.00,
        availableBalance: 5000.00,
        currency: 'USD',
        accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        routingNumber: '021000021',
        status: 'active',
        createdAt: new Date().toISOString(),
        overdraftProtection: false,
        overdraftLimit: 0,
        dailyLimit: 5000,
        monthlyLimit: 50000,
      },
      {
        id: generateId('acc'),
        userId: newUser.id,
        type: 'savings',
        name: 'High Yield Savings',
        nickname: 'Savings',
        balance: 0.00,
        availableBalance: 0.00,
        currency: 'USD',
        accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        routingNumber: '021000021',
        status: 'active',
        createdAt: new Date().toISOString(),
        overdraftProtection: false,
        overdraftLimit: 0,
        dailyLimit: 3000,
        monthlyLimit: 30000,
      },
    ])

    db.session.set({ userId: newUser.id, loginAt: new Date().toISOString() })
    setUser(newUser)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    db.session.clear()
    setUser(null)
    router.push('/login')
  }, [router])

  const updateUser = useCallback((data: Record<string, unknown>) => {
    if (user) {
      const safeData = { ...data }
      if (user.role !== 'admin') {
        delete safeData.role
        delete safeData.isAdmin
      }
      const updated = { ...user, ...safeData }
      db.users.update(user.id as string, safeData)
      setUser(updated)
    }
  }, [user])

  const resetPassword = useCallback(async (email: string) => {
    const foundUser = db.users.findByEmail(email)
    if (!foundUser) return { success: false, error: 'No account found with this email.' }

    const otp = generateOtp()
    localStorage.setItem('apex_reset_email', email)
    localStorage.setItem('apex_reset_otp', otp)
    localStorage.setItem('apex_reset_otp_expiry', String(Date.now() + 10 * 60 * 1000))
    return { success: true, otp }
  }, [])

  const verifyOtp = useCallback(async (code: string) => {
    const storedOtp = localStorage.getItem('apex_reset_otp')
    const expiry = localStorage.getItem('apex_reset_otp_expiry')

    if (!storedOtp || !expiry || Date.now() > parseInt(expiry)) {
      localStorage.removeItem('apex_reset_otp')
      localStorage.removeItem('apex_reset_otp_expiry')
      return { success: false, error: 'Verification code expired. Please request a new one.' }
    }

    if (code === storedOtp) {
      localStorage.removeItem('apex_reset_otp')
      localStorage.removeItem('apex_reset_otp_expiry')
      return { success: true }
    }
    return { success: false, error: 'Invalid verification code.' }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: (user?.role as string) === 'admin',
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        resetPassword,
        verifyOtp,
        attemptCount,
        isLocked,
        lockEndTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
