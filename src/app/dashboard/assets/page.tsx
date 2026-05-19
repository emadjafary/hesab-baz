import type { Metadata } from 'next'
import { AssetsList } from '@/features/assets'
import { SeedAssetsOnce } from '@/features/assets/components/SeedAssetsOnce'

export const metadata: Metadata = {
  title: 'سایر دارایی‌ها | حساب باز',
  description: 'مدیریت دارایی‌های متنوع با قیمت‌گیری خودکار',
}

export default function AssetsPage() {
  return (
    <>
      <SeedAssetsOnce />
      <AssetsList />
    </>
  )
}
