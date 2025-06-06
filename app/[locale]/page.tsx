'use client';

import { useState, useCallback } from 'react';
import { Subject, AdditionalPrompt, Scene } from '@/generated/prisma/client';
import ChatDemo from "@/components/chat-demo";
import { ChatConfig } from "@/components/chat-config";
import { MobileConfigPanel } from "@/components/mobile-config-panel";

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
    <div className="h-full max-w-7xl mx-auto w-full">
      {/* 移动端配置按钮 */}
      <div className="mb-4 lg:hidden">
        <MobileConfigPanel onConfigChange={handleConfigChange} />
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* 聊天区域 */}
        <div className="flex-1 min-w-0 h-full">
          <ChatDemo config={chatConfig} />
        </div>

        {/* 桌面端配置区域 */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <ChatConfig onConfigChange={handleConfigChange} />
        </div>
      </div>
    </div>
  );
}
