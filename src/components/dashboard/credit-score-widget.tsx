'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUp, ArrowDown, Minus, ChevronRight } from 'lucide-react'

export function CreditScoreWidget({ score }: { score: any }) {
  const scoreValue = score.score as number
  const previousScore = score.previousScore as number
  const diff = scoreValue - previousScore
  const factors = score.factors as any[]

  const getScoreColor = (s: number) => {
    if (s >= 800) return '#10B981'
    if (s >= 740) return '#22C55E'
    if (s >= 670) return '#EAB308'
    if (s >= 580) return '#F97316'
    return '#EF4444'
  }

  const scoreColor = getScoreColor(scoreValue)
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (scoreValue / 850) * circumference

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Credit score</CardTitle>
          <Badge variant={diff > 0 ? 'success' : diff < 0 ? 'danger' : 'default'} className="text-xs">
            {diff > 0 ? <ArrowUp className="h-3 w-3 mr-0.5" /> : diff < 0 ? <ArrowDown className="h-3 w-3 mr-0.5" /> : <Minus className="h-3 w-3 mr-0.5" />}
            {diff > 0 ? '+' : ''}{diff}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-slate-700" />
              <circle cx="64" cy="64" r="54" stroke={scoreColor} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: scoreColor }}>{scoreValue}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Excellent</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {factors?.slice(0, 3).map((factor: Record<string, unknown>, i: number) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${factor.impact === 'positive' ? 'bg-emerald-500' : factor.impact === 'negative' ? 'bg-red-500' : 'bg-slate-300'}`} />
                <span className="text-xs text-slate-600 dark:text-slate-300">{factor.name as string}</span>
              </div>
              <span className="text-[10px] text-slate-400">{factor.impact as string}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
