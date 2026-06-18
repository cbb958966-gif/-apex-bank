'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/lib/db'
import { formatCurrency, formatDate, generateId } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { UserCog, Wallet, TrendingUp, CreditCard, Shield, ArrowUpDown, Plus, Search, User, Ban, CheckCircle, Banknote, Eye, AlertTriangle } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const { user: currentUser, isAdmin } = useAuth()
  const [users, setUsers] = useState(() => db.users.getAll() as any[])
  const [accounts, setAccounts] = useState(() => db.accounts.getAll() as any[])
  const [transactions] = useState(() => db.transactions.getAll() as any[])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [addBalanceAccount, setAddBalanceAccount] = useState<string | null>(null)
  const [addAmount, setAddAmount] = useState('')
  const [addType, setAddType] = useState<'credit' | 'debit'>('credit')

  useEffect(() => {
    if (currentUser && !isAdmin) {
      router.push('/overview')
    }
  }, [currentUser, isAdmin, router])

  const refreshUsers = () => setUsers(db.users.getAll() as any[])

  useEffect(() => {
    const interval = setInterval(refreshUsers, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertTriangle className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400">You do not have admin privileges.</p>
      </div>
    )
  }

  const filteredUsers = users.filter((u: any) =>
    u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddBalance = () => {
    if (!addBalanceAccount || !addAmount) return
    const amount = parseFloat(addAmount)
    if (isNaN(amount) || amount <= 0) return

    const account = accounts.find((a: any) => a.id === addBalanceAccount)
    if (!account) return

    const newBalance = addType === 'credit'
      ? account.balance + amount
      : account.balance - amount

    db.accounts.update(addBalanceAccount, {
      balance: newBalance,
      availableBalance: addType === 'credit'
        ? account.availableBalance + amount
        : account.availableBalance - amount,
    })

    db.transactions.add({
      id: generateId('txn'),
      accountId: addBalanceAccount,
      type: addType,
      category: 'Admin Adjustment',
      amount,
      currency: 'USD',
      description: addType === 'credit' ? 'Admin credit adjustment' : 'Admin debit adjustment',
      merchant: 'Apex Bank Admin',
      status: 'completed',
      date: new Date().toISOString(),
      balance: newBalance,
      isRecurring: false,
      tags: ['admin'],
    })

    setAccounts(db.accounts.getAll() as any[])
    setAddBalanceAccount(null)
    setAddAmount('')
  }

  const toggleAccountStatus = (accountId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active'
    db.accounts.update(accountId, { status: newStatus })
    setAccounts(db.accounts.getAll() as any[])
  }

  const selectedUserAccounts = selectedUserId
    ? accounts.filter((a: any) => a.userId === selectedUserId)
    : []

  const accountIcons: Record<string, React.ElementType> = {
    checking: Wallet,
    savings: TrendingUp,
    credit: CreditCard,
    investment: TrendingUp,
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Admin Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all users and accounts</p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="warning" className="text-xs px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            admin@apexbank.com / admin123
          </Badge>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-300">Admin Access</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
                You have full administrative control. Use the panel below to manage users, adjust account balances, and control account status.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:focus:border-slate-600 dark:focus:ring-white/10 dark:text-white"
        />
      </div>

      {addBalanceAccount && (
        <Card className="border-amber-200 dark:border-amber-800/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Banknote className="h-5 w-5 text-amber-600" />
              Adjust Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Amount (USD)</label>
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={addAmount}
                  onChange={e => setAddAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={addType === 'credit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAddType('credit')}
                >
                  + Add Funds
                </Button>
                <Button
                  variant={addType === 'debit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAddType('debit')}
                >
                  - Deduct
                </Button>
              </div>
              <Button onClick={handleAddBalance} className="bg-amber-600 hover:bg-amber-700 text-white">
                Confirm
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setAddBalanceAccount(null); setAddAmount('') }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <User className="h-5 w-5" />
            Users ({filteredUsers.length})
            <button onClick={refreshUsers} className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Refresh users">
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredUsers.map((u: any) => (
              <Card
                key={u.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedUserId === u.id ? 'ring-2 ring-slate-900 dark:ring-white' : ''
                } ${u.role === 'admin' ? 'border-amber-300 dark:border-amber-700' : ''}`}
                onClick={() => { setSelectedUserId(selectedUserId === u.id ? null : u.id); refreshUsers() }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      u.role === 'admin'
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                    </div>
                    <Badge variant={u.role === 'admin' ? 'warning' : 'default'}>
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedUserId ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Accounts
              </h2>
              {selectedUserAccounts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No accounts found for this user.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {selectedUserAccounts.map((account: any) => {
                    const Icon = accountIcons[account.type] || Wallet
                    const userTransactions = transactions.filter((t: any) => t.accountId === account.id)
                    return (
                      <Card key={account.id}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${
                                account.type === 'checking' ? 'from-blue-500 to-blue-700' :
                                account.type === 'savings' ? 'from-emerald-500 to-emerald-700' :
                                account.type === 'credit' ? 'from-purple-500 to-purple-700' :
                                'from-amber-500 to-amber-700'
                              } flex items-center justify-center`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">{account.nickname || account.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{account.type} • ••••{account.accountNumber?.slice(-4)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={account.status === 'active' ? 'success' : account.status === 'frozen' ? 'warning' : 'danger'}>
                                {account.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-end justify-between mb-4">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Balance</p>
                              <p className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
                                {formatCurrency(account.balance)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500 dark:text-slate-400">Available</p>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {formatCurrency(account.availableBalance)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                              onClick={() => setAddBalanceAccount(account.id)}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Adjust Balance
                            </Button>
                            <Button
                              size="sm"
                              variant={account.status === 'active' ? 'outline' : 'default'}
                              className={account.status === 'frozen' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                              onClick={() => toggleAccountStatus(account.id, account.status)}
                            >
                              {account.status === 'active' ? (
                                <><Ban className="h-3.5 w-3.5 mr-1.5" /> Freeze</>
                              ) : (
                                <><CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Activate</>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setAddBalanceAccount(account.id)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              {userTransactions.length} TXNs
                            </Button>
                          </div>

                          {addBalanceAccount === account.id && (
                            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                  <label className="text-xs font-medium text-slate-500 mb-1 block">Amount (USD)</label>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={addAmount}
                                    onChange={e => setAddAmount(e.target.value)}
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                                <div className="flex gap-2 items-end">
                                  <Button
                                    size="sm"
                                    variant={addType === 'credit' ? 'default' : 'outline'}
                                    onClick={() => setAddType('credit')}
                                  >
                                    <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                                    Add
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={addType === 'debit' ? 'default' : 'outline'}
                                    onClick={() => setAddType('debit')}
                                  >
                                    <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                                    Deduct
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={handleAddBalance}
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                  >
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Recent Transactions
                </h3>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {selectedUserAccounts.flatMap((a: any) =>
                    transactions
                      .filter((t: any) => t.accountId === a.id)
                      .slice(0, 5)
                      .map((t: any) => (
                        <div key={t.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${t.type === 'credit' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <div>
                              <p className="text-sm text-slate-900 dark:text-white">{t.merchant || t.description}</p>
                              <p className="text-xs text-slate-500">{a.nickname || a.name} • {formatDate(t.date)}</p>
                            </div>
                          </div>
                          <p className={`text-sm font-semibold ${t.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                            {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <UserCog className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Select a User</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose a user from the list to view and manage their accounts.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
