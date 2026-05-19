import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ASSET_PRICE_KEY, AssetKind, PriceQuote } from '@/features/assets/types'

/**
 * GET /api/prices?kinds=tether,full_coin,gold_18
 * در صورت ست بودن BRSAPI_KEY یا NAVASAN_KEY از منبع زنده می‌خواند،
 * در غیر این صورت داده‌های mock با نوسان کوچک برمی‌گرداند تا UI همیشه کار کند.
 *
 * منابع پیشنهادی (انتخاب بر اساس کلید موجود):
 *   - BrsAPI:  https://brsapi.ir/Api/Market/Gold_Currency.php?key={KEY}
 *   - Navasan: http://api.navasan.tech/latest/?api_key={KEY}
 *   - TGJU:    https://api.tgju.org/v1/data/price/...  (نیاز به اشتراک)
 */

const querySchema = z.object({
  kinds: z
    .string()
    .min(1, 'حداقل یک نوع دارایی نیاز است')
    .transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean)),
})

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse({
    kinds: req.nextUrl.searchParams.get('kinds') ?? '',
  })
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'kinds query param is required' },
      { status: 400 },
    )
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
      return {
        kind,
        unitPrice,
        source: live ? source : 'mock',
        fetchedAt: new Date().toISOString(),
      }
    })

    return NextResponse.json({ quotes }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[prices] failed:', err)
    // در خطا، fallback به mock تا UI نشکند
    const quotes: PriceQuote[] = requested.map((kind) => ({
      kind,
      unitPrice: mockPriceFor(kind),
      source: 'mock-fallback',
      fetchedAt: new Date().toISOString(),
    }))
    return NextResponse.json({ quotes }, { status: 200 })
  }
}

// -------------------- Live source adapters --------------------

async function fetchFromBrsApi(key: string): Promise<Record<string, number>> {
  const url = `https://brsapi.ir/Api/Market/Gold_Currency.php?key=${encodeURIComponent(key)}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`BrsAPI ${res.status}`)
  const data = await res.json()
  // ساختار BrsAPI: { gold: [...], currency: [...] } — نگاشت به کلیدهای داخلی
  const map: Record<string, number> = {}
  for (const it of data?.gold ?? []) {
    if (it.symbol === 'IR_GOLD_18K') map['geram18'] = Number(it.price) / 10 // ریال→تومان
    if (it.symbol === 'IR_GOLD_24K') map['geram24'] = Number(it.price) / 10
    if (it.symbol === 'IR_COIN_EMAMI') map['sekee'] = Number(it.price) / 10
    if (it.symbol === 'IR_COIN_HALF') map['nim'] = Number(it.price) / 10
    if (it.symbol === 'IR_COIN_QUARTER') map['rob'] = Number(it.price) / 10
    if (it.symbol === 'IR_COIN_1G') map['gerami'] = Number(it.price) / 10
  }
  for (const it of data?.currency ?? []) {
    if (it.symbol === 'USD') map['price_dollar_rl'] = Number(it.price) / 10
  }
  return map
}

async function fetchFromNavasan(key: string): Promise<Record<string, number>> {
  const url = `http://api.navasan.tech/latest/?api_key=${encodeURIComponent(key)}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`Navasan ${res.status}`)
  const data = (await res.json()) as Record<string, { value: string }>
  // Navasan خروجی مستقیما با کلیدهایی مثل sekee, nim, rob, gerami, geram18, price_dollar_rl می‌دهد
  const map: Record<string, number> = {}
  for (const [k, v] of Object.entries(data)) {
    const num = Number(String(v?.value ?? '').replace(/,/g, ''))
    if (!Number.isNaN(num)) map[k] = num
  }
  return map
}

// -------------------- Mock prices --------------------
/** قیمت‌های نمونه با نوسان کوچک تا UI زنده به نظر برسد */
function mockPriceFor(kind: AssetKind): number {
  const base: Record<AssetKind, number> = {
    tether:       105_700,
    usd:          102_700,
    full_coin:    107_120_000,
    half_coin:    74_710_000,
    quarter_coin: 41_730_000,
    gerami_coin:  19_870_000,
    gold_18:      19_487_000,
    gold_24:      25_982_000,
  }
  // نوسان ±۰.۳٪
  const jitter = 1 + (Math.random() - 0.5) * 0.006
  return Math.round(base[kind] * jitter)
}
