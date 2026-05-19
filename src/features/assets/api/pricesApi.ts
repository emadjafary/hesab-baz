import { AssetKind, PriceQuote } from '../types'

export async function fetchPrices(kinds: AssetKind[]): Promise<PriceQuote[]> {
  if (kinds.length === 0) return []
  const url = `/api/prices?kinds=${encodeURIComponent(kinds.join(','))}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('قیمت‌گیری ناموفق بود')
  const data = (await res.json()) as { quotes: PriceQuote[] }
  return data.quotes
}
