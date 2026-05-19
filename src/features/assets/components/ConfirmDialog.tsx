'use client'

import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'حذف دارایی',
  description = 'آیا از حذف این دارایی مطمئن هستید؟ این عمل قابل بازگشت نیست.',
  confirmLabel = 'حذف',
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button
          variant="primary"
          className="!bg-rose-600 hover:!bg-rose-700"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  )
}
