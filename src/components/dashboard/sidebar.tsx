'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  BarChart3,
  PiggyBank,
  Target,
  TrendingUp,
  Shield,
  Settings,
  HelpCircle,
  FileText,
  Bell,
  LogOut,
  ShieldCheck,
  UserCog,
} from 'lucide-react'

const navSections = [
  {
    label: 'Main',
    items: [
      { href: '/overview', icon: LayoutDashboard, label: 'Overview' },
      { href: '/accounts', icon: Wallet, label: 'Accounts' },
      { href: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
      { href: '/payments', icon: CreditCard, label: 'Payments' },
    ],
  },
  {
    label: 'Cards',
    items: [
      { href: '/cards', icon: CreditCard, label: 'My Cards' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/analytics', icon: BarChart3, label: 'Analytics' },
      { href: '/budgets', icon: PiggyBank, label: 'Budgets' },
      { href: '/goals', icon: Target, label: 'Goals' },
      { href: '/investments', icon: TrendingUp, label: 'Investments' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/security', icon: ShieldCheck, label: 'Security' },
      { href: '/documents', icon: FileText, label: 'Documents' },
      { href: '/notifications', icon: Bell, label: 'Notifications' },
      { href: '/settings', icon: Settings, label: 'Settings' },
      { href: '/support', icon: HelpCircle, label: 'Support' },
    ],
  },
]

export function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()

  const allSections = isAdmin
    ? [
        ...navSections,
        {
          label: 'Admin',
          items: [
            { href: '/admin', icon: UserCog, label: 'Admin Panel' },
          ],
        },
      ]
    : navSections

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="h-9 w-9 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
            <Shield className="h-5 w-5 text-white dark:text-slate-900" />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Apex Bank</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {allSections.map(section => (
            <div key={section.label} className="mb-6">
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {(user?.firstName as string)?.charAt(0)}{(user?.lastName as string)?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.firstName as string} {user?.lastName as string}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email as string}</p>
              {isAdmin && <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Admin</p>}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 safe-area-bottom">
        <div className="flex justify-around px-2 pt-1">
          {[
            { href: '/overview', icon: LayoutDashboard, label: 'Home' },
            { href: '/accounts', icon: Wallet, label: 'Accounts' },
            { href: '/transfers', icon: ArrowLeftRight, label: 'Transfer' },
            { href: '/analytics', icon: BarChart3, label: 'Analytics' },
            { href: '/cards', icon: CreditCard, label: 'Cards' },
          ].map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={onNavClick} className={cn('flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] px-2 rounded-xl text-[11px] font-medium transition-all', isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500')}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
