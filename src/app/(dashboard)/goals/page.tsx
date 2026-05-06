'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { seedGoals } from '@/lib/seed-data'
import { formatCurrency, getProgress, getDaysUntil } from '@/lib/utils'
import { Target, Shield, Plane, Car, Home, Plus, ArrowRight, Calendar } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  plane: Plane,
  car: Car,
  home: Home,
  target: Target,
}

export default function GoalsPage() {
  const goals = (db.goals.getAll() as any[]).length > 0 ? db.goals.getAll() as any[] : seedGoals

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Savings Goals</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your progress towards financial goals</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Goal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal: Record<string, unknown>, i: number) => {
          const Icon = iconMap[goal.icon as string] || Target
          const progress = getProgress(goal.current as number, goal.target as number)
          const daysLeft = getDaysUntil(goal.deadline as string)
          const monthlyNeeded = ((goal.target as number) - (goal.current as number)) / Math.max(daysLeft / 30, 1)

          return (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: (goal.color as string) + '20' }}>
                      <Icon className="h-7 w-7" style={{ color: goal.color as string }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{goal.name as string}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{goal.status as string}</p>
                    </div>
                  </div>
                  <Badge variant="info">{Math.round(progress)}%</Badge>
                </div>

                <div className="space-y-4">
                  <Progress value={progress} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{formatCurrency(goal.current as number)}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(goal.target as number)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Auto-save monthly</p>
                    <p className="text-sm font-medium">{formatCurrency(goal.autoSave as number)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Deadline</p>
                    <p className="text-sm font-medium">{daysLeft} days left</p>
                  </div>
                </div>

                {monthlyNeeded > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">To reach your goal on time, save</p>
                    <p className="text-sm font-semibold">{formatCurrency(monthlyNeeded)}/month</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
