import { ConfirmDialog } from '@/components/confirm-dialog'
import { CreatorMutateDrawer } from './creator-mutate-drawer'
import { useCreatorsContext } from './creators-provider'
import { useDeleteCreator } from '../api/use-creators'

export function CreatorsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCreatorsContext()
  const deleteMutation = useDeleteCreator()

  const handleDeleteConfirm = () => {
    if (!currentRow?.id) return
    deleteMutation.mutate(currentRow.id, {
      onSuccess: () => {
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
    })
  }

  return (
    <>
      {/* Create Creator Drawer */}
      <CreatorMutateDrawer
        key='creator-create'
        open={open === 'create'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null)
          }
        }}
      />

      {/* Update Creator Drawer */}
      {currentRow && (
        <CreatorMutateDrawer
          key={`creator-update-${currentRow.id}`}
          open={open === 'update'}
          mode='update'
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }
          }}
          currentRow={currentRow}
        />
      )}

      {/* View Creator Drawer using Mutate Drawer */}
      {currentRow && (
        <CreatorMutateDrawer
          key={`creator-view-${currentRow.id}`}
          open={open === 'view'}
          mode='view'
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }
          }}
          currentRow={currentRow}
        />
      )}

      {/* Delete Creator Confirmation Dialog */}
      {currentRow && (
        <ConfirmDialog
          key={`creator-delete-${currentRow.id}`}
          destructive
          open={open === 'delete'}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }
          }}
          isLoading={deleteMutation.isPending}
          handleConfirm={handleDeleteConfirm}
          className='max-w-md'
          title={`Delete Creator #${currentRow.id}?`}
          desc={
            <>
              Are you sure you want to delete creator{' '}
              <strong>{currentRow.name || `#${currentRow.id}`}</strong> ({currentRow.phoneNumber})?
              <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
        />
      )}
    </>
  )
}
