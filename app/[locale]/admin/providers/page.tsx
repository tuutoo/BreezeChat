'use client'

import { useEffect, useState } from 'react'
import { PROVIDERS } from '@/lib/providers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Edit2, CheckCircle, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function LocalizedProvidersPage() {
  const [providerStates, setProviderStates] = useState<Record<string, { status: 'success' | 'error' | 'pending', message: string }>>({})
  const [editingProvider, setEditingProvider] = useState<string | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')

  const t = useTranslations()

  useEffect(() => {
    checkProviderStatuses()
  }, [])

  const checkProviderStatuses = async () => {
    const states: Record<string, { status: 'success' | 'error' | 'pending', message: string }> = {}

    for (const provider of PROVIDERS) {
      try {
        const response = await fetch(`/api/config/validate-provider?providerName=${provider.providerName}`)
        const data = await response.json()

        if (response.ok) {
          states[provider.providerName] = {
            status: 'success',
            message: t('provider.configured')
          }
        } else {
          states[provider.providerName] = {
            status: 'error',
            message: data.error || t('provider.notConfigured')
          }
        }
      } catch {
        states[provider.providerName] = {
          status: 'error',
          message: t('provider.notConfigured')
        }
      }
    }

    setProviderStates(states)
  }

  const handleEdit = (providerName: string) => {
    setEditingProvider(providerName)
    setApiKeyInput('')
  }

  const handleCancel = () => {
    setEditingProvider(null)
    setApiKeyInput('')
  }

  const handleSave = async () => {
    if (!editingProvider || !apiKeyInput.trim()) {
      return
    }

    try {
      const response = await fetch('/api/config/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerName: editingProvider,
          apiKey: apiKeyInput,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save API key')
      }

      toast({
        title: t('common.success'),
        description: t('provider.saveSuccess'),
      })

      // Reset state and check provider status again
      setEditingProvider(null)
      setApiKeyInput('')
      checkProviderStatuses()
    } catch (error) {
      console.error('Error saving API key:', error)
      toast({
        title: t('common.error'),
        description: t('provider.saveError'),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">{t('provider.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('provider.description')}</p>
        </div>

        <div className="grid gap-6">
          {PROVIDERS.map((provider) => (
            <Card key={provider.providerName}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="capitalize">{provider.providerName}</span>
                  {providerStates[provider.providerName]?.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  {providerStates[provider.providerName]?.message || t('provider.notConfigured')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingProvider === provider.providerName ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`api-key-${provider.providerName}`}>
                        {t('provider.apiKey')}
                      </Label>
                      <Input
                        id={`api-key-${provider.providerName}`}
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="sk-..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        {t('common.cancel')}
                      </Button>
                      <Button onClick={handleSave}>
                        {t('common.save')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEdit(provider.providerName)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {t('provider.edit')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  )
}
