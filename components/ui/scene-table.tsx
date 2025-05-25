'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
  getFilteredRowModel,
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
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useState, useEffect } from 'react'
import { Scene } from '@/generated/prisma/client'
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from 'next-intl'

// 添加防抖函数
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

interface SceneTableProps {
  scenes: Scene[]
  onEdit: (scene: Scene) => void
  onDelete: (scene: Scene) => void
  onToggleActive: (scene: Scene) => void
}

export function SceneTable({ scenes, onEdit, onDelete, onToggleActive }: SceneTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState('')
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const t = useTranslations()

  // 使用防抖的搜索值
  const debouncedSearchValue = useDebounce(searchValue, 300)

  // 当防抖后的搜索值改变时，更新 globalFilter
  useEffect(() => {
    setGlobalFilter(debouncedSearchValue)
  }, [debouncedSearchValue])

  const columns: ColumnDef<Scene>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const currentSort = column.getIsSorted()
              if (!currentSort) {
                column.toggleSorting(false)
              } else if (currentSort === 'asc') {
                column.toggleSorting(true)
              } else {
                column.clearSorting()
              }
            }}
            className="w-[150px] justify-start"
          >
            {t('scene.chineseName')}
            {column.getIsSorted() ? (
              column.getIsSorted() === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-[150px] truncate" title={row.getValue('name')}>
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'nameEn',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const currentSort = column.getIsSorted()
              if (!currentSort) {
                column.toggleSorting(false)
              } else if (currentSort === 'asc') {
                column.toggleSorting(true)
              } else {
                column.clearSorting()
              }
            }}
            className="w-[200px] justify-start"
          >
            {t('scene.englishName')}
            {column.getIsSorted() ? (
              column.getIsSorted() === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-[200px] truncate" title={row.getValue('nameEn')}>
          {row.getValue('nameEn')}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: t('common.description'),
      cell: ({ row }) => (
        <div className="w-[200px] whitespace-pre-wrap break-words">
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'prompt',
      header: t('scene.prompt'),
      cell: ({ row }) => (
        <div className="w-[500px] whitespace-pre-wrap break-words">
          {row.getValue('prompt')}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: t('common.status'),
      cell: ({ row }) => {
        const scene = row.original
        return (
          <div className="w-[50px]">
            <Switch
              checked={scene.isActive}
              onCheckedChange={() => onToggleActive(scene)}
            />
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        const scene = row.original
        return (
          <div className="w-[100px] flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(scene)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(scene)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: scenes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('scene.searchPlaceholder')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('scene.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {t('scene.itemsPerPage')}
          </p>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {t('scene.records')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{t('scene.goToPage')}</p>
            <Input
              type="number"
              min={1}
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  const nextPage = Math.min(table.getState().pagination.pageIndex + 1, table.getPageCount() - 1)
                  table.setPageIndex(nextPage)
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  const prevPage = Math.max(table.getState().pagination.pageIndex - 1, 0)
                  table.setPageIndex(prevPage)
                }
              }}
              className="h-8 w-16"
            />
            <p className="text-sm font-medium">{t('scene.page')}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('scene.pageOf', {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount()
            })}
          </p>
        </div>
      </div>
    </div>
  )
}