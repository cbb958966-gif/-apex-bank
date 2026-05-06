'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getDaysUntil } from '@/lib/utils'
import { Calendar, Zap, Home, Film, Shield, GraduationCap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const billIcons: Record<string, React.ElementType> = {
  Utilities: Zap,
  Housing: Home,
  Entertainment: Film,
  Insurance: Shield,
  Education: GraduationCap,
}

export function UpcomingBills({ bills }: { bills: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Upcoming bills</CardTitle>
        <Link href="/payments" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bills.map((bill: Record<string, unknown>, i: number) => {
            const Icon = billIcons[bill.category as string] || Calendar
            const days = getDaysUntil(bill.dueDate as string)
            const isUrgent = days <= 7

            return (
              <div key={i} className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${isUrgent ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{bill.name as string}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {days <= 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `Due in ${days} days`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(bill.amount as number)}</p>
                  {(bill.autoPay as boolean) && <Badge variant="info" className="mt-0.5">Auto-pay</Badge>}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
