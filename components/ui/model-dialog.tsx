'use client'

import { useEffect, useState } from 'react'
import { Model, Provider } from '@/generated/prisma/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const modelSchema = z.object({
  name: z.string().min(1, '请输入模型名称'),
  description: z.string().optional(),
  providerId: z.string().min(1, '请选择提供商'),
  modelId: z.string().min(1, '请输入模型ID'),
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
  const [providers, setProviders] = useState<Provider[]>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: '',
      description: '',
      providerId: '',
      modelId: '',
      isActive: true,
    },
  })

  useEffect(() => {
    // 获取提供商列表
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/config/providers')
        if (!response.ok) {
          throw new Error('Failed to fetch providers')
        }
        const data = await response.json()
        setProviders(data)
      } catch (error) {
        console.error('Error fetching providers:', error)
      }
    }

    fetchProviders()
  }, [])

  useEffect(() => {
    if (model) {
      reset({
        name: model.name,
        description: model.description || '',
        providerId: model.providerId,
        modelId: model.modelId,
        isActive: model.isActive,
      })
    } else {
      reset({
        name: '',
        description: '',
        providerId: '',
        modelId: '',
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
            <Label htmlFor="providerId">提供商</Label>
            <Controller
              name="providerId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择提供商" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.providerId && (
              <p className="text-sm text-red-500">{errors.providerId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelId">模型ID</Label>
            <Input
              id="modelId"
              {...register('modelId')}
              placeholder="请输入模型ID"
            />
            {errors.modelId && (
              <p className="text-sm text-red-500">{errors.modelId.message}</p>
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