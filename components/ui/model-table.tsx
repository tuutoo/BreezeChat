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
import { Model, Provider } from '@/generated/prisma/client'
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

// 扩展 Model 类型以包含 provider
interface ModelWithProvider extends Model {
  provider: Provider | null
}

interface ModelTableProps {
  models: ModelWithProvider[]
  onEdit: (model: ModelWithProvider) => void
  onDelete: (model: ModelWithProvider) => void
  onToggleActive: (model: ModelWithProvider) => void
}

export function ModelTable({ models, onEdit, onDelete, onToggleActive }: ModelTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState('')
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  // 使用防抖的搜索值
  const debouncedSearchValue = useDebounce(searchValue, 300)

  // 当防抖后的搜索值改变时，更新 globalFilter
  useEffect(() => {
    setGlobalFilter(debouncedSearchValue)
  }, [debouncedSearchValue])

  const columns: ColumnDef<ModelWithProvider>[] = [
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
            className="w-[200px] justify-start"
          >
            模型名称
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
        <div className="w-[200px] truncate" title={row.getValue('name')}>
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'description',
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
            className="w-[300px] justify-start"
          >
            模型描述
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
        <div className="w-[300px] truncate" title={row.getValue('description')}>
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'provider',
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
            提供商
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
        <div className="w-[150px] truncate" title={row.original.provider?.name || ''}>
          {row.original.provider?.name || ''}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: '状态',
      cell: ({ row }) => {
        const model = row.original
        return (
          <div className="w-[100px]">
            <Switch
              checked={model.isActive}
              onCheckedChange={() => onToggleActive(model)}
            />
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const model = row.original
        return (
          <div className="w-[100px] flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(model)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(model)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: models,
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
            placeholder="搜索模型..."
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
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            每页显示
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
            条记录
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">跳转到</p>
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
            <p className="text-sm font-medium">页</p>
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
            第 {table.getState().pagination.pageIndex + 1} 页，共 {table.getPageCount()} 页
          </p>
        </div>
      </div>
    </div>
  )
}