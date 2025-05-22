'use client'

import { useState, useEffect } from 'react'
import { Scene } from '@/generated/prisma/client'
import { SceneDialog } from '@/components/ui/scene-dialog'
import { SceneTable } from '@/components/ui/scene-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AdminPage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个场景吗？')) return

    try {
      const response = await fetch(`/api/config/scenes?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await loadScenes()
      }
    } catch (error) {
      console.error('Failed to delete scene:', error)
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
      }
    } catch (error) {
      console.error('Failed to toggle scene status:', error)
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
        <h1 className="text-2xl font-bold">配置管理</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          新建场景
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">场景配置</h2>
        <SceneTable
          scenes={scenes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </section>

      <SceneDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        scene={selectedScene}
        onSubmit={handleSubmit}
      />
    </div>
  )
}