'use client'

import { useState, useEffect } from 'react'
import { SceneDialog } from '@/components/ui/scene-dialog'
import { SceneTable } from '@/components/ui/scene-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toaster } from '@/components/ui/toaster'
import { useTranslations } from 'next-intl'

interface Scene {
  id: string
  name: string
  nameEn: string
  description: string
  prompt: string
  isActive: boolean
  subjectId?: string
  subject?: {
    id: string
    name: string
  }
}

export default function LocalizedScenePage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<Scene | null>(null)

  const t = useTranslations()

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
        title: t('common.error'),
        description: t('scene.fetchError'),
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
        title: t('common.success'),
        description: t('scene.deleteSuccess'),
      })

      loadScenes()
    } catch (error) {
      console.error('Error deleting scene:', error)
      toast({
        title: t('common.error'),
        description: t('scene.deleteError'),
        variant: 'destructive',
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSceneToDelete(null)
    }
  }

  const handleSave = async (sceneData: { id?: string; name: string; nameEn: string; description: string; prompt: string; isActive: boolean; subjectId?: string }) => {
    try {
      const isUpdate = !!sceneData.id
      const url = isUpdate ? `/api/config/scenes?id=${sceneData.id}` : '/api/config/scenes'
      const method = isUpdate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sceneData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} scene`)
      }

      toast({
        title: t('common.success'),
        description: t('scene.saveSuccess'),
      })

      loadScenes()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving scene:', error)
      toast({
        title: t('common.error'),
        description: t('scene.saveError'),
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
        title: t('common.success'),
        description: scene.isActive
          ? t('scene.disabled')
          : t('scene.enabled'),
      })

      loadScenes()
    } catch (error) {
      console.error('Error updating scene status:', error)
      toast({
        title: t('common.error'),
        description: t('scene.updateError'),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('scene.title')}</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {t('scene.add')}
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
        title={t('scene.confirmDelete')}
        description={t('scene.deletePrompt')}
        onConfirm={confirmDelete}
      />

      <Toaster />
    </div>
  )
}
