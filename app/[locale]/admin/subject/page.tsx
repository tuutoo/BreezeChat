'use client'

import { useState, useEffect } from 'react'
import { Subject } from '@/generated/prisma/client'
import { SubjectDialog } from '@/components/ui/subject-dialog'
import { SubjectTable } from '@/components/ui/subject-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toaster } from '@/components/ui/toaster'
import { useTranslations } from 'next-intl'

export default function LocalizedSubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null)

  const t = useTranslations()

  useEffect(() => {
    loadSubjects()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadSubjects = async () => {
    try {
      const response = await fetch('/api/config/subjects')
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error('Failed to load subjects:', error)
      toast({
        title: t('common.error'),
        description: t('subject.fetchError'),
        variant: "destructive",
      })
    }
  }

  const handleCreate = () => {
    setSelectedSubject(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsDialogOpen(true)
  }

  const handleDelete = (subject: Subject) => {
    setSubjectToDelete(subject)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!subjectToDelete) return

    try {
      const response = await fetch(`/api/config/subjects?id=${subjectToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete subject')
      }

      toast({
        title: t('common.success'),
        description: t('subject.deleteSuccess'),
      })

      loadSubjects()
    } catch (error) {
      console.error('Error deleting subject:', error)
      toast({
        title: t('common.error'),
        description: t('subject.deleteError'),
        variant: 'destructive',
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSubjectToDelete(null)
    }
  }

  const handleSave = async (subject: Partial<Subject> & { name: string; description: string; prompt: string; isActive: boolean }) => {
    try {
      const isUpdate = !!subject.id
      const url = isUpdate ? `/api/config/subjects?id=${subject.id}` : '/api/config/subjects'
      const method = isUpdate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subject),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} subject`)
      }

      toast({
        title: t('common.success'),
        description: t('subject.saveSuccess'),
      })

      loadSubjects()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving subject:', error)
      toast({
        title: t('common.error'),
        description: t('subject.saveError'),
        variant: 'destructive',
      })
    }
  }

  const handleToggleActive = async (subject: Subject) => {
    try {
      const response = await fetch(`/api/config/subjects?id=${subject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...subject,
          isActive: !subject.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update subject status')
      }

      toast({
        title: t('common.success'),
        description: subject.isActive
          ? t('subject.disabled')
          : t('subject.enabled'),
      })

      loadSubjects()
    } catch (error) {
      console.error('Error updating subject status:', error)
      toast({
        title: t('common.error'),
        description: t('subject.updateError'),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('subject.title')}</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {t('subject.add')}
        </Button>
      </div>

      <SubjectTable
        subjects={subjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <SubjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        subject={selectedSubject}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t('subject.confirmDelete')}
        description={t('subject.deletePrompt')}
        onConfirm={confirmDelete}
      />

      <Toaster />
    </div>
  )
}