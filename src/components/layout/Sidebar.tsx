'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  ArrowLeftRight,
  BarChart3,
  Users,
  TrendingUp,
  Tag,
  Building2,
  Calculator,
  CalendarDays,
  Settings,
  Calendar,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const NAV: NavItem[] = [
  { href: '/dashboard',              label: 'داشبورد',         icon: LayoutDashboard },
  { href: '/dashboard/accounts',     label: 'حساب‌ها',         icon: Wallet },
  { href: '/dashboard/assets',       label: 'سایر دارایی‌ها',  icon: PieChart },
  { href: '/dashboard/transactions', label: 'تراکنش‌ها',       icon: ArrowLeftRight },
  { href: '/dashboard/reports',      label: 'گزارش‌ها',         icon: BarChart3 },
  { href: '/dashboard/contacts',     label: 'صندوق',           icon: Users },
  { href: '/dashboard/dues',         label: 'بدهی و طلب',     icon: TrendingUp },
  { href: '/dashboard/tags',         label: 'تگ‌ها',            icon: Tag },
  { href: '/dashboard/businesses',   label: 'اشخاص',           icon: Building2 },
  { href: '/dashboard/budget',       label: 'بودجه‌بندی',      icon: Calculator },
  { href: '/dashboard/calc',         label: 'اقساط',           icon: Calendar },
  { href: '/dashboard/calendar',     label: 'تقویم مالی',     icon: CalendarDays },
  { href: '/dashboard/settings',     label: 'تنظیمات',         icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex md:w-56 flex-col bg-white border-s border-slate-200 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Wallet size={16} strokeWidth={1.5} />
        </div>
        <span className="font-bold text-slate-800">حساب باز</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                  )}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="ms-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-slate-100 text-xs text-slate-400">
        نسخه ۱۰.۰
      </div>
    </aside>
  )
}
