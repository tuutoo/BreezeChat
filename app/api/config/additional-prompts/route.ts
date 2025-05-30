import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/config/additional-prompts - 获取所有附加提示
export async function GET() {
  try {
    const additionalPrompts = await prisma.additionalPrompt.findMany({
      orderBy: [
        { category: 'asc' },
        { sort: 'asc' },
        { createdAt: 'desc' }
      ],
    })
    return NextResponse.json(additionalPrompts)
  } catch (error) {
    console.error('Failed to fetch additional prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch additional prompts' },
      { status: 500 }
    )
  }
}

// POST /api/config/additional-prompts - 创建新附加提示
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const additionalPrompt = await prisma.additionalPrompt.create({
      data: {
        name: data.name,
        prompt: data.prompt,
        category: data.category,
        sort: data.sort || 0,
        isActive: data.isActive ?? true,
        isDefault: data.isDefault ?? false,
        applicableScenes: data.applicableScenes || [],
      },
    })
    return NextResponse.json(additionalPrompt)
  } catch (error) {
    console.error('Failed to create additional prompt:', error)
    return NextResponse.json(
      { error: 'Failed to create additional prompt' },
      { status: 500 }
    )
  }
}

// PUT /api/config/additional-prompts - 更新附加提示
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const additionalPrompt = await prisma.additionalPrompt.update({
      where: { id: data.id },
      data: {
        name: data.name,
        prompt: data.prompt,
        category: data.category,
        sort: data.sort,
        isActive: data.isActive,
        isDefault: data.isDefault,
        applicableScenes: data.applicableScenes,
      },
    })
    return NextResponse.json(additionalPrompt)
  } catch (error) {
    console.error('Failed to update additional prompt:', error)
    return NextResponse.json(
      { error: 'Failed to update additional prompt' },
      { status: 500 }
    )
  }
}

// DELETE /api/config/additional-prompts?id=xxx - 删除附加提示
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Additional prompt ID is required' },
        { status: 400 }
      )
    }

    await prisma.additionalPrompt.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete additional prompt:', error)
    return NextResponse.json(
      { error: 'Failed to delete additional prompt' },
      { status: 500 }
    )
  }
}