import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

// 获取所有提供商
export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      include: {
        models: true,
      },
    })
    return NextResponse.json(providers)
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}

// 创建新提供商
export async function POST(req: Request) {
  try {
    const { name, envApiKeyName, isActive } = await req.json()

    // 验证环境变量是否存在
    if (!process.env[envApiKeyName]) {
      return NextResponse.json(
        { error: `Environment variable ${envApiKeyName} is not defined` },
        { status: 400 }
      )
    }

    const provider = await prisma.provider.create({
      data: {
        id: nanoid(),
        name,
        envApiKeyName,
        isActive,
      },
    })

    return NextResponse.json(provider)
  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json(
      { error: 'Failed to create provider' },
      { status: 500 }
    )
  }
}