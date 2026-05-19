import Link from 'next/link'

export default function DashboardHome() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
      <h1 className="text-xl font-bold text-slate-800">داشبورد حساب باز</h1>
      <p className="mt-2 text-sm text-slate-500">
        برای مدیریت دارایی‌ها به صفحه{' '}
        <Link href="/dashboard/assets" className="text-brand-600 hover:underline font-medium">
          سایر دارایی‌ها
        </Link>{' '}
        بروید.
      </p>
    </div>
  )
}
