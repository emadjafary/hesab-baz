'use client'

import * as React from 'react'
import {
  Eye, EyeOff, TrendingUp, TrendingDown, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatToman, toPersianDigits, timeAgoFa } from '@/lib/format'

interface Props {
  totalValue: number
  dayDelta: number
  dayDeltaPct: number
  visible: boolean
  onToggleVisible: () => void
  lastRefresh: string
  onRefresh: () => void
  isRefreshing: boolean
}

export function PortfolioHero({
  totalValue, dayDelta, dayDeltaPct,
  visible, onToggleVisible,
  lastRefresh, onRefresh, isRefreshing,
}: Props) {
  const isUp = dayDelta >= 0

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200/10 p-5"
      style={{
        background: 'linear-gradient(180deg, #142036 0%, #111c2e 100%)',
      }}
    >
      {/* green halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -end-16 h-48 w-48 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0) 70%)',
        }}
      />

      {/* header row */}
      <div className="relative mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">ارزش کل سبد</span>
        <button
          onClick={onToggleVisible}
          aria-label={visible ? 'مخفی کردن' : 'نمایش'}
          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          {visible ? <Eye size={17} strokeWidth={1.5} /> : <EyeOff size={17} strokeWidth={1.5} />}
        </button>
      </div>

      {/* value row */}
      <div className="relative mb-4 flex items-baseline gap-2">
        <span
          className="tabular-nums font-black leading-none tracking-tight text-slate-50"
          style={{ fontSize: 36 }}
        >
          {visible ? formatToman(totalValue) : '••••••••'}
        </span>
        <span className="text-sm font-medium text-slate-400">تومان</span>
      </div>

      {/* meta row */}
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        {/* delta pill */}
        <div
          className={cn(
            'inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold tabular-nums',
            isUp
              ? 'border-green-500/22 bg-green-500/12 text-green-400'
              : 'border-rose-500/22 bg-rose-500/12 text-rose-400',
          )}
        >
          {isUp ? (
            <TrendingUp size={12} strokeWidth={2} />
          ) : (
            <TrendingDown size={12} strokeWidth={2} />
          )}
          <span>
            {isUp ? '+' : '−'}
            {formatToman(Math.abs(dayDelta))}
          </span>
          <span className="opacity-70 font-medium">تومان</span>
          <span className="opacity-70">·</span>
          <span dir="ltr">
            {isUp ? '+' : '−'}
            {toPersianDigits(Math.abs(dayDeltaPct).toFixed(1))}٪
          </span>
        </div>

        {/* refresh */}
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 transition-colors hover:text-slate-200"
        >
          <RefreshCw
            size={12}
            strokeWidth={1.8}
            className={cn(isRefreshing && 'animate-spin')}
          />
          <span>{isRefreshing ? 'در حال بروزرسانی…' : timeAgoFa(lastRefresh)}</span>
        </button>
      </div>
    </section>
  )
}
