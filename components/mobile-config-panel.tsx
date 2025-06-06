'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Subject, AdditionalPrompt, Scene } from '@/generated/prisma/client'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ChatConfig } from './chat-config'

interface MobileConfigPanelProps {
  onConfigChange: (config: {
    subject?: Subject
    additionalPrompts: AdditionalPrompt[]
    scene?: Scene
    keepHistory: boolean
  }) => void
}

export function MobileConfigPanel({ onConfigChange }: MobileConfigPanelProps) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

    return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 lg:hidden"
          aria-label={t('chat.config.title')}
        >
          <Settings className="h-4 w-4" />
          {t('chat.config.title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('chat.config.title')}</DialogTitle>
          <DialogDescription>
            {t('chat.config.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <ChatConfig onConfigChange={onConfigChange} />
        </div>
      </DialogContent>
    </Dialog>
  )
}