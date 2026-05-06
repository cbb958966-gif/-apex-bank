'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getRelativeTime } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal, ShoppingCart, Utensils, Home, Car, Heart, Film, Zap, GraduationCap, Shield, Briefcase, ArrowRight, Repeat } from 'lucide-react'
import Link from 'next/link'

const categoryIcons: Record<string, React.ElementType> = {
  Groceries: ShoppingCart,
  Dining: Utensils,
  Housing: Home,
  Transportation: Car,
  Healthcare: Heart,
  Entertainment: Film,
  Utilities: Zap,
  Education: GraduationCap,
  Insurance: Shield,
  Income: Briefcase,
  Transfer: Repeat,
  Freelance: Briefcase,
  Interest: Briefcase,
}

const categoryColors: Record<string, string> = {
  Groceries: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Dining: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  Housing: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Transportation: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
  Healthcare: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  Entertainment: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Utilities: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  Education: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  Insurance: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  Income: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Transfer: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Freelance: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Interest: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
}

export function RecentTransactions({ transactions }: { transactions: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Recent transactions</CardTitle>
        <Link href="/accounts" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((txn: Record<string, unknown>, i: number) => {
            const Icon = categoryIcons[txn.category as string] || ShoppingCart
            const colorClass = categoryColors[txn.category as string] || 'bg-slate-100 text-slate-600'
            const isCredit = txn.type === 'credit'

            return (
              <div key={i} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{txn.merchant as string}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{txn.description as string}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {isCredit ? '+' : '-'}{formatCurrency(txn.amount as number)}
                  </p>
                  <p className="text-xs text-slate-400">{getRelativeTime(txn.date as string)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
