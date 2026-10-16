import { useEffect, useState } from 'react'
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
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
import { Button } from '@/components/ui/button'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { creatorsColumns } from './creators-columns'
import { useCreators } from '../api/use-creators'
import { AlertCircle, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from 'use-debounce'

export function CreatorsTable() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  // Extract search and filter values from columnFilters
  const nameFilter = (columnFilters.find((f) => f.id === 'name')?.value as string) || ''
  const enabledFilter = (columnFilters.find((f) => f.id === 'enabled')?.value as string[]) || []
  const onboardingFilter = (columnFilters.find((f) => f.id === 'onboardingCompleted')?.value as string[]) || []

  // Debounced search query for backend API (400ms delay)
  const [debouncedSearch] = useDebounce(nameFilter.trim(), 400)

  // Reset pagination to first page when any filter or search changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [debouncedSearch, enabledFilter.join(','), onboardingFilter.join(',')])

  // Prepare query params
  const queryParams = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id || 'createdAt',
    sortDir: (sorting[0]?.desc ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  }

  const { data, isLoading, isError, error, refetch } = useCreators(queryParams)

  const rawCreators = data?.data?.content || []
  const totalPages = data?.data?.totalPages

  const table = useReactTable({
    data: rawCreators,
    columns: creatorsColumns,
    pageCount: totalPages,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      {/* Faceted Filter Toolbar - exactly matches users */}
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter creators...'
        searchKey='name'
        filters={[
          {
            columnId: 'enabled',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Disabled', value: 'disabled' },
            ],
          },
          {
            columnId: 'onboardingCompleted',
            title: 'Onboarding',
            options: [
              { label: 'Completed', value: 'completed' },
              { label: 'Pending', value: 'pending' },
            ],
          },
        ]}
      />

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
                    <Skeleton className='h-4 w-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-8' />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Skeleton className='h-9 w-9 rounded-full' />
                      <div className='space-y-1.5'>
                        <Skeleton className='h-4 w-28' />
                        <Skeleton className='h-3 w-16' />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-28' />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-4 w-4 rounded-full' />
                      <Skeleton className='h-4 w-4 rounded-full' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-20 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-16 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-8 rounded-md' />
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
                      No creators match your criteria or none have been added yet.
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
