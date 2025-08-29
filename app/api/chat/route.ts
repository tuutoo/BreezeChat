import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { PROVIDERS } from '@/lib/providers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isImageGenerationRequest, extractImagePrompt } from '@/lib/utils/image-generation'

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
    const { messages, model: modelName, scene, subject, additionalPrompts = [], keepHistory = false } = body

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

    // 构建系统提示词
    let systemPrompt = ''

    // 如果有配置的主题，使用主题提示词
    if (subject) {
      systemPrompt = subject.prompt
      console.log('Using configured subject:', subject.name)

      // 如果还有配置的场景，添加场景提示词
      if (scene) {
        const sceneData = await prisma.scene.findUnique({
          where: { name: scene },
        })

        if (sceneData) {
          systemPrompt += '\n\n' + sceneData.prompt
          console.log('Adding scene prompt:', scene)
        }
      }
    } else if (scene) {
      console.log('scene', scene)
      // 没有配置主题但有场景时，获取场景信息，包括关联的主题
      const sceneData = await prisma.scene.findUnique({
        where: { name: scene },
        include: {
          subject: true, // 包含关联的主题信息
        },
      })

      if (!sceneData) {
        return createErrorResponse('Scene not found', 404)
      }

      // 如果场景有关联的激活主题，使用主题提示词 + 场景提示词
      if (sceneData.subject && sceneData.subject.isActive) {
        systemPrompt = sceneData.subject.prompt + '\n\n' + sceneData.prompt
        console.log('Using subject-based prompt for:', sceneData.subject.name)
      } else {
        // 没有关联主题时，直接使用场景的提示词
        systemPrompt = sceneData.prompt
        console.log('Using scene prompt without subject')
      }
    }

    // 添加附加提示词
    if (additionalPrompts.length > 0) {
      const additionalPromptTexts = additionalPrompts.map((prompt: { prompt: string }) => prompt.prompt).join('\n')
      if (systemPrompt) {
        systemPrompt += '\n\n' + additionalPromptTexts
      } else {
        systemPrompt = additionalPromptTexts
      }
      console.log('Added additional prompts:', additionalPrompts.map((p: { name: string }) => p.name).join(', '))
    }

    console.log('Final system prompt:', systemPrompt || '(No system prompt - free chat)')

    // 检查最后一条消息是否是图片生成请求
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'user' && isImageGenerationRequest(lastMessage.content)) {
      try {
        console.log('Detected image generation request:', lastMessage.content)

        // 提取图片生成提示词
        const imagePrompt = extractImagePrompt(lastMessage.content)
        console.log('Extracted image prompt:', imagePrompt)

        // 调用图片生成API
        const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
        const imageResponse = await fetch(`${baseUrl}/api/generate-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: imagePrompt,
            numberOfImages: 1,
            aspectRatio: '1:1'
          })
        })

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()

          if (imageData.success && imageData.images.length > 0) {
            const generatedImage = imageData.images[0]

            // 返回包含图片的特殊响应
            return NextResponse.json({
              type: 'image_generation',
              text: `I've generated an image based on your request: "${imagePrompt}". You can download it or view it in full size by clicking on the image.`,
              image: {
                type: 'image',
                image: generatedImage.dataUrl,
                prompt: imagePrompt,
                createdAt: generatedImage.createdAt
              }
            })
          }
        }

        console.error('Image generation failed, falling back to text response')
      } catch (error) {
        console.error('Error generating image:', error)
        // 如果图片生成失败，继续使用常规的文本生成
      }
    }

    // 根据 keepHistory 参数处理消息
    let processedMessages = messages
    if (!keepHistory && messages.length > 1) {
      // 如果不保留历史记录，只保留最后一条用户消息
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        processedMessages = [lastMessage]
        console.log('History disabled: Using only the last user message')
      } else {
        processedMessages = messages
      }
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

    // 处理多模态消息（支持文件输入，按照AI SDK规范）
    const finalMessages = processedMessages.map((msg: any) => {
      if (msg.content && Array.isArray(msg.content)) {
        // 多模态消息格式 - 转换为AI SDK格式
        const content = msg.content.map((part: any) => {
          if (part.type === 'text') {
            return { type: 'text', text: part.text };
          } else if (part.type === 'file') {
            // 处理文件输入 - 按照AI SDK规范
            console.log('Processing file for AI SDK:', {
              mediaType: part.mediaType,
              name: part.name,
              dataLength: part.data?.length
            });

            // 将base64字符串转换为Buffer
            const buffer = Buffer.from(part.data, 'base64');

            return {
              type: 'file',
              data: buffer,
              mediaType: part.mediaType
            };
          }
          return part;
        });

        return {
          role: msg.role,
          content: content
        };
      } else {
        // 文本消息格式 - 保持原样
        return {
          role: msg.role,
          content: msg.content
        };
      }
    });

    console.log('Final messages for AI:', JSON.stringify(finalMessages, null, 2));

    const result = streamText({
      model: aiProvider,
      ...(systemPrompt && { system: systemPrompt }),
      temperature: 0.2,
      topP: 0.9,
      messages: finalMessages,
    });

    try {
      return result.toUIMessageStreamResponse();
    } catch (error) {
      return createErrorResponse('Internal Server Error', 500, error);
    }

  } catch (error: unknown) {
    return createErrorResponse('Internal Server Error', 500, error)
  }
}


