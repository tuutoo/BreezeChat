'use client';

import { useState, useCallback, useEffect } from 'react';
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

  // 预加载配置数据
  const [configData, setConfigData] = useState<{
    subjects: Subject[]
    additionalPrompts: AdditionalPrompt[]
    scenes: Scene[]
    isLoading: boolean
  }>({
    subjects: [],
    additionalPrompts: [],
    scenes: [],
    isLoading: true
  })

  // 在组件挂载时立即加载配置数据
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        // 并行获取所有配置数据
        const [subjectsResponse, promptsResponse, scenesResponse] = await Promise.all([
          fetch('/api/config/subjects'),
          fetch('/api/config/additional-prompts'),
          fetch('/api/scenes')
        ])

        const [subjectsData, promptsData, scenesData] = await Promise.all([
          subjectsResponse.ok ? subjectsResponse.json() : [],
          promptsResponse.ok ? promptsResponse.json() : [],
          scenesResponse.ok ? scenesResponse.json() : []
        ])

        setConfigData({
          subjects: subjectsData,
          additionalPrompts: promptsData.filter((p: AdditionalPrompt) => p.isActive),
          scenes: scenesData,
          isLoading: false
        })
      } catch (error) {
        console.error('Error fetching config data:', error)
        setConfigData(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchConfigData()
  }, [])

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
        <MobileConfigPanel
          onConfigChange={handleConfigChange}
          configData={configData}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* 聊天区域 */}
        <div className="flex-1 min-w-0 h-full">
          <ChatDemo config={chatConfig} />
        </div>

        {/* 桌面端配置区域 */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <ChatConfig
            onConfigChange={handleConfigChange}
            configData={configData}
          />
        </div>
      </div>
    </div>
  );
}
