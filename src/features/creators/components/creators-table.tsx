import { useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTablePagination, DataTableViewOptions } from '@/components/data-table'
import { creatorsColumns } from './creators-columns'
import { useCreators } from '../api/use-creators'
import { AlertCircle, Search, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function CreatorsTable() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  // Filter states
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all')
  const [onboardingFilter, setOnboardingFilter] = useState<'all' | 'completed' | 'pending'>('all')

  // Prepare query params
  const queryParams = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id || 'createdAt',
    sortDir: (sorting[0]?.desc ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
    ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
  }

  const { data, isLoading, isError, error, refetch } = useCreators(queryParams)

  const rawCreators = data?.data?.content || []

  // Client-side filtering for status & onboarding if backend doesn't filter them yet
  const creators = rawCreators.filter((creator) => {
    if (statusFilter === 'active' && !creator.enabled) return false
    if (statusFilter === 'disabled' && creator.enabled) return false
    if (onboardingFilter === 'completed' && !creator.onboardingCompleted) return false
    if (onboardingFilter === 'pending' && creator.onboardingCompleted) return false
    return true
  })

  const totalPages = data?.data?.totalPages

  const table = useReactTable({
    data: creators,
    columns: creatorsColumns,
    pageCount: totalPages,
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }


  return (
    <div className='space-y-4'>
      {/* Toolbar / Filters */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <form
          onSubmit={handleSearchSubmit}
          className='flex items-center gap-2 max-w-sm flex-1'
        >
          <div className='relative w-full'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search by creator name...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='pl-8 h-9'
            />
          </div>
          <Button type='submit' size='sm' variant='secondary' className='h-9'>
            Search
          </Button>
        </form>

        <div className='flex flex-wrap items-center gap-2'>
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val: 'all' | 'active' | 'disabled') => {
              setStatusFilter(val)
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className='h-9 w-fit'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='disabled'>Disabled</SelectItem>
            </SelectContent>
          </Select>

          {/* Onboarding Filter */}
          <Select
            value={onboardingFilter}
            onValueChange={(val: 'all' | 'completed' | 'pending') => {
              setOnboardingFilter(val)
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className='h-9 w-fit'>
              <SelectValue placeholder='Onboarding' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Onboarding</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
            </SelectContent>
          </Select>

          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table Container */}
      <div className='rounded-md border bg-card'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading Skeleton Rows matching requested Page Size (up to 10)
              Array.from({ length: Math.min(pagination.pageSize, 10) }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className='h-4 w-10' />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Skeleton className='h-9 w-9 rounded-full' />
                      <div className='space-y-1.5'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-3 w-20' />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-12' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-20 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-16 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-8' />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              // Error State
              <TableRow>
                <TableCell
                  colSpan={creatorsColumns.length}
                  className='h-36 text-center'
                >
                  <div className='flex flex-col items-center justify-center gap-2 text-destructive'>
                    <AlertCircle className='h-8 w-8' />
                    <p className='font-semibold'>Failed to load creators</p>
                    <p className='text-xs text-muted-foreground'>
                      {(error as Error)?.message || 'An error occurred while fetching creators.'}
                    </p>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => refetch()}
                      className='mt-2'
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty State
              <TableRow>
                <TableCell
                  colSpan={creatorsColumns.length}
                  className='h-36 text-center'
                >
                  <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground'>
                    <Users className='h-8 w-8 opacity-40' />
                    <p className='font-medium'>No creators found</p>
                    <p className='text-xs'>
                      No creators match your search criteria or none have registered yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
