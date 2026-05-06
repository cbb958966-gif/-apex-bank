'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { seedTransactions, seedBudgets } from '@/lib/seed-data'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, DollarSign, ShoppingCart, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316']

const monthlyData = [
  { month: 'Nov', income: 8500, expenses: 4200 },
  { month: 'Dec', income: 9200, expenses: 5100 },
  { month: 'Jan', income: 8500, expenses: 4800 },
  { month: 'Feb', income: 8500, expenses: 4500 },
  { month: 'Mar', income: 11700, expenses: 5200 },
  { month: 'Apr', income: 8500, expenses: 4300 },
  { month: 'May', income: 8500, expenses: 3100 },
]

const trendData = [
  { month: 'Nov', savings: 4300 },
  { month: 'Dec', savings: 4100 },
  { month: 'Jan', savings: 3700 },
  { month: 'Feb', savings: 4000 },
  { month: 'Mar', savings: 6500 },
  { month: 'Apr', savings: 4200 },
  { month: 'May', savings: 5400 },
]

export default function AnalyticsPage() {
  const transactions = (db.transactions.getAll() as any[]).length > 0 ? db.transactions.getAll() as any[] : seedTransactions
  const budgets = (db.budgets.getAll() as any[]).length > 0 ? db.budgets.getAll() as any[] : seedBudgets

  const totalIncome = transactions.filter((t: any) => t.type === 'credit').reduce((s: number, t: any) => s + (t.amount as number), 0)
  const totalExpenses = transactions.filter((t: any) => t.type === 'debit').reduce((s: number, t: any) => s + (t.amount as number), 0)
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)

  const categoryData = budgets.map((b: Record<string, unknown>, i: number) => ({
    name: b.category as string,
    value: b.spent as number,
    limit: b.limit as number,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed insights into your finances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> This Month</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <Badge variant="success"><ArrowUpRight className="h-3 w-3 mr-1" /> 12%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3" style={{ fontFamily: 'var(--font-poppins)' }}>{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total income</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <ShoppingCart className="h-5 w-5 text-red-500" />
              <Badge variant="danger"><ArrowDownLeft className="h-3 w-3 mr-1" /> 8%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3" style={{ fontFamily: 'var(--font-poppins)' }}>{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <Badge variant="success">+5.2%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3" style={{ fontFamily: 'var(--font-poppins)' }}>{formatCurrency(totalIncome - totalExpenses)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Net savings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingDown className="h-5 w-5 text-purple-500" />
              <Badge variant="info">{savingsRate}%</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3" style={{ fontFamily: 'var(--font-poppins)' }}>{savingsRate}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Savings rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Income vs Expenses</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" radius={[6, 6, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Monthly Savings Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} formatter={(v) => formatCurrency(Number(v))} />
                <Area type="monotone" dataKey="savings" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Spending Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                    <span className="text-xs text-slate-400 ml-2">of {formatCurrency(item.limit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
