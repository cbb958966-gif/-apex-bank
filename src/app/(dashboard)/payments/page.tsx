'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db } from '@/lib/db'
import { seedBills } from '@/lib/seed-data'
import { formatCurrency, getDaysUntil } from '@/lib/utils'
import { CreditCard, Calendar, Zap, Home, Film, Shield, GraduationCap, CheckCircle2, Plus, Search, ArrowRight, Repeat } from 'lucide-react'

const billIcons: Record<string, React.ElementType> = {
  Utilities: Zap,
  Housing: Home,
  Entertainment: Film,
  Insurance: Shield,
  Education: GraduationCap,
  Default: CreditCard,
}

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const bills = (db.bills.getAll() as any[]).length > 0 ? db.bills.getAll() as any[] : seedBills

  const filtered = bills.filter((b: any) =>
    (b.name as string).toLowerCase().includes(search.toLowerCase())
  )

  const upcoming = filtered.filter(b => b.status === 'upcoming')
  const totalUpcoming = upcoming.reduce((sum: number, b: any) => sum + (b.amount as number), 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your bills and payees</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add payee</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total upcoming</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{formatCurrency(totalUpcoming)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Due this week</p>
            <p className="text-2xl font-bold text-amber-600 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>
              {upcoming.filter(b => { const d = getDaysUntil(b.dueDate as string); return d <= 7 }).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Auto-pay active</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>
              {bills.filter(b => b.autoPay).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Bill payees</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-10 w-64" placeholder="Search payees..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.map((bill: Record<string, unknown>, i: number) => {
              const Icon = billIcons[bill.category as string] || billIcons.Default
              const days = getDaysUntil(bill.dueDate as string)
              const isUrgent = days <= 7 && bill.status === 'upcoming'

              return (
                <div key={i} className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${isUrgent ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{bill.name as string}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {bill.category as string} • {bill.frequency !== 'once' ? (bill.frequency as string) : 'One-time'} • Due {formatDate(bill.dueDate as string)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(bill.amount as number)}</p>
                      <p className="text-xs text-slate-400">
                        {days <= 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `Due in ${days} days`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {(bill.autoPay as boolean) && <Badge variant="info" className="text-[10px]">Auto</Badge>}
                      {(bill.status as string) === 'upcoming' && (
                        <Button size="sm" variant="outline">Pay</Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatDate(dateStr: unknown) {
  return new Date(dateStr as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
