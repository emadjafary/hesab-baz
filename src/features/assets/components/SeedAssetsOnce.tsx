'use client'

import { useEffect, useRef } from 'react'
import { useStore } from '@/store'
import type { AssetFormData } from '@/features/assets/types'

const SEED: AssetFormData[] = [
  { kind: 'tether',       amount: 33.25,  label: 'تتر' },
  { kind: 'full_coin',    amount: 3,       label: 'سکه تمام بهار آزادی' },
  { kind: 'half_coin',    amount: 6,       label: 'نیم سکه' },
  { kind: 'gold_18',      amount: 132.25,  label: 'طلای آب شده (هر گرم)' },
  { kind: 'usd',          amount: 31_000,  label: 'دلار آمریکا (هر دلار)' },
]

/**
 * یک بار در اولین mount در هر مرورگر، در صورت خالی بودن state، seed را وارد می‌کند.
 * این کار فقط برای دموی اولیه است و قابل حذف.
 */
export function SeedAssetsOnce() {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    const { assets, addAsset } = useStore.getState()
    if (assets.length === 0) {
      SEED.forEach((s) => addAsset(s))
    }
  }, [])
  return null
}
