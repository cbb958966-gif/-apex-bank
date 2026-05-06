'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Lightbulb, Award, AlertCircle, ArrowRight } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  warning: AlertTriangle,
  tip: Lightbulb,
  congratulation: Award,
  alert: AlertCircle,
}

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-500', border: 'border-amber-200 dark:border-amber-800' },
  tip: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-500', border: 'border-blue-200 dark:border-blue-800' },
  congratulation: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-500', border: 'border-emerald-200 dark:border-emerald-800' },
  alert: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-500', border: 'border-red-200 dark:border-red-800' },
}

export function InsightsPanel({ insights }: { insights: any[] }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Smart insights</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">AI-powered recommendations based on your spending patterns</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight: Record<string, unknown>, i: number) => {
            const Icon = iconMap[insight.type as string] || AlertCircle
            const colors = colorMap[insight.type as string] || colorMap.tip

            return (
              <div key={i} className={`p-4 rounded-xl ${colors.bg} border ${colors.border} transition-all hover:shadow-md cursor-pointer`}>
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${colors.icon}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{insight.title as string}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{insight.message as string}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
