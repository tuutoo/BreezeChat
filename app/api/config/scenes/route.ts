import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/config/scenes - 获取所有场景
export async function GET() {
  try {
    const scenes = await prisma.scene.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(scenes)
  } catch (error) {
    console.error('Failed to fetch scenes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scenes' },
      { status: 500 }
    )
  }
}

// POST /api/config/scenes - 创建新场景
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const scene = await prisma.scene.create({
      data: {
        name: data.name,
        nameEn: data.nameEn,
        description: data.description,
        prompt: data.prompt,
        isActive: true,
      },
    })
    return NextResponse.json(scene)
  } catch (error) {
    console.error('Failed to create scene:', error)
    return NextResponse.json(
      { error: 'Failed to create scene' },
      { status: 500 }
    )
  }
}

// PUT /api/config/scenes - 更新场景
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const scene = await prisma.scene.update({
      where: { id: data.id },
      data: {
        name: data.name,
        nameEn: data.nameEn,
        description: data.description,
        prompt: data.prompt,
        isActive: data.isActive,
      },
    })
    return NextResponse.json(scene)
  } catch (error) {
    console.error('Failed to update scene:', error)
    return NextResponse.json(
      { error: 'Failed to update scene' },
      { status: 500 }
    )
  }
}

// DELETE /api/config/scenes?id=xxx - 删除场景
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Scene ID is required' },
        { status: 400 }
      )
    }

    await prisma.scene.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete scene:', error)
    return NextResponse.json(
      { error: 'Failed to delete scene' },
      { status: 500 }
    )
  }
}