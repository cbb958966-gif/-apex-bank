'use client'

import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, CreditCard, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function BalanceCards({ totalBalance, checking, savings, credit, investments }: {
  totalBalance: number
  checking?: any
  savings?: any
  credit?: any
  investments?: any
}) {
  const [showBalances, setShowBalances] = useState(true)

  const accounts = [
    {
      name: 'Total Balance',
      balance: totalBalance,
      icon: Wallet,
      color: 'from-slate-900 to-slate-700 dark:from-white dark:to-slate-200',
      textColor: 'text-white dark:text-slate-900',
      iconBg: 'bg-white/10 dark:bg-slate-900/10',
      change: '+2.4%',
      changeType: 'positive' as const,
    },
    {
      name: checking?.nickname || 'Checking',
      balance: checking?.balance || 0,
      icon: ArrowUpRight,
      color: 'from-blue-500 to-blue-700',
      textColor: 'text-white',
      iconBg: 'bg-white/10',
      change: '+$8,500',
      changeType: 'positive' as const,
    },
    {
      name: savings?.nickname || 'Savings',
      balance: savings?.balance || 0,
      icon: PiggyBank,
      color: 'from-emerald-500 to-emerald-700',
      textColor: 'text-white',
      iconBg: 'bg-white/10',
      change: '+$312',
      changeType: 'positive' as const,
    },
    {
      name: credit?.nickname || 'Credit',
      balance: credit?.balance ? Math.abs(credit.balance as number) : 0,
      icon: CreditCard,
      color: 'from-purple-500 to-purple-700',
      textColor: 'text-white',
      iconBg: 'bg-white/10',
      change: `${credit ? Math.round(((credit.limit as number - Math.abs(credit.balance as number)) / (credit.limit as number)) * 100) : 0}% available`,
      changeType: 'neutral' as const,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your accounts</h2>
        <button onClick={() => setShowBalances(!showBalances)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          {showBalances ? <Eye className="h-4 w-4 text-slate-500" /> : <EyeOff className="h-4 w-4 text-slate-500" />}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {accounts.map((account, i) => (
          <Card key={i} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${account.color} border-0 p-5 card-hover`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-xl ${account.iconBg} flex items-center justify-center`}>
                  <account.icon className={`h-4 w-4 ${account.textColor}`} />
                </div>
                {account.changeType === 'positive' && (
                  <span className="text-xs font-medium text-emerald-300">{account.change}</span>
                )}
                {account.changeType === 'neutral' && (
                  <span className="text-xs font-medium text-white/70">{account.change}</span>
                )}
              </div>
              <p className={`text-xs font-medium ${account.textColor} opacity-70 mb-1`}>{account.name}</p>
              <p className={`text-2xl font-bold ${account.textColor}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                {showBalances ? formatCurrency(account.balance) : '••••••'}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
