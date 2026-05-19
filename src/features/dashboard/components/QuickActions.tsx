'use client'

import { Plus, ArrowLeftRight, RefreshCw, BarChart3, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Action {
  icon: LucideIcon
  label: string
  onClick: () => void
  primary?: boolean
}

export function QuickActions({
  onAdd,
  onTransaction,
  onRefresh,
  onReports,
}: {
  onAdd: () => void
  onTransaction: () => void
  onRefresh: () => void
  onReports: () => void
}) {
  const actions: Action[] = [
    { icon: Plus,            label: 'افزودن دارایی', onClick: onAdd,         primary: true },
    { icon: ArrowLeftRight,  label: 'تراکنش جدید',   onClick: onTransaction },
    { icon: RefreshCw,       label: 'بروزرسانی',     onClick: onRefresh },
    { icon: BarChart3,       label: 'گزارش',          onClick: onReports },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map(({ icon: Icon, label, onClick, primary }) => (
        <button
          key={label}
          onClick={onClick}
          className="flex flex-col items-center gap-2 rounded-xl p-2 font-medium transition-colors hover:bg-slate-800/60"
        >
          <span
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-[14px] transition-transform active:scale-95',
              primary
                ? 'bg-green-500 text-[#052e1b]'
                : 'bg-[#182338] text-slate-300',
            )}
            style={primary ? { boxShadow: '0 6px 16px rgba(34,197,94,0.28)' } : undefined}
          >
            <Icon size={20} strokeWidth={primary ? 2 : 1.5} />
          </span>
          <span className="text-[11px] text-slate-400">{label}</span>
        </button>
      ))}
    </div>
  )
}
