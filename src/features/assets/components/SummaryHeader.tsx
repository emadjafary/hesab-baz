'use client'

import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatToman, timeAgoFa } from '@/lib/format'
import { cn } from '@/lib/cn'

interface Props {
  totalValue: number
  lastGlobalRefresh: string | null
  isRefreshing: boolean
  onAddClick: () => void
  onRefreshClick: () => void
}

export function SummaryHeader({
  totalValue,
  lastGlobalRefresh,
  isRefreshing,
  onAddClick,
  onRefreshClick,
}: Props) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-800">سایر دارایی‌ها</h1>
        {lastGlobalRefresh && (
          <button
            onClick={onRefreshClick}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            title="بروزرسانی دستی"
          >
            <RefreshCw
              size={12}
              strokeWidth={1.5}
              className={cn(isRefreshing && 'animate-spin')}
            />
            <span>آخرین بروزرسانی: {timeAgoFa(lastGlobalRefresh)}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm">
          <span className="text-slate-500">ارزش کل:</span>{' '}
          <span className="font-bold text-slate-800 tabular-nums">
            {formatToman(totalValue)}
          </span>{' '}
          <span className="text-slate-500 text-xs">تومان</span>
        </div>
        <Button onClick={onAddClick}>
          <Plus size={16} strokeWidth={1.5} />
          <span>دارایی جدید</span>
        </Button>
      </div>
    </header>
  )
}
