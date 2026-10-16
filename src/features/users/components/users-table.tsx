import { useEffect, useMemo, useState } from 'react'
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
import { usersColumns } from './users-columns'
import { useAppUsers } from '../api/use-users'
import { AlertCircle, Users as UsersIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from 'use-debounce'

export function UsersTable() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  // Extract filter values from columnFilters
  const nameFilter = (columnFilters.find((f) => f.id === 'name')?.value as string) || ''
  const countryFilter = (columnFilters.find((f) => f.id === 'country')?.value as string[]) || []
  const stateFilter = (columnFilters.find((f) => f.id === 'state')?.value as string[]) || []
  const cityFilter = (columnFilters.find((f) => f.id === 'city')?.value as string[]) || []

  // Debounced search query using 'use-debounce' package (400ms delay)
  const [debouncedSearch] = useDebounce(nameFilter.trim(), 400)

  // Reset pagination to first page when any filter changes
  const activeFiltersKey = `${debouncedSearch}-${countryFilter.join(',')}-${stateFilter.join(',')}-${cityFilter.join(',')}`
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [activeFiltersKey])

  // Prepare query params for GET /api/user matching Swagger parameters
  const queryParams = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id || 'createdAt',
    sortDir: (sorting[0]?.desc ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(countryFilter.length ? { country: countryFilter[0] } : {}),
    ...(stateFilter.length ? { state: stateFilter[0] } : {}),
    ...(cityFilter.length ? { city: cityFilter[0] } : {}),
  }

  const { data, isLoading, isError, error, refetch } = useAppUsers(queryParams)

  const users = data?.data?.content || []
  const totalPages = data?.data?.totalPages

  // Cumulative sets to preserve options dynamically generated from data
  const [knownCountries, setKnownCountries] = useState<Set<string>>(new Set())
  const [knownStates, setKnownStates] = useState<Set<string>>(new Set())
  const [knownCities, setKnownCities] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (users.length > 0) {
      setKnownCountries((prev) => {
        const next = new Set(prev)
        users.forEach((u) => {
          if (u.country?.trim()) next.add(u.country.trim())
        })
        return next
      })
      setKnownStates((prev) => {
        const next = new Set(prev)
        users.forEach((u) => {
          if (u.state?.trim()) next.add(u.state.trim())
        })
        return next
      })
      setKnownCities((prev) => {
        const next = new Set(prev)
        users.forEach((u) => {
          if (u.city?.trim()) next.add(u.city.trim())
        })
        return next
      })
    }
  }, [users])

  // Dynamically generated faceted options from dataset
  const countryOptions = useMemo(
    () =>
      Array.from(knownCountries)
        .sort()
        .map((country) => ({
          label: country,
          value: country,
        })),
    [knownCountries]
  )

  const stateOptions = useMemo(
    () =>
      Array.from(knownStates)
        .sort()
        .map((state) => ({
          label: state,
          value: state,
        })),
    [knownStates]
  )

  const cityOptions = useMemo(
    () =>
      Array.from(knownCities)
        .sort()
        .map((city) => ({
          label: city,
          value: city,
        })),
    [knownCities]
  )

  const table = useReactTable({
    data: users,
    columns: usersColumns,
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
      {/* Faceted Filter Toolbar - exactly matches users-copy */}
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter users...'
        searchKey='name'
        filters={[
          {
            columnId: 'country',
            title: 'Country',
            options: countryOptions,
          },
          {
            columnId: 'state',
            title: 'State',
            options: stateOptions,
          },
          {
            columnId: 'city',
            title: 'City',
            options: cityOptions,
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
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-28' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-20 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
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
                  colSpan={usersColumns.length}
                  className='h-36 text-center'
                >
                  <div className='flex flex-col items-center justify-center gap-2 text-destructive'>
                    <AlertCircle className='h-8 w-8' />
                    <p className='font-semibold'>Failed to load users</p>
                    <p className='text-xs text-muted-foreground'>
                      {(error as Error)?.message || 'An error occurred while fetching users.'}
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
                  colSpan={usersColumns.length}
                  className='h-36 text-center'
                >
                  <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground'>
                    <UsersIcon className='h-8 w-8 opacity-40' />
                    <p className='font-medium'>No users found</p>
                    <p className='text-xs'>
                      No users match your criteria or none have registered yet.
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
