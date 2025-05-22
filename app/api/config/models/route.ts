import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      include: {
        provider: true,
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

export async function POST(req: Request) {
  try {
    const { name, description, providerId, modelId, isActive } = await req.json()

    const model = await prisma.model.create({
      data: {
        name,
        description,
        providerId,
        modelId,
        isActive,
      },
      include: {
        provider: true,
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

export async function PUT(req: Request) {
  try {
    const { name, description, providerId, modelId, isActive } = await req.json()

    const model = await prisma.model.update({
      where: { name },
      data: {
        description,
        providerId,
        modelId,
        isActive,
      },
      include: {
        provider: true,
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
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

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting model:', error)
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    )
  }
}
