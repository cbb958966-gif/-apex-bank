'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Send, Download, CreditCard, Wallet, PiggyBank, TrendingUp, Receipt, Zap } from 'lucide-react'
import Link from 'next/link'

const actions = [
  { icon: Send, label: 'Send Money', href: '/transfers', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30' },
  { icon: Download, label: 'Request', href: '/transfers', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30' },
  { icon: CreditCard, label: 'Pay Bills', href: '/payments', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30' },
  { icon: Wallet, label: 'Deposit', href: '/accounts', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30' },
  { icon: PiggyBank, label: 'Savings', href: '/goals', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/30' },
  { icon: TrendingUp, label: 'Invest', href: '/investments', color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30' },
]

export function QuickActions() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick actions</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {actions.map((action, i) => (
          <Link key={i} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 card-hover group">
            <div className={`h-11 w-11 rounded-xl ${action.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
