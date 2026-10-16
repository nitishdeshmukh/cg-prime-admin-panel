import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { format } from 'date-fns'
import type { AppUser } from '../api/types'
import { cn } from '@/lib/utils'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<AppUser>[] = [
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
    meta: {
      className: cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky'),
    },
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
      <div className='ps-2.5 text-sm'>
        {row.getValue('id')}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => {
      const user = row.original
      const name = user.name
      const initials = name
        ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
        : 'US'

      return (
        <div className='flex items-center gap-3 min-w-44'>
          <Avatar className='h-9 w-9 border'>
            <AvatarImage
              src={user.profilePicLink || ''}
              alt={name || 'User'}
            />
            <AvatarFallback className='text-xs font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <LongText className='text-sm max-w-40'>
              {name || 'Unnamed User'}
            </LongText>
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
      const user = row.original
      const name = user.name?.toLowerCase() || ''
      const phone = user.phoneNumber?.toLowerCase() || ''
      return name.includes(search) || phone.includes(search)
    },
    enableSorting: false,
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.getValue('phoneNumber')}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'badge',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Badge' />
    ),
    cell: ({ row }) => {
      const badge = row.getValue('badge') as string | null

      if (!badge) {
        return <span className='text-xs text-muted-foreground'>None</span>
      }

      const formatted = badge.replace(/_/g, ' ')
      const isMonthlyActive = badge === 'MONTHLY_ACTIVE'

      return (
        <Badge
          variant='outline'
          className={cn(
            'capitalize text-xs font-medium',
            isMonthlyActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-primary/10 text-primary border-primary/20'
          )}
        >
          {formatted.toLowerCase()}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    id: 'city',
    accessorFn: (row) => row.city?.trim() || '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.getValue('city') || '—'}</span>
    ),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    id: 'state',
    accessorFn: (row) => row.state?.trim() || '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='State' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.getValue('state') || '—'}</span>
    ),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    id: 'country',
    accessorFn: (row) => row.country?.trim() || '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Country' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.getValue('country') || '—'}</span>
    ),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: 'lastUsedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Active' />
    ),
    cell: ({ row }) => {
      const lastUsedAt = row.getValue('lastUsedAt') as string | null
      if (!lastUsedAt) {
        return <span className='text-sm'>Never</span>
      }

      try {
        return (
          <span className='text-sm'>
            {format(new Date(lastUsedAt), 'MMM dd, yyyy HH:mm')}
          </span>
        )
      } catch {
        return <span className='text-xs font-mono'>{lastUsedAt}</span>
      }
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  }

]
