'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: { value: string; label: string }[]
  placeholder?: string
  error?: string
  onChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder = 'Select...', error, onChange, ...props }, ref) => (
    <div className="w-full relative">
      <select
        className={cn(
          'flex h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:focus-visible:ring-white transition-all',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-slate-400" />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
)
Select.displayName = 'Select'

export { Select }
