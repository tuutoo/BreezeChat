"use client"
 
import { useChat } from "@ai-sdk/react";
 
import { Chat } from "@/components/ui/chat"
 
export function ChatDemo() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat()
 
  return (
    <Chat
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={status === "streaming"}
      stop={stop}
    />
  )
}