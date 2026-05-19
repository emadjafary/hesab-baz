'use client'

import * as React from 'react'
import { Wallet, Plus, Loader2 } from 'lucide-react'
import { useAssets } from '../hooks/useAssets'
import { Asset, AssetFormData } from '../types'
import { AssetCard } from './AssetCard'
import { AssetForm } from './AssetForm'
import { SummaryHeader } from './SummaryHeader'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from '@/components/ui/Button'

export function AssetsList() {
  const {
    assets, totalValue, isLoading, isRefreshing, lastGlobalRefresh,
    addAsset, updateAsset, removeAsset, refreshAll, refreshOne,
  } = useAssets()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Asset | null>(null)
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)

  const handleSubmit = async (data: AssetFormData) => {
    if (editing) {
      await updateAsset(editing.id, {
        kind: data.kind, amount: data.amount, label: data.label,
        buyPrice: data.buyPrice, manualUnitPrice: data.unitPrice,
        unitPrice: data.unitPrice ?? editing.unitPrice,
      })
      setEditing(null)
    } else {
      await addAsset(data)
    }
  }

  const openAdd = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (asset: Asset) => { setEditing(asset); setFormOpen(true) }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 size={24} strokeWidth={1.5} className="animate-spin me-2" />
        <span>در حال بارگذاری دارایی‌ها...</span>
      </div>
    )
  }

  return (
    <section>
      <SummaryHeader
        totalValue={totalValue}
        lastGlobalRefresh={lastGlobalRefresh}
        isRefreshing={isRefreshing}
        onAddClick={openAdd}
        onRefreshClick={() => void refreshAll()}
      />

      {assets.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id} asset={asset} isRefreshing={isRefreshing}
              onEdit={openEdit}
              onDelete={(id) => setPendingDelete(id)}
              onRefresh={(id) => void refreshOne(id)}
            />
          ))}
        </div>
      )}

      <AssetForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        initialValue={editing ?? undefined}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={pendingDelete != null}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => { if (pendingDelete) await removeAsset(pendingDelete) }}
      />
    </section>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        <Wallet size={22} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-slate-700">هنوز دارایی‌ای ثبت نکرده‌اید</h3>
      <p className="mt-1 text-sm text-slate-500">برای شروع، اولین دارایی خود را اضافه کنید.</p>
      <div className="mt-4">
        <Button onClick={onAdd}><Plus size={16} strokeWidth={1.5} /><span>افزودن اولین دارایی</span></Button>
      </div>
    </div>
  )
}
