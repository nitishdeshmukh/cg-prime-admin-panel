import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Eye, Trash2, UserPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Creator } from '../api/types'
import { useCreatorsContext } from './creators-provider'

interface CreatorsRowActionsProps {
  row: Row<Creator>
}

export function CreatorsRowActions({ row }: CreatorsRowActionsProps) {
  const { setOpen, setCurrentRow } = useCreatorsContext()
  const creator = row.original

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(creator)
            setOpen('view')
          }}
          className='cursor-pointer'
        >
          <Eye className='mr-2 h-4 w-4 text-muted-foreground' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(creator)
            setOpen('update')
          }}
          className='cursor-pointer'
        >
          <UserPen className='mr-2 h-4 w-4 text-muted-foreground' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(creator)
            setOpen('delete')
          }}
          className='cursor-pointer text-destructive focus:text-destructive'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
