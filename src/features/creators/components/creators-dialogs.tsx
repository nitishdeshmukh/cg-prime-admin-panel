import { CreatorMutateDrawer } from './creator-mutate-drawer'
import { CreatorsDeleteDialog } from './creators-delete-dialog'
import { useCreatorsContext } from './creators-provider'

export function CreatorsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCreatorsContext()

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
        <CreatorsDeleteDialog
          key={`creator-delete-${currentRow.id}`}
          open={open === 'delete'}
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
    </>
  )
}
