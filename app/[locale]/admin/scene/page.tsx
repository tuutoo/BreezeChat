'use client'

import { useState, useEffect } from 'react'
import { Scene } from '@/generated/prisma/client'
import { SceneDialog } from '@/components/ui/scene-dialog'
import { SceneTable } from '@/components/ui/scene-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toaster } from '@/components/ui/toaster'
import { usePathname } from 'next/navigation'

export default function LocalizedScenePage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<Scene | null>(null)
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const translations = {
    title: {
      zh: '场景管理',
      en: 'Scene Management',
      ja: 'シーン管理',
      ko: '장면 관리'
    },
    addScene: {
      zh: '添加场景',
      en: 'Add Scene',
      ja: 'シーンを追加',
      ko: '장면 추가'
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
    loadError: {
      zh: '加载场景列表失败',
      en: 'Failed to load scenes',
      ja: 'シーンリストの読み込みに失敗しました',
      ko: '장면 목록을 로드하지 못했습니다'
    },
    saveSuccess: {
      zh: '场景保存成功',
      en: 'Scene saved successfully',
      ja: 'シーンが正常に保存されました',
      ko: '장면이 성공적으로 저장되었습니다'
    },
    saveError: {
      zh: '保存场景失败',
      en: 'Failed to save scene',
      ja: 'シーンの保存に失敗しました',
      ko: '장면을 저장하지 못했습니다'
    },
    deleteSuccess: {
      zh: '场景删除成功',
      en: 'Scene deleted successfully',
      ja: 'シーンが正常に削除されました',
      ko: '장면이 성공적으로 삭제되었습니다'
    },
    deleteError: {
      zh: '删除场景失败',
      en: 'Failed to delete scene',
      ja: 'シーンの削除に失敗しました',
      ko: '장면을 삭제하지 못했습니다'
    },
    confirmDelete: {
      zh: '确认删除',
      en: 'Confirm Delete',
      ja: '削除の確認',
      ko: '삭제 확인'
    },
    deletePrompt: {
      zh: '确定要删除此场景吗？此操作无法撤销。',
      en: 'Are you sure you want to delete this scene? This action cannot be undone.',
      ja: 'このシーンを削除してもよろしいですか？この操作は元に戻せません。',
      ko: '이 장면을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.'
    },
    sceneEnabled: {
      zh: '场景已启用',
      en: 'Scene enabled',
      ja: 'シーンが有効になりました',
      ko: '장면이 활성화되었습니다'
    },
    sceneDisabled: {
      zh: '场景已禁用',
      en: 'Scene disabled',
      ja: 'シーンが無効になりました',
      ko: '장면이 비활성화되었습니다'
    },
    updateError: {
      zh: '更新场景状态失败',
      en: 'Failed to update scene status',
      ja: 'シーンのステータスの更新に失敗しました',
      ko: '장면 상태 업데이트에 실패했습니다'
    }
  }

  const getTranslation = (key: string) => {
    const section = translations[key as keyof typeof translations]
    return section?.[locale as keyof typeof section] || section?.['en']
  }

  useEffect(() => {
    loadScenes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadScenes = async () => {
    try {
      const response = await fetch('/api/config/scenes')
      const data = await response.json()
      setScenes(data)
    } catch (error) {
      console.error('Failed to load scenes:', error)
      toast({
        title: getTranslation('error'),
        description: getTranslation('loadError'),
        variant: "destructive",
      })
    }
  }

  const handleCreate = () => {
    setSelectedScene(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (scene: Scene) => {
    setSelectedScene(scene)
    setIsDialogOpen(true)
  }

  const handleDelete = (scene: Scene) => {
    setSceneToDelete(scene)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!sceneToDelete) return

    try {
      const response = await fetch(`/api/config/scenes?id=${sceneToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete scene')
      }

      toast({
        title: getTranslation('success'),
        description: getTranslation('deleteSuccess'),
      })

      loadScenes()
    } catch (error) {
      console.error('Error deleting scene:', error)
      toast({
        title: getTranslation('error'),
        description: getTranslation('deleteError'),
        variant: 'destructive',
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSceneToDelete(null)
    }
  }

  const handleSave = async (scene: Scene) => {
    try {
      const isUpdate = !!scene.id
      const url = isUpdate ? `/api/config/scenes?id=${scene.id}` : '/api/config/scenes'
      const method = isUpdate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scene),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} scene`)
      }

      toast({
        title: getTranslation('success'),
        description: getTranslation('saveSuccess'),
      })

      loadScenes()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving scene:', error)
      toast({
        title: getTranslation('error'),
        description: getTranslation('saveError'),
        variant: 'destructive',
      })
    }
  }

  const handleToggleActive = async (scene: Scene) => {
    try {
      const response = await fetch(`/api/config/scenes?id=${scene.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...scene,
          isActive: !scene.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update scene status')
      }

      toast({
        title: getTranslation('success'),
        description: scene.isActive
          ? getTranslation('sceneDisabled')
          : getTranslation('sceneEnabled'),
      })

      loadScenes()
    } catch (error) {
      console.error('Error updating scene status:', error)
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
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {getTranslation('addScene')}
        </Button>
      </div>

      <SceneTable
        scenes={scenes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <SceneDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        scene={selectedScene}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={getTranslation('confirmDelete')}
        description={getTranslation('deletePrompt')}
        onConfirm={confirmDelete}
      />

      <Toaster />
    </div>
  )
}
