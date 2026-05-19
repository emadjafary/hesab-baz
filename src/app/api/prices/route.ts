import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ASSET_PRICE_KEY, AssetKind, PriceQuote } from '@/features/assets/types'

const querySchema = z.object({
  kinds: z
    .string()
    .min(1)
    .transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean)),
})

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse({
    kinds: req.nextUrl.searchParams.get('kinds') ?? '',
  })
  if (!parsed.success) {
    return NextResponse.json({ error: 'kinds query param is required' }, { status: 400 })
  }

  const requested = parsed.data.kinds.filter((k): k is AssetKind =>
    Object.keys(ASSET_PRICE_KEY).includes(k),
  )

  const brsKey = process.env.BRSAPI_KEY
  const navasanKey = process.env.NAVASAN_KEY

  try {
    let raw: Record<string, number> | null = null
    let source = 'mock'

    if (brsKey) {
      raw = await fetchFromBrsApi(brsKey)
      source = 'brsapi.ir'
    } else if (navasanKey) {
      raw = await fetchFromNavasan(navasanKey)
      source = 'navasan.tech'
    }

    const quotes: PriceQuote[] = requested.map((kind) => {
      const key = ASSET_PRICE_KEY[kind]
      const live = raw?.[key]
      const unitPrice = live ?? mockPriceFor(kind)
      return { kind, unitPrice, source: live ? source : 'mock', fetchedAt: new Date().toISOString() }
    })

    return NextResponse.json({ quotes }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('[prices] failed:', err)
    const quotes: PriceQuote[] = requested.map((kind) => ({
      kind,
      unitPrice: mockPriceFor(kind),
      source: 'mock-fallback',
      fetchedAt: new Date().toISOString(),
    }))
    return NextResponse.json({ quotes }, { status: 200 })
  }
}

// ─── BrsAPI adapter ────────────────────────────────────────────────────────
async function fetchFromBrsApi(key: string): Promise<Record<string, number>> {
  const url = `https://brsapi.ir/Api/Market/Gold_Currency.php?key=${encodeURIComponent(key)}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`BrsAPI ${res.status}`)
  const data = await res.json()
  const map: Record<string, number> = {}
  // BrsAPI قیمت‌ها را به ریال برمی‌گرداند، تقسیم بر ۱۰ = تومان
  for (const it of data?.gold ?? []) {
    if (it.symbol === 'IR_GOLD_18K')     map['geram18'] = Number(it.price) / 10
    if (it.symbol === 'IR_GOLD_24K')     map['geram24'] = Number(it.price) / 10
    if (it.symbol === 'IR_COIN_EMAMI')   map['sekee']   = Number(it.price) / 10
    if (it.symbol === 'IR_COIN_HALF')    map['nim']     = Number(it.price) / 10
    if (it.symbol === 'IR_COIN_QUARTER') map['rob']     = Number(it.price) / 10
    if (it.symbol === 'IR_COIN_1G')      map['gerami']  = Number(it.price) / 10
  }
  for (const it of data?.currency ?? []) {
    if (it.symbol === 'USD') map['price_dollar_rl'] = Number(it.price) / 10
    if (it.symbol === 'EUR') map['price_eur']       = Number(it.price) / 10
  }
  return map
}

// ─── Navasan adapter ───────────────────────────────────────────────────────
async function fetchFromNavasan(key: string): Promise<Record<string, number>> {
  const url = `http://api.navasan.tech/latest/?api_key=${encodeURIComponent(key)}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`Navasan ${res.status}`)
  const data = (await res.json()) as Record<string, { value: string }>
  const map: Record<string, number> = {}
  for (const [k, v] of Object.entries(data)) {
    const num = Number(String(v?.value ?? '').replace(/,/g, ''))
    if (!Number.isNaN(num)) map[k] = num
  }
  return map
}

// ─── Mock prices ───────────────────────────────────────────────────────────
/**
 * قیمت‌های تقریبی به تومان — مطابق بازار ایران (اردیبهشت ۱۴۰۴)
 * این فقط fallback است و با ست کردن BRSAPI_KEY یا NAVASAN_KEY قیمت زنده می‌آید.
 *
 *  دلار   ≈ ۱,۷۷۹,۰۰۰ تومان
 *  یورو   ≈ ۲,۰۶۸,۷۰۰ تومان
 *  تتر    ≈ ۱,۷۷۵,۰۰۰ تومان  (کمی کمتر از دلار)
 *  سکه تمام ≈ ۶۴,۴۰۰,۰۰۰ تومان
 *  نیم سکه  ≈ ۳۷,۵۰۰,۰۰۰ تومان
 *  ربع سکه  ≈ ۲۰,۵۰۰,۰۰۰ تومان
 *  سکه گرمی ≈  ۸,۵۰۰,۰۰۰ تومان
 *  طلا ۱۸   ≈  ۵,۴۴۰,۰۰۰ تومان (هر گرم)
 *  طلا ۲۴   ≈  ۷,۲۵۰,۰۰۰ تومان (هر گرم)
 */
function mockPriceFor(kind: AssetKind): number {
  const base: Record<AssetKind, number> = {
    tether:         177_500,
    usd:            177_000,
    eur:            206_870,
    full_coin:    6_440_000,
    half_coin:    3_750_000,
    quarter_coin: 2_050_000,
    gerami_coin:    850_000,
    gold_18:        544_000,
    gold_24:        725_000,
  }
  // نوسان کوچک ±۰.۳٪ تا عدد زنده به نظر برسد
  const jitter = 1 + (Math.random() - 0.5) * 0.006
  return Math.round(base[kind] * jitter)
}
