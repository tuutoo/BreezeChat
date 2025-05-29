import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/config/subjects - 获取所有主题
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        scenes: true, // 包含关联的场景
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Failed to fetch subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

// POST /api/config/subjects - 创建新主题
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const subject = await prisma.subject.create({
      data: {
        name: data.name,
        description: data.description,
        prompt: data.prompt,
        isActive: true,
      },
    })
    return NextResponse.json(subject)
  } catch (error) {
    console.error('Failed to create subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}

// PUT /api/config/subjects - 更新主题
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const subject = await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        prompt: data.prompt,
        isActive: data.isActive,
      },
    })
    return NextResponse.json(subject)
  } catch (error) {
    console.error('Failed to update subject:', error)
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    )
  }
}

// DELETE /api/config/subjects?id=xxx - 删除主题
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Subject ID is required' },
        { status: 400 }
      )
    }

    await prisma.subject.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete subject:', error)
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    )
  }
}