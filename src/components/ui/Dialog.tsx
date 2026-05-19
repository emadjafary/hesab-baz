'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: DialogProps) {
  // ESC to close
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white shadow-2xl shadow-slate-900/10',
          'animate-in zoom-in-95 fade-in',
          sizeMap[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            {title && (
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6 pt-4">{children}</div>
      </div>
    </div>
  )
}
