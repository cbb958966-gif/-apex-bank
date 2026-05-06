'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db } from '@/lib/db'
import { seedDevices, seedSecurityEvents } from '@/lib/seed-data'
import { formatDateTime } from '@/lib/utils'
import { Shield, Lock, Smartphone, Globe, Monitor, Key, Trash2, CheckCircle2, AlertTriangle, Eye, ArrowRight, ShieldCheck } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const deviceIcons: Record<string, React.ElementType> = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Laptop: Monitor,
}

export default function SecurityPage() {
  const devices = (db.devices.getAll() as any[]).length > 0 ? db.devices.getAll() as any[] : seedDevices
  const events = (db.securityEvents.getAll() as any[]).length > 0 ? db.securityEvents.getAll() as any[] : seedSecurityEvents
  const [showChangePassword, setShowChangePassword] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Security</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your security settings and monitor activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6 flex items-center gap-4">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Secure</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Account protected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">2FA Status</p>
            <Badge variant="success" className="mt-2">Enabled</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Active devices</p>
            <p className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{devices.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices">
        <TabsList>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="history">Login History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <Card>
            <CardHeader><CardTitle>Active devices</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.map((device: Record<string, unknown>, i: number) => {
                  const Icon = deviceIcons[device.type as string] || Monitor
                  return (
                    <div key={i} className="flex items-center justify-between py-4 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{device.name as string}</p>
                            {(device.isCurrent as boolean) && <Badge variant="info">Current</Badge>}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{device.browser as string} • {device.os as string} • {device.location as string}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{formatDateTime(device.lastActive as string)}</p>
                        {!device.isCurrent && <Button variant="ghost" size="sm" className="mt-1 text-red-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5 mr-1" /> Remove</Button>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle>Security event log</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {events.map((event: Record<string, unknown>, i: number) => {
                  const statusColor = event.status === 'success' ? 'text-emerald-500' : event.status === 'blocked' ? 'text-red-500' : 'text-amber-500'
                  return (
                    <div key={i} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${statusColor.replace('text-', 'bg-')}`} />
                        <div>
                          <p className="text-sm font-medium capitalize">{(event.type as string).replace('_', ' ')} <span className={`text-xs ${statusColor}`}>({event.status as string})</span></p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{event.ip as string} • {event.location as string} • {event.device as string}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{formatDateTime(event.date as string)}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader><CardTitle>Security settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium">Change password</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update your account password</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowChangePassword(!showChangePassword)}>Change</Button>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium">Biometric login</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Use fingerprint or face ID</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium">Login alerts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Get notified of new logins</p>
                </div>
                <Badge variant="success">On</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
