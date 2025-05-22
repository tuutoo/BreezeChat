import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(models)
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const model = await prisma.model.create({
      data: {
        name: data.name,
        description: data.description,
        provider: data.provider,
        isActive: data.isActive ?? true,
      },
    })
    return NextResponse.json(model)
  } catch (error) {
    console.error('Error creating model:', error)
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()

    if (!data.name) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      )
    }

    const model = await prisma.model.update({
      where: { name: data.name },
      data: {
        description: data.description,
        provider: data.provider,
        isActive: data.isActive,
      },
    })
    return NextResponse.json(model)
  } catch (error) {
    console.error('Error updating model:', error)
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      )
    }

    await prisma.model.delete({
      where: { name },
    })
    return NextResponse.json({ message: 'Model deleted successfully' })
  } catch (error) {
    console.error('Error deleting model:', error)
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    )
  }
}
