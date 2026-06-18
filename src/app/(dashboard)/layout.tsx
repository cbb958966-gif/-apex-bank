'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { Shield, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-white" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading Apex Bank...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity',
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Apex Bank</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <Sidebar onNavClick={() => setMobileMenuOpen(false)} />
      </aside>
      <Sidebar />
      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col pb-[72px] lg:pb-0">
        <Header onToggleMenu={() => setMobileMenuOpen(o => !o)} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="animate-fade-in max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
