'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PROVIDERS } from '@/lib/providers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Edit2, CheckCircle, XCircle } from 'lucide-react'

export default function LocalizedProvidersPage() {
  const [providerStates, setProviderStates] = useState<Record<string, { status: 'success' | 'error' | 'pending', message: string }>>({})
  const [editingProvider, setEditingProvider] = useState<string | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const translations = {
    title: {
      zh: '提供商管理',
      en: 'Provider Management',
      ja: 'プロバイダー管理',
      ko: '공급자 관리'
    },
    description: {
      zh: '管理AI模型提供商的API密钥和配置',
      en: 'Manage API keys and configurations for AI model providers',
      ja: 'AIモデルプロバイダーのAPIキーと構成を管理する',
      ko: 'AI 모델 공급자를 위한 API 키 및 구성 관리'
    },
    provider: {
      zh: '提供商',
      en: 'Provider',
      ja: 'プロバイダー',
      ko: '공급자'
    },
    status: {
      zh: '状态',
      en: 'Status',
      ja: 'ステータス',
      ko: '상태'
    },
    apiKey: {
      zh: 'API密钥',
      en: 'API Key',
      ja: 'APIキー',
      ko: 'API 키'
    },
    save: {
      zh: '保存',
      en: 'Save',
      ja: '保存',
      ko: '저장'
    },
    cancel: {
      zh: '取消',
      en: 'Cancel',
      ja: 'キャンセル',
      ko: '취소'
    },
    edit: {
      zh: '编辑',
      en: 'Edit',
      ja: '編集',
      ko: '편집'
    },
    configured: {
      zh: '已配置',
      en: 'Configured',
      ja: '設定済み',
      ko: '구성됨'
    },
    notConfigured: {
      zh: '未配置',
      en: 'Not Configured',
      ja: '未設定',
      ko: '구성되지 않음'
    },
    error: {
      zh: '错误',
      en: 'Error',
      ja: 'エラー',
      ko: '오류'
    },
    success: {
      zh: '成功',
      en: 'Success',
      ja: '成功',
      ko: '성공'
    },
    saveSuccess: {
      zh: 'API密钥已保存',
      en: 'API key saved successfully',
      ja: 'APIキーが正常に保存されました',
      ko: 'API 키가 성공적으로 저장되었습니다'
    },
    saveError: {
      zh: '保存API密钥失败',
      en: 'Failed to save API key',
      ja: 'APIキーの保存に失敗しました',
      ko: 'API 키 저장에 실패했습니다'
    }
  }

  const getTranslation = (key: string) => {
    const section = translations[key as keyof typeof translations]
    return section?.[locale as keyof typeof section] || section?.['en']
  }

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
            message: getTranslation('configured')
          }
        } else {
          states[provider.providerName] = {
            status: 'error',
            message: data.error || getTranslation('notConfigured')
          }
        }
      } catch (error) {
        states[provider.providerName] = {
          status: 'error',
          message: getTranslation('notConfigured')
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
        title: getTranslation('success'),
        description: getTranslation('saveSuccess'),
      })

      // Reset state and check provider status again
      setEditingProvider(null)
      setApiKeyInput('')
      checkProviderStatuses()
    } catch (error) {
      console.error('Error saving API key:', error)
      toast({
        title: getTranslation('error'),
        description: getTranslation('saveError'),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">{getTranslation('title')}</h1>
          <p className="text-muted-foreground mt-2">{getTranslation('description')}</p>
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
                  {providerStates[provider.providerName]?.message || getTranslation('notConfigured')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingProvider === provider.providerName ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`api-key-${provider.providerName}`}>
                        {getTranslation('apiKey')}
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
                        {getTranslation('cancel')}
                      </Button>
                      <Button onClick={handleSave}>
                        {getTranslation('save')}
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
                    {getTranslation('edit')}
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
