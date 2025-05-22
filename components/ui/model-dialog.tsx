'use client'

import { useEffect } from 'react'
import { Model } from '@/generated/prisma/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const modelSchema = z.object({
  name: z.string().min(1, '请输入模型名称'),
  description: z.string().optional(),
  provider: z.string().min(1, '请输入提供商'),
  isActive: z.boolean().default(true),
})

type ModelFormData = z.infer<typeof modelSchema>

interface ModelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  model: Model | null
  onSubmit: (data: Partial<Model>) => void
}

export function ModelDialog({
  open,
  onOpenChange,
  model,
  onSubmit,
}: ModelDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: '',
      description: '',
      provider: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (model) {
      reset({
        name: model.name,
        description: model.description || '',
        provider: model.provider,
        isActive: model.isActive,
      })
    } else {
      reset({
        name: '',
        description: '',
        provider: '',
        isActive: true,
      })
    }
  }, [model, reset])

  const onSubmitForm = (data: ModelFormData) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{model ? '编辑模型' : '新建模型'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">模型名称</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="请输入模型名称"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">模型描述</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="请输入模型描述（可选）"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">提供商</Label>
            <Input
              id="provider"
              {...register('provider')}
              placeholder="请输入提供商"
            />
            {errors.provider && (
              <p className="text-sm text-red-500">{errors.provider.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit">{model ? '保存' : '创建'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}