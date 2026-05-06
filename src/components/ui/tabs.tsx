'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({ value: '', onValueChange: () => {} })

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value, defaultValue = '', onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const activeValue = value ?? internalValue
    const setActiveValue = React.useCallback(
      (v: string) => {
        setInternalValue(v)
        onValueChange?.(v)
      },
      [onValueChange]
    )
    return (
      <TabsContext.Provider value={{ value: activeValue, onValueChange: setActiveValue }}>
        <div ref={ref} className={cn('', className)} {...props} />
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext)
    return (
      <button
        ref={ref}
        data-state={activeValue === value ? 'active' : 'inactive'}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          activeValue === value
            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: activeValue } = React.useContext(TabsContext)
    if (activeValue !== value) return null
    return (
      <div
        ref={ref}
        className={cn('mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
