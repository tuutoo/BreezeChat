"use client"

import { useEffect, useState } from "react"
import { useChat, type UseChatOptions } from "@ai-sdk/react"
import { cn } from "@/lib/utils"
import { transcribeAudio } from "@/lib/utils/audio"
import { Chat } from "@/components/ui/chat"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Message } from "@/components/ui/chat-message"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Model, Scene, Subject, AdditionalPrompt } from "@/generated/prisma/client"
import { useTranslations } from 'next-intl'
import { useToast } from "@/components/ui/use-toast"

// 定义错误类型
interface ChatError extends Error {
  error?: string;
}

type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"]
  config?: {
    subject?: Subject
    additionalPrompts: AdditionalPrompt[]
    scene?: Scene
  }
}

export default function ChatDemo(props: ChatDemoProps) {
  const t = useTranslations()
  const { toast } = useToast()

  const [api, setApi] = useState<CarouselApi>()
  const [models, setModels] = useState<Model[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedSceneId, setSelectedSceneId] = useState<string>("")
  const [count, setCount] = useState(0)
  const [current, setCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // 从配置中获取场景，如果没有配置则使用选择的场景ID找到对应场景
  const getEffectiveSceneName = () => {
    if (props.config?.scene?.name) {
      return props.config.scene.name
    }
    if (selectedSceneId) {
      const scene = scenes.find(s => s.id === selectedSceneId)
      return scene?.name || ""
    }
    return ""
  }

  const effectiveScene = getEffectiveSceneName()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取模型列表
        const modelsResponse = await fetch('/api/models')
        if (!modelsResponse.ok) {
          throw new Error('Failed to fetch models')
        }
        const modelsData = await modelsResponse.json()
        setModels(modelsData)
        // 只在 localStorage 没有值时设置默认
        if (!localStorage.getItem('selectedModel') && modelsData.length > 0) {
          setSelectedModel(modelsData[0].name)
        }

        // 获取场景列表（但不自动设置默认值）
        const scenesResponse = await fetch('/api/scenes')
        if (!scenesResponse.ok) {
          throw new Error('Failed to fetch scenes')
        }
        const scenesData = await scenesResponse.json()
        setScenes(scenesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const storedModel = localStorage.getItem("selectedModel")
    if (storedModel) setSelectedModel(storedModel)

    // 只有在没有config时才从localStorage读取场景
    if (!props.config) {
      const storedSceneId = localStorage.getItem("selectedSceneId")
      if (storedSceneId) setSelectedSceneId(storedSceneId)
    }
  }, [props.config])

  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel)
  }, [selectedModel])

  useEffect(() => {
    // 只有在没有config时才保存场景到localStorage
    if (!props.config) {
      localStorage.setItem("selectedSceneId", selectedSceneId)
    }
  }, [selectedSceneId, props.config])

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handleSceneClick = (sceneId: string) => {
    setSelectedSceneId(sceneId)
  }

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    append,
    stop,
    status,
    setMessages,
  } = useChat({
    ...props,
    api: "/api/chat",
    body: {
      model: selectedModel,
      scene: effectiveScene,
      subject: props.config?.subject,
      additionalPrompts: props.config?.additionalPrompts || [],
    },
    onError: (error: ChatError) => {
      console.error('Chat error:', error)
      // 尝试解析错误响应中的详细信息
      try {
        if (error.message) {
          const errorData = JSON.parse(error.message)
          if (errorData.showToast) {
            toast({
              variant: "destructive",
              title: "Error",
              description: errorData.error || 'An error occurred'
            })
          }
          if (errorData.details) {
            console.error('AI Provider Error Details:', errorData.details)
          }
        }
      } catch {
        // 如果解析失败，直接打印原始错误
        console.error('Raw error details:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: 'An error occurred while processing your request'
        })
      }
    },
    onFinish: () => {
      // 清除错误状态当成功完成时
    },
  })

  // 自定义 handleSubmit 来处理错误
  const handleSubmit = async (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => {
    try {
      await originalHandleSubmit(event, options)
    } catch (error) {
      console.error('Submit error:', error)
      // 尝试解析错误响应中的详细信息
      try {
        if (error instanceof Error && error.message) {
          const errorData = JSON.parse(error.message)
          if (errorData.showToast) {
            toast({
              variant: "destructive",
              title: "Error",
              description: errorData.error || 'An error occurred'
            })
          }
          if (errorData.details) {
            console.error('AI Provider Error Details:', errorData.details)
          }
        }
      } catch {
        // 如果解析失败，直接打印原始错误
        console.error('Raw error details:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: 'An error occurred while processing your request'
        })
      }
    }
  }

  return (
    <div className={cn("flex", "flex-col", "w-full")}>
      <div className={cn("flex", "justify-end", "mb-2")}>
        <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoading}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder={isLoading ? t('common.loading') : t('model.select')}>
              {models.find((m) => m.name === selectedModel)?.name || ''}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.name} value={model.name} className="py-2 px-2 group">
                <div className="flex flex-col text-left">
                  <span className="font-medium text-sm">{model.name}</span>
                  <span
                    className="text-xs text-muted-foreground max-w-[180px] whitespace-normal break-all"
                  >
                    {model.modelId}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Chat
        className="w-full"
        messages={messages as unknown as Message[]}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={status === "streaming"}
        stop={stop}
        append={append}
        setMessages={setMessages}
        transcribeAudio={transcribeAudio}
        placeholder={t('chat.inputPlaceholder')}
        suggestions={[
          "你好，今天的会议在哪里举行？",
          "Please confirm your availability for the upcoming meeting.",
          "Können Sie mir bitte den Fehlercode senden?",
        ]}
      />

      {/* 只有在没有配置时才显示场景选择器 */}
      {!props.config && (
        <div className="mb-2 relative w-full">
          {/* left fade */}
          <div
            className={cn(
              "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none",
              current == 1 && "hidden"
            )}
          />

          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full px-12 h-12 flex items-center"
          >
            <CarouselContent className="-ml-1">
              {scenes.map((scene) => (
                <CarouselItem
                  key={scene.name}
                  className="pl-3 basis-auto flex items-center"
                  onClick={() => handleSceneClick(scene.id)}
                >
                  <Badge
                    variant={selectedSceneId === scene.id ? "default" : "secondary"}
                    className="cursor-pointer counded-lg px-3 py-1 white-space-nowrap"
                  >
                    {scene.name}
                  </Badge>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 z-20" />
            <CarouselNext className="right-0 z-20" />
            {/* right fade */}
            <div
              className={cn(
                "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none",
                current == count && "hidden"
              )}
            />
          </Carousel>
        </div>
      )}
    </div>
  )
}
