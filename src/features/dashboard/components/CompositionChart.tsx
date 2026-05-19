'use client'

import * as React from 'react'
import { Asset, ASSET_META } from '@/features/assets/types'
import { toPersianDigits } from '@/lib/format'

const TONE_COLORS: Record<string, string> = {
  'دیجیتال':   '#26a17b',
  'ارز خارجی': '#16a34a',
  'سکه':       '#a855f7',
  'طلا':       '#f59e0b',
}

interface Group {
  tone: string
  value: number
  pct: number
  color: string
}

function buildGroups(assets: Asset[]): Group[] {
  const totalsByTone = new Map<string, number>()
  let total = 0

  for (const a of assets) {
    const v = a.amount * a.unitPrice
    const tone = ASSET_META[a.kind].tone
    totalsByTone.set(tone, (totalsByTone.get(tone) ?? 0) + v)
    total += v
  }

  return Array.from(totalsByTone.entries())
    .map(([tone, value]) => ({
      tone,
      value,
      pct: total > 0 ? (value / total) * 100 : 0,
      color: TONE_COLORS[tone] ?? '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value)
}

export function CompositionChart({ assets }: { assets: Asset[] }) {
  const groups = React.useMemo(() => buildGroups(assets), [assets])

  if (assets.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700/40 bg-[#111c2e] p-4">
        <p className="text-center text-xs text-slate-500">هنوز دارایی ثبت نشده</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-700/40 bg-[#111c2e] p-4 flex flex-col gap-3">
      {/* bar */}
      <div
        className="flex h-2.5 overflow-hidden rounded-full"
        style={{ background: '#182338' }}
        role="img"
        aria-label="نمودار ترکیب سبد"
      >
        {groups.map((g) => (
          <span
            key={g.tone}
            style={{ width: `${g.pct}%`, background: g.color }}
            className="transition-all duration-500"
          />
        ))}
      </div>

      {/* legend */}
      <div className="grid grid-cols-2 gap-2">
        {groups.map((g) => (
          <div key={g.tone} className="flex items-center gap-2">
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: g.color }}
            />
            <span className="flex-1 text-xs text-slate-400">{g.tone}</span>
            <span className="text-xs font-bold tabular-nums text-slate-200">
              {toPersianDigits(g.pct.toFixed(1))}٪
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
