'use client'

import { useState, useEffect } from 'react'
import { AdditionalPrompt, PromptCategory } from '@/generated/prisma/client'
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
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useTranslations } from 'next-intl'

interface AdditionalPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt?: AdditionalPrompt
  onSave: (prompt: Partial<AdditionalPrompt>) => Promise<void>
}

export function AdditionalPromptDialog({ open, onOpenChange, prompt, onSave }: AdditionalPromptDialogProps) {
  const [name, setName] = useState(prompt?.name || '')
  const [promptText, setPromptText] = useState(prompt?.prompt || '')
  const [category, setCategory] = useState<PromptCategory>(prompt?.category || 'TONE')
  const [sort, setSort] = useState(prompt?.sort?.toString() || '0')
  const [isActive, setIsActive] = useState(prompt?.isActive ?? true)
  const [isDefault, setIsDefault] = useState(prompt?.isDefault ?? false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const t = useTranslations()

  useEffect(() => {
    if (prompt) {
      setName(prompt.name)
      setPromptText(prompt.prompt)
      setCategory(prompt.category)
      setSort(prompt.sort.toString())
      setIsActive(prompt.isActive)
      setIsDefault(prompt.isDefault)
    } else {
      setName('')
      setPromptText('')
      setCategory('TONE')
      setSort('0')
      setIsActive(true)
      setIsDefault(false)
    }
  }, [prompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !promptText.trim()) {
      toast({
        title: t('common.error'),
        description: t('additionalPrompt.requiredFields'),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSave({
        ...(prompt && { id: prompt.id }),
        name: name.trim(),
        prompt: promptText.trim(),
        category,
        sort: parseInt(sort),
        isActive,
        isDefault,
        applicableScenes: prompt?.applicableScenes || []
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save additional prompt:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryOptions = [
    { value: 'TONE', label: t('additionalPrompt.categories.tone') },
    { value: 'STYLE', label: t('additionalPrompt.categories.style') },
    { value: 'DOMAIN', label: t('additionalPrompt.categories.domain') },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {prompt ? t('additionalPrompt.edit') : t('additionalPrompt.add')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('common.name')} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('additionalPrompt.namePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('additionalPrompt.category')} *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as PromptCategory)}>
              <SelectTrigger>
                <SelectValue placeholder={t('additionalPrompt.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort">{t('additionalPrompt.sort')}</Label>
            <Input
              id="sort"
              type="number"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">{t('additionalPrompt.prompt')} *</Label>
            <Textarea
              id="prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={t('additionalPrompt.promptPlaceholder')}
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">{t('additionalPrompt.isActive')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
              <Label htmlFor="isDefault">{t('additionalPrompt.isDefault')}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}