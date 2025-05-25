'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Model } from '@/generated/prisma/client'
import { PROVIDERS } from '@/lib/providers'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useTranslations } from 'next-intl'

interface ModelFormData {
  name: string
  description: string
  providerName: string
  modelId: string
  isActive: boolean
}

interface ModelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  model?: Model | null
  onSubmit: (data: ModelFormData) => void
}

export function ModelDialog({
  open,
  onOpenChange,
  model,
  onSubmit,
}: ModelDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    providerName: '',
    modelId: '',
    isActive: true,
  })

  const t = useTranslations()

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        description: model.description || '',
        providerName: model.providerName,
        modelId: model.modelId,
        isActive: model.isActive,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        providerName: '',
        modelId: '',
        isActive: true,
      })
    }
  }, [model])

  const validateProviderKey = async (providerName: string) => {
    try {
      const response = await fetch(`/api/config/validate-provider?providerName=${providerName}`)
      const data = await response.json()

      if (!response.ok) {
        toast({
          title: t('common.error'),
          description: data.error || t('model.validationError'),
          variant: 'destructive',
        })
        return false
      }
      return true
    } catch (error) {
      console.error('Error validating provider:', error)
      toast({
        title: t('common.error'),
        description: t('model.validationError'),
        variant: 'destructive',
      })
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证提供商配置
    const isValid = await validateProviderKey(formData.providerName)
    if (!isValid) {
      return
    }

    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{model ? t('model.edit') : t('model.add')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('common.name')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description')}</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">{t('model.provider')}</Label>
            <Select
              value={formData.providerName}
              onValueChange={(value) =>
                setFormData({ ...formData, providerName: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t('model.selectProvider')} />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((provider) => (
                  <SelectItem key={provider.providerName} value={provider.providerName}>
                    {provider.providerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="modelId">{t('model.modelId')}</Label>
            <Input
              id="modelId"
              value={formData.modelId}
              onChange={(e) =>
                setFormData({ ...formData, modelId: e.target.value })
              }
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive">{t('common.enabled')}</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}