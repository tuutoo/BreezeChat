'use client';

import { useState, useCallback } from 'react';
import { Subject, AdditionalPrompt, Scene } from '@/generated/prisma/client';
import ChatDemo from "@/components/chat-demo";
import { ChatConfig } from "@/components/chat-config";

export default function LocalizedHome() {
  const [chatConfig, setChatConfig] = useState<{
    subject?: Subject
    additionalPrompts: AdditionalPrompt[]
    scene?: Scene
    keepHistory: boolean
  }>({
    additionalPrompts: [],
    keepHistory: false
  })

  const handleConfigChange = useCallback((config: {
    subject?: Subject
    additionalPrompts: AdditionalPrompt[]
    scene?: Scene
    keepHistory: boolean
  }) => {
    setChatConfig(config)
  }, [])

  return (
    <div className="flex gap-6 h-full max-w-7xl mx-auto w-full">
      {/* 左侧聊天区域 */}
      <div className="flex-1 min-w-0">
        <ChatDemo config={chatConfig} />
      </div>

      {/* 右侧配置区域 */}
      <div className="w-80 flex-shrink-0">
        <ChatConfig onConfigChange={handleConfigChange} />
      </div>
    </div>
  );
}
