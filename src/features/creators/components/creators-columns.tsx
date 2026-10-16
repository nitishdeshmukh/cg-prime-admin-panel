import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTableColumnHeader } from '@/components/data-table'
import { YoutubeIcon, InstagramIcon } from './social-icons'
import { format } from 'date-fns'
import type { Creator } from '../api/types'
import { CreatorsRowActions } from './creators-row-actions'
import { Checkbox } from '@/components/ui/checkbox'
import { LongText } from '@/components/long-text'
import { cn } from '@/lib/utils'

export const creatorsColumns: ColumnDef<Creator>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-20 ps-2.5' >{row.getValue('id')}</div>
    ),
    enableSorting: true,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Creator' />
    ),
    cell: ({ row }) => {
      const creator = row.original
      const name = creator.name
      const initials = creator.name
        ? creator.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
        : 'CR'

      return (
        <div className='flex items-center gap-3 min-w-50'>
          <Avatar className='h-9 w-9 border'>
            <AvatarImage
              src={creator.profileImage || ""}
              alt={name || ""}
            />
            <AvatarFallback className='text-xs font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <LongText className='max-w-36'>
              {name ? name : "No name"}
            </LongText>

            <span className='text-sm text-muted-foreground line-clamp-1 max-w-55'>
              {creator.bio ? creator.bio : "No bio"}
            </span>

          </div>
        </div>
      )
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    filterFn: (row, _id, value) => {
      if (!value) return true
      const search = String(value).toLowerCase()
      const creator = row.original
      const name = creator.name?.toLowerCase() || ''
      const phone = creator.phoneNumber?.toLowerCase() || ''
      return name.includes(search) || phone.includes(search)
    },
    enableSorting: false,
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.getValue('phoneNumber')}</span>
    ),
    enableSorting: false,
  },
  {
    id: 'socials',
    accessorFn: (row) => row.youtubeLink || row.instagramLink || '',
    header: 'Socials',
    cell: ({ row }) => {
      const { youtubeLink, instagramLink } = row.original

      return (
        <div className='flex items-center gap-2'>
          {youtubeLink ? (
            <a
              href={youtubeLink}
              target='_blank'
              rel='noreferrer'
              title='YouTube Channel'
              className='text-red-600 hover:text-red-700 transition-colors'
            >
              <YoutubeIcon className='h-4 w-4' />
            </a>
          ) : (
            <YoutubeIcon className='h-4 w-4 text-muted-foreground/30' />
          )}

          {instagramLink ? (
            <a
              href={instagramLink}
              target='_blank'
              rel='noreferrer'
              title='Instagram Profile'
              className='text-pink-600 hover:text-pink-700 transition-colors'
            >
              <InstagramIcon className='h-4 w-4' />
            </a>
          ) : (
            <InstagramIcon className='h-4 w-4 text-muted-foreground/30' />
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'onboardingCompleted',
    accessorFn: (row) => (row.onboardingCompleted ? 'completed' : 'pending'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Onboarding' />
    ),
    cell: ({ row }) => {
      const isCompleted = row.getValue('onboardingCompleted') === 'completed'
      return isCompleted ? (
        <Badge
          variant='outline'
          className='bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 gap-1'
        >
          Completed
        </Badge>
      ) : (
        <Badge
          variant='outline'
          className='bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 gap-1'
        >
          Pending
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    id: 'enabled',
    accessorFn: (row) => (row.enabled ? 'active' : 'disabled'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isEnabled = row.getValue('enabled') === 'active'
      return isEnabled ? (
        <Badge
          variant='default'
        >
          Active
        </Badge>
      ) : (
        <Badge
          variant='destructive'
        >
          Disabled
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue('createdAt') as string
      if (!rawDate) return <span className='text-sm ps-2.5'>-</span>
      try {
        return (
          <span className='text-sm  whitespace-nowrap ps-2.5'>
            {format(new Date(rawDate), 'MMM d, yyyy')}
          </span>
        )
      } catch {
        return <span className='text-sm  whitespace-nowrap ps-2.5'>{rawDate}</span>
      }
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: CreatorsRowActions,
    enableHiding: false,
  },
]
