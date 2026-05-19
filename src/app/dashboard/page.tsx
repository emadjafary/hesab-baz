'use client'

import dynamic from 'next/dynamic'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'

const DashboardClient = dynamic(
  () => import('@/features/dashboard/components/DashboardClient'),
  { ssr: false, loading: () => <DashboardSkeleton /> },
)

export default function DashboardPage() {
  return <DashboardClient />
}
