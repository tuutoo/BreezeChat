import { createGroq } from "@ai-sdk/groq"
import { streamText, generateText } from "ai"
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

    // 处理多模态消息 - AI SDK会自动处理文件格式
    const finalMessages = processedMessages.map((msg: any) => {
      if (msg.content && Array.isArray(msg.content)) {
        // 多模态消息格式 - 让AI SDK自动处理
        const content = msg.content.map((part: any) => {
          if (part.type === 'text') {
            return { type: 'text', text: part.text };
          } else if (part.type === 'file') {
            console.log('Processing file for AI SDK:', {
              mediaType: part.mediaType,
              dataType: typeof part.data,
              isDataURL: typeof part.data === 'string' && part.data.startsWith('data:')
            });

            // AI SDK会自动处理data URL和Buffer
            return {
              type: 'file',
              data: part.data, // AI SDK自动处理
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

    // 检查是否为图片生成模型且可能需要图片输出
    const isImageCapableModel = providerConfig.providerName === 'google' &&
      (model.modelId.includes('image') || model.modelId.includes('vision') || model.modelId.includes('flash-image'))

    if (isImageCapableModel) {
      // 尝试使用generateText来处理可能的图片生成
      try {
        const lastMessage = messages[messages.length - 1]
        const content = typeof lastMessage.content === 'string' ? lastMessage.content.toLowerCase() : ''

        // 检测图片生成相关关键词
        const imageKeywords = ['画', '生成图', 'create', 'picture', 'image', 'draw', 'generate', 'photo', 'illustration', 'design']
        const mayBeImageRequest = imageKeywords.some(keyword => content.includes(keyword))

        if (mayBeImageRequest) {
          console.log('Trying generateText for potential image generation with model:', model.modelId)

          const generateConfig: any = {
            model: aiProvider,
            ...(systemPrompt && { system: systemPrompt }),
            temperature: 0.2,
            topP: 0.9,
            messages: finalMessages,
            providerOptions: {
              google: {
                responseModalities: ['TEXT', 'IMAGE']
              }
            }
          }

          const result = await generateText(generateConfig)
          console.log('GenerateText result summary:', {
            hasSteps: !!result.steps,
            stepCount: result.steps?.length || 0,
            hasFiles: !!result.files,
            fileCount: result.files?.length || 0
          })

          // 检查steps中是否有图片内容
          if (result.steps && result.steps.length > 0) {
            console.log('Checking steps for images...')

            let allParts: any[] = []
            for (const step of result.steps) {
              if (step.content && Array.isArray(step.content)) {
                allParts.push(...step.content)
              }
            }

            console.log('All parts from steps:', allParts.map(p => ({ type: p.type, hasImage: !!p.image })))

            // 查找图片部分
            const imageParts = allParts.filter(part => part.type === 'image' || (part.image && part.type !== 'text'))

            if (imageParts.length > 0) {
              console.log('Found image parts in steps:', imageParts.length)

              const parts: any[] = []

              // 添加文本部分
              const textParts = allParts.filter(part => part.type === 'text')
              if (textParts.length > 0) {
                parts.push({
                  type: 'text',
                  text: textParts.map(p => p.text).join('\n')
                })
              }

              // 添加图片部分
              for (const imagePart of imageParts) {
                parts.push({
                  type: 'image',
                  image: imagePart.image,
                  prompt: `Generated image`
                })
              }

              return NextResponse.json({
                type: 'complete_generation',
                parts: parts
              })
            }
          }

          // 检查是否有生成的文件（图片）
          if (result.files && result.files.length > 0) {
            const imageFiles = result.files.filter(file => file.mediaType.startsWith('image/'))

            if (imageFiles.length > 0) {
              console.log('Generated images found:', imageFiles.length)

              // 构造包含文本和图片的响应
              const parts: any[] = [
                { type: 'text', text: result.text }
              ]

              // 添加所有生成的图片
              for (const file of imageFiles) {
                const fileData = file as any // 暂时类型转换处理
                console.log('Processing image file with base64Data:', !!fileData.base64Data)

                let imageUrl: string
                if (fileData.base64Data) {
                  // AI SDK 返回的图片数据在 base64Data 属性中
                  imageUrl = `data:${file.mediaType};base64,${fileData.base64Data}`
                } else if (fileData.url) {
                  imageUrl = fileData.url
                } else {
                  console.error('No base64Data or url found in file:', Object.keys(fileData))
                  continue
                }

                parts.push({
                  type: 'image',
                  image: imageUrl,
                  prompt: `Generated image`
                })
              }

              return NextResponse.json({
                type: 'complete_generation',
                parts: parts
              })
            }
          }

          // 暂时返回调试信息，让我们看看到底返回了什么
          console.log('No images found, falling back to text response')
          console.log('Result object type:', typeof result)
          console.log('Result properties:', Object.getOwnPropertyNames(result))

          // 如果没有图片但有文本，返回文本响应
          if (result.text) {
            return NextResponse.json({
              type: 'text_generation',
              text: result.text
            })
          }
        }
      } catch (error) {
        console.log('generateText failed, falling back to streamText:', error)
        // 继续使用streamText作为fallback
      }
    }

    // 构建streamText配置
    const streamConfig: any = {
      model: aiProvider,
      ...(systemPrompt && { system: systemPrompt }),
      temperature: 0.2,
      topP: 0.9,
      messages: finalMessages,
    }

    // 为Google provider启用图片输出能力
    if (providerConfig.providerName === 'google') {
      streamConfig.providerOptions = {
        google: {
          responseModalities: ['TEXT', 'IMAGE']
        }
      }
    }

    const result = streamText(streamConfig);

    try {
      return result.toUIMessageStreamResponse();
    } catch (error) {
      return createErrorResponse('Internal Server Error', 500, error);
    }

  } catch (error: unknown) {
    return createErrorResponse('Internal Server Error', 500, error)
  }
}


