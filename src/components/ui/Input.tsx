'use client'

import * as React from 'react'
import { cn } from '@/lib/cn'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm',
        'placeholder:text-slate-400 text-slate-800',
        'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
        'disabled:opacity-50 disabled:bg-slate-50',
        className,
      )}
      {...props}
    />
  )
})
