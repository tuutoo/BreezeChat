'use client'

import { useState, useEffect } from 'react'
import { Subject } from '@/generated/prisma/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { useTranslations } from 'next-intl'

interface SubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject?: Subject
  onSubmit: (subject: Partial<Subject> & { name: string; description: string; prompt: string; isActive: boolean }) => Promise<void>
}

export function SubjectDialog({ open, onOpenChange, subject, onSubmit }: SubjectDialogProps) {
  const [name, setName] = useState(subject?.name || '')
  const [description, setDescription] = useState(subject?.description || '')
  const [prompt, setPrompt] = useState(subject?.prompt || '')
  const [isActive, setIsActive] = useState(subject?.isActive ?? true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const t = useTranslations()

  useEffect(() => {
    if (subject) {
      setName(subject.name)
      setDescription(subject.description)
      setPrompt(subject.prompt)
      setIsActive(subject.isActive)
    } else {
      setName('')
      setDescription('')
      setPrompt('')
      setIsActive(true)
    }
  }, [subject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...(subject && { id: subject.id }),
        name,
        description,
        prompt,
        isActive
      })
      toast({
        title: t('common.success'),
        description: subject ? t('subject.saveSuccess') : t('subject.saveSuccess'),
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save subject:', error)
      toast({
        title: t('common.error'),
        description: t('subject.saveError'),
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
          <DialogTitle>{subject ? t('subject.edit') : t('subject.create')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('subject.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <Label htmlFor="prompt">{t('subject.prompt')}</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="min-h-[200px]"
              placeholder={t('subject.promptPlaceholder')}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('subject.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}