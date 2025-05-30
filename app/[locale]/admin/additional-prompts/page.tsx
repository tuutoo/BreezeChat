'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdditionalPrompt } from '@/generated/prisma/client'
import { AdditionalPromptDialog } from '@/components/ui/additional-prompt-dialog'
import { AdditionalPromptTable } from '@/components/ui/additional-prompt-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toaster } from '@/components/ui/toaster'
import { useTranslations } from 'next-intl'

export default function LocalizedAdditionalPromptPage() {
  const [additionalPrompts, setAdditionalPrompts] = useState<AdditionalPrompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<AdditionalPrompt | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<AdditionalPrompt | null>(null)

  const t = useTranslations()

  const loadAdditionalPrompts = useCallback(async () => {
    try {
      const response = await fetch('/api/config/additional-prompts')
      const data = await response.json()
      setAdditionalPrompts(data)
    } catch (error) {
      console.error('Failed to load additional prompts:', error)
      toast({
        title: t('common.error'),
        description: t('additionalPrompt.fetchError'),
        variant: "destructive",
      })
    }
  }, [t])

  useEffect(() => {
    loadAdditionalPrompts()
  }, [loadAdditionalPrompts])

  const handleCreate = () => {
    setSelectedPrompt(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (prompt: AdditionalPrompt) => {
    setSelectedPrompt(prompt)
    setIsDialogOpen(true)
  }

  const handleDelete = (prompt: AdditionalPrompt) => {
    setPromptToDelete(prompt)
    setIsDeleteDialogOpen(true)
  }

  const handleToggleActive = async (prompt: AdditionalPrompt) => {
    try {
      const response = await fetch('/api/config/additional-prompts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...prompt,
          isActive: !prompt.isActive,
        }),
      })

      if (response.ok) {
        await loadAdditionalPrompts()
        toast({
          title: t('common.success'),
          description: prompt.isActive
            ? t('additionalPrompt.disabled')
            : t('additionalPrompt.enabled'),
        })
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      console.error('Failed to toggle additional prompt status:', error)
      toast({
        title: t('common.error'),
        description: t('additionalPrompt.updateError'),
        variant: "destructive",
      })
    }
  }

  const confirmDelete = async () => {
    if (!promptToDelete) return

    try {
      const response = await fetch(`/api/config/additional-prompts?id=${promptToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadAdditionalPrompts()
        toast({
          title: t('common.success'),
          description: t('additionalPrompt.deleteSuccess'),
        })
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      console.error('Failed to delete additional prompt:', error)
      toast({
        title: t('common.error'),
        description: t('additionalPrompt.deleteError'),
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setPromptToDelete(null)
    }
  }

  const handleSave = async (data: Partial<AdditionalPrompt>) => {
    try {
      const url = '/api/config/additional-prompts'
      const method = selectedPrompt ? 'PUT' : 'POST'
      const body = selectedPrompt
        ? { ...data, id: selectedPrompt.id }
        : data

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        await loadAdditionalPrompts()
        setIsDialogOpen(false)
        toast({
          title: t('common.success'),
          description: selectedPrompt
            ? t('additionalPrompt.updateSuccess')
            : t('additionalPrompt.createSuccess'),
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Failed to save additional prompt:', error)
      toast({
        title: t('common.error'),
        description: selectedPrompt
          ? t('additionalPrompt.updateError')
          : t('additionalPrompt.createError'),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('additionalPrompt.title')}</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {t('additionalPrompt.add')}
        </Button>
      </div>

      <AdditionalPromptTable
        data={additionalPrompts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <AdditionalPromptDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        prompt={selectedPrompt}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t('additionalPrompt.deleteConfirmTitle')}
        description={t('additionalPrompt.deleteConfirmDescription', {
          name: promptToDelete?.name || ''
        })}
        onConfirm={confirmDelete}
      />

      <Toaster />
    </div>
  )
}