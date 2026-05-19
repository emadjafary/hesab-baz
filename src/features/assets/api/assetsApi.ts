import { createClient } from '@/lib/supabase'
import { Asset, AssetFormData, AssetKind } from '../types'

const db = () => createClient()

export async function fetchAssets(): Promise<Asset[]> {
  const { data, error } = await db()
    .from('assets')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(rowToAsset)
}

export async function insertAsset(userId: string, form: AssetFormData): Promise<Asset> {
  const now = new Date().toISOString()
  const row = {
    user_id: userId,
    kind: form.kind,
    amount: form.amount,
    unit_price: form.unitPrice ?? 0,
    manual_unit_price: form.unitPrice ?? null,
    buy_price: form.buyPrice ?? null,
    label: form.label ?? null,
    source: 'tgju.org',
    last_update: now,
    created_at: now,
  }
  const { data, error } = await db().from('assets').insert(row).select().single()
  if (error) throw error
  return rowToAsset(data)
}

export async function updateAsset(id: string, patch: Partial<Asset>): Promise<void> {
  const row: Record<string, unknown> = {}
  if (patch.amount    != null) row['amount']            = patch.amount
  if (patch.unitPrice != null) row['unit_price']        = patch.unitPrice
  if (patch.manualUnitPrice !== undefined) row['manual_unit_price'] = patch.manualUnitPrice ?? null
  if (patch.buyPrice  !== undefined) row['buy_price']   = patch.buyPrice ?? null
  if (patch.label     !== undefined) row['label']       = patch.label ?? null
  if (patch.source    != null) row['source']            = patch.source
  if (patch.lastUpdate != null) row['last_update']      = patch.lastUpdate
  if (patch.kind      != null) row['kind']              = patch.kind

  const { error } = await db().from('assets').update(row).eq('id', id)
  if (error) throw error
}

export async function deleteAsset(id: string): Promise<void> {
  const { error } = await db().from('assets').delete().eq('id', id)
  if (error) throw error
}

function rowToAsset(row: Record<string, unknown>): Asset {
  return {
    id:             String(row['id']),
    kind:           row['kind'] as AssetKind,
    amount:         Number(row['amount']),
    unitPrice:      Number(row['unit_price']),
    manualUnitPrice: row['manual_unit_price'] != null ? Number(row['manual_unit_price']) : undefined,
    buyPrice:       row['buy_price'] != null ? Number(row['buy_price']) : undefined,
    label:          row['label'] as string | undefined,
    source:         row['source'] as string | undefined,
    lastUpdate:     String(row['last_update']),
    createdAt:      String(row['created_at']),
  }
}
