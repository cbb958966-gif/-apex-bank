'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { seedAccounts, seedTransactions } from '@/lib/seed-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, CreditCard, Download, Eye, Plus, Filter } from 'lucide-react'

export default function AccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const accounts = (db.accounts.getAll() as any[]).length > 0 ? db.accounts.getAll() as any[] : seedAccounts
  const transactions = (db.transactions.getAll() as any[]).length > 0 ? db.transactions.getAll() as any[] : seedTransactions

  const selectedTxns = selectedAccount
    ? transactions.filter((t: any) => t.accountId === selectedAccount)
    : []

  const accountIcons: Record<string, React.ElementType> = {
    checking: Wallet,
    savings: TrendingUp,
    credit: CreditCard,
    investment: TrendingUp,
  }

  const accountColors: Record<string, string> = {
    checking: 'from-blue-500 to-blue-600',
    savings: 'from-emerald-500 to-emerald-600',
    credit: 'from-purple-500 to-purple-600',
    investment: 'from-amber-500 to-amber-600',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Accounts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all your bank accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-2" /> New Account</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account: any) => {
          const Icon = accountIcons[account.type as string] || Wallet
          const isSelected = selectedAccount === account.id

          return (
            <Card
              key={account.id}
              className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-slate-900 dark:ring-white' : ''} hover:shadow-lg`}
              onClick={() => setSelectedAccount(isSelected ? null : account.id as string)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${accountColors[account.type as string]} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant={account.status === 'active' ? 'success' : 'danger'}>{account.status as string}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{account.nickname as string}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{account.name as string}</p>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {formatCurrency(account.balance as number)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ••••{(account.accountNumber as string)?.slice(-4)} • {account.routingNumber as string}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1"><ArrowUpRight className="h-3.5 w-3.5 mr-1.5" /> Send</Button>
                  <Button variant="outline" size="sm" className="flex-1"><Download className="h-3.5 w-3.5 mr-1.5" /> Statement</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedAccount && selectedTxns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction history</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedTxns.slice(0, 15).map((txn: Record<string, unknown>, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{txn.merchant as string}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{txn.category as string} • {formatDate(txn.date as string)}</p>
                  </div>
                  <p className={`text-sm font-semibold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount as number)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
