'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316']

export function SpendingChart({ budgets }: { budgets: any[] }) {
  const data = budgets.map((b: any, i: number) => ({
    name: b.category as string,
    value: b.spent as number,
    limit: b.limit as number,
    color: COLORS[i % COLORS.length],
    percentage: Math.round(((b.spent as number) / (b.limit as number)) * 100),
  }))

  const totalSpent = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Spending by category</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Total spent: {formatCurrency(totalSpent)} this month</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                  <span className="text-xs text-slate-400 ml-1">/ {formatCurrency(item.limit)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
