'use client'

import { useState, useEffect } from 'react'
import { Model } from '@/generated/prisma/client'
import { ModelDialog } from '@/components/ui/model-dialog'
import { ModelTable } from '@/components/ui/model-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/config/models')
      if (!response.ok) throw new Error('Failed to fetch models')
      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error('Error fetching models:', error)
      toast({
        title: '错误',
        description: '获取模型列表失败',
        variant: 'destructive',
      })
    }
  }

  const handleSave = async (data: Model) => {
    try {
      const url = selectedModel
        ? `/api/config/models?name=${selectedModel.name}`
        : '/api/config/models'
      const method = selectedModel ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save model')

      toast({
        title: '成功',
        description: `模型已${selectedModel ? '更新' : '创建'}`,
      })

      fetchModels()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving model:', error)
      toast({
        title: '错误',
        description: '保存模型失败',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (model: Model) => {
    setSelectedModel(model)
    setIsDialogOpen(true)
  }

  const handleDelete = (model: Model) => {
    setModelToDelete(model)
  }

  const handleConfirmDelete = async () => {
    if (!modelToDelete) return

    try {
      const response = await fetch(`/api/config/models?name=${modelToDelete.name}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete model')

      toast({
        title: '成功',
        description: '模型已删除',
      })

      fetchModels()
    } catch (error) {
      console.error('Error deleting model:', error)
      toast({
        title: '错误',
        description: '删除模型失败',
        variant: 'destructive',
      })
    } finally {
      setModelToDelete(null)
    }
  }

  const handleToggleActive = async (model: Model) => {
    try {
      const response = await fetch(`/api/config/models?name=${model.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...model,
          isActive: !model.isActive,
        }),
      })

      if (!response.ok) throw new Error('Failed to update model')

      toast({
        title: '成功',
        description: `模型已${model.isActive ? '禁用' : '启用'}`,
      })

      fetchModels()
    } catch (error) {
      console.error('Error updating model:', error)
      toast({
        title: '错误',
        description: '更新模型状态失败',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">模型管理</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加模型
        </Button>
      </div>

      <ModelTable
        models={models}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <ModelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        model={selectedModel}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={!!modelToDelete}
        onOpenChange={(open) => !open && setModelToDelete(null)}
        title="删除模型"
        description={`确定要删除模型 "${modelToDelete?.name}" 吗？`}
        onConfirm={handleConfirmDelete}
      />

      <Toaster />
    </div>
  )
}