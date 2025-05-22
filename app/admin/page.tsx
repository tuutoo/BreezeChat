'use client'

import { useState, useEffect } from 'react'
import { Scene } from '@/generated/prisma/client'
import { SceneDialog } from '@/components/ui/scene-dialog'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Power } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

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

      {/* 场景管理 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">场景配置</h2>
        <div className="grid gap-4">
          {scenes.map(scene => (
            <div key={scene.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{scene.name} ({scene.nameEn})</h3>
                    <Switch
                      checked={scene.isActive}
                      onCheckedChange={() => handleToggleActive(scene)}
                      className="ml-2"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{scene.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(scene)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(scene.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
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