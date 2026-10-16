import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Creator } from '../api/types'

type CreatorsDialogType = 'view' | 'create' | 'update' | 'delete'

type CreatorsContextType = {
  open: CreatorsDialogType | null
  setOpen: (str: CreatorsDialogType | null) => void
  currentRow: Creator | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Creator | null>>
}

const CreatorsContext = React.createContext<CreatorsContextType | null>(null)

export function CreatorsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CreatorsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Creator | null>(null)

  return (
    <CreatorsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CreatorsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCreatorsContext = () => {
  const context = React.useContext(CreatorsContext)

  if (!context) {
    throw new Error('useCreatorsContext must be used within <CreatorsProvider>')
  }

  return context
}
