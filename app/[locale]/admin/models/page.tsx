'use client'

import { useState, useEffect, useCallback } from 'react'
import { Model } from '@/generated/prisma/client'
import { ModelDialog } from '@/components/ui/model-dialog'
import { ModelTable } from '@/components/ui/model-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useTranslations } from 'next-intl'

export default function LocalizedModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null)
  const t = useTranslations()

  const fetchModels = useCallback(async () => {
    try {
      const response = await fetch('/api/config/models')
      if (!response.ok) throw new Error('Failed to fetch models')
      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error('Error fetching models:', error)
      toast({
        title: t('common.error'),
        description: t('model.fetchError'),
        variant: 'destructive',
      })
    }
  }, [t])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  const handleSave = async (data: Model) => {
    try {
      const url = selectedModel?.id
        ? `/api/config/models?id=${selectedModel.id}`
        : '/api/config/models'
      const method = selectedModel?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save model')

      setIsDialogOpen(false)
      setSelectedModel(null)
      fetchModels()
      toast({
        title: t('common.success'),
        description: t('model.saveSuccess'),
      })
    } catch (error) {
      console.error('Error saving model:', error)
      toast({
        title: t('common.error'),
        description: t('model.saveError'),
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!modelToDelete) return

    try {
      const response = await fetch(
        `/api/config/models?name=${modelToDelete.name}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) throw new Error('Failed to delete model')

      setModelToDelete(null)
      fetchModels()
      toast({
        title: t('common.success'),
        description: t('model.deleteSuccess'),
      })
    } catch (error) {
      console.error('Error deleting model:', error)
      toast({
        title: t('common.error'),
        description: t('model.deleteError'),
        variant: 'destructive',
      })
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
        title: t('common.success'),
        description: model.isActive
          ? t('model.disabled')
          : t('model.enabled'),
      })

      fetchModels()
    } catch (error) {
      console.error('Error updating model:', error)
      toast({
        title: t('common.error'),
        description: t('model.updateError'),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('model.title')}</h1>
        <Button
          onClick={() => {
            setSelectedModel(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('model.add')}
        </Button>
      </div>

      <ModelTable
        models={models}
        onEdit={(model) => {
          setSelectedModel(model)
          setIsDialogOpen(true)
        }}
        onDelete={(model) => setModelToDelete(model)}
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
        onOpenChange={() => setModelToDelete(null)}
        title={t('model.confirmDelete')}
        description={t('model.deletePrompt')}
        onConfirm={handleDelete}
      />

      <Toaster />
    </div>
  )
}
