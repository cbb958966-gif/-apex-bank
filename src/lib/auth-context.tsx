'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { db } from './db'
import { generateId } from './utils'

interface AuthContextType {
  user: Record<string, unknown> | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: any) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (data: any) => void
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>
  attemptCount: number
  isLocked: boolean
  lockEndTime: number | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const LOCK_DURATION = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockEndTime, setLockEndTime] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const lockData = localStorage.getItem('apex_lock')
    if (lockData) {
      const { endTime } = JSON.parse(lockData)
      if (Date.now() < endTime) {
        setIsLocked(true)
        setLockEndTime(endTime)
        const remaining = endTime - Date.now()
        setTimeout(() => {
          setIsLocked(false)
          setLockEndTime(null)
          setAttemptCount(0)
          localStorage.removeItem('apex_lock')
        }, remaining)
      } else {
        localStorage.removeItem('apex_lock')
      }
    }

    const attempts = localStorage.getItem('apex_attempts')
    if (attempts) setAttemptCount(parseInt(attempts))

    const session = db.session.get()
    if (session) {
      const storedUser = db.users.findById(session.userId as string)
      if (storedUser) {
        setUser(storedUser)
      } else {
        db.session.clear()
      }
    }
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
    if (!foundUser || foundUser.password !== password) {
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
    })

    setAttemptCount(0)
    localStorage.removeItem('apex_attempts')
    setUser(foundUser)
    return { success: true }
  }, [isLocked])

  const signup = useCallback(async (data: any) => {
    const existingUser = db.users.findByEmail(data.email as string)
    if (existingUser) return { success: false, error: 'An account with this email already exists.' }

    const newUser = {
      ...data,
      id: generateId('usr'),
      createdAt: new Date().toISOString(),
      isVerified: true,
      twoFactorEnabled: false,
      preferences: {
        currency: 'USD',
        language: 'en',
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

  const updateUser = useCallback((data: any) => {
    if (user) {
      const updated = { ...user, ...data }
      db.users.update(user.id as string, data)
      setUser(updated)
    }
  }, [user])

  const resetPassword = useCallback(async (email: string) => {
    const foundUser = db.users.findByEmail(email)
    if (!foundUser) return { success: false, error: 'No account found with this email.' }

    localStorage.setItem('apex_reset_email', email)
    return { success: true }
  }, [])

  const verifyOtp = useCallback(async (_code: string) => {
    if (_code === '123456' || _code.length === 6) {
      return { success: true }
    }
    return { success: false, error: 'Invalid verification code.' }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
