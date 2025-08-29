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
  const [pendingUserMessage, setPendingUserMessage] = useState<UIMessage | null>(null)
  const [shouldPreventUserMessage, setShouldPreventUserMessage] = useState(false)

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

            // 如果有待处理的用户消息（包含附件），使用已有的消息历史而不是新消息
            if (pendingUserMessage) {
              const currentMessages = [...messages];
              convertedMessages = currentMessages.map((msg: UIMessage) => {
                if (msg.parts && Array.isArray(msg.parts)) {
                  const textParts = msg.parts.filter((part): part is { type: 'text'; text: string } => part.type === 'text');
                  const content = textParts.map((part) => part.text).join('\n');
                  return { role: msg.role, content: content };
                }
                return { role: msg.role, content: '' };
              });

                                          // 添加包含附件内容的最后一条用户消息（支持多模态）
              if (pendingUserMessage.parts) {
                const hasMultimodal = pendingUserMessage.parts.some((part: any) => part.type === 'image' || part.type === 'file');

                if (hasMultimodal) {
                  // 多模态消息格式
                  const multimodalContent = pendingUserMessage.parts.map((part: any) => {
                    if (part.type === 'text') {
                      return { type: 'text', text: part.text };
                    } else if (part.type === 'image') {
                      const mimeType = part.image.match(/data:([^;]+)/)?.[1] || 'image/png'
                      return {
                        type: 'file',
                        data: part.image,
                        mediaType: mimeType
                      };
                    }
                    return null;
                  }).filter(Boolean);

                  convertedMessages.push({ role: 'user', content: multimodalContent });
                } else {
                  // 纯文本消息格式
                  const textParts = pendingUserMessage.parts.filter((part): part is { type: 'text'; text: string } => part.type === 'text');
                  const content = textParts.map((part) => part.text).join('\n');
                  convertedMessages.push({ role: 'user', content });
                }
              }

              // 清除待处理消息
              setPendingUserMessage(null);
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

  // 监控messages变化，阻止sendMessage添加重复的用户消息
  useEffect(() => {
    if (shouldPreventUserMessage && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      // 如果最后一条消息是用户消息且不是我们想要的（包含附件的消息）
      if (lastMessage.role === 'user' && lastMessage.id !== pendingUserMessage?.id) {
        // 移除这条重复消息
        setMessages(prev => prev.slice(0, -1))
        setShouldPreventUserMessage(false)
      }
    }
  }, [messages, shouldPreventUserMessage, pendingUserMessage, setMessages])


  // Handle form submission (supports attachments from ChatForm)
  const handleSubmit = async (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => {
    event?.preventDefault?.()
    const hasText = !!input.trim()
    const files = options?.experimental_attachments
    const hasFiles = !!files && files.length > 0
    if (!hasText && !hasFiles) return

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

    // Helpers to read files
    const readFileAsDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })

    const readFileAsText = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsText(file)
      })

    // Prepare attachment parts for UI and inline text for model
    let messageParts: Array<any> = []
    const attachmentTexts: string[] = []

    // First, add all attachments (images and files)
    if (hasFiles && files) {
      const fileArray = Array.from(files)
      for (const file of fileArray) {
                // Handle image files - add as image parts for UI preview
        if (file.type.startsWith('image/')) {
          try {
            const dataUrl = await readFileAsDataUrl(file)
            // For UI display
            messageParts.push({
              type: 'image',
              image: dataUrl,
              prompt: `Uploaded image: ${file.name}`
            })
          } catch {
            attachmentTexts.push(`[无法读取图片: ${file.name}]`)
          }
        }
        // Handle text files - inline content
        else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          try {
            const text = await readFileAsText(file)
            const maxLen = 8000
            const truncated = text.length > maxLen
              ? text.slice(0, maxLen) + "\n...[truncated]"
              : text
            attachmentTexts.push(
              `附件文件: ${file.name}\n\n\`\`\`\n${truncated}\n\`\`\``
            )
          } catch {
            attachmentTexts.push(`[无法读取文件: ${file.name}]`)
          }
        }
        // Handle other files - add as file parts
        else {
          try {
            const dataUrl = await readFileAsDataUrl(file)
            messageParts.push({
              type: 'file',
              url: dataUrl,
              mediaType: file.type || 'application/octet-stream',
              name: file.name
            })
            const sizeKb = Math.round(file.size / 1024)
            attachmentTexts.push(`[附件: ${file.name} (${file.type || 'unknown'}, ${sizeKb} KB)]`)
          } catch {
            const sizeKb = Math.round(file.size / 1024)
            attachmentTexts.push(`[附件: ${file.name} (${file.type || 'unknown'}, ${sizeKb} KB) - 读取失败]`)
          }
        }
      }
    }

    // Then, add text part at the end (after attachments)
    if (hasText) {
      messageParts.push({ type: 'text', text: userInput })
    }

        // Create message content for API - let AI SDK handle multimodal natively
    const hasImages = messageParts.some(part => part.type === 'image')

    let apiMessageContent: any;
    if (hasImages) {
      // Convert to AI SDK native format
      apiMessageContent = messageParts.map(part => {
        if (part.type === 'text') {
          return { type: 'text', text: part.text }
                } else if (part.type === 'image') {
          // Use data URL directly - AI SDK will handle conversion
          const mimeType = part.image.match(/data:([^;]+)/)?.[1] || 'image/png'

          return {
            type: 'file',
            data: part.image, // AI SDK accepts data URLs
            mediaType: mimeType
          }
        }
        return null
      }).filter(Boolean)

      // Add non-image attachments as text
      if (attachmentTexts.length > 0) {
        apiMessageContent.push({
          type: 'text',
          text: attachmentTexts.join('\n\n')
        })
      }
    } else {
      // Simple text format
      apiMessageContent = [userInput, ...attachmentTexts].filter(Boolean).join("\n\n")
    }

    // 添加用户消息（包含文本与文件parts，便于UI展示）
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: messageParts as any
    }
    setMessages(prev => [...prev, userMessage])

    // 如果有附件，设置待处理的用户消息
    const hasAttachments = hasImages || messageParts.some(part => part.type === 'file')
    if (hasAttachments) {
      setPendingUserMessage(userMessage)
    }

    try {
      // 直接调用聊天API检查是否是图片生成
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: apiMessageContent }],
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
          setPendingUserMessage(null) // 清除待处理消息
          setShouldPreventUserMessage(false)
          return
        }
      }

      // 如果不是图片生成，使用常规的流式响应
      // 检查是否有附件
      const hasAttachments = hasImages || messageParts.some(part => part.type === 'file')

      if (hasAttachments) {
        // 如果有附件，保持我们的用户消息（包含图片预览）
        // 设置阻止标志，然后调用sendMessage
        setShouldPreventUserMessage(true)
        sendMessage({ text: typeof apiMessageContent === 'string' ? apiMessageContent : JSON.stringify(apiMessageContent) })
      } else {
        // 如果没有附件，移除我们手动添加的消息，让sendMessage正常处理
        setMessages(prev => prev.slice(0, -1))
        sendMessage({ text: typeof apiMessageContent === 'string' ? apiMessageContent : JSON.stringify(apiMessageContent) })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setPendingUserMessage(null) // 清除待处理消息
      setShouldPreventUserMessage(false)
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
