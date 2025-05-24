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
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function LocalizedModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null)
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const translations = useMemo(() => ({
    title: {
      zh: '模型管理',
      en: 'Model Management',
      ja: 'モデル管理',
      ko: '모델 관리'
    },
    addModel: {
      zh: '添加模型',
      en: 'Add Model',
      ja: 'モデルを追加',
      ko: '모델 추가'
    },
    error: {
      zh: '错误',
      en: 'Error',
      ja: 'エラー',
      ko: '오류'
    },
    success: {
      zh: '成功',
      en: 'Success',
      ja: '成功',
      ko: '성공'
    },
    fetchError: {
      zh: '获取模型列表失败',
      en: 'Failed to fetch models',
      ja: 'モデルリストの取得に失敗しました',
      ko: '모델 목록을 가져오지 못했습니다'
    },
    saveSuccess: {
      zh: '模型保存成功',
      en: 'Model saved successfully',
      ja: 'モデルが正常に保存されました',
      ko: '모델이 성공적으로 저장되었습니다'
    },
    saveError: {
      zh: '保存模型失败',
      en: 'Failed to save model',
      ja: 'モデルの保存に失敗しました',
      ko: '모델을 저장하지 못했습니다'
    },
    deleteSuccess: {
      zh: '模型删除成功',
      en: 'Model deleted successfully',
      ja: 'モデルが正常に削除されました',
      ko: '모델이 성공적으로 삭제되었습니다'
    },
    deleteError: {
      zh: '删除模型失败',
      en: 'Failed to delete model',
      ja: 'モデルの削除に失敗しました',
      ko: '모델을 삭제하지 못했습니다'
    },
    updateError: {
      zh: '更新模型状态失败',
      en: 'Failed to update model status',
      ja: 'モデルの状態の更新に失敗しました',
      ko: '모델 상태를 업데이트하지 못했습니다'
    },
    modelEnabled: {
      zh: '模型已启用',
      en: 'Model has been enabled',
      ja: 'モデルが有効になりました',
      ko: '모델이 활성화되었습니다'
    },
    modelDisabled: {
      zh: '模型已禁用',
      en: 'Model has been disabled',
      ja: 'モデルが無効になりました',
      ko: '모델이 비활성화되었습니다'
    },
    confirmDelete: {
      zh: '确认删除',
      en: 'Confirm Delete',
      ja: '削除の確認',
      ko: '삭제 확인'
    },
    deletePrompt: {
      zh: '确定要删除此模型吗？此操作无法撤销。',
      en: 'Are you sure you want to delete this model? This action cannot be undone.',
      ja: 'このモデルを削除してもよろしいですか？この操作は元に戻せません。',
      ko: '이 모델을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.'
    }
  }), [])

  const getTranslation = useCallback(
    (key: string) => {
      const section = translations[key as keyof typeof translations]
      return section?.[locale as keyof typeof section] || section?.['en']
    },
    [locale, translations]
  )


  const fetchModels = useCallback(async () => {
    try {
      const response = await fetch('/api/config/models')
      if (!response.ok) throw new Error('Failed to fetch models')
      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error('Error fetching models:', error)
      toast({
        title: getTranslation('error'),
        description: getTranslation('fetchError'),
        variant: 'destructive',
      })
    }
  }, [getTranslation])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

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

      setIsDialogOpen(false)
      setSelectedModel(null)
      fetchModels()
      toast({
        title: '成功',
        description: getTranslation('saveSuccess'),
      })
    } catch (error) {
      console.error('Error saving model:', error)
      toast({
        title: getTranslation('error'),
        description: getTranslation('saveError'),
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
        title: '成功',
        description: getTranslation('deleteSuccess'),
      })
    } catch (error) {
      console.error('Error deleting model:', error)
      toast({
        title: getTranslation('error'),
        description: getTranslation('deleteError'),
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
        title: getTranslation('success'),
        description: model.isActive
          ? getTranslation('modelDisabled')
          : getTranslation('modelEnabled'),
      })

      fetchModels()
    } catch (error) {
      console.error('Error updating model:', error)
      toast({
        title: getTranslation('error'),
        description: getTranslation('updateError'),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{getTranslation('title')}</h1>
        <Button
          onClick={() => {
            setSelectedModel(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {getTranslation('addModel')}
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
        title={getTranslation('confirmDelete')}
        description={getTranslation('deletePrompt')}
        onConfirm={handleDelete}
      />

      <Toaster />
    </div>
  )
}
