'use client'

import { useAuth } from '@/lib/auth-context'
import { db } from '@/lib/db'
import { seedAccounts, seedTransactions, seedCards, seedBills, seedInsights, seedCreditScore, seedBudgets, seedGoals } from '@/lib/seed-data'
import { BalanceCards } from '@/components/dashboard/balance-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { UpcomingBills } from '@/components/dashboard/upcoming-bills'
import { SpendingChart } from '@/components/analytics/spending-chart'
import { InsightsPanel } from '@/components/dashboard/insights-panel'
import { CreditScoreWidget } from '@/components/dashboard/credit-score-widget'
import { SavingsGoalsWidget } from '@/components/dashboard/savings-goals-widget'
import { formatCurrency } from '@/lib/utils'

export default function OverviewPage() {
  const { user } = useAuth()
  const accounts = (db.accounts.getAll() as any[]).length > 0 ? db.accounts.getAll() as any[] : seedAccounts
  const transactions = (db.transactions.getAll() as any[]).length > 0 ? db.transactions.getAll() as any[] : seedTransactions
  const cards = (db.cards.getAll() as any[]).length > 0 ? db.cards.getAll() as any[] : seedCards
  const bills = (db.bills.getAll() as any[]).length > 0 ? db.bills.getAll() as any[] : seedBills
  const budgets = (db.budgets.getAll() as any[]).length > 0 ? db.budgets.getAll() as any[] : seedBudgets
  const goals = (db.goals.getAll() as any[]).length > 0 ? db.goals.getAll() as any[] : seedGoals

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0)
  const checkingAccount = accounts.find(a => a.type === 'checking')
  const savingsAccount = accounts.find(a => a.type === 'savings')
  const creditAccount = accounts.find(a => a.type === 'credit')
  const investmentAccount = accounts.find(a => a.type === 'investment')

  const recentTransactions = transactions.slice(0, 8)
  const upcomingBillsList = bills.filter(b => b.status === 'upcoming').slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.firstName as string}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your accounts today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          All systems operational
        </div>
      </div>

      <BalanceCards
        totalBalance={totalBalance}
        checking={checkingAccount}
        savings={savingsAccount}
        credit={creditAccount}
        investments={investmentAccount}
      />

      <QuickActions />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentTransactions transactions={recentTransactions} />
        </div>
        <div className="space-y-6">
          <CreditScoreWidget score={seedCreditScore} />
          <UpcomingBills bills={upcomingBillsList} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SpendingChart budgets={budgets} />
        </div>
        <div className="space-y-6">
          <SavingsGoalsWidget goals={goals} />
        </div>
      </div>

      <InsightsPanel insights={seedInsights} />
    </div>
  )
}
