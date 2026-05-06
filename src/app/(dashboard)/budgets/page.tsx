'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db } from '@/lib/db'
import { seedBudgets } from '@/lib/seed-data'
import { formatCurrency } from '@/lib/utils'
import { Plus, Edit2, AlertTriangle, PiggyBank } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316']

export default function BudgetsPage() {
  const budgets = (db.budgets.getAll() as any[]).length > 0 ? db.budgets.getAll() as any[] : seedBudgets
  const totalBudget = budgets.reduce((s: number, b: Record<string, unknown>) => s + (b.limit as number), 0)
  const totalSpent = budgets.reduce((s: number, b: Record<string, unknown>) => s + (b.spent as number), 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Budgets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your spending limits</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Budget</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total budget</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{formatCurrency(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total spent</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{formatCurrency(totalBudget - totalSpent)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget: Record<string, unknown>, i: number) => {
          const percentage = ((budget.spent as number) / (budget.limit as number)) * 100
          const isOver = percentage >= 100
          const isWarning = percentage >= 80 && !isOver

          return (
            <Card key={i} className={isOver ? 'border-red-200 dark:border-red-800' : isWarning ? 'border-amber-200 dark:border-amber-800' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS[i % COLORS.length] + '20' }}>
                      <PiggyBank className="h-5 w-5" style={{ color: COLORS[i % COLORS.length] }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{budget.category as string}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Monthly budget</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOver && <Badge variant="danger"><AlertTriangle className="h-3 w-3 mr-1" /> Over</Badge>}
                    {isWarning && <Badge variant="warning"><AlertTriangle className="h-3 w-3 mr-1" /> 80%+</Badge>}
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{formatCurrency(budget.spent as number)} spent</span>
                    <span className="font-medium">{Math.round(percentage)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2.5" />
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{formatCurrency((budget.limit as number) - (budget.spent as number))} remaining</span>
                    <span>Budget: {formatCurrency(budget.limit as number)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
