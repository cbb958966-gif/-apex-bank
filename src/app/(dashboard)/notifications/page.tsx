'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { seedNotifications } from '@/lib/seed-data'
import { getRelativeTime } from '@/lib/utils'
import { Bell, Check, CheckCheck, Trash2, Filter, Settings } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(
    (db.notifications.getAll() as any[]).length > 0 ? db.notifications.getAll() as any[] : seedNotifications
  )
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
  }

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const typeIcons: Record<string, string> = {
    transaction: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    security: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    system: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    marketing: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated on your account activity</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="h-4 w-4 mr-2" /> Mark all read</Button>}
          <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2" /> Preferences</Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((notification: Record<string, unknown>, i: number) => (
                <div key={i} className={`p-4 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/50`}>
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${typeIcons[notification.type as string] || typeIcons.system}`}>
                      <Bell className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title as string}</p>
                            {!notification.read && <span className="h-2 w-2 bg-blue-500 rounded-full" />}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{notification.message as string}</p>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{getRelativeTime(notification.date as string)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {!notification.read && (
                          <button onClick={() => markAsRead(notification.id as string)} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
                            <Check className="h-3 w-3" /> Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
