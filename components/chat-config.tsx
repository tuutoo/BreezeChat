'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Subject, AdditionalPrompt, Scene, PromptCategory } from '@/generated/prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface ChatConfigProps {
  onConfigChange: (config: {
    subject?: Subject
    additionalPrompts: AdditionalPrompt[]
    scene?: Scene
  }) => void
}

export function ChatConfig({ onConfigChange }: ChatConfigProps) {
  const t = useTranslations()

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [additionalPrompts, setAdditionalPrompts] = useState<AdditionalPrompt[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([])

  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>()
  const [selectedAdditionalPrompts, setSelectedAdditionalPrompts] = useState<AdditionalPrompt[]>([])
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>()

  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // 获取主题列表
        const subjectsResponse = await fetch('/api/config/subjects')
        if (subjectsResponse.ok) {
          const subjectsData = await subjectsResponse.json()
          setSubjects(subjectsData)
        }

        // 获取附加提示列表
        const promptsResponse = await fetch('/api/config/additional-prompts')
        if (promptsResponse.ok) {
          const promptsData = await promptsResponse.json()
          setAdditionalPrompts(promptsData.filter((p: AdditionalPrompt) => p.isActive))
        }

        // 获取场景列表
        const scenesResponse = await fetch('/api/scenes')
        if (scenesResponse.ok) {
          const scenesData = await scenesResponse.json()
          setScenes(scenesData)
        }
      } catch (error) {
        console.error('Error fetching config data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // 从localStorage加载保存的配置
  useEffect(() => {
    // 等待数据加载完成，但不要求所有数据都必须存在
    if (isLoading) {
      return
    }

    console.log('Loading from localStorage...')
    const savedSubjectId = localStorage.getItem('selectedSubjectId')
    const savedAdditionalPromptIds = localStorage.getItem('selectedAdditionalPromptIds')
    const savedSceneId = localStorage.getItem('selectedSceneId')

    console.log('Saved values:', { savedSubjectId, savedAdditionalPromptIds, savedSceneId })

    if (savedSubjectId && savedSubjectId !== 'none' && subjects.length > 0) {
      const subject = subjects.find(s => s.id === savedSubjectId)
      console.log('Setting subject:', subject)
      setSelectedSubject(subject)
    }

    if (savedAdditionalPromptIds && additionalPrompts.length > 0) {
      try {
        const promptIds = JSON.parse(savedAdditionalPromptIds)
        if (promptIds.length > 0) {
          const prompts = additionalPrompts.filter(p => promptIds.includes(p.id))
          console.log('Setting additional prompts:', prompts)
          setSelectedAdditionalPrompts(prompts)
        }
      } catch (error) {
        console.error('Error parsing saved additional prompts:', error)
      }
    }

    if (savedSceneId && savedSceneId !== 'none' && scenes.length > 0) {
      const scene = scenes.find(s => s.id === savedSceneId)
      console.log('Setting scene:', scene)
      setSelectedScene(scene)
    }

    setIsInitialized(true)
    console.log('Initialization completed')
  }, [isLoading, subjects, additionalPrompts, scenes])

  // 保存配置到localStorage（只在初始化后）
  useEffect(() => {
    if (!isInitialized) return
    const value = selectedSubject?.id || 'none'
    console.log('Saving selectedSubjectId to localStorage:', value)
    localStorage.setItem('selectedSubjectId', value)
  }, [selectedSubject, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    const promptIds = selectedAdditionalPrompts.map(p => p.id)
    const value = JSON.stringify(promptIds)
    console.log('Saving selectedAdditionalPromptIds to localStorage:', value)
    localStorage.setItem('selectedAdditionalPromptIds', value)
  }, [selectedAdditionalPrompts, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    const value = selectedScene?.id || 'none'
    console.log('Saving selectedSceneId to localStorage:', value)
    localStorage.setItem('selectedSceneId', value)
  }, [selectedScene, isInitialized])

  // 根据选择的主题过滤场景
  useEffect(() => {
    if (selectedSubject) {
      const filtered = scenes.filter(scene => scene.subjectId === selectedSubject.id)
      setFilteredScenes(filtered)
      // 只有在初始化完成后才检查场景是否需要清除，避免在数据加载时错误清除
      if (isInitialized && selectedScene && selectedScene.subjectId !== selectedSubject.id) {
        console.log('Clearing scene due to subject change:', selectedScene.name, 'does not belong to', selectedSubject.name)
        setSelectedScene(undefined)
      }
    } else {
      setFilteredScenes([])
      // 只有在初始化完成后才清除场景，避免在数据加载时错误清除
      if (isInitialized && selectedScene) {
        console.log('Clearing scene due to no subject selected')
        setSelectedScene(undefined)
      }
    }
  }, [selectedSubject, scenes, selectedScene, isInitialized])

  // 通知父组件配置变化（只在初始化后）
  useEffect(() => {
    if (!isInitialized) return

    onConfigChange({
      subject: selectedSubject,
      additionalPrompts: selectedAdditionalPrompts,
      scene: selectedScene,
    })
  }, [selectedSubject, selectedAdditionalPrompts, selectedScene, onConfigChange, isInitialized])

  const handleSubjectChange = (subjectId: string) => {
    if (subjectId === 'none') {
      setSelectedSubject(undefined)
    } else {
      const subject = subjects.find(s => s.id === subjectId)
      setSelectedSubject(subject)
    }
  }

  const handleAdditionalPromptToggle = (prompt: AdditionalPrompt) => {
    setSelectedAdditionalPrompts(prev => {
      // 移除同分类的其他提示（互斥）
      const filtered = prev.filter(p => p.category !== prompt.category)

      // 检查是否已选择当前提示
      const isSelected = prev.some(p => p.id === prompt.id)

      if (isSelected) {
        // 如果已选择，则移除
        return filtered
      } else {
        // 如果未选择，则添加
        return [...filtered, prompt]
      }
    })
  }

  const handleSceneChange = (sceneId: string) => {
    if (sceneId === 'none') {
      setSelectedScene(undefined)
    } else {
      const scene = filteredScenes.find(s => s.id === sceneId)
      setSelectedScene(scene)
    }
  }

  const getCategoryLabel = (category: PromptCategory) => {
    const categoryKey = category.toLowerCase()
    return t(`additionalPrompt.categories.${categoryKey}`)
  }

  const getCategoryColor = (category: PromptCategory) => {
    const colorMap: Record<PromptCategory, string> = {
      LANGUAGE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      TONE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      STYLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      DOMAIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    }
    return colorMap[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }

  // 按分类分组附加提示
  const groupedPrompts = additionalPrompts.reduce((groups, prompt) => {
    if (!groups[prompt.category]) {
      groups[prompt.category] = []
    }
    groups[prompt.category].push(prompt)
    return groups
  }, {} as Record<PromptCategory, AdditionalPrompt[]>)

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {t('common.loading')}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-h-[calc(100vh-8rem)] overflow-y-auto">
      <CardHeader>
        <CardTitle>{t('chat.config.title')}</CardTitle>
        <CardDescription>{t('chat.config.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 主题选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('chat.config.subject')}</label>
          <Select value={selectedSubject?.id || 'none'} onValueChange={handleSubjectChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('chat.config.selectSubject')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('chat.config.noSubject')}</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 附加提示选择 */}
        <div className="space-y-3">
          <label className="text-sm font-medium">{t('chat.config.additionalPrompts')}</label>
          <div className="text-xs text-muted-foreground">
            {t('chat.config.additionalPromptsDescription')}
          </div>

          {Object.entries(groupedPrompts).map(([category, prompts]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(category as PromptCategory)} variant="outline">
                  {getCategoryLabel(category as PromptCategory)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ({t('chat.config.selectOne')})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {prompts.map((prompt) => {
                  const isSelected = selectedAdditionalPrompts.some(p => p.id === prompt.id)
                  return (
                    <Button
                      key={prompt.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAdditionalPromptToggle(prompt)}
                      className="text-xs"
                    >
                      {prompt.name}
                      {isSelected && <X className="ml-1 h-3 w-3" />}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 场景选择 - 只有选择了主题才显示 */}
        {selectedSubject && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('chat.config.scene')}</label>
              <Select value={selectedScene?.id || 'none'} onValueChange={handleSceneChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('chat.config.selectScene')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('chat.config.noScene')}</SelectItem>
                  {filteredScenes.map((scene) => (
                    <SelectItem key={scene.id} value={scene.id}>
                      {scene.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* 当前配置摘要 */}
        {(selectedSubject || selectedAdditionalPrompts.length > 0 || selectedScene) && (
          <>
            <div className="space-y-2">
              <div className="text-sm font-medium">{t('chat.config.currentConfig')}</div>
              <div className="space-y-1 text-xs">
                {selectedSubject && (
                  <div>
                    <span className="text-muted-foreground">{t('chat.config.subject')}:</span>{' '}
                    <span className="font-medium">{selectedSubject.name}</span>
                  </div>
                )}
                {selectedAdditionalPrompts.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">{t('chat.config.additionalPrompts')}:</span>{' '}
                    <span className="font-medium">
                      {selectedAdditionalPrompts.map(p => p.name).join(', ')}
                    </span>
                  </div>
                )}
                {selectedScene && (
                  <div>
                    <span className="text-muted-foreground">{t('chat.config.scene')}:</span>{' '}
                    <span className="font-medium">{selectedScene.name}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}