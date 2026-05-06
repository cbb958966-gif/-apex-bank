'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { seedAccounts, seedTransfers } from '@/lib/seed-data'
import { formatCurrency, formatDateTime, generateId } from '@/lib/utils'
import { sendTransferReceipt } from '@/lib/email'
import {
  ArrowRight, Send, Clock, CheckCircle2, XCircle, Loader2, Plus, ArrowUpDown,
  Search, Filter, Mail, AlertCircle, Receipt, Printer, Download, ChevronLeft,
  ChevronRight, ArrowLeftRight, Building2, User, Globe, CreditCard
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type Step = 'details' | 'review' | 'receipt'

const TRANSFER_TYPES = [
  { value: 'internal', label: 'Between my accounts', desc: 'Instant, no fee', icon: ArrowLeftRight },
  { value: 'external', label: 'To external bank', desc: '1-3 business days', icon: Building2 },
  { value: 'wire', label: 'Wire transfer', desc: 'Same day, $25 fee', icon: Send },
  { value: 'p2p', label: 'To person (P2P)', desc: 'Instant', icon: User },
  { value: 'international', label: 'International', desc: '2-5 business days', icon: Globe },
]

const STATUS_ICONS: Record<string, React.ElementType> = {
  completed: CheckCircle2,
  pending: Clock,
  failed: XCircle,
  processing: Loader2,
  scheduled: Clock,
}

const STATUS_COLORS: Record<string, string> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
  processing: 'info',
  scheduled: 'info',
}

export default function TransfersPage() {
  const [tab, setTab] = useState('new')
  const [step, setStep] = useState<Step>('details')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [completedTransfer, setCompletedTransfer] = useState<Record<string, unknown> | null>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [viewReceipt, setViewReceipt] = useState<Record<string, unknown> | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const receiptRef = useRef<HTMLDivElement>(null)

  const accounts = (db.accounts.getAll() as any[]).length > 0 ? db.accounts.getAll() as any[] : seedAccounts
  const transfers = (db.transfers.getAll() as any[]).length > 0 ? db.transfers.getAll() as any[] : seedTransfers

  const [formData, setFormData] = useState({
    fromAccount: '',
    toType: 'internal',
    toAccount: '',
    toName: '',
    recipientEmail: '',
    amount: '',
    description: '',
  })

  const filteredTransfers = transfers.filter((t: Record<string, unknown>) => {
    const matchesSearch = !searchQuery ||
      (t.toName as string)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description as string)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.reference as string)?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const validateForm = () => {
    if (!formData.fromAccount) return 'Select a source account'
    if (!formData.amount || parseFloat(formData.amount) <= 0) return 'Enter a valid amount'
    if (formData.toType === 'internal' && !formData.toAccount) return 'Select a destination account'
    if (formData.toType !== 'internal' && !formData.toName) return 'Enter recipient name'
    return null
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateForm()
    if (error) {
      setSuccessMessage(error)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
      return
    }
    setStep('review')
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)

    const newTransfer = {
      id: generateId('xfr'),
      type: formData.toType,
      fromAccount: formData.fromAccount,
      toAccount: formData.toAccount,
      toName: formData.toName,
      recipientEmail: formData.recipientEmail || emailInput,
      amount: parseFloat(formData.amount),
      currency: 'USD',
      fee: formData.toType === 'wire' ? 25 : 0,
      description: formData.description,
      status: 'completed',
      date: new Date().toISOString(),
      reference: `${formData.toType.toUpperCase().slice(0, 4)}-${Date.now()}`,
    }

    db.transfers.add(newTransfer)

    const srcAccount = accounts.find((a: any) => a.id === newTransfer.fromAccount)
    if (srcAccount) {
      const totalDeduction = newTransfer.amount + newTransfer.fee
      db.accounts.update(srcAccount.id as string, {
        balance: (srcAccount.balance as number) - totalDeduction,
        availableBalance: (srcAccount.availableBalance as number) - totalDeduction,
      })
    }

    if (formData.toType === 'internal') {
      const destAccount = accounts.find((a: any) => a.id === newTransfer.toAccount)
      if (destAccount) {
        db.accounts.update(destAccount.id as string, {
          balance: (destAccount.balance as number) + newTransfer.amount,
          availableBalance: (destAccount.availableBalance as number) + newTransfer.amount,
        })
      }
    }

    setIsSubmitting(false)
    setCompletedTransfer(newTransfer)
    setEmailInput(formData.recipientEmail)
    setStep('receipt')
  }

  const handleSendReceipt = async () => {
    if (!completedTransfer) return
    const email = emailInput || (completedTransfer.recipientEmail as string)
    if (!email) return

    setIsSendingEmail(true)
    const fromAccount = accounts.find((a: any) => a.id === completedTransfer.fromAccount)
    const result = await sendTransferReceipt({
      to_email: email,
      toName: completedTransfer.toName as string,
      fromName: fromAccount?.nickname || 'Apex Bank',
      amount: formatCurrency(completedTransfer.amount as number),
      currency: completedTransfer.currency as string,
      reference: completedTransfer.reference as string,
      date: formatDateTime(completedTransfer.date as string),
      description: completedTransfer.description as string,
      type: completedTransfer.type as string,
      fee: formatCurrency(completedTransfer.fee as number),
    })

    setIsSendingEmail(false)
    setSuccessMessage(result ? 'Receipt emailed successfully!' : 'Failed to send email. Check your EmailJS setup.')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 4000)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleNewTransfer = () => {
    setStep('details')
    setCompletedTransfer(null)
    setFormData({ fromAccount: '', toType: 'internal', toAccount: '', toName: '', recipientEmail: '', amount: '', description: '' })
    setEmailInput('')
  }

  const selectedType = TRANSFER_TYPES.find(t => t.value === formData.toType)
  const fromAccount = accounts.find((a: any) => a.id === formData.fromAccount)
  const toAccount = accounts.find((a: any) => a.id === formData.toAccount)
  const totalAmount = formData.amount ? parseFloat(formData.amount) + (formData.toType === 'wire' ? 25 : 0) : 0

  const getTypeIcon = (type: string) => {
    const t = TRANSFER_TYPES.find(t => t.value === type)
    return t?.icon || ArrowUpDown
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Transfers</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Send money securely with receipts</p>
      </div>

      {success && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${successMessage?.toLowerCase().includes('failed') ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'}`}>
          {successMessage?.toLowerCase().includes('failed') ? <XCircle className="h-5 w-5 text-red-500 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: successMessage?.includes('emailed') ? '#10b981' : undefined }} />}
          <p className={`text-sm font-medium ${successMessage?.toLowerCase().includes('failed') ? 'text-red-600 dark:text-red-400' : successMessage?.includes('emailed') ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{successMessage}</p>
        </div>
      )}

      <Tabs value={tab} onValueChange={(v) => { setTab(v); handleNewTransfer() }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">New Transfer</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          {step === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Send className="h-5 w-5" /> Send money</CardTitle>
                <CardDescription>Choose transfer type and fill in details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReview} className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {TRANSFER_TYPES.map(t => {
                      const Icon = t.icon
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, toType: t.value }))}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
                            formData.toType === t.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <Icon className="h-4 w-4" style={{ color: formData.toType === t.value ? '#3b82f6' : undefined }} />
                          <span className="text-xs font-medium leading-tight">{t.label}</span>
                          <span className="text-[10px] text-slate-400">{t.desc}</span>
                        </button>
                      )
                    })}
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>From account</Label>
                      <Select
                        options={accounts.map(a => ({ value: a.id as string, label: `${a.nickname} (${formatCurrency(a.balance as number)})` }))}
                        value={formData.fromAccount}
                        onChange={v => setFormData(p => ({ ...p, fromAccount: v }))}
                        placeholder="Select account"
                      />
                    </div>

                    {formData.toType === 'internal' ? (
                      <div className="space-y-2">
                        <Label>To account</Label>
                        <Select
                          options={accounts.filter(a => a.id !== formData.fromAccount).map(a => ({ value: a.id as string, label: `${a.nickname} (${formatCurrency(a.balance as number)})` }))}
                          value={formData.toAccount}
                          onChange={v => setFormData(p => ({ ...p, toAccount: v }))}
                          placeholder="Select destination"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Recipient name</Label>
                          <Input placeholder="Full name" value={formData.toName} onChange={e => setFormData(p => ({ ...p, toName: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Recipient email <span className="text-slate-400 font-normal">(for receipt)</span></Label>
                          <Input type="email" placeholder="recipient@email.com" value={formData.recipientEmail} onChange={e => setFormData(p => ({ ...p, recipientEmail: e.target.value }))} />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <Input className="pl-8" type="number" step="0.01" min="0.01" placeholder="0.00" value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description <span className="text-slate-400 font-normal">(optional)</span></Label>
                      <Textarea placeholder="What's this for?" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={1} />
                    </div>
                  </div>

                  {formData.amount && parseFloat(formData.amount) > 0 && (
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Transfer amount</span><span>{formatCurrency(parseFloat(formData.amount) || 0)}</span></div>
                      {formData.toType === 'wire' && <div className="flex justify-between"><span className="text-slate-500">Wire fee</span><span>$25.00</span></div>}
                      <Separator />
                      <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(totalAmount)}</span></div>
                      {fromAccount && <div className="flex justify-between text-xs text-slate-400"><span>Remaining balance</span><span>{formatCurrency((fromAccount.balance as number) - totalAmount)}</span></div>}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12">
                    Review Transfer <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 'review' && (
            <Card>
              <CardHeader>
                <button onClick={() => setStep('details')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2">
                  <ChevronLeft className="h-4 w-4" /> Back to details
                </button>
                <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Review & confirm</CardTitle>
                <CardDescription>Verify details before sending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">From</p>
                      <p className="font-semibold text-sm">{fromAccount?.nickname}</p>
                      <p className="text-xs text-slate-400">{formatCurrency(fromAccount?.balance ?? 0)}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                    <div className="text-center">
                      <p className="text-xs text-slate-500">To</p>
                      <p className="font-semibold text-sm">{formData.toType === 'internal' ? toAccount?.nickname : formData.toName}</p>
                      <p className="text-xs text-slate-400 capitalize">{formData.toType}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-semibold text-lg">{formatCurrency(parseFloat(formData.amount))}</span></div>
                    {formData.toType === 'wire' && <div className="flex justify-between"><span className="text-slate-500">Wire fee</span><span>$25.00</span></div>}
                    <Separator />
                    <div className="flex justify-between font-bold text-base"><span>Total debited</span><span>{formatCurrency(totalAmount)}</span></div>
                    <Separator />
                    <div className="flex justify-between text-xs"><span className="text-slate-500">From</span><span>{fromAccount?.nickname} •••• {(fromAccount?.accountNumber as string)?.slice(-4)}</span></div>
                    {formData.toType === 'internal' && <div className="flex justify-between text-xs"><span className="text-slate-500">To</span><span>{toAccount?.nickname} •••• {(toAccount?.accountNumber as string)?.slice(-4)}</span></div>}
                    {formData.toType !== 'internal' && <div className="flex justify-between text-xs"><span className="text-slate-500">Recipient</span><span>{formData.toName}</span></div>}
                    {(formData.recipientEmail || emailInput) && <div className="flex justify-between text-xs"><span className="text-slate-500">Receipt to</span><span>{formData.recipientEmail || emailInput}</span></div>}
                    {formData.description && <div className="flex justify-between text-xs"><span className="text-slate-500">Note</span><span>{formData.description}</span></div>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('details')}>Edit</Button>
                <Button className="flex-1 h-12" onClick={handleConfirm} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Confirm & Send
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 'receipt' && completedTransfer && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={handleNewTransfer} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <ChevronLeft className="h-4 w-4" /> New transfer
                </button>
                <Badge variant="success" className="text-sm px-3 py-1"><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Completed</Badge>
              </div>

              <div ref={receiptRef} className="rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-8 w-8" />
                    <div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>Transfer Receipt</h2>
                      <p className="text-blue-100 text-sm">Apex Bank</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(completedTransfer.amount as number)}</p>
                    <p className="text-sm text-slate-500 mt-1">{completedTransfer.description as string || 'Transfer'}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-slate-500 text-xs">Transaction ID</p><p className="font-mono text-xs mt-0.5">{completedTransfer.id as string}</p></div>
                    <div><p className="text-slate-500 text-xs">Reference</p><p className="font-mono text-xs mt-0.5">{completedTransfer.reference as string}</p></div>
                    <div><p className="text-slate-500 text-xs">Date</p><p className="mt-0.5">{formatDateTime(completedTransfer.date as string)}</p></div>
                    <div><p className="text-slate-500 text-xs">Type</p><p className="mt-0.5 capitalize">{completedTransfer.type as string}</p></div>
                    <div><p className="text-slate-500 text-xs">From</p><p className="mt-0.5">{fromAccount?.nickname} ••••{(fromAccount?.accountNumber as string)?.slice(-4)}</p></div>
                    <div><p className="text-slate-500 text-xs">To</p><p className="mt-0.5">{completedTransfer.toName as string || toAccount?.nickname}</p></div>
                    {(completedTransfer.recipientEmail as string) && <div><p className="text-slate-500 text-xs">Receipt emailed to</p><p className="mt-0.5">{completedTransfer.recipientEmail as string}</p></div>}
                    <div><p className="text-slate-500 text-xs">Fee</p><p className="mt-0.5">{formatCurrency(completedTransfer.fee as number)}</p></div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email receipt to recipient</p>
                      <p className="text-xs text-slate-500">Send a confirmation email with this receipt</p>
                    </div>
                    <Input
                      className="w-52 text-sm"
                      type="email"
                      placeholder="email@recipient.com"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                    />
                    <Button size="sm" onClick={handleSendReceipt} disabled={!emailInput || isSendingEmail}>
                      {isSendingEmail ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Send <Mail className="h-3.5 w-3.5 ml-1" /></>}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 print:hidden">
                <Button variant="outline" className="flex-1" onClick={handlePrintReceipt}><Printer className="h-4 w-4 mr-2" /> Print</Button>
                <Button variant="outline" className="flex-1" onClick={handleNewTransfer}>New Transfer <Plus className="h-4 w-4 ml-2" /></Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle>Transfer history</CardTitle>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-9 h-9 text-sm"
                      placeholder="Search transfers..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    options={[
                      { value: 'all', label: 'All' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'failed', label: 'Failed' },
                    ]}
                    value={filterStatus}
                    onChange={setFilterStatus}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTransfers.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">No transfers found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTransfers.map((transfer: Record<string, unknown>, i: number) => {
                    const StatusIcon = STATUS_ICONS[transfer.status as string] || Clock
                    const color = STATUS_COLORS[transfer.status as string] || 'default'
                    const TypeIcon = getTypeIcon(transfer.type as string)
                    const srcAcc = accounts.find((a: any) => a.id === transfer.fromAccount)

                    return (
                      <div key={i} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${transfer.type === 'internal' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{transfer.toName as string}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{transfer.description as string} • {formatDateTime(transfer.date as string)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(transfer.amount as number)}</p>
                            <Badge variant={color as 'success' | 'warning' | 'danger' | 'info' | 'default'} className="mt-1">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {transfer.status as string}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setViewReceipt(transfer)}
                            title="View receipt"
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader><CardTitle>Scheduled transfers</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No scheduled transfers</p>
                <Button variant="outline" className="mt-4" onClick={() => { setTab('new'); handleNewTransfer() }}><Plus className="h-4 w-4 mr-2" /> Schedule a transfer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Receipt</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setViewReceipt(null)}>Close</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-3">
                <p className="text-2xl font-bold">{formatCurrency(viewReceipt.amount as number)}</p>
                <p className="text-sm text-slate-500 mt-1">{viewReceipt.description as string || 'Transfer'}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-500 text-xs">Reference</p><p className="font-mono text-xs mt-0.5">{viewReceipt.reference as string}</p></div>
                <div><p className="text-slate-500 text-xs">Type</p><p className="mt-0.5 capitalize">{viewReceipt.type as string}</p></div>
                <div><p className="text-slate-500 text-xs">Date</p><p className="mt-0.5">{formatDateTime(viewReceipt.date as string)}</p></div>
                <div><p className="text-slate-500 text-xs">Status</p><p className="mt-0.5 capitalize">{viewReceipt.status as string}</p></div>
                <div><p className="text-slate-500 text-xs">From</p><p className="mt-0.5">{accounts.find((a: any) => a.id === viewReceipt.fromAccount)?.nickname || 'N/A'}</p></div>
                <div><p className="text-slate-500 text-xs">To</p><p className="mt-0.5">{viewReceipt.toName as string}</p></div>
                {(viewReceipt.recipientEmail as string) && <div><p className="text-slate-500 text-xs">Email</p><p className="mt-0.5">{viewReceipt.recipientEmail as string}</p></div>}
                <div><p className="text-slate-500 text-xs">Fee</p><p className="mt-0.5">{formatCurrency(viewReceipt.fee as number)}</p></div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { handlePrintReceipt() }}>
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setEmailInput(viewReceipt.recipientEmail as string || '')
                  setCompletedTransfer(viewReceipt)
                  handleSendReceipt()
                }}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                Email Receipt
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}