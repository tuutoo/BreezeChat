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
import { SCENES } from "@/lib/scenes";
import { Message } from "@/components/ui/chat-message"
import { Carousel, CarouselContent, CarouselItem,CarouselPrevious,CarouselNext  } from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { set } from "zod"

const MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
  { id: "meta-llama/llama-4-maverick-17b-128e-instruct", name: "Llama 4 17B" },
  { id: "qwen-qwq-32b", name: "Qwen 32B" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B" },
  { id: "mistral-saba-24b", name: "Mistral 24B" },
]

type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"]
}

export default function ChatDemo(props: ChatDemoProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [selectedScene, setSelectedScene] = useState(SCENES[0].name);
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);
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
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap()+1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap()+1);
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
    <div className={cn("flex","flex-col", "w-full")}>
      <div className={cn("flex", "justify-end", "mb-2")}>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
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
        isGenerating={status==="streaming"}
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
      <div className="mb-2 w-full">
        {/* left fade */}
        <div className={cn("absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none",
          current==1 && "hidden")} />
    
        <Carousel setApi={setApi} opts={{
          align: "start", 
          dragFree:true
          }} className="w-full px-12 h-12 flex items-center">
          <CarouselContent className="-ml-1">
          {SCENES.map((scene, idx) => (
            <CarouselItem key={scene.name} className="pl-3 basis-auto flex items-center" onClick={() => handleSceneClick(scene.name)} >
               <Badge variant={selectedScene === scene.name ? "default" : "secondary"} 
                      className="cursor-pointer counded-lg px-3 py-1 white-space-nowrap"
               >
                {scene.name}
               </Badge>
             
            </CarouselItem>
          ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 z-20" />
          <CarouselNext className="right-0 z-20"/>
          {/* right fade */}
          <div className={cn("absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none",
            current==count && "hidden")} />
          </Carousel>
       
      </div>
    </div>
  )
}
