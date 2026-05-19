'use client'

import * as React from 'react'
import { createClient } from '@/lib/supabase'
import { fetchAssets, insertAsset, updateAsset as apiUpdate, deleteAsset } from '../api/assetsApi'
import { fetchPrices } from '../api/pricesApi'
import { Asset, AssetFormData, AssetKind, PriceQuote } from '../types'

const AUTO_REFRESH_MS = 24 * 60 * 60 * 1000

export function useAssets() {
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastGlobalRefresh, setLastGlobalRefresh] = React.useState<string | null>(null)
  const [userId, setUserId] = React.useState<string | null>(null)

  const totalValue = assets.reduce((sum, a) => sum + a.amount * a.unitPrice, 0)
  const uniqueKinds = Array.from(new Set(assets.map((a) => a.kind)))

  // بارگذاری اولیه — گرفتن user و دارایی‌ها از Supabase
  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      try {
        const list = await fetchAssets()
        setAssets(list)
      } catch (e) {
        console.error('fetchAssets failed', e)
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  // قیمت‌گیری خودکار هر ۲۴ ساعت
  const refreshPrices = React.useCallback(async (kinds: AssetKind[]) => {
    if (kinds.length === 0) return
    setIsRefreshing(true)
    try {
      const quotes = await fetchPrices(kinds)
      const byKind = new Map<AssetKind, PriceQuote>()
      quotes.forEach((q) => byKind.set(q.kind, q))

      setAssets((prev) => prev.map((a) => {
        const q = byKind.get(a.kind)
        if (!q || a.manualUnitPrice != null) return a
        const updated = { ...a, unitPrice: q.unitPrice, source: q.source, lastUpdate: q.fetchedAt }
        void apiUpdate(a.id, { unitPrice: q.unitPrice, source: q.source, lastUpdate: q.fetchedAt })
        return updated
      }))
      setLastGlobalRefresh(new Date().toISOString())
    } catch (e) {
      console.error('refreshPrices failed', e)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    if (uniqueKinds.length === 0) return
    const msSinceLast = lastGlobalRefresh
      ? Date.now() - new Date(lastGlobalRefresh).getTime()
      : Infinity
    if (msSinceLast >= AUTO_REFRESH_MS) void refreshPrices(uniqueKinds)
    const timer = setInterval(() => void refreshPrices(uniqueKinds), AUTO_REFRESH_MS)
    return () => clearInterval(timer)
  }, [uniqueKinds.join(',')])

  const addAsset = async (data: AssetFormData): Promise<Asset> => {
    if (!userId) throw new Error('not logged in')
    const asset = await insertAsset(userId, data)
    setAssets((prev) => [...prev, asset])
    if (data.unitPrice == null) {
      const [quote] = await fetchPrices([asset.kind])
      if (quote) {
        const patch = { unitPrice: quote.unitPrice, source: quote.source, lastUpdate: quote.fetchedAt }
        await apiUpdate(asset.id, patch)
        setAssets((prev) => prev.map((a) => a.id === asset.id ? { ...a, ...patch } : a))
      }
    }
    return asset
  }

  const updateAsset = async (id: string, patch: Partial<Asset>) => {
    await apiUpdate(id, patch)
    setAssets((prev) => prev.map((a) => a.id === id ? { ...a, ...patch } : a))
  }

  const removeAsset = async (id: string) => {
    await deleteAsset(id)
    setAssets((prev) => prev.filter((a) => a.id !== id))
  }

  const refreshOne = async (id: string) => {
    const asset = assets.find((a) => a.id === id)
    if (!asset) return
    const [quote] = await fetchPrices([asset.kind])
    if (quote) {
      const patch = { unitPrice: quote.unitPrice, source: quote.source, lastUpdate: quote.fetchedAt }
      await apiUpdate(id, patch)
      setAssets((prev) => prev.map((a) => a.id === id ? { ...a, ...patch } : a))
    }
  }

  const refreshAll = () => refreshPrices(uniqueKinds)

  return {
    assets, totalValue, isLoading, isRefreshing, lastGlobalRefresh,
    addAsset, updateAsset, removeAsset, refreshAll, refreshOne,
  } as const
}

export type { Asset, AssetFormData, AssetKind }
