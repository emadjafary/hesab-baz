'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Asset,
  AssetFormData,
  AssetKind,
  ASSET_META,
  assetFormSchema,
} from '../types'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { toLatinDigits } from '@/lib/format'

interface Props {
  open: boolean
  onClose: () => void
  initialValue?: Asset
  onSubmit: (data: AssetFormData) => void
}

const kindOptions = (Object.keys(ASSET_META) as AssetKind[]).map((k) => ({
  value: k,
  label: ASSET_META[k].label,
}))

export function AssetForm({ open, onClose, initialValue, onSubmit }: Props) {
  const isEdit = Boolean(initialValue)

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      kind: initialValue?.kind ?? 'tether',
      amount: initialValue?.amount ?? 0,
      unitPrice: initialValue?.unitPrice,
      label: initialValue?.label ?? '',
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({
        kind: initialValue?.kind ?? 'tether',
        amount: initialValue?.amount ?? 0,
        unitPrice: initialValue?.unitPrice,
        label: initialValue?.label ?? '',
      })
    }
  }, [open, initialValue, reset])

  const submit = (data: AssetFormData) => {
    onSubmit(data)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'ویرایش دارایی' : 'افزودن دارایی جدید'}
      description="نوع دارایی و مقدار را وارد کنید. قیمت به صورت خودکار از منبع آنلاین گرفته می‌شود."
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        {/* نوع دارایی */}
        <Field label="نوع دارایی" error={errors.kind?.message}>
          <Controller
            name="kind"
            control={control}
            render={({ field }) => (
              <Select
                options={kindOptions}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value as AssetKind)}
              />
            )}
          />
        </Field>

        {/* مقدار */}
        <Field
          label="مقدار"
          hint="عدد را با ارقام انگلیسی یا فارسی وارد کنید"
          error={errors.amount?.message}
        >
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                inputMode="decimal"
                placeholder="مثلا ۳۳/۲۵"
                value={field.value === 0 ? '' : String(field.value)}
                onChange={(e) => {
                  const latin = toLatinDigits(e.target.value).replace(/,/g, '')
                  const num = Number(latin)
                  field.onChange(Number.isFinite(num) ? num : 0)
                }}
              />
            )}
          />
        </Field>

        {/* قیمت دستی (اختیاری) */}
        <Field
          label="قیمت هر واحد (اختیاری)"
          hint="اگر خالی بگذارید، از قیمت آنلاین استفاده می‌شود"
          error={errors.unitPrice?.message}
        >
          <Controller
            name="unitPrice"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                inputMode="numeric"
                placeholder="تومان"
                value={field.value == null ? '' : String(field.value)}
                onChange={(e) => {
                  const v = toLatinDigits(e.target.value).replace(/,/g, '')
                  if (v === '') field.onChange(undefined)
                  else {
                    const num = Number(v)
                    field.onChange(Number.isFinite(num) ? num : undefined)
                  }
                }}
              />
            )}
          />
        </Field>

        {/* توضیح */}
        <Field label="توضیح (اختیاری)" error={errors.label?.message}>
          <Input placeholder="مثلا: سکه تمام بهار آزادی" {...register('label')} />
        </Field>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? 'ذخیره تغییرات' : 'افزودن دارایی'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}
