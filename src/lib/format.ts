/**
 * ابزارهای فرمت‌بندی متناسب با UI فارسی
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** تبدیل ارقام لاتین به فارسی */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)])
}

/** تبدیل ارقام فارسی به لاتین (برای پارس فرم) */
export function toLatinDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
}

/** فرمت تومان با جداکننده هزارگان فارسی */
export function formatToman(value: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 0
  const fixed = value.toFixed(decimals)
  const [intPart, frac] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const out = frac ? `${grouped}.${frac}` : grouped
  return toPersianDigits(out)
}

/** فرمت مقدار با واحد (مثل ۳۳٫۲۵ USDT یا ۶ عدد) */
export function formatAmount(value: number, unit: string): string {
  const hasDecimal = !Number.isInteger(value)
  const fixed = hasDecimal ? value.toFixed(2) : String(value)
  return `${toPersianDigits(fixed)} ${unit}`
}

/** زمان نسبی به فارسی: «۴ دقیقه پیش» */
export function timeAgoFa(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const sec = Math.max(1, Math.floor(diffMs / 1000))
  if (sec < 60) return `${toPersianDigits(sec)} ثانیه پیش`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${toPersianDigits(min)} دقیقه پیش`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${toPersianDigits(hr)} ساعت پیش`
  const day = Math.floor(hr / 24)
  return `${toPersianDigits(day)} روز پیش`
}

/** ساعت و دقیقه فارسی: ۱۴:۲۳ */
export function formatClockFa(iso: string): string {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return toPersianDigits(`${hh}:${mm}`)
}
