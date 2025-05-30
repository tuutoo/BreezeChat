import { PrismaClient } from '../generated/prisma'
import { SCENES } from '../lib/scenes'

const prisma = new PrismaClient()

async function main() {
  // 清除现有数据
  await prisma.additionalPrompt.deleteMany()
  await prisma.model.deleteMany()
  await prisma.scene.deleteMany()
  await prisma.subject.deleteMany()

  // 创建主题
  const subject = await prisma.subject.create({
    data: {
      name: 'translation',
      description: '翻译',
      prompt: 'You are a highly reliable, professional translation assistant. Always identify the primary language of the input text based on comprehensive analysis of syntax, vocabulary, and linguistic patterns. Follow these strict rules:\n- If the input\'s primary language is Chinese, translate the entire content into US English.\n- If the input\'s primary language is not Chinese, translate the entire content into Simplified Chinese.\n- Output only the translated text. Do not include the original text, comments, explanations, or any unnecessary formatting, unless specifically required by the scenario.\n- Preserve important markdown, code, or structural formatting when present.\n- If a specific structure or style is required by the scenario, strictly follow those requirements.',
      isActive: true
    }
  })

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

  // 创建场景（关联到 translation 主题）
  const scenesData = SCENES.map((scene) => ({
    name: scene.name,
    nameEn: scene.name_en,
    description: scene.description,
    prompt: scene.prompt,
    isActive: true,
    subjectId: subject.id, // 关联到 translation 主题
  }))

  for (const sceneData of scenesData) {
    await prisma.scene.create({
      data: sceneData,
    })
  }

  // 创建附加提示条件
  await prisma.additionalPrompt.createMany({
    data: [
      // 语气类条件
      {
        name: '正式语气',
        prompt: '请使用正式、专业的语气进行翻译',
        category: 'TONE',
        sort: 1,
        isActive: true,
        isDefault: false,
        applicableScenes: []
      },
      {
        name: '友好随意',
        prompt: '请使用友好、随意的语气，就像朋友间的对话',
        category: 'TONE',
        sort: 2,
        isActive: true,
        isDefault: false,
        applicableScenes: []
      },
      {
        name: '客气礼貌',
        prompt: '请使用客气、礼貌的表达方式',
        category: 'TONE',
        sort: 3,
        isActive: true,
        isDefault: false,
        applicableScenes: []
      },

      // 风格类条件
      {
        name: '简洁明了',
        prompt: '请保持翻译简洁明了，避免冗余表达',
        category: 'STYLE',
        sort: 1,
        isActive: true,
        isDefault: false,
        applicableScenes: []
      },
      {
        name: '详细完整',
        prompt: '请提供详细完整的翻译，包含必要的上下文说明',
        category: 'STYLE',
        sort: 2,
        isActive: true,
        isDefault: false,
        applicableScenes: []
      },

      // 领域类条件
      {
        name: '保留技术术语',
        prompt: '请保留专业技术术语的原文，并在括号中提供翻译',
        category: 'DOMAIN',
        sort: 1,
        isActive: true,
        isDefault: false,
        applicableScenes: []
      },
      {
        name: '商务用语',
        prompt: '请使用标准的商务用语和表达方式',
        category: 'DOMAIN',
        sort: 2,
        isActive: true,
        isDefault: false,
        applicableScenes: []
      }
    ]
  })

  console.log('Seed completed successfully')
  console.log(`Created subject: ${subject.name} (${subject.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })