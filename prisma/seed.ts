import { PrismaClient } from '../generated/prisma'
import { SCENES } from '../lib/scenes'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

async function main() {
  // 清除现有数据
  await prisma.model.deleteMany()
  await prisma.provider.deleteMany()
  await prisma.scene.deleteMany()

  // 创建提供商
  const providers = await Promise.all([
    prisma.provider.create({
      data: {
        id: nanoid(),
        name: 'groq',
        envApiKeyName: 'GROQ_API_KEY',
        isActive: true,
        models: {
          create: [
            {
              name: 'Qwen 32B',
              description: '通义千问 32B 模型，支持中英互译',
              modelId: 'qwen-qwq-32b',
              isActive: true,
            },
          ],
        },
      },
    }),
    prisma.provider.create({
      data: {
        id: nanoid(),
        name: 'google',
        envApiKeyName: 'GOOGLE_GENERATIVE_AI_API_KEY',
        isActive: true,
        models: {
          create: [
            {
              name: 'Gemini 2.5',
              description: 'Google Gemini 2.5 模型，支持多语言翻译',
              modelId: 'gemini-2.5-flash-preview-05-20',
              isActive: true,
            },
          ],
        },
      },
    }),
    prisma.provider.create({
      data: {
        id: nanoid(),
        name: 'openai',
        envApiKeyName: 'OPENAI_API_KEY',
        isActive: true,
        models: {
          create: [
            {
              name: 'GPT-4',
              description: 'OpenAI GPT-4 模型，提供高质量的翻译服务',
              modelId: 'gpt-4o-mini',
              isActive: true,
            },
          ],
        },
      },
    }),
    prisma.provider.create({
      data: {
        id: nanoid(),
        name: 'mistral',
        envApiKeyName: 'MISTRAL_API_KEY',
        isActive: true,
        models: {
          create: [
            {
              name: 'Mistral Large',
              description: 'Mistral Large 模型，支持多语言翻译',
              modelId: 'mistral-large-latest',
              isActive: true,
            },
          ],
        },
      },
    }),
  ])

  // 创建场景
  await prisma.scene.createMany({
    data: SCENES.map(scene => ({
      name: scene.name,
      nameEn: scene.name_en,
      description: scene.description,
      prompt: scene.prompt,
      isActive: true,
    })),
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })