'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAssetsStore }    from '@/store'
import { useAssets }         from '@/features/assets/hooks/useAssets'
import { PortfolioHero }     from './PortfolioHero'
import { QuickActions }      from './QuickActions'
import { CompositionChart }  from './CompositionChart'
import { TopHoldings }       from './TopHoldings'
import { RecentActivity }    from './RecentActivity'

export default function DashboardClient() {
  const router = useRouter()

  // re-use the existing assets hook — prices auto-refresh every 60s
  const { assets, isRefreshing, lastGlobalRefresh, refreshAll } = useAssets()

  const [valueVisible, setValueVisible] = React.useState(true)

  // ---- derived portfolio metrics ----------------------------------------
  const totalValue = React.useMemo(
    () => assets.reduce((sum, a) => sum + a.amount * a.unitPrice, 0),
    [assets],
  )
  const totalCost = React.useMemo(
    () =>
      assets.reduce(
        (sum, a) =>
          sum + (a.buyPrice != null ? a.buyPrice * a.amount : a.amount * a.unitPrice),
        0,
      ),
    [assets],
  )

  // Approximate unrealized gain — real-world: use actual day-open prices.
  // Here we show total P&L as a proxy (same as design UI kit).
  const unrealizedPnL = totalValue - totalCost
  const unrealizedPct = totalCost > 0 ? (unrealizedPnL / totalCost) * 100 : 0

  const lastRefresh = lastGlobalRefresh ?? new Date(Date.now() - 3 * 60_000).toISOString()

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* ---- hero -------------------------------------------------------- */}
      <PortfolioHero
        totalValue={totalValue}
        dayDelta={unrealizedPnL}
        dayDeltaPct={unrealizedPct}
        visible={valueVisible}
        onToggleVisible={() => setValueVisible((v) => !v)}
        lastRefresh={lastRefresh}
        onRefresh={refreshAll}
        isRefreshing={isRefreshing}
      />

      {/* ---- quick actions ----------------------------------------------- */}
      <QuickActions
        onAdd={()         => router.push('/dashboard/assets?add=1')}
        onTransaction={()  => router.push('/dashboard/transactions')}
        onRefresh={refreshAll}
        onReports={()     => router.push('/dashboard/reports')}
      />

      {/* ---- composition ------------------------------------------------- */}
      <section className="flex flex-col gap-2">
        <h2 className="px-1 text-sm font-bold text-slate-200">ترکیب سبد</h2>
        <CompositionChart assets={assets} />
      </section>

      {/* ---- top holdings ------------------------------------------------ */}
      <TopHoldings assets={assets} />

      {/* ---- recent activity --------------------------------------------- */}
      <RecentActivity />
    </div>
  )
}
