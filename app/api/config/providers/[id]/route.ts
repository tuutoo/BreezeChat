import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取单个提供商
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { id: params.id },
      include: {
        models: true,
      },
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(provider)
  } catch (error) {
    console.error('Error fetching provider:', error)
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    )
  }
}

// 更新提供商
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, envApiKeyName, isActive } = await req.json()

    // 验证环境变量是否存在
    if (envApiKeyName && !process.env[envApiKeyName]) {
      return NextResponse.json(
        { error: `Environment variable ${envApiKeyName} is not defined` },
        { status: 400 }
      )
    }

    const provider = await prisma.provider.update({
      where: { id: params.id },
      data: {
        name,
        envApiKeyName,
        isActive,
      },
    })

    return NextResponse.json(provider)
  } catch (error) {
    console.error('Error updating provider:', error)
    return NextResponse.json(
      { error: 'Failed to update provider' },
      { status: 500 }
    )
  }
}

// 删除提供商
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.provider.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting provider:', error)
    return NextResponse.json(
      { error: 'Failed to delete provider' },
      { status: 500 }
    )
  }
}