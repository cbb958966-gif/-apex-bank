'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex items-center gap-2">
      <label className="relative flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] -ml-2">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cn('peer h-4 w-4 shrink-0 rounded border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:focus-visible:ring-white', className)}
          {...props}
        />
        <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 opacity-0 peer-checked:opacity-100 text-white" />
      </label>
      {label && <label htmlFor={id} className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">{label}</label>}
    </div>
  )
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
