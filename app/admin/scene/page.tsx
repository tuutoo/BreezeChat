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

export default function ScenePage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<Scene | null>(null)

  useEffect(() => {
    loadScenes()
  }, [])

  const loadScenes = async () => {
    try {
      const response = await fetch('/api/config/scenes')
      const data = await response.json()
      setScenes(data)
    } catch (error) {
      console.error('Failed to load scenes:', error)
      toast({
        title: "错误",
        description: "加载场景列表失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  const handleDelete = async (scene: Scene) => {
    setSceneToDelete(scene)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!sceneToDelete) return

    try {
      const response = await fetch(`/api/config/scenes?id=${sceneToDelete.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await loadScenes()
        toast({
          title: "成功",
          description: "场景已删除",
        })
      }
    } catch (error) {
      console.error('Failed to delete scene:', error)
      toast({
        title: "错误",
        description: "删除场景失败",
        variant: "destructive",
      })
    } finally {
      setSceneToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleToggleActive = async (scene: Scene) => {
    try {
      const response = await fetch('/api/config/scenes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: scene.id,
          name: scene.name,
          nameEn: scene.nameEn,
          description: scene.description,
          prompt: scene.prompt,
          isActive: !scene.isActive,
        }),
      })

      if (response.ok) {
        await loadScenes()
        toast({
          title: "成功",
          description: `场景已${scene.isActive ? '禁用' : '启用'}`,
        })
      }
    } catch (error) {
      console.error('Failed to toggle scene status:', error)
      toast({
        title: "错误",
        description: "更新场景状态失败",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (data: {
    name: string
    nameEn: string
    description: string
    prompt: string
    isActive: boolean
  }) => {
    try {
      const url = '/api/config/scenes'
      const method = selectedScene ? 'PUT' : 'POST'
      const body = selectedScene
        ? { id: selectedScene.id, ...data }
        : data

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        await loadScenes()
      }
    } catch (error) {
      console.error('Failed to save scene:', error)
      throw error
    }
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">加载中...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">场景管理</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          新建场景
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
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="删除场景"
        description="确定要删除这个场景吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        confirmText="删除"
      />

      <Toaster />
    </div>
  )
}