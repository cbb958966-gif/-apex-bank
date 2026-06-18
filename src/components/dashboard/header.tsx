'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from 'next-themes'
import { Bell, Sun, Moon, Search, Menu, X, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { getRelativeTime } from '@/lib/utils'

export function Header({ onToggleMenu }: { onToggleMenu?: () => void }) {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notifications = (db.notifications.getAll() as any[]).slice(0, 5)
  const unreadCount = db.notifications.getUnreadCount()

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4 flex-1">
          <button className="lg:hidden p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onToggleMenu}>
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions, accounts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-slate-400 focus:bg-white focus:outline-none transition-all dark:border-slate-700 dark:bg-slate-800 dark:focus:border-slate-600 dark:focus:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-in">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <button onClick={() => db.notifications.markAllAsRead()} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{n.title}</p>
                        {!n.read && <span className="h-2 w-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{getRelativeTime(n.date)}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                  View all notifications
                </button>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-slate-700">
            <Avatar size="sm">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {(user?.firstName as string)?.charAt(0)}{(user?.lastName as string)?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">{user?.firstName as string} {user?.lastName as string}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email as string}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
