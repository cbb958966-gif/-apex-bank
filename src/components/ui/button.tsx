'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

function cn2(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'
    const variants: Record<string, string> = {
      default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20',
      outline: 'border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
      ghost: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white',
      link: 'text-slate-900 underline-offset-4 hover:underline dark:text-white',
    }
    const sizes: Record<string, string> = {
      default: 'h-11 px-6 py-3',
      sm: 'min-h-[44px] h-10 rounded-lg px-4 text-xs',
      lg: 'h-14 rounded-xl px-10 text-base',
      icon: 'h-11 w-11',
    }
    return (
      <button
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
