'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

interface SceneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scene?: {
    id: string
    name: string
    nameEn: string
    description: string
    prompt: string
    isActive: boolean
  }
  onSubmit: (data: {
    name: string
    nameEn: string
    description: string
    prompt: string
    isActive: boolean
  }) => Promise<void>
}

export function SceneDialog({ open, onOpenChange, scene, onSubmit }: SceneDialogProps) {
  const [name, setName] = useState(scene?.name || '')
  const [nameEn, setNameEn] = useState(scene?.nameEn || '')
  const [description, setDescription] = useState(scene?.description || '')
  const [prompt, setPrompt] = useState(scene?.prompt || '')
  const [isActive, setIsActive] = useState(scene?.isActive ?? true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (scene) {
      setName(scene.name)
      setNameEn(scene.nameEn)
      setDescription(scene.description)
      setPrompt(scene.prompt)
      setIsActive(scene.isActive)
    } else {
      setName('')
      setNameEn('')
      setDescription('')
      setPrompt('')
      setIsActive(true)
    }
  }, [scene])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({ name, nameEn, description, prompt, isActive })
      toast({
        title: "成功",
        description: `场景已${scene ? '更新' : '创建'}`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save scene:', error)
      toast({
        title: "错误",
        description: "保存场景失败",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{scene ? '编辑场景' : '新建场景'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">中文名称</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">英文名称</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}