"use client"

import { useState } from "react"
import { useChat, type UseChatOptions } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { transcribeAudio } from "@/lib/utils/audio"
import { Check } from "lucide-react";
import { Chat } from "@/components/ui/chat"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SCENES } from "@/lib/scenes";
import { Message } from "./ui/chat-message"

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
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [selectedScene, setSelectedScene] = useState(SCENES[0].name);
  const handleSceneClick = (scenePrompt: string) => {
    setSelectedScene(scenePrompt);
  };
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
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
    <div className={cn("flex", "flex-col", "flex-1", "w-full")}>
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
        className="grow"
        messages={messages as unknown as Message[]} 
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
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
      <div className="mb-2 flex flex-row gap-4 text-sm text-gray-600 items-center">
        <div className="flex-none">
          应用场景:
        </div>
        <div className="flex flex-row gap-2 flex-wrap ">
          {SCENES.map((scene, idx) => (
            <Button 
              variant="outline"
              size="sm" 
              key={idx}
              onClick={() => handleSceneClick(scene.name)} // Update the selected scene's prompt
               
            >{selectedScene === scene.name && (
              <Check  /> // Show checkmark if selected
            )}
              {scene.name} 
            </Button>
          ))}
          </div>
      </div>
    </div>
  )
}
