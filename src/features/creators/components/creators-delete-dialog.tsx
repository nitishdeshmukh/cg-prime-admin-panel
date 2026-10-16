'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Creator } from '../api/types'
import { useDeleteCreator } from '../api/use-creators'

type CreatorDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Creator
}

export function CreatorsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CreatorDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteMutation = useDeleteCreator()

  const confirmKeyword = currentRow.phoneNumber || currentRow.name || String(currentRow.id)
  const isMatch = value.trim().toLowerCase() === confirmKeyword.toLowerCase()

  const handleDelete = () => {
    if (!isMatch) return

    deleteMutation.mutate(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='creators-delete-form'
      disabled={!isMatch}
      isLoading={deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Creator
        </span>
      }
      desc={
        <form
          id='creators-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete creator{' '}
            <span className='font-bold'>
              {currentRow.name || currentRow.phoneNumber}
            </span>
            ?
            <br />
            This action will permanently remove this creator record (ID: {currentRow.id}) from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Confirmation:
          </Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter "${confirmKeyword}" to confirm.`}
            autoFocus
          />

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText='Delete'
      destructive
    />
  )
}
