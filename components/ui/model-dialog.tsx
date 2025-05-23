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

interface ModelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  model?: Model | null
  onSubmit: (data: any) => void
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{model ? '编辑模型' : '添加模型'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
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
            <Label htmlFor="description">描述</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">提供商</Label>
            <Select
              value={formData.providerName}
              onValueChange={(value) =>
                setFormData({ ...formData, providerName: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择提供商" />
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
            <Label htmlFor="modelId">模型ID</Label>
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
            <Label htmlFor="isActive">启用</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}