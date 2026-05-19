'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, options, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pe-3 ps-10 text-sm',
            'text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
            'disabled:opacity-50 disabled:bg-slate-50',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
        />
      </div>
    )
  },
)
