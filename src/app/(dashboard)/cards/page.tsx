'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { seedCards } from '@/lib/seed-data'
import { formatCurrency, maskCardNumber } from '@/lib/utils'
import { CreditCard, Eye, EyeOff, Lock, Unlock, Copy, Plus, Shield, Settings, TrendingUp, Wifi } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function CardsPage() {
  const [selectedCard, setSelectedCard] = useState(0)
  const [showNumbers, setShowNumbers] = useState(false)
  const cards = (db.cards.getAll() as any[]).length > 0 ? db.cards.getAll() as any[] : seedCards

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>My Cards</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your physical and virtual cards</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Card</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Cards</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {cards.map((card: Record<string, unknown>, i: number) => (
                <div
                  key={card.id as string}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white cursor-pointer transition-all ${selectedCard === i ? 'ring-2 ring-white/50 scale-[1.02]' : ''}`}
                  onClick={() => setSelectedCard(i)}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-10 -translate-x-10" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 rotate-90 opacity-70" />
                        <span className="text-xs uppercase tracking-wider opacity-70">{card.network as string}</span>
                      </div>
                      <Badge variant={card.status === 'active' ? 'success' : 'danger'} className="text-xs bg-white/20 text-white border-0">
                        {card.status as string}
                      </Badge>
                    </div>

                    <div className="mb-6">
                      <p className="text-lg font-mono tracking-widest">
                        {showNumbers ? card.number as string : maskCardNumber(card.number as string)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-60">Card holder</p>
                        <p className="text-sm font-medium">{card.holderName as string}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider opacity-60">Expires</p>
                        <p className="text-sm font-medium">{card.expiry as string}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setShowNumbers(!showNumbers)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">
                  {showNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showNumbers ? 'Hide' : 'Show'} numbers
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {cards[selectedCard] && (
                <>
                  <Card>
                    <CardHeader><CardTitle>Card details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Type</p>
                          <p className="text-sm font-medium capitalize">{cards[selectedCard].type as string}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Network</p>
                          <p className="text-sm font-medium capitalize">{cards[selectedCard].network as string}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">CVV</p>
                          <p className="text-sm font-medium font-mono">{showNumbers ? cards[selectedCard].cvv : '***'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                          <Badge variant={cards[selectedCard].status === 'active' ? 'success' : 'danger'}>{cards[selectedCard].status as string}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-20 flex flex-col gap-1">
                          <Lock className="h-5 w-5" />
                          <span className="text-xs">Freeze Card</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-1">
                          <Settings className="h-5 w-5" />
                          <span className="text-xs">Settings</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-1">
                          <Copy className="h-5 w-5" />
                          <span className="text-xs">Copy Details</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-1">
                          <Shield className="h-5 w-5" />
                          <span className="text-xs">Report Issue</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="controls">
          <Card>
            <CardHeader><CardTitle>Card controls</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Freeze card', desc: 'Temporarily disable all transactions', icon: Lock },
                  { label: 'Contactless payments', desc: 'Enable tap-to-pay transactions', icon: Wifi, enabled: true },
                  { label: 'Online purchases', desc: 'Allow online and in-app purchases', icon: CreditCard, enabled: true },
                  { label: 'ATM withdrawals', desc: 'Enable cash withdrawals at ATMs', icon: TrendingUp },
                  { label: 'International transactions', desc: 'Allow transactions outside your country', icon: Shield },
                ].map((control, i) => (
                  <div key={i} className="flex items-center justify-between py-4 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <control.icon className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium">{control.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{control.desc}</p>
                      </div>
                    </div>
                    <Button variant={control.enabled ? 'default' : 'outline'} size="sm">
                      {control.enabled ? 'On' : 'Off'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader><CardTitle>Spending limits</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: 'Daily purchase limit', value: 5000, max: 10000 },
                  { label: 'ATM withdrawal limit', value: 1000, max: 3000 },
                  { label: 'Online purchase limit', value: 3000, max: 5000 },
                  { label: 'International limit', value: 2000, max: 5000 },
                ].map((limit, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{limit.label}</span>
                      <span className="text-sm text-slate-500">{formatCurrency(limit.value)} / {formatCurrency(limit.max)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 dark:bg-white rounded-full transition-all" style={{ width: (limit.value / limit.max) * 100 + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
