'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { db } from '@/lib/db'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Mail, Phone, MapPin, Camera, Save, Bell, Moon, Sun, Monitor, Globe, Wallet, Pencil } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { user, updateUser, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName as string || '',
    lastName: user?.lastName as string || '',
    email: user?.email as string || '',
    phone: user?.phone as string || '',
    street: (user?.address as Record<string, unknown>)?.street as string || '',
    city: (user?.address as Record<string, unknown>)?.city as string || '',
    state: (user?.address as Record<string, unknown>)?.state as string || '',
    zip: (user?.address as Record<string, unknown>)?.zip as string || '',
  })
  const [accounts, setAccounts] = useState(db.accounts.getByUserId(user?.id as string) || [])
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [balanceInput, setBalanceInput] = useState('')

  const handleSave = () => {
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
    })
    setEditing(false)
  }

  const handleBalanceUpdate = (accountId: string) => {
    const amount = parseFloat(balanceInput)
    if (isNaN(amount) || amount < 0) return
    db.accounts.update(accountId, { balance: amount, availableBalance: amount })
    setAccounts(db.accounts.getByUserId(user?.id as string) || [])
    setEditingAccount(null)
    setBalanceInput('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Profile information</CardTitle>
              {!editing && <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center">
                    <Camera className="h-3.5 w-3.5 text-white dark:text-slate-900" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{formData.firstName} {formData.lastName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{formData.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First name</Label>
                  <Input value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} disabled={!editing} />
                </div>
                <div className="space-y-2">
                  <Label>Last name</Label>
                  <Input value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} disabled={!editing} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={formData.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} disabled={!editing} />
                </div>
              </div>

              <Separator className="my-6" />

              <h4 className="text-sm font-medium mb-4">Address</h4>
              <div className="space-y-4">
                <Input placeholder="Street address" value={formData.street} onChange={e => setFormData(p => ({ ...p, street: e.target.value }))} disabled={!editing} />
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="City" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} disabled={!editing} />
                  <Input placeholder="State" value={formData.state} onChange={e => setFormData(p => ({ ...p, state: e.target.value }))} disabled={!editing} />
                  <Input placeholder="ZIP" value={formData.zip} onChange={e => setFormData(p => ({ ...p, zip: e.target.value }))} disabled={!editing} />
                </div>
              </div>

              {editing && (
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save changes</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Account Balances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {isAdmin ? 'As an admin, you can adjust account balances below.' : 'View your account balances. Contact support for balance adjustments.'}
              </p>
              {accounts.map((account: any) => (
                <div key={account.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{account.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{account.type} • {account.nickname}</p>
                    </div>
                    {isAdmin && (
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingAccount(account.id)
                        setBalanceInput(account.balance.toString())
                      }}>
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-slate-500" />
                    <span className="text-lg font-semibold">${account.balance.toFixed(2)}</span>
                  </div>
                  {editingAccount === account.id && (
                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <Input
                        type="number"
                        value={balanceInput}
                        onChange={e => setBalanceInput(e.target.value)}
                        placeholder="Enter new balance"
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => handleBalanceUpdate(account.id)}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingAccount(null)}>Cancel</Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Transaction alerts', desc: 'Get notified for each transaction', key: 'transactionAlerts' },
                { label: 'Security alerts', desc: 'Login attempts and suspicious activity', key: 'securityAlerts' },
                { label: 'Bill reminders', desc: 'Get reminded before bills are due', key: 'billReminders' },
                { label: 'Budget alerts', desc: 'When approaching budget limits', key: 'budgetAlerts' },
                { label: 'Monthly statements', desc: 'Receive monthly account statements', key: 'statements' },
                { label: 'Marketing emails', desc: 'Product updates and special offers', key: 'marketing' },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="text-sm font-medium">{pref.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{pref.desc}</p>
                  </div>
                  <Checkbox defaultChecked={i < 4} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${theme === t.value ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                  >
                    <t.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
