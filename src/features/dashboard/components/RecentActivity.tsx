'use client'

import Link from 'next/link'
import { ChevronLeft, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

type ActivityKind = 'up' | 'down' | 'add'

interface ActivityItem {
  id: string
  kind: ActivityKind
  title: string
  meta: string
}

// In production this would come from a hook / store; hard-coded sample for now.
const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', kind: 'up',   title: 'قیمت سکه تمام بروزرسانی شد',    meta: '۴ دقیقه پیش · ‎+۱٫۲٪' },
  { id: '2', kind: 'add',  title: '۰٫۵ گرم به طلای آب شده افزوده شد', meta: '۲ ساعت پیش' },
  { id: '3', kind: 'down', title: 'قیمت دلار کاهش یافت',              meta: '۶ ساعت پیش · ‎−۰٫۴٪' },
]

const KIND_MAP: Record<ActivityKind, { icon: typeof Plus; color: string; bg: string }> = {
  up:   { icon: TrendingUp,   color: '#4ade80', bg: 'rgba(34,197,94,0.12)' },
  down: { icon: TrendingDown, color: '#fb7185', bg: 'rgba(244,63,94,0.12)' },
  add:  { icon: Plus,         color: '#7dd3fc', bg: 'rgba(56,189,248,0.12)' },
}

export function RecentActivity() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-200">آخرین فعالیت</h2>
        <Link
          href="/dashboard/transactions"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-green-400"
        >
          همه
          <ChevronLeft size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-slate-700/40 bg-[#111c2e]">
        {MOCK_ACTIVITY.map((item, idx) => {
          const { icon: Icon, color, bg } = KIND_MAP[item.kind]
          return (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3',
                idx < MOCK_ACTIVITY.length - 1 && 'border-b border-slate-800/60',
              )}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: bg, color }}
              >
                <Icon size={14} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-200">{item.title}</p>
                <p className="mt-0.5 text-[11px] tabular-nums text-slate-500">{item.meta}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
