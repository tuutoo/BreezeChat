import { createGroq } from "@ai-sdk/groq"
import { streamText  } from "ai"
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { PROVIDERS } from '@/lib/providers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// const LLAMA_MODEL = "llama-3.3-70b-versatile"

async function createSystemPrompt(scene: string): Promise<string> {
  // General translation instructions
  const baseInstructions = `
You are a highly reliable, professional translation assistant. Always identify the primary language of the input text based on comprehensive analysis of syntax, vocabulary, and linguistic patterns. Follow these strict rules:
- If the input's primary language is Chinese, translate the entire content into US English.
- If the input's primary language is not Chinese, translate the entire content into Simplified Chinese.
- Output only the translated text. Do not include the original text, comments, explanations, or any unnecessary formatting, unless specifically required by the scenario.
- Preserve important markdown, code, or structural formatting when present.
- If a specific structure or style is required by the scenario, strictly follow those requirements.
`;

    return `
${baseInstructions}
Translate the following text according to these rules:
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Chat API request body:', body)

    const { messages, model: modelName, scene } = body
    console.log('Scene:', scene)

    if (!messages || !modelName) {
      console.error('Missing required fields:', { messages, modelName })
      return NextResponse.json(
        { error: 'Messages and model name are required' },
        { status: 400 }
      )
    }

    // 获取模型信息
    const model = await prisma.model.findUnique({
      where: { name: modelName },
    })

    if (!model) {
      console.error('Model not found:', modelName)
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // 获取场景信息
    const sceneData = await prisma.scene.findUnique({
      where: { name: scene },
    })

    if (!sceneData) {
      console.error('Scene not found:', scene)
      return NextResponse.json(
        { error: 'Scene not found' },
        { status: 404 }
      )
    }

    // 获取提供商配置
    const providerConfig = PROVIDERS.find(p => p.providerName === model.providerName)
    if (!providerConfig) {
      console.error('Provider not found:', model.providerName)
      return NextResponse.json(
        { error: `Provider ${model.providerName} not found` },
        { status: 404 }
      )
    }

    // 获取 API 密钥
    const apiKey = process.env[providerConfig.envKey]
    if (!apiKey) {
      console.error('API key not found for provider:', providerConfig.providerName)
      return NextResponse.json(
        { error: `API key not found for provider ${providerConfig.providerName}` },
        { status: 500 }
      )
    }

    // 根据提供商选择对应的客户端
    let aiProvider;
    switch (providerConfig.providerName) {
      case 'google':
        aiProvider = google(model.modelId);
        break;
      case 'openai':
        aiProvider = openai(model.modelId);
        break;
      case 'groq':
        aiProvider = createGroq({
          apiKey,
          fetch: async (url, options) => {
            if (options?.body) {
              const body = JSON.parse(options.body as string)
              if (body?.model === modelName) {
                body.reasoning_format = "parsed"
                options.body = JSON.stringify(body)
              }
            }
            return fetch(url, options)
          },
        })(model.modelId);
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported provider: ${providerConfig.providerName}` },
          { status: 400 }
        )
    }

    const systemPrompt = sceneData.prompt;
    console.log('System Prompt:', systemPrompt)

    const result = streamText({
      model: aiProvider,
      system: systemPrompt,
      temperature: 0.2,
      topP: 0.9,
      messages,
    });
    return result.toDataStreamResponse({ sendReasoning: false });
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


