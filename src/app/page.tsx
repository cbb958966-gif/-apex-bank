'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { initializeDb } from '@/lib/db'
import {
  seedUser,
  seedAccounts,
  seedTransactions,
  seedCards,
  seedTransfers,
  seedBills,
  seedBudgets,
  seedGoals,
  seedNotifications,
  seedDevices,
  seedSecurityEvents,
} from '@/lib/seed-data'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('apex_users') || '[]')
    if (users.length === 0) {
      const demoUser = { ...seedUser, password: 'password123' }
      initializeDb({
        users: [demoUser as any],
        accounts: seedAccounts as any[],
        transactions: seedTransactions as any[],
        cards: seedCards as any[],
        transfers: seedTransfers as any[],
        bills: seedBills as any[],
        budgets: seedBudgets as any[],
        goals: seedGoals as any[],
        notifications: seedNotifications as any[],
        devices: seedDevices as any[],
        securityEvents: seedSecurityEvents as any[],
      })
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/overview')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-white" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading Apex Bank...</p>
      </div>
    </div>
  )
}
