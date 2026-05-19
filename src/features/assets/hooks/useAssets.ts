'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useStore } from '@/store'
import { fetchPrices } from '../api/pricesApi'
import { Asset, AssetFormData, AssetKind } from '../types'

// هر ۲۴ ساعت یک بار — مصرف API رایگان Navasan حفظ می‌شود
const AUTO_REFRESH_MS = 24 * 60 * 60 * 1000

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

  const totalValue = assets.reduce((sum, a) => sum + a.amount * a.unitPrice, 0)

  const uniqueKinds = Array.from(new Set(assets.map((a) => a.kind)))

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
  }, [uniqueKinds.join(','), applyQuotes, setRefreshing, markGlobalRefresh])

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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (uniqueKinds.length === 0) return

    // بررسی آخرین refresh — اگه بیشتر از ۲۴ ساعت گذشته یا اصلاً نبوده، الان refresh کن
    const last = useStore.getState().lastGlobalRefresh
    const msSinceLast = last ? Date.now() - new Date(last).getTime() : Infinity
    if (msSinceLast >= AUTO_REFRESH_MS) {
      void refreshAll()
    }

    // هر ۲۴ ساعت یک‌بار چک کن
    timerRef.current = setInterval(() => {
      void refreshAll()
    }, AUTO_REFRESH_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
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
