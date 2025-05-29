import { PrismaClient } from '../generated/prisma'
import { SCENES } from '../lib/scenes'

const prisma = new PrismaClient()

async function main() {
  // 清除现有数据
  await prisma.model.deleteMany()
  await prisma.scene.deleteMany()
  await prisma.subject.deleteMany()

  // 创建模型
  await prisma.model.createMany({
    data: [
      {
        name: 'Qwen 32B',
        description: '通义千问 32B 模型，支持中英互译',
        providerName: 'groq',
        modelId: 'qwen-qwq-32b',
        isActive: true,
      },
      {
        name: 'Gemini 2.5',
        description: 'Google Gemini 2.5 模型，支持多语言翻译',
        providerName: 'google',
        modelId: 'gemini-2.5-flash-preview-05-20',
        isActive: true,
      },
      {
        name: 'GPT-4',
        description: 'OpenAI GPT-4 模型，提供高质量的翻译服务',
        providerName: 'openai',
        modelId: 'gpt-4o-mini',
        isActive: true,
      },
      {
        name: 'Mistral Large',
        description: 'Mistral Large 模型，支持多语言翻译',
        providerName: 'mistral',
        modelId: 'mistral-large-latest',
        isActive: true,
      },
    ],
  })

  // 创建场景（不关联任何主题）
  const scenesData = SCENES.map((scene) => ({
    name: scene.name,
    nameEn: scene.name_en,
    description: scene.description,
    prompt: scene.prompt,
    isActive: true,
    subjectId: null, // 所有场景都不关联主题
  }))

  for (const sceneData of scenesData) {
    await prisma.scene.create({
      data: sceneData,
    })
  }

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