"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { UIMessage } from "ai"


// 定义错误类型
interface ChatError extends Error {
  error?: string;
}

type ChatDemoProps = {
  initialMessages?: UIMessage[]
  config?: {
    subject?: Subject
    additionalPrompts: AdditionalPrompt[]
    scene?: Scene
    keepHistory: boolean
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
  const [isPromptExpanded, setIsPromptExpanded] = useState(true)

  // Use refs to always get the latest values in the fetch function
  // This solves the closure issue where static transport would capture stale state
  const selectedModelRef = useRef<string>("")
  const effectiveSceneRef = useRef<string>("")
  const configRef = useRef(props.config)

  // Update refs when state changes
  selectedModelRef.current = selectedModel
  configRef.current = props.config

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

  // Update the ref with the latest effective scene
  effectiveSceneRef.current = effectiveScene

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

  // Manual input management for AI SDK 5.0
  const [input, setInput] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  // Create a static transport with dynamic request body enhancement
  // AI SDK 5.0 requires static transport configuration, but we need dynamic state injection
  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: "/api/chat",
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        if (init?.body) {
          try {
            const originalBody = JSON.parse(init.body as string)

            // Convert UIMessage[] to ModelMessage[] format for API compatibility
            let convertedMessages = originalBody.messages;
            if (originalBody.messages && Array.isArray(originalBody.messages)) {
              convertedMessages = originalBody.messages.map((msg: UIMessage) => {
                if (msg.parts && Array.isArray(msg.parts)) {
                  // Extract text content from UIMessage parts format
                  const textParts = msg.parts.filter((part): part is { type: 'text'; text: string } => part.type === 'text');
                  const content = textParts.map((part) => part.text).join('\n');

                  return {
                    role: msg.role,
                    content: content
                  };
                }
                return msg;
              });
            }

            // Inject current state values using refs to avoid closure issues
            const enhancedBody = {
              ...originalBody,
              messages: convertedMessages,
              model: selectedModelRef.current,
              scene: effectiveSceneRef.current,
              subject: configRef.current?.subject,
              additionalPrompts: configRef.current?.additionalPrompts || [],
              keepHistory: configRef.current?.keepHistory ?? false,
            }

            const newInit = {
              ...init,
              body: JSON.stringify(enhancedBody)
            }

            return fetch(input, newInit)
          } catch (e) {
            console.error('Failed to enhance request body:', e)
            return fetch(input, init)
          }
        }

        return fetch(input, init)
      }
    })
  }, [])

  const {
    messages,
    sendMessage,
    stop,
    status,
    setMessages,
  } = useChat({
    messages: props.initialMessages,
    transport,
    onError: (error: ChatError) => {
      console.error('Chat error:', error)
      // Parse error response for user-friendly messages
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
        // If parsing fails, show generic error message
        console.error('Raw error details:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: 'An error occurred while processing your request'
        })
      }
    },
    onFinish: (message) => {
      // Check if this is an image generation response
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage && lastUserMessage.role === 'user') {
        // This is handled in the custom sendMessage function below
      }
    },
  })



  // Handle form submission
  const handleSubmit = async (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.()
    if (!input.trim()) return

    // Check if model is selected before submitting
    if (!selectedModel) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Please select a model first'
      })
      return
    }

    const userInput = input
    setInput("") // 清空输入框

    // 添加用户消息
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text: userInput }]
    }
    setMessages(prev => [...prev, userMessage])

    try {
      // 直接调用聊天API检查是否是图片生成
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userInput }],
          model: selectedModel,
          scene: effectiveScene,
          subject: configRef.current?.subject,
          additionalPrompts: configRef.current?.additionalPrompts || [],
          keepHistory: configRef.current?.keepHistory ?? false,
        })
      })

      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        // 可能是图片生成响应
        const jsonData = await response.json()
        if (jsonData.type === 'image_generation') {
          // 添加包含图片的AI响应
          const assistantMessage: UIMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            parts: [
              { type: 'text', text: jsonData.text },
              jsonData.image
            ]
          }
          setMessages(prev => [...prev, assistantMessage])
          return
        }
      }

      // 如果不是图片生成，使用常规的流式响应
      // 先移除刚才添加的用户消息，让useChat重新处理
      setMessages(prev => prev.slice(0, -1))
      sendMessage({ text: userInput })

    } catch (error) {
      console.error('Submit error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: 'An error occurred while processing your request'
      })

      // 添加错误消息
      const errorMessage: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        parts: [{ type: 'text', text: 'Sorry, I encountered an error. Please try again.' }]
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  // Handle suggestions
  const handleSuggestion = (message: { role: "user"; content: string }) => {
    sendMessage({ text: message.content })
  }

  // 构建最终的系统提示词（模拟后端逻辑）
  const buildFinalPrompt = () => {
    let systemPrompt = ''

    // 如果有配置的主题，使用主题提示词
    if (props.config?.subject) {
      systemPrompt = props.config.subject.prompt

      // 如果还有配置的场景或选择的场景，添加场景提示词
      if (props.config.scene) {
        systemPrompt += '\n\n' + props.config.scene.prompt
      } else if (effectiveScene) {
        const scene = scenes.find(s => s.name === effectiveScene)
        if (scene) {
          systemPrompt += '\n\n' + scene.prompt
        }
      }
    } else if (effectiveScene) {
      // 没有配置主题但有场景时，直接使用场景的提示词
      const scene = scenes.find(s => s.name === effectiveScene)
      if (scene) {
        systemPrompt = scene.prompt
      }
    }

    // 添加附加提示词
    if (props.config?.additionalPrompts && props.config.additionalPrompts.length > 0) {
      const additionalPromptTexts = props.config.additionalPrompts.map(prompt => prompt.prompt).join('\n')
      if (systemPrompt) {
        systemPrompt += '\n\n' + additionalPromptTexts
      } else {
        systemPrompt = additionalPromptTexts
      }
    }

    return systemPrompt || t('chat.systemPrompt.noPrompt')
  }

  const finalPrompt = buildFinalPrompt()

  return (
    <div className={cn("flex", "flex-col", "w-full", "h-full")}>
      <div className={cn("flex", "justify-between", "lg:justify-end", "items-center", "mb-2", "gap-2")}>
        <h2 className="text-lg font-semibold lg:hidden">BreezeChat</h2>
        <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoading}>
          <SelectTrigger className="w-full max-w-[220px] lg:w-[220px]">
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

      <div className="flex-1 min-h-0">
        <Chat
          className="w-full h-full"
          messages={messages as unknown as Message[]}
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          isGenerating={status === "streaming"}
          stop={stop}
          append={handleSuggestion}
          setMessages={setMessages}
          transcribeAudio={transcribeAudio}
          placeholder={selectedModel ? t('chat.inputPlaceholder') : 'Please select a model first...'}
          suggestions={[
            "你好，今天的会议在哪里举行？",
            "Please confirm your availability for the upcoming meeting.",
            "Können Sie mir bitte den Fehlercode senden?",
          ]}
        />
      </div>

      {/* 实时显示当前的最终提示词 */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium cursor-pointer flex items-center gap-2"
            onClick={() => setIsPromptExpanded(!isPromptExpanded)}
          >
            {isPromptExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {t('chat.systemPrompt.title')}
          </CardTitle>
        </CardHeader>
        {isPromptExpanded && (
          <CardContent className="pt-0">
            <div className="bg-muted rounded-md p-3 text-sm max-h-32 lg:max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                {finalPrompt}
              </pre>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 只有在没有配置时才显示场景选择器 */}
      {!props.config && scenes.length > 0 && (
        <div className="mb-2 relative w-full">
          {/* left fade */}
          <div
            className={cn(
              "absolute left-6 lg:left-12 top-0 bottom-0 w-6 lg:w-12 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none",
              current == 1 && "hidden"
            )}
          />

          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full px-6 lg:px-12 h-12 flex items-center"
          >
            <CarouselContent className="-ml-1">
              {scenes.map((scene) => (
                <CarouselItem
                  key={scene.name}
                  className="pl-2 lg:pl-3 basis-auto flex items-center"
                  onClick={() => handleSceneClick(scene.id)}
                >
                  <Badge
                    variant={selectedSceneId === scene.id ? "default" : "secondary"}
                    className="cursor-pointer rounded-lg px-2 lg:px-3 py-1 text-xs lg:text-sm whitespace-nowrap"
                  >
                    {scene.name}
                  </Badge>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 z-20 h-8 w-8 lg:h-10 lg:w-10" />
            <CarouselNext className="right-0 z-20 h-8 w-8 lg:h-10 lg:w-10" />
            {/* right fade */}
            <div
              className={cn(
                "absolute right-6 lg:right-12 top-0 bottom-0 w-6 lg:w-12 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none",
                current == count && "hidden"
              )}
            />
          </Carousel>
        </div>
      )}
    </div>
  )
}
