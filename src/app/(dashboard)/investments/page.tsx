'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { seedAccounts } from '@/lib/seed-data'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownLeft, BarChart3, LineChart, Plus, ArrowRight } from 'lucide-react'
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const performanceData = [
  { month: 'Nov', value: 142000 },
  { month: 'Dec', value: 145000 },
  { month: 'Jan', value: 148000 },
  { month: 'Feb', value: 151000 },
  { month: 'Mar', value: 149000 },
  { month: 'Apr', value: 153000 },
  { month: 'May', value: 156789 },
]

const allocationData = [
  { name: 'Stocks', value: 62, color: '#3B82F6' },
  { name: 'Bonds', value: 18, color: '#10B981' },
  { name: 'Cash', value: 10, color: '#F59E0B' },
  { name: 'Real Estate', value: 7, color: '#8B5CF6' },
  { name: 'Crypto', value: 3, color: '#EF4444' },
]

const holdings = [
  { name: 'S&P 500 Index Fund', ticker: 'VOO', shares: 24.5, price: 412.30, change: 1.2 },
  { name: 'Total Bond Market', ticker: 'BND', shares: 150, price: 72.15, change: -0.3 },
  { name: 'Tech Growth Fund', ticker: 'QQQ', shares: 18.2, price: 385.60, change: 2.1 },
  { name: 'International Fund', ticker: 'VXUS', shares: 85, price: 56.40, change: 0.8 },
  { name: 'Bitcoin ETF', ticker: 'IBIT', shares: 12, price: 32.80, change: -1.5 },
]

export default function InvestmentsPage() {
  const accounts = (db.accounts.getAll() as any[]).length > 0 ? db.accounts.getAll() as any[] : seedAccounts
  const investmentAccount = accounts.find(a => a.type === 'investment')
  const totalValue = investmentAccount?.balance || 156789.50
  const totalReturn = 12450
  const totalReturnPct = ((totalReturn / (totalValue - totalReturn)) * 100).toFixed(2)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Investments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Portfolio overview and performance</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Investment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio value</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{formatCurrency(totalValue)}</p>
            <Badge variant="success" className="mt-2"><ArrowUpRight className="h-3 w-3 mr-1" /> +{totalReturnPct}%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total return</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>+{formatCurrency(totalReturn)}</p>
            <p className="text-xs text-slate-400 mt-1">Since inception</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Today&apos;s change</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>+$892.40</p>
            <Badge variant="success" className="mt-2">+0.57%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Holdings</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{holdings.length}</p>
            <p className="text-xs text-slate-400 mt-1">Across 5 asset classes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Portfolio performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Asset allocation</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={allocationData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {allocationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${Number(v) || 0}%`} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {allocationData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Your holdings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {holdings.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{h.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{h.ticker} • {h.shares} shares</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(h.price * h.shares)}</p>
                  <div className={`flex items-center justify-end text-xs ${h.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {h.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {h.change >= 0 ? '+' : ''}{h.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
