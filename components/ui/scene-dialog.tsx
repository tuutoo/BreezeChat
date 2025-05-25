'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { useTranslations } from 'next-intl'

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

  const t = useTranslations()

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
        title: t('common.success'),
        description: scene ? t('scene.saveSuccess') : t('scene.saveSuccess'),
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save scene:', error)
      toast({
        title: t('common.error'),
        description: t('scene.saveError'),
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
          <DialogTitle>{scene ? t('scene.edit') : t('scene.create')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('scene.chineseName')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">{t('scene.englishName')}</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">{t('scene.prompt')}</Label>
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
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('scene.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}