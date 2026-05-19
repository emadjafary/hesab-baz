import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import './globals.css'

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazir',
})

export const metadata: Metadata = {
  title: 'حساب باز',
  description: 'مدیریت حساب‌ها و دارایی‌ها با قیمت‌گیری خودکار',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  )
}
