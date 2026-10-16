import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCreatorsContext } from './creators-provider'

export function CreatorsPrimaryButtons() {
  const { setOpen, setCurrentRow } = useCreatorsContext()
  return (
    <div className='flex gap-2'>
      <Button
        className='space-x-1'
        onClick={() => {
          setCurrentRow(null)
          setOpen('create')
        }}
      >
        <span>Add Creator</span> <Plus size={18} />
      </Button>
    </div>
  )
}
