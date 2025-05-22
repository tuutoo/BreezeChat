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
import { Model, Scene } from "@/generated/prisma/client"

type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"]
}

export default function ChatDemo(props: ChatDemoProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [models, setModels] = useState<Model[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedScene, setSelectedScene] = useState<string>("")
  const [count, setCount] = useState(0)
  const [current, setCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

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

        // 获取场景列表
        const scenesResponse = await fetch('/api/scenes')
        if (!scenesResponse.ok) {
          throw new Error('Failed to fetch scenes')
        }
        const scenesData = await scenesResponse.json()
        setScenes(scenesData)
        if (!localStorage.getItem('selectedScene') && scenesData.length > 0) {
          setSelectedScene(scenesData[0].name)
        }
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
    const storedScene = localStorage.getItem("selectedScene")
    if (storedModel) setSelectedModel(storedModel)
    if (storedScene) setSelectedScene(storedScene)
  }, [])

  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel)
  }, [selectedModel])

  useEffect(() => {
    localStorage.setItem("selectedScene", selectedScene)
  }, [selectedScene])

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handleSceneClick = (sceneName: string) => {
    setSelectedScene(sceneName)
  }

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    status,
    setMessages,
  } = useChat({
    ...props,
    api: "/api/chat",
    body: {
      model: selectedModel,
      scene: selectedScene,
    },
  })

  return (
    <div className={cn("flex", "flex-col", "w-full")}>
      <div className={cn("flex", "justify-end", "mb-2")}>
        <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoading}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder={isLoading ? "加载中..." : "选择模型"}>
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
                    {model.description}
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
        suggestions={[
          "你好，今天的会议在哪里举行？",
          "Please confirm your availability for the upcoming meeting.",
          "Können Sie mir bitte den Fehlercode senden?",
        ]}
      />
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
                onClick={() => handleSceneClick(scene.name)}
              >
                <Badge
                  variant={selectedScene === scene.name ? "default" : "secondary"}
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
    </div>
  )
}
