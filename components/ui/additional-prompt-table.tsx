'use client'

import { useState, useEffect } from 'react'
import { AdditionalPrompt, PromptCategory } from '@/generated/prisma/client'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  PaginationState,
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
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

interface AdditionalPromptTableProps {
  data: AdditionalPrompt[]
  onEdit: (prompt: AdditionalPrompt) => void
  onDelete: (prompt: AdditionalPrompt) => void
  onToggleActive: (prompt: AdditionalPrompt) => void
}

export function AdditionalPromptTable({ data, onEdit, onDelete, onToggleActive }: AdditionalPromptTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState('')
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const t = useTranslations()
  const debouncedSearchValue = useDebounce(searchValue, 300)

  useEffect(() => {
    setGlobalFilter(debouncedSearchValue)
  }, [debouncedSearchValue])

  const getCategoryLabel = (category: PromptCategory) => {
    const categoryMap = {
      TONE: t('additionalPrompt.categories.tone'),
      STYLE: t('additionalPrompt.categories.style'),
      DOMAIN: t('additionalPrompt.categories.domain'),
    }
    return categoryMap[category] || category
  }

  const getCategoryColor = (category: PromptCategory) => {
    const colorMap = {
      TONE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      STYLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      DOMAIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    }
    return colorMap[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }

  const columns: ColumnDef<AdditionalPrompt>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            {t('common.name')}
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
    },
    {
      accessorKey: 'category',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            {t('additionalPrompt.category')}
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const category = row.getValue('category') as PromptCategory
        return (
          <Badge className={getCategoryColor(category)}>
            {getCategoryLabel(category)}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'sort',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            {t('additionalPrompt.sort')}
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
    },
    {
      accessorKey: 'prompt',
      header: t('additionalPrompt.prompt'),
      cell: ({ row }) => {
        const prompt = row.getValue('prompt') as string
        return (
          <div className="max-w-xs truncate" title={prompt}>
            {prompt}
          </div>
        )
      }
    },
    {
      accessorKey: 'isActive',
      header: t('common.status'),
      cell: ({ row }) => {
        const prompt = row.original
        return (
          <div className="w-[50px]">
            <Switch
              checked={prompt.isActive}
              onCheckedChange={() => onToggleActive(prompt)}
            />
          </div>
        )
      }
    },
    {
      accessorKey: 'isDefault',
      header: t('additionalPrompt.isDefault'),
      cell: ({ row }) => {
        const isDefault = row.getValue('isDefault') as boolean
        return isDefault ? (
          <Badge variant="outline">{t('additionalPrompt.defaultBadge')}</Badge>
        ) : null
      }
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        const prompt = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(prompt)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(prompt)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      {/* 搜索栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={t('additionalPrompt.searchPlaceholder')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header
                      ? typeof header.column.columnDef.header === 'function'
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header
                      : null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue() as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('additionalPrompt.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {t('additionalPrompt.itemsPerPage')}
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
            {t('additionalPrompt.records')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{t('additionalPrompt.goToPage')}</p>
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
            <p className="text-sm font-medium">{t('additionalPrompt.page')}</p>
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
            {t('additionalPrompt.pageOf', {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount()
            })}
          </p>
        </div>
      </div>
    </div>
  )
}