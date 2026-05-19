'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useStore } from '@/store'
import { fetchPrices } from '../api/pricesApi'
import { Asset, AssetFormData, AssetKind } from '../types'

const AUTO_REFRESH_MS = 60_000 // هر ۶۰ ثانیه

export function useAssets() {
  const assets = useStore((s) => s.assets)
  const isRefreshing = useStore((s) => s.isRefreshing)
  const lastGlobalRefresh = useStore((s) => s.lastGlobalRefresh)

  const addAsset = useStore((s) => s.addAsset)
  const updateAsset = useStore((s) => s.updateAsset)
  const removeAsset = useStore((s) => s.removeAsset)
  const applyQuotes = useStore((s) => s.applyQuotes)
  const setRefreshing = useStore((s) => s.setRefreshing)
  const markGlobalRefresh = useStore((s) => s.markGlobalRefresh)

  /** مجموع ارزش کل دارایی‌ها به تومان */
  const totalValue = useMemo(
    () => assets.reduce((sum, a) => sum + a.amount * a.unitPrice, 0),
    [assets],
  )

  /** انواع منحصربه‌فرد موجود — برای صدا زدن API */
  const uniqueKinds = useMemo(
    () => Array.from(new Set(assets.map((a) => a.kind))),
    [assets],
  )

  const refreshAll = useCallback(async () => {
    if (uniqueKinds.length === 0) return
    setRefreshing(true)
    try {
      const quotes = await fetchPrices(uniqueKinds)
      applyQuotes(quotes)
      markGlobalRefresh()
    } catch (err) {
      console.error('[useAssets] refreshAll failed:', err)
    } finally {
      setRefreshing(false)
    }
  }, [uniqueKinds, applyQuotes, setRefreshing, markGlobalRefresh])

  const refreshOne = useCallback(
    async (id: string) => {
      const asset = useStore.getState().assets.find((a) => a.id === id)
      if (!asset) return
      try {
        const [quote] = await fetchPrices([asset.kind])
        if (quote) {
          updateAsset(id, {
            unitPrice: quote.unitPrice,
            source: quote.source,
            lastUpdate: quote.fetchedAt,
          })
        }
      } catch (err) {
        console.error('[useAssets] refreshOne failed:', err)
      }
    },
    [updateAsset],
  )

  // auto-refresh: هر ۶۰ ثانیه قیمت‌ها را به‌روز کن
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (uniqueKinds.length === 0) return
    // اولین refresh فوری
    void refreshAll()
    timerRef.current = setInterval(() => {
      void refreshAll()
    }, AUTO_REFRESH_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // مهم: روی uniqueKinds.join وابسته‌ایم نه روی array reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueKinds.join(',')])

  return {
    assets,
    totalValue,
    isRefreshing,
    lastGlobalRefresh,
    addAsset,
    updateAsset,
    removeAsset,
    refreshAll,
    refreshOne,
  } as const
}

export type UseAssetsReturn = ReturnType<typeof useAssets>
export type { Asset, AssetFormData, AssetKind }
