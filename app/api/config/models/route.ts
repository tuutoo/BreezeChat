import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PROVIDERS } from '@/lib/providers'

export async function GET() {
  try {
    const models = await prisma.model.findMany()
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
    const { name, description, providerName, modelId, isActive } = await req.json()

    // 验证提供商是否存在
    const provider = PROVIDERS.find(p => p.providerName === providerName)
    if (!provider) {
      return NextResponse.json(
        { error: 'Invalid provider name' },
        { status: 400 }
      )
    }

    const model = await prisma.model.create({
      data: {
        name,
        description,
        providerName,
        modelId,
        isActive,
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
    const { name, description, providerName, modelId, isActive } = await req.json()

    // 验证提供商是否存在
    const provider = PROVIDERS.find(p => p.providerName === providerName)
    if (!provider) {
      return NextResponse.json(
        { error: 'Invalid provider name' },
        { status: 400 }
      )
    }

    const model = await prisma.model.update({
      where: { name },
      data: {
        description,
        providerName,
        modelId,
        isActive,
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
