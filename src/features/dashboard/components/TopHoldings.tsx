'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Asset, ASSET_META } from '@/features/assets/types'
import { AssetIcon } from '@/features/assets/components/AssetIcon'
import { formatToman, formatAmount, toPersianDigits } from '@/lib/format'
import { cn } from '@/lib/cn'

export const TopHoldings = React.memo(function TopHoldings({
  assets,
}: {
  assets: Asset[]
}) {
  const top = React.useMemo(
    () =>
      [...assets]
        .sort((a, b) => b.amount * b.unitPrice - a.amount * a.unitPrice)
        .slice(0, 3),
    [assets],
  )

  if (top.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      {/* section header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-200">بزرگترین دارایی‌ها</h2>
        <Link
          href="/dashboard/assets"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-green-400"
        >
          همه دارایی‌ها
          <ChevronLeft size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {top.map((a) => {
          const meta = ASSET_META[a.kind]
          const totalValue = a.amount * a.unitPrice
          const hasBuy = a.buyPrice != null && a.buyPrice > 0
          const profitPct = hasBuy
            ? ((a.unitPrice - a.buyPrice!) / a.buyPrice!) * 100
            : null
          const isProfit = profitPct != null && profitPct > 0
          const isLoss   = profitPct != null && profitPct < 0

          return (
            <article
              key={a.id}
              className="flex items-center gap-3 rounded-[14px] border border-slate-700/40 bg-[#111c2e] p-3.5 transition-colors hover:bg-[#182338]"
              style={{
                borderInlineEndWidth: 4,
                borderInlineEndColor: meta.accent,
              }}
            >
              {/* glyph */}
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${meta.accent}24`, color: meta.accent }}
              >
                <AssetIcon kind={a.kind} size={22} />
              </div>

              {/* title block */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-slate-100">
                  {a.label || meta.label}
                </span>
                <span className="text-[11.5px] tabular-nums text-slate-500">
                  {formatAmount(a.amount, meta.unit)}
                </span>
              </div>

              {/* value + delta */}
              <div className="flex flex-shrink-0 flex-col items-start gap-0.5">
                <span className="text-sm font-bold tabular-nums text-slate-100">
                  {formatToman(totalValue)}
                  <span className="ms-1 text-[10px] font-medium text-slate-500">تومان</span>
                </span>
                {profitPct != null && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums',
                      isProfit ? 'text-green-400' : isLoss ? 'text-rose-400' : 'text-slate-500',
                    )}
                  >
                    {isProfit ? (
                      <TrendingUp size={11} strokeWidth={2} />
                    ) : isLoss ? (
                      <TrendingDown size={11} strokeWidth={2} />
                    ) : (
                      <Minus size={11} strokeWidth={2} />
                    )}
                    <span dir="ltr">
                      {isProfit ? '+' : isLoss ? '−' : ''}
                      {toPersianDigits(Math.abs(profitPct).toFixed(1))}٪
                    </span>
                  </span>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
})
