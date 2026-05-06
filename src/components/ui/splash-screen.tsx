'use client'

export default function SplashScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-white" />
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
        Apex Bank
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm">Loading your banking experience...</p>
    </div>
  )
}
