import { z } from 'zod'

export const AssetKind = z.enum([
  'tether',
  'usd',
  'eur',
  'full_coin',
  'half_coin',
  'quarter_coin',
  'gerami_coin',
  'gold_18',
  'gold_24',
])
export type AssetKind = z.infer<typeof AssetKind>

export const ASSET_META: Record<
  AssetKind,
  { label: string; unit: string; tone: string; accent: string }
> = {
  tether:       { label: 'تتر',           unit: 'USDT', tone: 'دیجیتال',   accent: '#26A17B' },
  usd:          { label: 'دلار آمریکا',    unit: 'USD',  tone: 'ارز خارجی', accent: '#16A34A' },
  eur:          { label: 'یورو',           unit: 'EUR',  tone: 'ارز خارجی', accent: '#2563EB' },
  full_coin:    { label: 'سکه تمام',       unit: 'عدد',  tone: 'سکه',       accent: '#A855F7' },
  half_coin:    { label: 'نیم سکه',        unit: 'عدد',  tone: 'سکه',       accent: '#F97316' },
  quarter_coin: { label: 'ربع سکه',        unit: 'عدد',  tone: 'سکه',       accent: '#EAB308' },
  gerami_coin:  { label: 'سکه گرمی',       unit: 'عدد',  tone: 'سکه',       accent: '#06B6D4' },
  gold_18:      { label: 'طلای آب شده',    unit: 'گرم',  tone: 'طلا',       accent: '#F59E0B' },
  gold_24:      { label: 'طلای ۲۴ عیار',   unit: 'گرم',  tone: 'طلا',       accent: '#D97706' },
}

export const ASSET_PRICE_KEY: Record<AssetKind, string> = {
  tether:       'price_dollar_rl',
  usd:          'price_dollar_rl',
  eur:          'price_eur',
  full_coin:    'sekee',
  half_coin:    'nim',
  quarter_coin: 'rob',
  gerami_coin:  'gerami',
  gold_18:      'geram18',
  gold_24:      'geram24',
}

/** Zod schema برای فرم ثبت/ویرایش دارایی */
export const assetFormSchema = z.object({
  kind: AssetKind,
  amount: z
    .number({ invalid_type_error: 'مقدار باید عدد باشد' })
    .positive('مقدار باید بزرگتر از صفر باشد'),
  unitPrice: z
    .number({ invalid_type_error: 'قیمت باید عدد باشد' })
    .nonnegative('قیمت نمی‌تواند منفی باشد')
    .optional(),
  // قیمت خرید هر واحد به تومان — برای محاسبه سود/زیان
  buyPrice: z
    .number({ invalid_type_error: 'قیمت خرید باید عدد باشد' })
    .positive('قیمت خرید باید بزرگتر از صفر باشد')
    .optional(),
  label: z.string().max(80, 'حداکثر ۸۰ کاراکتر').optional(),
})

export type AssetFormData = z.infer<typeof assetFormSchema>

export interface Asset {
  id: string
  kind: AssetKind
  amount: number
  unitPrice: number
  manualUnitPrice?: number
  buyPrice?: number        // قیمت خرید هر واحد به تومان
  label?: string
  source?: string
  lastUpdate: string
  createdAt: string
}

export interface PriceQuote {
  kind: AssetKind
  unitPrice: number
  source: string
  fetchedAt: string
}
