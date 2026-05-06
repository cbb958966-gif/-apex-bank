'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, getProgress } from '@/lib/utils'
import { Shield, Plane, Car, Home, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  plane: Plane,
  car: Car,
  home: Home,
  target: Target,
}

export function SavingsGoalsWidget({ goals }: { goals: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Savings goals</CardTitle>
        <Link href="/goals" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal: Record<string, unknown>, i: number) => {
            const Icon = iconMap[goal.icon as string] || Target
            const progress = getProgress(goal.current as number, goal.target as number)

            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: (goal.color as string) + '20' }}>
                      <Icon className="h-3.5 w-3.5" style={{ color: goal.color as string }} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{goal.name as string}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" color="" />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{formatCurrency(goal.current as number)}</span>
                  <span>{formatCurrency(goal.target as number)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
