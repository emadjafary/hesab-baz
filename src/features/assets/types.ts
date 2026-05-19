import { z } from 'zod'

/**
 * انواع دارایی پشتیبانی شده در «ساير دارايى‌ها»
 * - tether    : تتر (USDT)
 * - usd       : دلار آمریکا
 * - full_coin : سکه تمام (بهار آزادی / امامی)
 * - half_coin : نیم سکه
 * - quarter_coin : ربع سکه
 * - gerami_coin : سکه گرمی
 * - gold_18    : طلای آب شده ۱۸ عیار
 * - gold_24    : طلای ۲۴ عیار
 */
export const AssetKind = z.enum([
  'tether',
  'usd',
  'full_coin',
  'half_coin',
  'quarter_coin',
  'gerami_coin',
  'gold_18',
  'gold_24',
])
export type AssetKind = z.infer<typeof AssetKind>

/** اطلاعات نمایشی هر نوع دارایی (لیبل، واحد، رنگ تم) */
export const ASSET_META: Record<
  AssetKind,
  { label: string; unit: string; tone: string; accent: string }
> = {
  tether:       { label: 'تتر',           unit: 'USDT', tone: 'از دیجیتال',         accent: '#26A17B' },
  usd:          { label: 'دلار آمریکا',    unit: 'USD',  tone: 'از خارجی',          accent: '#16A34A' },
  full_coin:    { label: 'سکه تمام',       unit: 'عدد',  tone: 'سایر',              accent: '#A855F7' },
  half_coin:    { label: 'نیم سکه',        unit: 'عدد',  tone: 'سایر',              accent: '#F97316' },
  quarter_coin: { label: 'ربع سکه',        unit: 'عدد',  tone: 'سایر',              accent: '#EAB308' },
  gerami_coin:  { label: 'سکه گرمی',       unit: 'عدد',  tone: 'سایر',              accent: '#06B6D4' },
  gold_18:      { label: 'طلای آب شده',    unit: 'گرم',  tone: 'طلا',               accent: '#F59E0B' },
  gold_24:      { label: 'طلای ۲۴ عیار',   unit: 'گرم',  tone: 'طلا',               accent: '#D97706' },
}

/** نگاشت بین نوع دارایی و کلید قیمت در API */
export const ASSET_PRICE_KEY: Record<AssetKind, string> = {
  tether:       'price_dollar_rl', // تتر را با نرخ آزاد دلار ست می‌کنیم؛ در عمل از منبع دیگر هم می‌توان گرفت
  usd:          'price_dollar_rl',
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
  // قیمت هر واحد به تومان — اگر خالی باشد از API گرفته می‌شود
  unitPrice: z
    .number({ invalid_type_error: 'قیمت باید عدد باشد' })
    .nonnegative('قیمت نمی‌تواند منفی باشد')
    .optional(),
  label: z.string().max(80, 'حداکثر ۸۰ کاراکتر').optional(),
})

export type AssetFormData = z.infer<typeof assetFormSchema>

/** مدل ذخیره‌شده در state */
export interface Asset {
  id: string
  kind: AssetKind
  amount: number
  unitPrice: number              // قیمت هر واحد به تومان (آخرین مقدار)
  manualUnitPrice?: number       // اگر کاربر دستی وارد کرده، نگه می‌داریم
  label?: string                 // توضیح آزاد (مثل «طلای ۱۸ عیار (هر گرم)»)
  source?: string                // منبع: مثلا "tgju.org"
  lastUpdate: string             // ISO timestamp آخرین به‌روزرسانی قیمت
  createdAt: string
}

/** پاسخ استاندارد سرویس قیمت */
export interface PriceQuote {
  kind: AssetKind
  unitPrice: number              // تومان
  source: string
  fetchedAt: string              // ISO
}
