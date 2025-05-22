'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface Provider {
  id: string
  name: string
  envApiKeyName: string
  isActive: boolean
  models: Model[]
}

interface Model {
  id: string
  name: string
  description: string
  modelId: string
  isActive: boolean
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    envApiKeyName: '',
    isActive: true,
  })

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/config/providers')
      if (!response.ok) throw new Error('Failed to fetch providers')
      const data = await response.json()
      setProviders(data)
    } catch (error) {
      console.error('Error fetching providers:', error)
      toast({
        title: '错误',
        description: '获取提供商列表失败',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingProvider
        ? `/api/config/providers/${editingProvider.id}`
        : '/api/config/providers'
      const method = editingProvider ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save provider')

      toast({
        title: '成功',
        description: `提供商已${editingProvider ? '更新' : '创建'}`,
      })
      setIsDialogOpen(false)
      fetchProviders()
    } catch (error) {
      console.error('Error saving provider:', error)
      toast({
        title: '错误',
        description: '保存提供商失败',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider)
    setFormData({
      name: provider.name,
      envApiKeyName: provider.envApiKeyName,
      isActive: provider.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (provider: Provider) => {
    setProviderToDelete(provider)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!providerToDelete) return

    try {
      const response = await fetch(`/api/config/providers/${providerToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete provider')

      toast({
        title: '成功',
        description: '提供商已删除',
      })
      fetchProviders()
    } catch (error) {
      console.error('Error deleting provider:', error)
      toast({
        title: '错误',
        description: '删除提供商失败',
        variant: 'destructive',
      })
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/config/providers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!response.ok) throw new Error('Failed to update provider status')

      toast({
        title: '成功',
        description: `提供商已${currentStatus ? '禁用' : '启用'}`,
      })
      fetchProviders()
    } catch (error) {
      console.error('Error updating provider status:', error)
      toast({
        title: '错误',
        description: '更新提供商状态失败',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">提供商管理</h1>
        <Button onClick={() => {
          setEditingProvider(null)
          setFormData({ name: '', envApiKeyName: '', isActive: true })
          setIsDialogOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          新建提供商
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>环境变量</TableHead>
              <TableHead>模型数量</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>{provider.name}</TableCell>
                <TableCell>{provider.envApiKeyName}</TableCell>
                <TableCell>{provider.models.length}</TableCell>
                <TableCell>
                  <Switch
                    checked={provider.isActive}
                    onCheckedChange={() => handleToggleActive(provider.id, provider.isActive)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(provider)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(provider)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProvider ? '编辑提供商' : '新建提供商'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入提供商名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="envApiKeyName">环境变量</Label>
              <Input
                id="envApiKeyName"
                value={formData.envApiKeyName}
                onChange={(e) => setFormData({ ...formData, envApiKeyName: e.target.value })}
                placeholder="请输入环境变量名称"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">{editingProvider ? '保存' : '创建'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="确认删除"
        description={`确定要删除提供商 "${providerToDelete?.name}" 吗？此操作不可恢复。`}
        onConfirm={handleConfirmDelete}
        confirmText="删除"
      />

      <Toaster />
    </div>
  )
}