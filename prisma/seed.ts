import { PrismaClient } from '@/generated/prisma/client'
import { SCENES } from '../lib/scenes'
import { MODELS } from '../lib/models'

const prisma = new PrismaClient()

async function main() {
  // 导入场景数据
  for (const scene of SCENES) {
    await prisma.scene.upsert({
      where: { name: scene.name },
      update: {
        nameEn: scene.name_en,
        description: scene.description,
        prompt: scene.prompt,
        isActive: true
      },
      create: {
        name: scene.name,
        nameEn: scene.name_en,
        description: scene.description,
        prompt: scene.prompt,
        isActive: true
      }
    })
  }

  // 导入模型数据
  for (const model of MODELS) {
    await prisma.model.upsert({
      where: { name: model.name },
      update: {
        name: model.name,
        provider: model.name.split('-')[0], // 简单地从 ID 中提取提供商
        isActive: true
      },
      create: {
        name: model.name,
        description: model.description,
        provider: model.name.split('-')[0],
        isActive: true
      }
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