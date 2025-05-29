import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { PROVIDERS } from '@/lib/providers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// const LLAMA_MODEL = "llama-3.3-70b-versatile"

// 统一错误处理函数
function createErrorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      showToast: true,
      ...(details && { details })
    },
    { status }
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, model: modelName, scene } = body

    if (!messages || !modelName) {
      return createErrorResponse('Messages and model name are required', 400)
    }

    // 获取模型信息
    const model = await prisma.model.findUnique({
      where: { name: modelName },
    })

    if (!model) {
      return createErrorResponse('Model not found', 404)
    }

    // 获取场景信息，包括关联的主题
    const sceneData = await prisma.scene.findUnique({
      where: { name: scene },
      include: {
        subject: true, // 包含关联的主题信息
      },
    })

    if (!sceneData) {
      return createErrorResponse('Scene not found', 404)
    }

    // 获取提供商配置
    const providerConfig = PROVIDERS.find(p => p.providerName === model.providerName)
    if (!providerConfig) {
      return createErrorResponse('Provider not found', 404)
    }

    // 获取 API 密钥
    const apiKey = process.env[providerConfig.envKey]
    if (!apiKey) {
      return createErrorResponse('API key not found', 500)
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
        return createErrorResponse('Unsupported provider', 400)
    }

    // 构建系统提示词
    let systemPrompt = ''

    // 如果场景有关联的激活主题，使用主题提示词 + 场景提示词
    if (sceneData.subject && sceneData.subject.isActive) {
      systemPrompt = sceneData.subject.prompt + '\n\n' + sceneData.prompt
      console.log('Using subject-based prompt for:', sceneData.subject.name)
    } else {
      // 没有关联主题时，直接使用场景的提示词
      systemPrompt = sceneData.prompt
      console.log('Using scene prompt without subject')
    }

    console.log('Final system prompt:', systemPrompt)

    const result = streamText({
      model: aiProvider,
      system: systemPrompt,
      temperature: 0.2,
      topP: 0.9,
      messages,
    });

    try {
      return result.toDataStreamResponse();
    } catch (error) {
      return createErrorResponse('Internal Server Error', 500, error);
    }

  } catch (error: unknown) {
    return createErrorResponse('Internal Server Error', 500, error)
  }
}


