import { StateCreator } from 'zustand'
import { Asset, AssetFormData, AssetKind, PriceQuote } from '../types'

export interface AssetsSlice {
  assets: Asset[]
  isRefreshing: boolean
  lastGlobalRefresh: string | null

  addAsset: (data: AssetFormData) => Asset
  updateAsset: (id: string, patch: Partial<Asset>) => void
  removeAsset: (id: string) => void
  applyQuotes: (quotes: PriceQuote[]) => void
  setRefreshing: (v: boolean) => void
  markGlobalRefresh: () => void
}

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const createAssetsSlice: StateCreator<AssetsSlice> = (set) => ({
  assets: [],
  isRefreshing: false,
  lastGlobalRefresh: null,

  addAsset: (data) => {
    const now = new Date().toISOString()
    const asset: Asset = {
      id: uid(),
      kind: data.kind,
      amount: data.amount,
      unitPrice: data.unitPrice ?? 0,
      manualUnitPrice: data.unitPrice,
      label: data.label,
      source: 'tgju.org',
      lastUpdate: now,
      createdAt: now,
    }
    set((s) => ({ assets: [...s.assets, asset] }))
    return asset
  },

  updateAsset: (id, patch) =>
    set((s) => ({
      assets: s.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })),

  removeAsset: (id) =>
    set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),

  applyQuotes: (quotes) =>
    set((s) => {
      const byKind = new Map<AssetKind, PriceQuote>()
      for (const q of quotes) byKind.set(q.kind, q)
      return {
        assets: s.assets.map((a) => {
          const q = byKind.get(a.kind)
          if (!q) return a
          // اگر کاربر قیمت دستی ست کرده، unitPrice دست‌نخورده می‌ماند،
          // فقط timestamp و source به‌روز می‌شود تا کاربر بداند آخرین تلاش refresh کِی بوده.
          const keepManual = a.manualUnitPrice != null
          return {
            ...a,
            unitPrice: keepManual ? a.unitPrice : q.unitPrice,
            source: q.source,
            lastUpdate: q.fetchedAt,
          }
        }),
      }
    }),

  setRefreshing: (v) => set({ isRefreshing: v }),
  markGlobalRefresh: () =>
    set({ lastGlobalRefresh: new Date().toISOString() }),
})
