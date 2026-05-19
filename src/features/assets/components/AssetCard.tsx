'use client'

import * as React from 'react'
import { Trash2, Pencil, RefreshCw, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Asset, ASSET_META } from '../types'
import { AssetIcon } from './AssetIcon'
import { formatAmount, formatToman, timeAgoFa, formatClockFa } from '@/lib/format'
import { cn } from '@/lib/cn'

interface Props {
  asset: Asset
  onEdit: (asset: Asset) => void
  onDelete: (id: string) => void
  onRefresh: (id: string) => void
  isRefreshing?: boolean
}

export const AssetCard = React.memo(function AssetCard({
  asset,
  onEdit,
  onDelete,
  onRefresh,
  isRefreshing = false,
}: Props) {
  const meta = ASSET_META[asset.kind]
  const totalValue = asset.amount * asset.unitPrice

  // محاسبه سود/زیان
  const hasBuyPrice = asset.buyPrice != null && asset.buyPrice > 0
  const totalCost = hasBuyPrice ? asset.buyPrice! * asset.amount : null
  const profitToman = totalCost != null ? totalValue - totalCost : null
  const profitPct = totalCost != null && totalCost > 0
    ? ((totalValue - totalCost) / totalCost) * 100
    : null

  const isProfit = profitToman != null && profitToman > 0
  const isLoss   = profitToman != null && profitToman < 0
  const isEven   = profitToman != null && profitToman === 0

  return (
    <article
      className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow"
      style={{ borderInlineEndWidth: 4, borderInlineEndColor: meta.accent }}
    >
      <div className="p-4">
        {/* Header */}
        <header className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(asset.id)}
              aria-label="حذف"
              className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => onEdit(asset)}
              aria-label="ویرایش"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <Pencil size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-2.5 text-right">
            <div>
              <h3 className="text-base font-semibold text-slate-800 leading-tight">
                {asset.label || meta.label}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{meta.tone}</p>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${meta.accent}1A`, color: meta.accent }}
            >
              <AssetIcon kind={asset.kind} size={20} />
            </div>
          </div>
        </header>

        {/* Body */}
        <dl className="space-y-2 text-sm">
          <Row label="مقدار" value={formatAmount(asset.amount, meta.unit)} />
          <Row
            label="قیمت هر واحد"
            value={`${formatToman(asset.unitPrice)} تومان`}
            subtle
          />
          {hasBuyPrice && (
            <Row
              label="قیمت خرید هر واحد"
              value={`${formatToman(asset.buyPrice!)} تومان`}
              subtle
            />
          )}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200">
            <span className="text-xs text-slate-400">ارزش کل</span>
            <span className="text-base font-bold text-slate-800 tabular-nums">
              {formatToman(totalValue)}{' '}
              <span className="text-xs font-medium text-slate-500">تومان</span>
            </span>
          </div>
        </dl>

        {/* سود / زیان */}
        {profitToman != null && (
          <div
            className={cn(
              'mt-3 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2',
              isProfit && 'bg-emerald-50 border border-emerald-100',
              isLoss   && 'bg-rose-50 border border-rose-100',
              isEven   && 'bg-slate-50 border border-slate-200',
            )}
          >
            <div className="flex items-center gap-1.5">
              {isProfit && <TrendingUp  size={15} strokeWidth={1.5} className="text-emerald-600" />}
              {isLoss   && <TrendingDown size={15} strokeWidth={1.5} className="text-rose-600" />}
              {isEven   && <Minus        size={15} strokeWidth={1.5} className="text-slate-500" />}
              <span
                className={cn(
                  'text-xs font-medium',
                  isProfit && 'text-emerald-700',
                  isLoss   && 'text-rose-700',
                  isEven   && 'text-slate-600',
                )}
              >
                {isProfit ? 'سود' : isLoss ? 'زیان' : 'سر به سر'}
              </span>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  'text-sm font-bold tabular-nums',
                  isProfit && 'text-emerald-700',
                  isLoss   && 'text-rose-700',
                  isEven   && 'text-slate-600',
                )}
              >
                {isProfit ? '+' : isLoss ? '-' : ''}
                {formatToman(Math.abs(profitToman))}{' '}
                <span className="text-xs font-normal">تومان</span>
              </div>
              {profitPct != null && (
                <div
                  className={cn(
                    'text-xs tabular-nums',
                    isProfit && 'text-emerald-600',
                    isLoss   && 'text-rose-600',
                    isEven   && 'text-slate-500',
                  )}
                >
                  {isProfit ? '+' : isLoss ? '-' : ''}
                  {Math.abs(profitPct).toFixed(1)}٪
                </div>
              )}
            </div>
          </div>
        )}

        {/* Source link */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700">
          <a
            href={`https://${asset.source ?? 'tgju.org'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
          >
            <span>{asset.source ?? 'tgju.org'}</span>
            <ExternalLink size={12} strokeWidth={1.5} />
          </a>
        </div>

        {/* Update info */}
        <div className="mt-3 text-[11px] leading-relaxed text-slate-400 space-y-0.5">
          <div>منبع آنلاین: <span className="text-slate-500">{meta.label}</span></div>
          <div>زمان قیمت در: <span className="text-slate-500">{formatClockFa(asset.lastUpdate)}</span></div>
          <div>آخرین دریافت: <span className="text-slate-500">{timeAgoFa(asset.lastUpdate)}</span></div>
        </div>
      </div>

      {/* Refresh button */}
      <button
        onClick={() => onRefresh(asset.id)}
        disabled={isRefreshing}
        className="w-full border-t border-slate-100 bg-slate-50/60 hover:bg-slate-100 transition-colors py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <RefreshCw size={12} strokeWidth={1.5} className={cn(isRefreshing && 'animate-spin')} />
        <span>بروزرسانی قیمت از tgju</span>
      </button>
    </article>
  )
})

function Row({
  label,
  value,
  subtle,
}: {
  label: string
  value: string
  subtle?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className={cn('tabular-nums', subtle ? 'text-sm text-slate-600' : 'text-sm font-semibold text-slate-800')}>
        {value}
      </dd>
    </div>
  )
}
